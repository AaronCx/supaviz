interface BadgeProps {
  children: React.ReactNode
  color?: string
}

export function Badge({ children, color = 'gray' }: BadgeProps) {
  const colors: Record<string, string> = {
    gray: 'bg-gray-800 text-gray-400',
    yellow: 'bg-yellow-900/50 text-yellow-400',
    blue: 'bg-blue-900/50 text-blue-400',
    green: 'bg-emerald-900/50 text-emerald-400',
  }

  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${colors[color] || colors.gray}`}>
      {children}
    </span>
  )
}
