import React, { useState } from 'react'
import { Sparkles, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react'
import { PopularRatesSkeleton } from './SkeletonLoaders'

const flagMap = {
  usd: '🇺🇸', eur: '🇪🇺', gbp: '🇬🇧', jpy: '🇯🇵', aud: '🇦🇺', cad: '🇨🇦', aed: '🇦🇪', inr: '🇮🇳',
  chf: '🇨🇭', cny: '🇨🇳', sgd: '🇸🇬', hkd: '🇭🇰', sek: '🇸🇪', nzd: '🇳🇿', zar: '🇿🇦', brl: '🇧🇷'
}

const defaultPopularCodes = ['eur', 'gbp', 'jpy', 'aud', 'cad', 'aed']
const extendedPopularCodes = ['eur', 'gbp', 'jpy', 'aud', 'cad', 'aed', 'chf', 'cny', 'sgd', 'hkd']

const pseudoChanges = {
  eur: 0.18,
  gbp: -0.21,
  jpy: 0.31,
  aud: 0.25,
  cad: 0.22,
  aed: 0.15,
  chf: -0.10,
  cny: 0.05,
  sgd: 0.12,
  hkd: 0.02
}

function PopularRates({ 
  baseCurrency = 'usd', 
  currencyInfo = {}, 
  currencyNames = {}, 
  isLoading = false,
  formatExchangeRate 
}) {
  const [showAll, setShowAll] = useState(false)

  const activeCodes = showAll ? extendedPopularCodes : defaultPopularCodes
  const displayCodes = activeCodes.filter(c => c !== baseCurrency.toLowerCase())

  return (
    <div className="fin-card p-5 sm:p-6 space-y-4">
      
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/40">
            <Sparkles size={18} strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Popular Exchange Rates
            </h2>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              Major global pair market quotes
            </p>
          </div>
        </div>

        <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700/60">
          Base: {baseCurrency.toUpperCase()}
        </span>
      </div>

      {/* Content List or Skeleton */}
      {isLoading ? (
        <PopularRatesSkeleton />
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 py-0.5">
          {displayCodes.map((code) => {
            const rawRate = currencyInfo[code]
            const displayRate = rawRate ? (1 / rawRate) : null
            const flag = flagMap[code] || '🏳️'
            const name = currencyNames[code] || code.toUpperCase()
            const change = pseudoChanges[code] || 0.12
            const isPositive = change >= 0

            return (
              <div 
                key={code}
                className="flex items-center justify-between py-2 px-2 hover:bg-slate-50 dark:hover:bg-[#090D16] rounded-xl transition-colors duration-150"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm leading-none shrink-0 shadow-2xs">
                    {flag}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs tracking-wider text-slate-900 dark:text-white uppercase">
                        {code}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium block capitalize truncate max-w-[130px]">
                      {name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right shrink-0">
                  <span className="font-extrabold text-xs font-mono-numbers text-slate-900 dark:text-white">
                    {displayRate && formatExchangeRate ? formatExchangeRate(displayRate, baseCurrency) : (rawRate ? `$${Number(rawRate).toFixed(2)}` : '—')}
                  </span>

                  <span 
                    className={`inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md min-w-[56px] justify-center ${
                      isPositive 
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40' 
                        : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/40'
                    }`}
                  >
                    {isPositive ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                    {isPositive ? '+' : ''}{change.toFixed(2)}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* View All Rates Action */}
      {!isLoading && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="w-full text-center text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 pt-1 flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>{showAll ? 'Show Fewer Rates' : 'View All Rates'}</span>
          <ChevronRight size={14} className={`transform transition-transform ${showAll ? '-rotate-90' : ''}`} />
        </button>
      )}

    </div>
  )
}

export default PopularRates
