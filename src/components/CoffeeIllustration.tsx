import type { Coffee } from '../types'

interface CoffeeIllustrationProps {
  coffee: Coffee
  className?: string
}

/** Ilustração vetorial reutilizável da embalagem de cada café. */
export function CoffeeIllustration({ coffee, className }: CoffeeIllustrationProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 140"
      role="img"
      aria-label={`Embalagem de ${coffee.name}`}
    >
      <ellipse cx="80" cy="126" rx="46" ry="7" fill="rgba(0,0,0,.12)" />
      <path d="M48 34h64l9 84a6 6 0 0 1-6 7H45a6 6 0 0 1-6-7l9-84Z" fill={coffee.color} />
      <path d="M48 34h64l2 15H46l2-15Z" fill={coffee.accent} opacity=".85" />
      <rect x="52" y="57" width="56" height="49" rx="6" fill={coffee.accent} />
      <ellipse cx="80" cy="78" rx="13" ry="8" transform="rotate(-25 80 78)" fill={coffee.color} />
      <path d="M74 85c4-2 8-6 12-12" stroke={coffee.accent} strokeWidth="2" fill="none" />
      <path d="M64 95h32" stroke={coffee.color} strokeWidth="2.5" strokeLinecap="round" opacity=".7" />
      <path d="M69 101h22" stroke={coffee.color} strokeWidth="2" strokeLinecap="round" opacity=".5" />
      <path d="M57 28c-4-6 3-9 0-15M80 27c-4-6 3-9 0-15M103 28c-4-6 3-9 0-15" stroke={coffee.color} strokeWidth="3" strokeLinecap="round" fill="none" opacity=".6" />
    </svg>
  )
}
