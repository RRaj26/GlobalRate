import React from 'react'
import { Clock, Trash2, Bookmark } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { HistorySkeleton } from './SkeletonLoaders'

function CalculationHistory({ history = [], onClearHistory, isLoading = false }) {
  return (
    <div className="fin-card p-5 sm:p-6 space-y-4">
      
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/40">
            <Clock size={18} strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Recent Calculation History
            </h2>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              Saved conversion log
            </p>
          </div>
        </div>

        {!isLoading && history.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="text-[11px] font-extrabold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors uppercase tracking-wider flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            <Trash2 size={13} />
            <span>Clear Log</span>
          </button>
        )}
      </div>

      {/* Content List, Skeleton or Empty State */}
      {isLoading ? (
        <HistorySkeleton />
      ) : history.length > 0 ? (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5 scrollbar-none">
          <AnimatePresence mode="popLayout">
            {history.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/40 transition-all text-xs"
              >
                <div className="flex items-center gap-1.5 min-w-0 font-semibold truncate">
                  <span className="font-mono-numbers text-slate-900 dark:text-white font-extrabold">
                    {typeof item.fromAmount === 'number' ? item.fromAmount.toLocaleString() : item.fromAmount}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{item.from}</span>
                  <span className="text-slate-400">→</span>
                  <span className="font-mono-numbers text-blue-600 dark:text-blue-400 font-extrabold">
                    {typeof item.toAmount === 'number' ? item.toAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : item.toAmount}
                  </span>
                  <span className="text-[10px] text-blue-500 font-bold uppercase">{item.to}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium font-mono-numbers">
                    {item.time}
                  </span>
                  <Bookmark size={12} className="text-blue-500/70" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* Compact Empty State */
        <div className="py-5 px-4 bg-slate-50/70 dark:bg-[#090D16]/60 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-1.5">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Clock size={16} />
          </div>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No Calculation History Saved</p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Save a conversion to see your calculated logs here.
          </p>
        </div>
      )}

    </div>
  )
}

export default CalculationHistory
