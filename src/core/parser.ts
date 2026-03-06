import type { Column, Table, Schema, Relationship } from '../types/schema'

export function parseSchema(sql: string): Schema {
  const tables: Table[] = []
  const relationships: Relationship[] = []
  const uniqueColumns = new Set<string>()

  // Normalize SQL
  const normalized = sql.replace(/--[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')

  // Extract CREATE TABLE blocks
  const tableRegex =
    /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:"?(\w+)"?\.)?"?(\w+)"?\s*\(([\s\S]*?)\)\s*;/gi
  let match: RegExpExecArray | null

  while ((match = tableRegex.exec(normalized)) !== null) {
    const tableName = match[2]
    const body = match[3]
    const columns: Column[] = []

    // Collect table-level constraints first
    const tablePKs = new Set<string>()
    const tableUniques = new Set<string>()
    const tableFKs: Array<{ columns: string[]; refTable: string; refColumns: string[] }> = []

    const constraintPKRegex =
      /(?:CONSTRAINT\s+"?\w+"?\s+)?PRIMARY\s+KEY\s*\(([^)]+)\)/gi
    let cm: RegExpExecArray | null
    while ((cm = constraintPKRegex.exec(body)) !== null) {
      cm[1].split(',').forEach((c) => tablePKs.add(c.trim().replace(/"/g, '')))
    }

    const constraintUniqueRegex =
      /(?:CONSTRAINT\s+"?\w+"?\s+)?UNIQUE\s*\(([^)]+)\)/gi
    while ((cm = constraintUniqueRegex.exec(body)) !== null) {
      cm[1].split(',').forEach((c) => tableUniques.add(c.trim().replace(/"/g, '')))
    }

    const constraintFKRegex =
      /(?:CONSTRAINT\s+"?\w+"?\s+)?FOREIGN\s+KEY\s*\(([^)]+)\)\s*REFERENCES\s+(?:"?(\w+)"?\.)?"?(\w+)"?\s*\(([^)]+)\)/gi
    while ((cm = constraintFKRegex.exec(body)) !== null) {
      const fkCols = cm[1].split(',').map((c) => c.trim().replace(/"/g, ''))
      const refTable = cm[3]
      const refCols = cm[4].split(',').map((c) => c.trim().replace(/"/g, ''))
      tableFKs.push({ columns: fkCols, refTable, refColumns: refCols })
    }

    // Parse individual columns
    const lines = splitColumnDefs(body)

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue

      // Skip table-level constraints
      if (/^(PRIMARY\s+KEY|UNIQUE|FOREIGN\s+KEY|CONSTRAINT|CHECK)\s/i.test(trimmed)) continue

      const colMatch = trimmed.match(
        /^"?(\w+)"?\s+([\w\s(),.]+?)(?:\s+(NOT\s+NULL|NULL|PRIMARY\s+KEY|UNIQUE|DEFAULT\s+.+|REFERENCES\s+.+|CHECK\s*\(.+\)))*$/i,
      )

      if (!colMatch) {
        // Try simpler match
        const simpleMatch = trimmed.match(/^"?(\w+)"?\s+(.+)$/i)
        if (!simpleMatch) continue

        const col = parseColumnLine(simpleMatch[1], simpleMatch[2], tableName, relationships)
        if (tablePKs.has(col.name)) col.isPrimaryKey = true
        if (tableUniques.has(col.name)) {
          col.isUnique = true
          uniqueColumns.add(`${tableName}.${col.name}`)
        }
        columns.push(col)
        continue
      }

      const col = parseColumnLine(colMatch[1], trimmed.slice(colMatch[1].length + 1).replace(/^"?\s*/, ''), tableName, relationships)
      if (tablePKs.has(col.name)) col.isPrimaryKey = true
      if (tableUniques.has(col.name)) {
        col.isUnique = true
        uniqueColumns.add(`${tableName}.${col.name}`)
      }
      columns.push(col)
    }

    // Apply table-level FKs
    for (const fk of tableFKs) {
      for (let i = 0; i < fk.columns.length; i++) {
        const col = columns.find((c) => c.name === fk.columns[i])
        if (col) {
          col.isForeignKey = true
          col.references = { table: fk.refTable, column: fk.refColumns[i] }
          relationships.push({
            from: { table: tableName, column: fk.columns[i] },
            to: { table: fk.refTable, column: fk.refColumns[i] },
            type: 'one-to-many',
          })
        }
      }
    }

    tables.push({ name: tableName, columns })
  }

  if (tables.length === 0) {
    throw new Error('No valid CREATE TABLE statements found. Check your SQL syntax.')
  }

  // Fix relationship types: if FK column is unique, it's one-to-one
  for (const rel of relationships) {
    if (uniqueColumns.has(`${rel.from.table}.${rel.from.column}`)) {
      rel.type = 'one-to-one'
    }
  }

  return { tables, relationships }
}

function splitColumnDefs(body: string): string[] {
  const results: string[] = []
  let current = ''
  let depth = 0

  for (const char of body) {
    if (char === '(') depth++
    if (char === ')') depth--
    if (char === ',' && depth === 0) {
      results.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  if (current.trim()) results.push(current.trim())
  return results
}

function parseColumnLine(
  name: string,
  rest: string,
  tableName: string,
  relationships: Relationship[],
): Column {
  const upper = rest.toUpperCase()

  // Extract type (first word/phrase before constraints)
  const typeMatch = rest.match(
    /^((?:character\s+varying|double\s+precision|timestamp\s+with(?:out)?\s+time\s+zone|bigint|smallint|integer|int|uuid|text|boolean|bool|jsonb?|date|timestamptz?|varchar|char|numeric|decimal|real|float|serial|bigserial)(?:\s*\([^)]*\))?)/i,
  )
  const type = typeMatch ? typeMatch[1].trim() : rest.split(/\s/)[0]

  const col: Column = {
    name,
    type: normalizeType(type),
    isPrimaryKey: /PRIMARY\s+KEY/i.test(upper),
    isForeignKey: false,
    isNullable: !/NOT\s+NULL/i.test(upper) && !/PRIMARY\s+KEY/i.test(upper),
    isUnique: /UNIQUE/i.test(upper),
  }

  // Check for DEFAULT
  const defaultMatch = rest.match(/DEFAULT\s+(.+?)(?:\s+(?:NOT\s+NULL|NULL|UNIQUE|PRIMARY|REFERENCES|CHECK|$))/i)
  if (defaultMatch) col.defaultValue = defaultMatch[1].trim()

  // Check for inline REFERENCES
  const refMatch = rest.match(/REFERENCES\s+(?:"?(\w+)"?\.)?"?(\w+)"?\s*\(\s*"?(\w+)"?\s*\)/i)
  if (refMatch) {
    const refTable = refMatch[2]
    const refColumn = refMatch[3]
    col.isForeignKey = true
    col.references = { table: refTable, column: refColumn }
    relationships.push({
      from: { table: tableName, column: name },
      to: { table: refTable, column: refColumn },
      type: col.isUnique ? 'one-to-one' : 'one-to-many',
    })
  }

  return col
}

function normalizeType(type: string): string {
  const lower = type.toLowerCase().trim()
  const map: Record<string, string> = {
    'character varying': 'varchar',
    'timestamp with time zone': 'timestamptz',
    'timestamp without time zone': 'timestamp',
    'double precision': 'float8',
    boolean: 'bool',
    integer: 'int',
  }
  return map[lower] || lower
}

export function getSupportedTypes(): string[] {
  return [
    'uuid', 'text', 'varchar', 'char', 'int', 'bigint', 'smallint', 'serial', 'bigserial',
    'bool', 'date', 'timestamp', 'timestamptz', 'jsonb', 'json', 'numeric', 'decimal',
    'real', 'float8', 'bytea',
  ]
}
