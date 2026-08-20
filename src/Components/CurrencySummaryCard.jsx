import React from 'react'
import { Star, TrendingUp, TrendingDown } from 'lucide-react'
import { CurrencySummaryCardSkeleton } from './SkeletonLoaders'

// Flag map helper
const flagMap = {
  usd: '🇺🇸', eur: '🇪🇺', gbp: '🇬🇧', jpy: '🇯🇵', inr: '🇮🇳', aud: '🇦🇺', cad: '🇨🇦', aed: '🇦🇪'
}

// Generate smooth SVG sparkline path
const generateSparklinePath = (changePercent, width = 90, height = 30) => {
  const isPositive = changePercent >= 0
  let seed = Math.abs(changePercent) * 100 + 12
  const points = []
  const steps = 7
  
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width
    const pseudoRand = (Math.sin(seed + i * 1.5) + 1) / 2
    let y = (height / 2) + (pseudoRand * (height / 2.5) - height / 5)
    
    if (i === 0) y = isPositive ? height * 0.7 : height * 0.3
    if (i === steps) y = isPositive ? height * 0.25 : height * 0.75
    points.push({ x, y })
  }

  let d = `M ${points[0].x},${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i]
    const next = points[i + 1]
    const cpX = (curr.x + next.x) / 2
    d += ` C ${cpX},${curr.y} ${cpX},${next.y} ${next.x},${next.y}`
  }
  return d
}

function CurrencySummaryCard({ 
  fromCode, 
  toCode = 'inr', 
  rate, 
  changePercent = 0.42, 
  isFavorite = false, 
  onToggleFavorite,
  isLoading = false
}) {
  if (isLoading || !rate || isNaN(rate)) {
    return <CurrencySummaryCardSkeleton />
  }

  const flag = flagMap[fromCode.toLowerCase()] || '🏳️'
  const isPositive = changePercent >= 0
  const sparklinePath = generateSparklinePath(changePercent, 90, 30)

  const symbol = toCode.toLowerCase() === 'inr' ? '₹' : (toCode.toLowerCase() === 'usd' ? '$' : '€')
  const formattedValue = `${symbol}${Number(rate).toFixed(2)}`

  return (
    <div className="fin-card p-4 flex flex-col justify-between h-[124px] group hover:border-blue-500/40 transition-all duration-200">
      
      {/* Top Row: Flag + Pair Title & Favorite Star */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm leading-none">{flag}</span>
          <span className="font-extrabold text-xs tracking-wider text-slate-800 dark:text-slate-200 uppercase">
            {fromCode.toUpperCase()} / {toCode.toUpperCase()}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onToggleFavorite && onToggleFavorite(fromCode)}
          aria-label={isFavorite ? `Remove ${fromCode} from favorites` : `Add ${fromCode} to favorites`}
          className="text-slate-300 dark:text-slate-600 hover:text-amber-400 transition-colors p-1 cursor-pointer"
        >
          <Star 
            size={14} 
            className={isFavorite ? "fill-amber-400 text-amber-400" : "stroke-slate-400 hover:scale-110"} 
          />
        </button>
      </div>

      {/* Bottom Content Row: Rate + Change Pill & Sparkline */}
      <div className="flex items-end justify-between gap-2">
        <div className="space-y-1">
          <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono-numbers tracking-tight">
            {formattedValue}
          </div>

          <div className="flex items-center">
            <span 
              className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                isPositive 
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40' 
                  : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/40'
              }`}
            >
              {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {isPositive ? '+' : ''}{changePercent.toFixed(2)}% (24h)
            </span>
          </div>
        </div>

        {/* Mini Sparkline Chart */}
        <div className="w-20 h-7 shrink-0 pb-0.5">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 90 30">
            <defs>
              <linearGradient id={`grad-${fromCode}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity="0.25" />
                <stop offset="100%" stopColor={isPositive ? '#10B981' : '#EF4444'} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d={`${sparklinePath} L 90 30 L 0 30 Z`}
              fill={`url(#grad-${fromCode})`}
            />
            <path
              d={sparklinePath}
              fill="none"
              stroke={isPositive ? '#10B981' : '#EF4444'}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

    </div>
  )
}

export default CurrencySummaryCard
