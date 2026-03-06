import { useState, useCallback, useMemo } from 'react'
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
  const [mobilePanel, setMobilePanel] = useState<'editor' | 'diagram'>('editor')

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

  const handleLoadExample = useCallback(
    (v: string) => {
      setImmediate(v)
      if (v) setMobilePanel('diagram')
    },
    [setImmediate],
  )

  const editorStyle = useMemo(
    () => ({ width: window.innerWidth >= 768 ? `${sidebarWidth}%` : undefined }),
    [sidebarWidth],
  )

  return (
    <ReactFlowProvider>
      <div className="h-[100dvh] flex flex-col bg-gray-950">
        <Header />

        {/* Mobile tab switcher */}
        <div className="flex md:hidden border-b border-gray-800 bg-gray-900 shrink-0">
          <button
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${mobilePanel === 'editor' ? 'text-supabase border-b-2 border-supabase' : 'text-gray-500'}`}
            onClick={() => setMobilePanel('editor')}
          >
            SQL Editor
          </button>
          <button
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${mobilePanel === 'diagram' ? 'text-supabase border-b-2 border-supabase' : 'text-gray-500'}`}
            onClick={() => setMobilePanel('diagram')}
          >
            Diagram {schema ? `(${schema.tables.length})` : ''}
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Editor panel — full width on mobile, percentage on desktop */}
          <div
            className={`border-r border-gray-800 flex flex-col min-h-0 ${mobilePanel === 'editor' ? 'flex-1' : 'hidden'} md:flex md:flex-none`}
            style={editorStyle}
          >
            <SchemaEditor
              value={sql}
              onChange={updateSql}
              onSetImmediate={handleLoadExample}
              schema={schema}
              error={error}
            />
          </div>

          {/* Resize handle — desktop only */}
          <div
            className="resize-handle hidden md:block bg-gray-800 hover:bg-supabase shrink-0"
            onMouseDown={handleMouseDown}
          />

          {/* Diagram panel */}
          <div className={`min-h-0 ${mobilePanel === 'diagram' ? 'flex-1' : 'hidden'} md:flex md:flex-1`}>
            <DiagramCanvas initialNodes={nodes} initialEdges={edges} />
          </div>
        </div>

        <footer className="text-center py-1.5 text-[11px] text-gray-600 border-t border-gray-800 bg-gray-900 shrink-0">
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
