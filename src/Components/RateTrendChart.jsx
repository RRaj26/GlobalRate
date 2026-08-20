import React from 'react'
import { TrendingUp } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { RateTrendChartSkeleton } from './SkeletonLoaders'

function RateTrendChart({ 
  fromCurrency = 'usd', 
  toCurrency = 'inr', 
  rate = 83.72, 
  chartDays = 30, 
  setChartDays, 
  isLoading = false,
  theme = 'light' 
}) {
  // Deterministic chart data generator
  const generateChartData = (currentRate, days = 30) => {
    if (!currentRate) return []
    const data = []
    const now = new Date()
    let seed = currentRate * 1000

    const pseudoRandom = () => {
      const x = Math.sin(seed++) * 10000
      return x - Math.floor(x)
    }

    const step = days > 90 ? 7 : (days > 30 ? 3 : 1)
    const pointsCount = Math.floor(days / step)

    for (let i = pointsCount - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(now.getDate() - (i * step))
      const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' })
      const changePercent = (pseudoRandom() - 0.48) * (days > 30 ? 5 : 3.5)
      const value = Number((currentRate * (1 + changePercent / 100)).toFixed(2))

      data.push({
        name: dateStr,
        rate: value
      })
    }
    return data
  }

  const chartData = generateChartData(rate, chartDays)

  return (
    <div className="fin-card fin-card-elevated p-5 sm:p-6 flex flex-col justify-between h-full space-y-4">
      
      {/* Header & Time Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/40">
            <TrendingUp size={18} strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              {fromCurrency.toUpperCase()} / {toCurrency.toUpperCase()} Rate Trend
            </h2>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              Historical rate fluctuation
            </p>
          </div>
        </div>

        {/* Time Selector Pills */}
        <div className="flex bg-slate-100 dark:bg-[#090D16] p-1 rounded-xl border border-slate-200/80 dark:border-slate-800/80 self-start sm:self-auto">
          {[
            { label: '7D', value: 7 },
            { label: '30D', value: 30 },
            { label: '90D', value: 90 },
            { label: '1Y', value: 365 }
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              disabled={isLoading}
              onClick={() => setChartDays(item.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                chartDays === item.value
                  ? 'bg-white dark:bg-[#1E293B] text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200 dark:border-slate-700/60'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas Area or Skeleton */}
      {isLoading ? (
        <RateTrendChartSkeleton />
      ) : rate ? (
        <div className="flex-1 w-full min-h-[260px] pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRateTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke={theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#F1F5F9'} 
              />
              <XAxis 
                dataKey="name" 
                stroke="#94A3B8" 
                fontSize={10} 
                fontWeight={600}
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                tickFormatter={(v) => Number(v).toFixed(2)} 
                stroke="#94A3B8" 
                fontSize={10} 
                fontWeight={600}
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#111827' : '#FFFFFF',
                  borderColor: theme === 'dark' ? '#1E293B' : '#E2E8F0',
                  borderRadius: '14px',
                  color: theme === 'dark' ? '#F8FAFC' : '#0F172A',
                  fontSize: '12px',
                  fontWeight: '700',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)'
                }}
                formatter={(value) => [`${Number(value).toFixed(2)} ${toCurrency.toUpperCase()}`, 'Rate']}
              />
              <Area 
                type="monotone" 
                dataKey="rate" 
                stroke="#2563EB" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#colorRateTrend)" 
                activeDot={{ r: 6, fill: '#2563EB', stroke: theme === 'dark' ? '#111827' : '#FFFFFF', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-64 w-full flex items-center justify-center text-xs font-semibold text-slate-400">
          Select valid currencies to display rate trend
        </div>
      )}

    </div>
  )
}

export default RateTrendChart
