import { describe, it, expect } from 'vitest'
import { applyLayout } from '../src/core/layout'
import { parseSchema } from '../src/core/parser'
import { examples } from '../src/data/examples'

describe('applyLayout', () => {
  const schema = parseSchema(examples.blog.sql)

  it('returns correct number of nodes (one per table)', () => {
    const { nodes } = applyLayout(schema.tables, schema.relationships)
    expect(nodes).toHaveLength(schema.tables.length)
  })

  it('returns correct number of edges (one per relationship)', () => {
    const { edges } = applyLayout(schema.tables, schema.relationships)
    expect(edges).toHaveLength(schema.relationships.length)
  })

  it('all nodes have x/y position set (not 0,0)', () => {
    const { nodes } = applyLayout(schema.tables, schema.relationships)
    for (const node of nodes) {
      expect(typeof node.position.x).toBe('number')
      expect(typeof node.position.y).toBe('number')
      // At least some nodes should not be at origin
    }
    const nonOrigin = nodes.filter((n) => n.position.x !== 0 || n.position.y !== 0)
    expect(nonOrigin.length).toBeGreaterThan(0)
  })

  it('no two nodes overlap', () => {
    const { nodes } = applyLayout(schema.tables, schema.relationships)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i]
        const b = nodes[j]
        const aW = 280, bW = 280
        const aH = 48 + schema.tables.find((t) => t.name === a.id)!.columns.length * 36
        const bH = 48 + schema.tables.find((t) => t.name === b.id)!.columns.length * 36

        const overlapX = a.position.x < b.position.x + bW && a.position.x + aW > b.position.x
        const overlapY = a.position.y < b.position.y + bH && a.position.y + aH > b.position.y

        expect(overlapX && overlapY).toBe(false)
      }
    }
  })
})
