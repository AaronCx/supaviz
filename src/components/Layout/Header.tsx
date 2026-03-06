import { Button } from '../ui/Button'

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-supabase flex items-center justify-center text-white font-bold text-sm">
            S
          </div>
          <h1 className="text-lg font-bold text-white">
            Supa<span className="text-supabase">Viz</span>
          </h1>
        </div>
        <span className="hidden sm:inline text-sm text-gray-500">
          Visualize your Supabase schema instantly
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden sm:inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded border border-gray-700">
          Your schema never leaves your browser
        </span>
        <a
          href="https://ko-fi.com/aaroncx"
          target="_blank"
          rel="noreferrer"
        >
          <Button size="sm" variant="ghost">Support SupaViz</Button>
        </a>
        <a
          href="https://github.com/AaronCx/supaviz"
          target="_blank"
          rel="noreferrer"
        >
          <Button size="sm" variant="ghost">GitHub</Button>
        </a>
      </div>
    </header>
  )
}
