import { useState, useCallback, useRef, useEffect } from 'react'
import { parseSchema } from '../core/parser'
import type { Schema } from '../types/schema'

export function useSchema() {
  const [sql, setSql] = useState('')
  const [schema, setSchema] = useState<Schema | null>(null)
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const parse = useCallback((input: string) => {
    if (!input.trim()) {
      setSchema(null)
      setError(null)
      return
    }
    try {
      const result = parseSchema(input)
      setSchema(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Parse error')
      setSchema(null)
    }
  }, [])

  const updateSql = useCallback(
    (value: string) => {
      setSql(value)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => parse(value), 400)
    },
    [parse],
  )

  const setImmediate = useCallback(
    (value: string) => {
      setSql(value)
      parse(value)
    },
    [parse],
  )

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return { sql, schema, error, updateSql, setImmediate }
}
