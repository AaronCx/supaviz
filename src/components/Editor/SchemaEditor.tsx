import { useCallback } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { sql } from '@codemirror/lang-sql'
import { EditorToolbar } from './EditorToolbar'
import type { Schema } from '../../types/schema'

interface SchemaEditorProps {
  value: string
  onChange: (value: string) => void
  onSetImmediate: (value: string) => void
  schema: Schema | null
  error: string | null
}

const SQL_KEYWORDS = [
  'CREATE', 'TABLE', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES',
  'NOT', 'NULL', 'UNIQUE', 'DEFAULT', 'IF', 'EXISTS', 'CONSTRAINT',
  'CHECK', 'INDEX', 'ON', 'CASCADE', 'SET', 'DELETE', 'UPDATE',
]

function formatSQL(input: string): string {
  let result = input
  for (const kw of SQL_KEYWORDS) {
    result = result.replace(new RegExp(`\\b${kw}\\b`, 'gi'), kw)
  }
  return result
}

export function SchemaEditor({ value, onChange, onSetImmediate, schema, error }: SchemaEditorProps) {
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value)
  }, [value])

  return (
    <div className="flex flex-col h-full">
      <EditorToolbar
        onLoadExample={onSetImmediate}
        onClear={() => onSetImmediate('')}
        onFormat={() => onSetImmediate(formatSQL(value))}
        onCopy={handleCopy}
      />

      <div className="flex-1 overflow-auto">
        <CodeMirror
          value={value}
          onChange={onChange}
          extensions={[sql()]}
          theme="dark"
          placeholder="Paste your CREATE TABLE SQL here..."
          className="h-full"
          basicSetup={{
            lineNumbers: true,
            autocompletion: false,
            closeBrackets: true,
            foldGutter: false,
          }}
        />
      </div>

      <div className="px-3 py-2 border-t border-gray-800 text-xs">
        {error ? (
          <span className="text-red-400">{error}</span>
        ) : schema ? (
          <span className="text-emerald-400">
            {schema.tables.length} table{schema.tables.length !== 1 ? 's' : ''},{' '}
            {schema.relationships.length} relationship{schema.relationships.length !== 1 ? 's' : ''} detected
          </span>
        ) : (
          <span className="text-gray-500">Paste SQL to visualize your schema</span>
        )}
      </div>
    </div>
  )
}
