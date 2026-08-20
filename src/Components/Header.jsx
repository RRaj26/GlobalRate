import React from 'react'
import { Globe, RefreshCw, Sun, Moon } from 'lucide-react'

function Header({ lastUpdated, isRefreshing, onRefresh, theme, toggleTheme }) {
  return (
    <header className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Brand Logo & Section Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <Globe size={22} strokeWidth={2.2} />
          </div>
          
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                GlobalRate
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 tracking-wider">
                PRO
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                Global Currency Overview &bull; Real-time exchange rates and converter
              </h1>
            </div>
          </div>
        </div>

        {/* Action Controls & Live Rates Status */}
        <div className="flex items-center gap-3 self-end md:self-center shrink-0">
          
          {/* Live Rates Status Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
              Live Rates
            </span>
            {lastUpdated && (
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-700 pl-2 ml-0.5 font-mono-numbers">
                {lastUpdated}
              </span>
            )}
          </div>

          {/* Refresh Rates Button */}
          <button
            type="button"
            onClick={onRefresh}
            title="Refresh Exchange Rates"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl transition-all cursor-pointer shadow-2xs hover:border-blue-500 dark:hover:border-blue-500 active:scale-95"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin text-blue-600 dark:text-blue-400" : ""} />
            <span>Refresh</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 rounded-xl transition-all cursor-pointer shadow-2xs hover:border-blue-500 dark:hover:border-blue-500 active:scale-95"
          >
            {theme === 'dark' ? (
              <>
                <Sun size={14} className="text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon size={14} className="text-blue-600" />
                <span>Dark</span>
              </>
            )}
          </button>

        </div>

      </div>
    </header>
  )
}

export default Header
