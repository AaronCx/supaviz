export interface Column {
  name: string
  type: string
  isPrimaryKey: boolean
  isForeignKey: boolean
  isNullable: boolean
  isUnique: boolean
  defaultValue?: string
  references?: {
    table: string
    column: string
  }
}

export interface Table {
  name: string
  columns: Column[]
}

export interface Schema {
  tables: Table[]
  relationships: Relationship[]
}

export interface Relationship {
  from: { table: string; column: string }
  to: { table: string; column: string }
  type: 'one-to-many' | 'many-to-many' | 'one-to-one'
}
