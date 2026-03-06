import { Button } from '../ui/Button'

export function Header() {
  return (
    <header className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-gray-900 border-b border-gray-800 shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-supabase flex items-center justify-center text-white font-bold text-xs sm:text-sm shrink-0">
          S
        </div>
        <h1 className="text-base sm:text-lg font-bold text-white whitespace-nowrap">
          Supa<span className="text-supabase">Viz</span>
        </h1>
        <span className="hidden lg:inline text-sm text-gray-500">
          Visualize your Supabase schema instantly
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <span className="hidden md:inline-flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded border border-gray-700">
          Schema stays in your browser
        </span>
        <a href="https://ko-fi.com/aaroncx" target="_blank" rel="noreferrer">
          <Button size="sm" variant="ghost" className="hidden sm:inline-flex">Support</Button>
        </a>
        <a href="https://github.com/AaronCx/supaviz" target="_blank" rel="noreferrer">
          <Button size="sm" variant="ghost">GitHub</Button>
        </a>
      </div>
    </header>
  )
}
