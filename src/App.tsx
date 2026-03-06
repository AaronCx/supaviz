import { useState, useCallback } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { Header } from './components/Layout/Header'
import { SchemaEditor } from './components/Editor/SchemaEditor'
import { DiagramCanvas } from './components/Diagram/DiagramCanvas'
import { useSchema } from './hooks/useSchema'
import { useDiagram } from './hooks/useDiagram'

export default function App() {
  const { sql, schema, error, updateSql, setImmediate } = useSchema()
  const { nodes, edges } = useDiagram(schema)
  const [sidebarWidth, setSidebarWidth] = useState(35)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      const startX = e.clientX
      const startWidth = sidebarWidth

      const onMove = (ev: MouseEvent) => {
        const delta = ev.clientX - startX
        const newWidth = startWidth + (delta / window.innerWidth) * 100
        setSidebarWidth(Math.max(20, Math.min(60, newWidth)))
      }
      const onUp = () => {
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    },
    [sidebarWidth],
  )

  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col bg-gray-950">
        <Header />

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Editor panel */}
          <div
            className="md:h-full h-[45vh] border-r border-gray-800 flex flex-col"
            style={{ width: `${sidebarWidth}%` }}
          >
            <SchemaEditor
              value={sql}
              onChange={updateSql}
              onSetImmediate={setImmediate}
              schema={schema}
              error={error}
            />
          </div>

          {/* Resize handle */}
          <div
            className="resize-handle hidden md:block bg-gray-800 hover:bg-supabase"
            onMouseDown={handleMouseDown}
          />

          {/* Diagram panel */}
          <div className="flex-1 h-[55vh] md:h-full">
            <DiagramCanvas initialNodes={nodes} initialEdges={edges} />
          </div>
        </div>

        <footer className="text-center py-1.5 text-[11px] text-gray-600 border-t border-gray-800 bg-gray-900">
          Built by{' '}
          <a href="https://github.com/AaronCx" className="text-gray-500 hover:text-gray-300" target="_blank" rel="noreferrer">
            Aaron Character
          </a>
          {' · '}
          <a href="https://ko-fi.com/aaroncx" className="text-gray-500 hover:text-gray-300" target="_blank" rel="noreferrer">
            Support on Ko-fi
          </a>
        </footer>
      </div>
    </ReactFlowProvider>
  )
}
