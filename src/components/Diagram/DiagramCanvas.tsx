import { useState, useCallback, useEffect } from 'react'
import {
  ReactFlow,
  Background,
  MiniMap,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { TableNode } from './TableNode'
import { DiagramToolbar } from './DiagramToolbar'

const nodeTypes = { tableNode: TableNode }

interface DiagramCanvasProps {
  initialNodes: Node[]
  initialEdges: Edge[]
}

export function DiagramCanvas({ initialNodes, initialEdges }: DiagramCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [showMinimap, setShowMinimap] = useState(() => window.innerWidth >= 768)

  useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges, setNodes, setEdges])

  const toggleMinimap = useCallback(() => setShowMinimap((v) => !v), [])

  return (
    <div className="relative w-full h-full min-h-0" id="diagram-canvas">
      <DiagramToolbar showMinimap={showMinimap} onToggleMinimap={toggleMinimap} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        proOptions={{ hideAttribution: true }}
        className="bg-gray-950"
        minZoom={0.1}
      >
        <Background color="#1e2228" gap={20} />
        {showMinimap && (
          <MiniMap
            nodeColor="#3ECF8E"
            maskColor="rgba(0,0,0,0.6)"
            className="!bg-gray-900 !border-gray-700"
          />
        )}
      </ReactFlow>
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
          <div className="text-center text-gray-600">
            <p className="text-base sm:text-lg font-medium">No schema loaded</p>
            <p className="text-xs sm:text-sm mt-1">Paste SQL or load an example to get started</p>
          </div>
        </div>
      )}
    </div>
  )
}
