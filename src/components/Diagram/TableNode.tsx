import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import type { Table } from '../../types/schema'

const TABLE_COLORS = [
  '#3ECF8E', '#58a6ff', '#bc8cff', '#f0883e',
  '#d29922', '#f778ba', '#56d4dd', '#8b949e',
]

function hashColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) | 0
  }
  return TABLE_COLORS[Math.abs(hash) % TABLE_COLORS.length]
}

interface TableNodeProps {
  data: { table: Table }
}

export const TableNode = memo(function TableNode({ data }: TableNodeProps) {
  const { table } = data
  const color = hashColor(table.name)

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 shadow-lg overflow-hidden w-[220px] sm:w-[280px]">
      <div
        className="px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5 sm:gap-2"
        style={{ backgroundColor: color + '20', borderBottom: `2px solid ${color}` }}
      >
        <span style={{ color }}>&#x1f5c2;</span>
        <span className="truncate">{table.name}</span>
      </div>

      <div className="divide-y divide-gray-800">
        {table.columns.map((col) => {
          const borderColor = col.isPrimaryKey
            ? 'border-l-yellow-400'
            : col.isForeignKey
              ? 'border-l-blue-400'
              : 'border-l-transparent'

          return (
            <div
              key={col.name}
              className={`flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs border-l-2 ${borderColor} hover:bg-gray-800/50`}
            >
              <Handle
                type="target"
                position={Position.Left}
                id={`${table.name}-${col.name}`}
                className="!w-2 !h-2 !bg-gray-600 !border-gray-500"
              />
              <div className="flex items-center gap-1.5 min-w-0">
                {col.isPrimaryKey && <span className="text-yellow-400 text-[9px] sm:text-[10px] shrink-0">PK</span>}
                {col.isForeignKey && <span className="text-blue-400 text-[9px] sm:text-[10px] shrink-0">FK</span>}
                <span className="text-gray-200 truncate">{col.name}</span>
              </div>
              <span className={`text-gray-500 ml-2 shrink-0 ${col.isNullable ? 'italic' : ''}`}>
                {col.type}
              </span>
              <Handle
                type="source"
                position={Position.Right}
                id={`${table.name}-${col.name}`}
                className="!w-2 !h-2 !bg-gray-600 !border-gray-500"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
})
