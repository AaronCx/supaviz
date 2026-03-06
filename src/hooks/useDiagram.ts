import { useMemo } from 'react'
import type { Schema } from '../types/schema'
import { applyLayout } from '../core/layout'

export function useDiagram(schema: Schema | null) {
  const { nodes, edges } = useMemo(() => {
    if (!schema || schema.tables.length === 0) {
      return { nodes: [], edges: [] }
    }
    return applyLayout(schema.tables, schema.relationships)
  }, [schema])

  return { nodes, edges }
}
