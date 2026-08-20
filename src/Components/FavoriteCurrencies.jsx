import React from 'react'
import { Star, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { FavoritesSkeleton } from './SkeletonLoaders'

const flagMap = {
  usd: '🇺🇸', eur: '🇪🇺', gbp: '🇬🇧', jpy: '🇯🇵', inr: '🇮🇳', aud: '🇦🇺', cad: '🇨🇦', aed: '🇦🇪',
  chf: '🇨🇭', cny: '🇨🇳', sgd: '🇸🇬', hkd: '🇭🇰', sek: '🇸🇪', nzd: '🇳🇿', zar: '🇿🇦', brl: '🇧🇷'
}

function FavoriteCurrencies({ favorites = [], onToggleFavorite, isLoading = false }) {
  return (
    <div className="fin-card p-5 sm:p-6 space-y-3.5">
      
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-50 dark:bg-amber-950/50 text-amber-500 rounded-xl border border-amber-100 dark:border-amber-900/40">
            <Star size={18} strokeWidth={2.2} className="fill-amber-500/20" />
          </div>
          <div>
            <h2 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Favorite Currencies
            </h2>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              Bookmarked 1-click pairs
            </p>
          </div>
        </div>

        {!isLoading && (
          <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/40">
            {favorites.length} Pinned
          </span>
        )}
      </div>

      {/* Content Chips or Skeleton */}
      {isLoading ? (
        <FavoritesSkeleton />
      ) : favorites.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-1">
          <AnimatePresence>
            {favorites.map((curr) => {
              const flag = flagMap[curr.toLowerCase()] || '🏳️'
              return (
                <motion.div
                  key={curr}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold shadow-2xs hover:border-blue-500/50 transition-all"
                >
                  <span className="text-xs shrink-0">{flag}</span>
                  <span className="font-extrabold tracking-wider text-slate-900 dark:text-white uppercase text-xs">
                    {curr.toUpperCase()}
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(curr)}
                    aria-label={`Remove ${curr} from favorites`}
                    className="p-0.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer rounded-md hover:bg-slate-200 dark:hover:bg-slate-800"
                  >
                    <X size={12} />
                  </button>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* Compact Empty State */
        <div className="py-4 px-3 bg-slate-50/70 dark:bg-[#090D16]/60 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-1">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No Favorites Pinned</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Click the star icon on any currency card or dropdown option to bookmark it.
          </p>
        </div>
      )}

    </div>
  )
}

export default FavoriteCurrencies
