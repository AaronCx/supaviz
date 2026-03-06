import { useReactFlow } from '@xyflow/react'
import { Button } from '../ui/Button'
import { exportAsPNG, exportAsSVG } from '../../core/exporter'

interface DiagramToolbarProps {
  showMinimap: boolean
  onToggleMinimap: () => void
}

export function DiagramToolbar({ showMinimap, onToggleMinimap }: DiagramToolbarProps) {
  const { fitView, zoomIn, zoomOut } = useReactFlow()

  return (
    <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-gray-900/90 border border-gray-700 rounded-lg p-1.5 backdrop-blur">
      <Button size="sm" variant="ghost" onClick={() => fitView({ padding: 0.2 })}>Fit</Button>
      <Button size="sm" variant="ghost" onClick={() => zoomIn()}>+</Button>
      <Button size="sm" variant="ghost" onClick={() => zoomOut()}>-</Button>
      <div className="w-px h-5 bg-gray-700" />
      <Button size="sm" variant="ghost" onClick={() => exportAsPNG('diagram-canvas')}>PNG</Button>
      <Button size="sm" variant="ghost" onClick={() => exportAsSVG('diagram-canvas')}>SVG</Button>
      <div className="w-px h-5 bg-gray-700" />
      <Button size="sm" variant="ghost" onClick={onToggleMinimap}>
        {showMinimap ? 'Hide Map' : 'Map'}
      </Button>
    </div>
  )
}
