import dagre from 'dagre'
import type { Node, Edge } from '@xyflow/react'
import type { Table, Relationship } from '../types/schema'

const NODE_WIDTH = 280
const HEADER_HEIGHT = 48
const ROW_HEIGHT = 36

export function applyLayout(
  tables: Table[],
  relationships: Relationship[],
): { nodes: Node[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph()
  const direction = tables.length > 5 ? 'LR' : 'TB'

  g.setGraph({ rankdir: direction, nodesep: 60, ranksep: 80, marginx: 40, marginy: 40 })
  g.setDefaultEdgeLabel(() => ({}))

  for (const table of tables) {
    const height = HEADER_HEIGHT + table.columns.length * ROW_HEIGHT
    g.setNode(table.name, { width: NODE_WIDTH, height })
  }

  for (const rel of relationships) {
    if (g.hasNode(rel.from.table) && g.hasNode(rel.to.table)) {
      g.setEdge(rel.from.table, rel.to.table)
    }
  }

  dagre.layout(g)

  const nodes: Node[] = tables.map((table) => {
    const node = g.node(table.name)
    const height = HEADER_HEIGHT + table.columns.length * ROW_HEIGHT
    return {
      id: table.name,
      type: 'tableNode',
      position: {
        x: node.x - NODE_WIDTH / 2,
        y: node.y - height / 2,
      },
      data: { table },
    }
  })

  const edges: Edge[] = relationships
    .filter((rel) => g.hasNode(rel.from.table) && g.hasNode(rel.to.table))
    .map((rel, i) => ({
      id: `e-${rel.from.table}-${rel.from.column}-${rel.to.table}-${i}`,
      source: rel.from.table,
      target: rel.to.table,
      sourceHandle: `${rel.from.table}-${rel.from.column}`,
      targetHandle: `${rel.to.table}-${rel.to.column}`,
      animated: true,
      style: { stroke: '#3ECF8E', strokeDasharray: '5,5' },
      label: rel.type,
      labelStyle: { fontSize: 11, fill: '#8b949e' },
      labelBgStyle: { fill: '#1e2228', fillOpacity: 0.9 },
    }))

  return { nodes, edges }
}
