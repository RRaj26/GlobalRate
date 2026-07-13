import React from 'react'

export function ConverterSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* From Input skeleton */}
      <div className="space-y-2">
        <div className="h-28 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl animate-shimmer"></div>
        <div className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-shimmer"></div>
      </div>
      
      {/* Swap button skeleton */}
      <div className="flex justify-center my-[-12px]">
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-shimmer"></div>
      </div>

      {/* To Input skeleton */}
      <div className="space-y-2">
        <div className="h-28 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl animate-shimmer"></div>
        <div className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-shimmer"></div>
      </div>

      {/* Button skeleton */}
      <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl animate-shimmer"></div>
    </div>
  )
}

export function RatesSkeleton() {
  return (
    <div className="space-y-3.5">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 animate-shimmer"></div>
            <div className="w-12 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-shimmer"></div>
          </div>
          <div className="flex items-center gap-6">
            <div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-shimmer"></div>
            <div className="w-14 h-4 bg-slate-200 dark:bg-slate-800 rounded animate-shimmer"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="w-32 h-5 bg-slate-200 dark:bg-slate-800 rounded animate-shimmer"></div>
        <div className="w-20 h-8 bg-slate-200 dark:bg-slate-800 rounded-xl animate-shimmer"></div>
      </div>
      <div className="h-48 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl animate-shimmer"></div>
    </div>
  )
}
