import { useState, useRef, useEffect } from 'react'
import { Button } from '../ui/Button'
import { examples, type ExampleKey } from '../../data/examples'

interface EditorToolbarProps {
  onLoadExample: (sql: string) => void
  onClear: () => void
  onFormat: () => void
  onCopy: () => void
}

export function EditorToolbar({ onLoadExample, onClear, onFormat, onCopy }: EditorToolbarProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 border-b border-gray-800 bg-gray-900/50 overflow-x-auto shrink-0">
      <div className="relative shrink-0" ref={ref}>
        <Button size="sm" onClick={() => setOpen(!open)}>
          Examples &#x25BE;
        </Button>
        {open && (
          <div className="absolute top-full left-0 mt-1 z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden min-w-[140px]">
            {(Object.keys(examples) as ExampleKey[]).map((key) => (
              <button
                key={key}
                className="block w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-gray-700"
                onClick={() => {
                  onLoadExample(examples[key].sql)
                  setOpen(false)
                }}
              >
                {examples[key].name}
              </button>
            ))}
          </div>
        )}
      </div>
      <Button size="sm" onClick={onClear} className="shrink-0">Clear</Button>
      <Button size="sm" onClick={onFormat} className="shrink-0 hidden sm:inline-flex">Format</Button>
      <Button size="sm" onClick={onCopy} className="shrink-0 hidden sm:inline-flex">Copy</Button>
    </div>
  )
}
