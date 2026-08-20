import React from 'react'

/**
 * Reusable Base Skeleton Primitive Component
 */
export function Skeleton({ className = "" }) {
  return (
    <div 
      aria-busy="true"
      aria-hidden="true"
      className={`bg-[#E9EDF2] dark:bg-[#1E293B] animate-shimmer rounded-xl select-none ${className}`} 
    />
  )
}

/**
 * Currency Summary Card Skeleton (Exact height 124px, zero CLS)
 */
export function CurrencySummaryCardSkeleton() {
  return (
    <div aria-busy="true" className="fin-card p-4 flex flex-col justify-between h-[124px]">
      {/* Top Row: Pair & Star */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="w-20 h-4 rounded-md" />
        </div>
        <Skeleton className="w-4 h-4 rounded-md" />
      </div>

      {/* Bottom Content Row: Rate + Change Pill & Sparkline */}
      <div className="flex items-end justify-between gap-2">
        <div className="space-y-2">
          <Skeleton className="w-28 h-6 rounded-lg" />
          <Skeleton className="w-24 h-4 rounded-md" />
        </div>
        <Skeleton className="w-20 h-7 rounded-lg shrink-0" />
      </div>
    </div>
  )
}

/**
 * Currency Converter Card Skeleton
 */
export function ConverterSkeleton() {
  return (
    <div aria-busy="true" className="space-y-4">
      {/* From & To Input Boxes Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* From Box */}
        <div className="sm:col-span-5 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#090D16] space-y-2">
          <div className="flex justify-between">
            <Skeleton className="w-12 h-3" />
            <Skeleton className="w-16 h-3" />
          </div>
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="w-24 h-8 rounded-xl" />
            <Skeleton className="w-20 h-7 rounded-lg" />
          </div>
        </div>

        {/* Swap Button Placeholder */}
        <div className="sm:col-span-2 flex justify-center py-1 sm:py-0">
          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
        </div>

        {/* To Box */}
        <div className="sm:col-span-5 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#090D16] space-y-2">
          <div className="flex justify-between">
            <Skeleton className="w-12 h-3" />
            <Skeleton className="w-16 h-3" />
          </div>
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="w-24 h-8 rounded-xl" />
            <Skeleton className="w-20 h-7 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Quick Amounts Presets Skeleton */}
      <div className="space-y-1.5 pt-0.5">
        <Skeleton className="w-24 h-3" />
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="w-14 h-6 rounded-xl" />
          <Skeleton className="w-14 h-6 rounded-xl" />
          <Skeleton className="w-16 h-6 rounded-xl" />
          <Skeleton className="w-16 h-6 rounded-xl" />
          <Skeleton className="w-18 h-6 rounded-xl" />
        </div>
      </div>

      {/* Pinned & Target Favorites Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="space-y-1">
          <Skeleton className="w-28 h-3" />
          <div className="flex flex-wrap gap-1">
            <Skeleton className="w-12 h-6 rounded-lg" />
            <Skeleton className="w-12 h-6 rounded-lg" />
            <Skeleton className="w-12 h-6 rounded-lg" />
            <Skeleton className="w-12 h-6 rounded-lg" />
          </div>
        </div>
        <div className="space-y-1">
          <Skeleton className="w-28 h-3" />
          <div className="flex flex-wrap gap-1">
            <Skeleton className="w-12 h-6 rounded-lg" />
            <Skeleton className="w-12 h-6 rounded-lg" />
            <Skeleton className="w-12 h-6 rounded-lg" />
            <Skeleton className="w-12 h-6 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Converted Total Summary Box Skeleton */}
      <div className="bg-slate-50/80 dark:bg-[#090D16] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="space-y-1.5 w-full sm:w-auto">
          <Skeleton className="w-32 h-3" />
          <Skeleton className="w-44 h-7 rounded-lg" />
        </div>
        <Skeleton className="w-32 h-7 rounded-xl shrink-0" />
      </div>

      {/* Save Action Button Skeleton */}
      <Skeleton className="w-full h-11 rounded-2xl" />
    </div>
  )
}

/**
 * Rate Trend Chart Skeleton
 */
export function RateTrendChartSkeleton() {
  return (
    <div aria-busy="true" className="w-full flex-1 min-h-[260px] pt-2 flex flex-col justify-between space-y-3">
      <Skeleton className="w-full h-full min-h-[220px] rounded-2xl" />
    </div>
  )
}
export const ChartSkeleton = RateTrendChartSkeleton

/**
 * Popular Exchange Rates List Skeleton
 */
export function PopularRatesSkeleton() {
  return (
    <div aria-busy="true" className="divide-y divide-slate-100 dark:divide-slate-800/60 py-0.5 space-y-2">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2 px-2">
          <div className="flex items-center gap-3">
            <Skeleton className="w-7 h-7 rounded-full shrink-0" />
            <div className="space-y-1">
              <Skeleton className="w-12 h-3.5 rounded-md" />
              <Skeleton className="w-20 h-2.5 rounded-md" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="w-16 h-4 rounded-md" />
            <Skeleton className="w-14 h-4 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )
}
export const RatesSkeleton = PopularRatesSkeleton

/**
 * Recent Calculation History Skeleton
 */
export function HistorySkeleton() {
  return (
    <div aria-busy="true" className="space-y-2 py-1">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <Skeleton className="w-12 h-4 rounded-md" />
            <Skeleton className="w-4 h-3 rounded-md" />
            <Skeleton className="w-16 h-4 rounded-md" />
          </div>
          <Skeleton className="w-12 h-3 rounded-md" />
        </div>
      ))}
    </div>
  )
}

/**
 * Favorite Currencies Chips Skeleton (Compact & non-stretching)
 */
export function FavoritesSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-wrap gap-2 pt-1">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="w-20 h-7 rounded-xl" />
      ))}
    </div>
  )
}
