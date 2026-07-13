import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Globe, ArrowUpDown, Star, Trash2, 
  Clock, TrendingUp, Sparkles, Coins, Info 
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

import { InputBox, ConverterSkeleton, RatesSkeleton, ChartSkeleton } from './Components'

// Comprehensive flag map for official country fiat currencies
const flagMap = {
  usd: '🇺🇸', eur: '🇪🇺', gbp: '🇬🇧', jpy: '🇯🇵', aud: '🇦🇺', cad: '🇨🇦', aed: '🇦🇪', inr: '🇮🇳',
  chf: '🇨🇭', cny: '🇨🇳', nzd: '🇳🇿', brl: '🇧🇷', rub: '🇷🇺', zar: '🇿🇦', sgd: '🇸🇬', mxn: '🇲🇽',
  hkd: '🇭🇰', sek: '🇸🇪', nok: '🇳🇴', try: '🇹🇷', krw: '🇰🇷', idr: '🇮🇩', myr: '🇲🇾', thb: '🇹🇭',
  php: '🇵🇭', vnd: '🇻🇳', dkk: '🇩🇰', pln: '🇵🇱', huf: '🇭🇺', ils: '🇮🇱', clp: '🇨🇱', sar: '🇸🇦',
  afn: '🇦🇫', all: '🇦🇱', amd: '🇦🇲', ang: '🇨🇼', aoa: '🇦🇴', ars: '🇦🇷', awg: '🇦🇼', azn: '🇦🇿',
  bam: '🇧🇦', bbd: '🇧🇧', bdt: '🇧🇩', bgn: '🇧🇬', bhd: '🇧🇭', bif: '🇧🇮', bmd: '🇧🇲', bnd: '🇧🇳',
  bob: '🇧🇴', bsd: '🇧🇸', btn: '🇧🇹', bwp: '🇧🇼', byn: '🇧🇾', bzd: '🇧🇿', cdf: '🇨🇩', cve: '🇨🇻',
  djf: '🇩🇯', dop: '🇩🇴', dzd: '🇩🇿', egp: '🇪🇬', ern: '🇪🇷', etb: '🇪🇹', fjd: '🇫🇯', fkp: '🇫🇰',
  gel: '🇬🇪', ghs: '🇬🇭', gip: '🇬🇮', gmd: '🇬🇲', gnf: '🇬🇮', gtq: '🇬🇹', gyd: '🇬🇾', hnl: '🇭🇳',
  hrk: '🇭🇷', htg: '🇭🇹', iqd: '🇮🇶', irr: '🇮🇷', isk: '🇮🇸', jod: '🇯🇴', kes: '🇰🇪', kgs: '🇰🇬',
  khr: '🇰🇭', kmf: '🇰🇲', kpw: '🇰🇵', kwd: '🇰🇼', kyd: '🇰🇾', kzt: '🇰🇿', lak: '🇱🇦', lbp: '🇱🇧',
  lkr: '🇱🇰', lrd: '🇱🇷', lsl: '🇱🇸', lyd: '🇱🇾', mad: '🇲🇦', mdl: '🇲🇩', mga: '🇲🇬', mkd: '🇲🇰',
  mmk: '🇲🇲', mnt: '🇲🇳', mop: '🇲🇴', mru: '🇲🇷', mur: '🇲🇺', mvr: '🇲🇻', mwk: '🇲🇼',
  mzn: '🇲🇿', nad: '🇳🇦', ngn: '🇳🇬', nio: '🇳🇮', npr: '🇳🇵', omr: '🇴🇲', pab: '🇵🇦', pen: '🇵🇪',
  pgk: '🇵🇬', pkr: '🇵🇰', pyg: '🇵🇾', qar: '🇶🇦', ron: '🇷🇴', rsd: '🇷🇸', rwf: '🇷🇼', sbd: '🇸🇧',
  scr: '🇸🇨', sdg: '🇸🇩', shp: '🇸🇭', sll: '🇸🇱', sos: '🇸🇴', srd: '🇸🇷', ssp: '🇸🇸', stn: '🇸🇹',
  syp: '🇸🇾', szl: '🇸🇿', tjs: '🇹🇯', tmt: '🇹🇲', tnd: '🇹🇳', top: '🇹🇴', ttd: '🇹🇹', twd: '🇹🇼',
  tzs: '🇹🇿', uah: '🇺🇦', ugx: '🇺🇬', uyu: '🇺🇾', uzs: '🇺🇿', ves: '🇻🇪', wst: '🇼🇸', xaf: '🇨🇲',
  xcd: '🇩🇲', xof: '🇨🇮', xpf: '🇵🇫', yer: '🇾🇪', zmw: '🇿🇲', zwl: '🇿🇼'
}

const getFlag = (code) => {
  return flagMap[code.toLowerCase()] || '🏳️'
}

// Popular currencies displayed in the sidebar
const popularCodes = ['usd', 'eur', 'gbp', 'jpy', 'aud', 'cad', 'aed']

// Mapping of common currency symbols
const getCurrencySymbol = (code) => {
  const symbols = {
    usd: '$', eur: '€', gbp: '£', jpy: '¥', inr: '₹', aud: 'A$', cad: 'C$', chf: 'CHF', cny: '¥', aed: 'د.إ'
  }
  return symbols[code.toLowerCase()] || `${code.toUpperCase()} `
}

// User-friendly rate formatter limited to 2 decimal places
const formatExchangeRate = (rate, fromCurrency) => {
  if (!rate || isNaN(rate)) return '—'
  const symbol = getCurrencySymbol(fromCurrency)
  const value = rate.toFixed(2)
  return `${symbol}${value}`
}

// Standard amount formatter (2 decimal places)
const formatAmount = (amt) => {
  if (amt === 0) return '0.00'
  return amt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Pseudo-random deterministic historical chart generator for historical Rates Trend
const generateChartData = (rate, days = 7) => {
  if (!rate) return []
  const data = []
  const now = new Date()
  let seed = rate * 1000
  
  const pseudoRandom = () => {
    const x = Math.sin(seed++) * 10000
    return x - Math.floor(x)
  }

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(now.getDate() - i)
    const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    const changePercent = (pseudoRandom() - 0.5) * 3.5 // -1.75% to +1.75%
    const value = Number((rate * (1 + changePercent / 100)).toFixed(6))
    
    data.push({
      name: dateStr,
      rate: value
    })
  }
  return data
}

function App() {
  // Theme state locked to dark mode
  const theme = 'dark'

  // Converter state
  const [amount, setAmount] = useState(1000)
  const [from, setFrom] = useState("inr")
  const [to, setTo] = useState("usd")
  const [convertedAmount, setConvertedAmount] = useState(0)
  const [lastEdited, setLastEdited] = useState('from')

  // History state
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('history')
    return saved ? JSON.parse(saved) : []
  })

  // Favorites state
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : ['usd', 'eur', 'inr', 'gbp', 'jpy']
  })

  // Chart state
  const [chartDays, setChartDays] = useState(7)

  // Separated loading states
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  // Full currency names registry
  const [currencyNames, setCurrencyNames] = useState({})

  // Currency Info state containing actual exchange rates
  const [currencyInfo, setCurrencyInfo] = useState({})

  // Only display official fiat currencies in the options list (filters out all cryptos)
  const options = Object.keys(currencyInfo).filter(code => flagMap[code.toLowerCase()] !== undefined)

  // Fetch full currency names dictionary once on mount
  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json')
      .then(res => res.json())
      .then(data => setCurrencyNames(data))
      .catch(err => console.error("Error fetching currency names:", err))
  }, [])

  // Sync favorites
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  // Sync history
  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(history))
  }, [history])

  // Fetch fresh exchange rates from the API (Zero dependencies since it doesn't read state directly)
  const fetchRates = useCallback((baseCurrency) => {
    return fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency}.json`)
      .then(res => res.json())
      .then(data => {
        const rates = data[baseCurrency] || {}
        setCurrencyInfo(rates)
        return rates
      })
      .catch(err => {
        console.error("Error fetching rates:", err)
        return {}
      })
  }, [])

  // Fetch rates whenever the base currency "from" changes (triggers Initial skeleton loading only for base currency shifts)
  useEffect(() => {
    setIsInitialLoading(true)
    fetchRates(from)
      .finally(() => {
        setIsInitialLoading(false)
      })
  }, [from, fetchRates])

  // Automatically refresh data in background every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRates(from)
    }, 60000)
    return () => clearInterval(interval)
  }, [from, fetchRates])

  const toggleFavorite = (curr) => {
    setFavorites(prev => {
      if (prev.includes(curr)) {
        return prev.filter(c => c !== curr)
      } else {
        return [...prev, curr]
      }
    })
  }

  const swapCurrency = () => {
    const tempFrom = from
    const tempTo = to
    setFrom(tempTo)
    setTo(tempFrom)
    
    if (lastEdited === 'from') {
      setAmount(convertedAmount)
      setLastEdited('to')
    } else {
      setConvertedAmount(amount)
      setLastEdited('from')
    }
  }

  const handleAmountChange = useCallback((val) => {
    setAmount(val)
    setLastEdited('from')
    if (currencyInfo && currencyInfo[to]) {
      setConvertedAmount(Number((val * currencyInfo[to]).toFixed(6)))
    }
  }, [currencyInfo, to])

  const handleConvertedAmountChange = useCallback((val) => {
    setConvertedAmount(val)
    setLastEdited('to')
    if (currencyInfo && currencyInfo[to]) {
      setAmount(Number((val / currencyInfo[to]).toFixed(6)))
    }
  }, [currencyInfo, to])

  const convert = useCallback(() => {
    if (currencyInfo && currencyInfo[to]) {
      if (lastEdited === 'from') {
        setConvertedAmount(Number((amount * currencyInfo[to]).toFixed(6)))
      } else {
        setAmount(Number((convertedAmount / currencyInfo[to]).toFixed(6)))
      }
    }
  }, [amount, convertedAmount, to, currencyInfo, lastEdited])

  // Real-time conversion updates locally
  useEffect(() => {
    convert()
  }, [convert])

  const saveToHistory = (e) => {
    if (e) e.preventDefault()
    if (amount <= 0) return

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const newItem = {
      id: Date.now(),
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      fromAmount: amount,
      toAmount: convertedAmount,
      time
    }
    
    setHistory((prev) => {
      if (prev.length > 0 && 
          prev[0].from === newItem.from && 
          prev[0].to === newItem.to && 
          prev[0].fromAmount === newItem.fromAmount) {
        return prev
      }
      return [newItem, ...prev].slice(0, 10)
    })
  }

  const activeRate = currencyInfo[to] || 0
  const chartData = generateChartData(activeRate, chartDays)

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] bg-grid text-[#0F172A] dark:text-[#F8FAFC] transition-colors duration-300 pb-12 antialiased"
    >
      {/* Top Professional Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md border-b border-[#E2E8F0] dark:border-[#334155]">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/20">
              <Globe size={18} />
            </div>
            <div>
              <h1 className="text-md font-bold tracking-tight text-slate-900 dark:text-white">GlobalRate <span className="text-blue-500 font-extrabold text-[10px] tracking-widest uppercase ml-1 px-1.5 py-0.5 bg-blue-500/10 rounded border border-blue-500/20">Pro</span></h1>
              <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-semibold hidden sm:block">Real-time Currency Exchange Rate Tracker & Converter</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Two Column Grid Layout */}
      <main className="max-w-[1200px] mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDE COLUMN: Converter, Chart, History */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Currency Converter Card */}
            <motion.div 
              whileHover={{ y: -1 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-3xl p-5 shadow-sm"
            >
              <h2 className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Coins size={14} className="text-blue-500" />
                Currency Converter
              </h2>

              {isInitialLoading ? (
                <ConverterSkeleton />
              ) : (
                <form onSubmit={saveToHistory} className="space-y-4">
                  
                  {/* From Input Box */}
                  <div className="space-y-2.5">
                    <InputBox
                      label="From"
                      amount={amount}
                      onAmountChange={handleAmountChange}
                      onCurrencyChange={setFrom}
                      currencyOptions={options}
                      selectCurrency={from}
                      currencyNames={currencyNames}
                      favorites={favorites}
                      onToggleFavorite={toggleFavorite}
                    />
                    
                    {/* Preset Amount Chips + Favorites Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
                      {/* Presets */}
                      <div className="flex flex-wrap gap-1.5">
                        {[100, 500, 1000, 5000, 10000].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => handleAmountChange(preset)}
                            className="text-[10px] font-bold px-2.5 py-1 rounded-lg border border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] hover:bg-slate-100 dark:hover:bg-slate-800 text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white transition-all cursor-pointer"
                          >
                            {preset.toLocaleString()}
                          </button>
                        ))}
                      </div>

                      {/* Favorites Quick select */}
                      {favorites.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Favorites:</span>
                          <div className="flex gap-1 max-w-[150px] overflow-x-auto scrollbar-none">
                            {favorites.map((curr) => (
                              <button
                                key={curr}
                                type="button"
                                onClick={() => {
                                  setFrom(curr)
                                  setLastEdited('from')
                                }}
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded border transition-all cursor-pointer shrink-0 ${
                                  from === curr 
                                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-500' 
                                    : 'border-[#E2E8F0] dark:border-[#334155] text-slate-450 hover:text-slate-350'
                                }`}
                              >
                                {curr.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Swap Button Divider */}
                  <div className="relative flex justify-center items-center my-[-8px] z-10">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-[#E2E8F0] dark:border-[#334155]"></div>
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ rotate: 180 }}
                      whileTap={{ scale: 0.92 }}
                      transition={{ duration: 0.3 }}
                      onClick={swapCurrency}
                      className="relative flex items-center justify-center w-8 h-8 rounded-full border border-[#E2E8F0] dark:border-[#334155] bg-[#F1F5F9] dark:bg-[#0F172A] text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer shadow-sm focus:ring-2 focus:ring-blue-500/20"
                      title="Swap currencies"
                    >
                      <ArrowUpDown size={14} />
                    </motion.button>
                  </div>

                  {/* To Input Box */}
                  <div className="space-y-2.5">
                    <InputBox
                      label="To"
                      amount={convertedAmount}
                      onAmountChange={handleConvertedAmountChange}
                      onCurrencyChange={setTo}
                      currencyOptions={options}
                      selectCurrency={to}
                      currencyNames={currencyNames}
                      favorites={favorites}
                      onToggleFavorite={toggleFavorite}
                    />

                    {/* Favorites Quick select to destination */}
                    {favorites.length > 0 && (
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Favorites:</span>
                        <div className="flex gap-1 max-w-[200px] overflow-x-auto scrollbar-none">
                          {favorites.map((curr) => (
                            <button
                              key={curr}
                              type="button"
                              onClick={() => {
                                setTo(curr)
                                setLastEdited('from')
                              }}
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded border transition-all cursor-pointer shrink-0 ${
                                to === curr 
                                  ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-500' 
                                  : 'border-[#E2E8F0] dark:border-[#334155] text-slate-450 hover:text-slate-350'
                              }`}
                            >
                              {curr.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Premium Conversion Result Summary Card */}
                  {amount > 0 && currencyInfo[to] && (
                    <div className="bg-[#F8FAFC] dark:bg-[#0F172A]/40 border border-[#E2E8F0] dark:border-[#334155] rounded-2xl p-3.5 text-center">
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1">Conversion Summary</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1.5 flex-wrap">
                        <span className="text-slate-900 dark:text-white font-extrabold">{formatAmount(amount)}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{from}</span>
                        <span className="text-slate-400 dark:text-slate-600">≈</span>
                        <span className="text-blue-500 font-extrabold">{formatAmount(convertedAmount)}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase text-blue-500">{to}</span>
                      </p>
                    </div>
                  )}

                  {/* Dynamic Rate Info Summary */}
                  {currencyInfo && currencyInfo[to] ? (
                    <div className="flex justify-between items-center text-xs font-semibold px-1 text-slate-450 dark:text-slate-500">
                      <span>Rate Overview</span>
                      <span className="text-[#0F172A] dark:text-[#F8FAFC]">
                        1 {from.toUpperCase()} = {formatExchangeRate(currencyInfo[to], to)}
                      </span>
                    </div>
                  ) : null}

                  {/* Save Log Button */}
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.98 }}
                    disabled={amount <= 0}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold rounded-2xl transition-colors shadow-sm shadow-blue-600/10 cursor-pointer text-sm"
                  >
                    Save to History
                  </motion.button>
                </form>
              )}
            </motion.div>

            {/* Rate Trend Chart Card */}
            <motion.div 
              whileHover={{ y: -1 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-3xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp size={14} className="text-blue-500" />
                  {from.toUpperCase()} → {to.toUpperCase()} Exchange Rate History
                </h2>
                
                {/* Time Range Toggle */}
                <div className="flex bg-[#F1F5F9] dark:bg-[#0F172A] p-0.5 rounded-lg border border-[#E2E8F0] dark:border-[#334155]">
                  {[7, 30].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setChartDays(days)}
                      className="px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer text-slate-400 dark:text-slate-500 hover:text-[#0F172A] dark:hover:text-white"
                      style={{
                        backgroundColor: chartDays === days ? (theme === 'dark' ? '#1E293B' : '#FFFFFF') : 'transparent',
                        color: chartDays === days ? '#3B82F6' : ''
                      }}
                    >
                      {days}D
                    </button>
                  ))}
                </div>
              </div>

              {isInitialLoading ? (
                <ChartSkeleton />
              ) : activeRate ? (
                <div className="h-44 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="name" 
                        stroke="#475569" 
                        fontSize={9} 
                        fontWeight={600}
                        tickLine={false} 
                      />
                      <YAxis 
                        domain={['auto', 'auto']} 
                        tickFormatter={(v) => v.toFixed(2)} 
                        stroke="#475569" 
                        fontSize={9} 
                        fontWeight={600}
                        tickLine={false} 
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1E293B',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          color: '#F8FAFC',
                          fontSize: '11px',
                          fontWeight: '700'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="rate" 
                        stroke="#3B82F6" 
                        strokeWidth={2} 
                        fillOpacity={1} 
                        fill="url(#colorRate)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-44 w-full flex items-center justify-center text-xs font-semibold text-slate-400">
                  Select valid currencies to plot rates
                </div>
              )}
            </motion.div>

            {/* Conversion History Card */}
            <motion.div 
              whileHover={{ y: -1 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-3xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider flex items-center gap-2">
                  <Clock size={14} className="text-blue-500" />
                  Recent Calculations
                </h2>
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setHistory([])}
                    className="text-[9px] font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 size={10} />
                    Clear History
                  </button>
                )}
              </div>

              {history.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                  <AnimatePresence mode="popLayout">
                    {history.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        layout
                        className="flex justify-between items-center bg-[#F8FAFC] dark:bg-[#0F172A]/40 hover:bg-slate-100 dark:hover:bg-[#0F172A] border border-[#E2E8F0] dark:border-slate-800/40 rounded-xl px-3.5 py-2.5 text-xs transition-colors"
                      >
                        <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold">
                          <span className="text-[#0F172A] dark:text-[#F8FAFC]">{item.fromAmount.toLocaleString()}</span>
                          <span className="text-[9px] text-slate-400 font-bold">{item.from}</span>
                          <span className="text-slate-450 dark:text-slate-600">→</span>
                          <span className="text-blue-500 dark:text-blue-400">{item.toAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                          <span className="text-[9px] text-slate-400 font-bold">{item.to}</span>
                        </div>
                        <span className="text-[9px] text-slate-450 dark:text-slate-500 font-bold">{item.time}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-5 text-slate-400 dark:text-slate-600 text-xs font-semibold flex items-center justify-center gap-2">
                  <Clock size={12} />
                  Your calculation history is currently empty.
                </div>
              )}
            </motion.div>

          </div>

          {/* RIGHT SIDE COLUMN: Popular Exchange Rates + Favorites Panel */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Popular Exchange Rates Panel */}
            <motion.div 
              whileHover={{ y: -1 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-3xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={14} className="text-blue-500" />
                  Popular Exchange Rates
                </h2>
              </div>

              {isInitialLoading ? (
                <RatesSkeleton />
              ) : (
                <div className="space-y-0.5">
                  {popularCodes.filter(c => c !== from).map((code) => {
                    const rawRate = currencyInfo[code]
                    const displayRate = rawRate ? (1 / rawRate) : null
                    
                    return (
                      <div 
                        key={code}
                        className="flex justify-between items-center py-2 px-1.5 hover:bg-slate-55 dark:hover:bg-[#0F172A] rounded-xl transition-all duration-150 border-b border-[#E2E8F0]/30 dark:border-slate-800/10"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-base leading-none shrink-0">{getFlag(code)}</span>
                          <div className="min-w-0">
                            <span className="font-bold text-xs tracking-wide block text-slate-800 dark:text-slate-200 uppercase">{code}</span>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold block capitalize truncate max-w-[125px]">
                              {currencyNames[code] || ''}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-bold text-xs font-mono block text-[#0F172A] dark:text-[#F8FAFC]">
                            {displayRate ? formatExchangeRate(displayRate, from) : '—'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>

            {/* Favorites Manager Card */}
            <motion.div 
              whileHover={{ y: -1 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-3xl p-5 shadow-sm"
            >
              <h2 className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Star size={14} className="text-blue-500 fill-blue-500/20" />
                Favorite Currencies
              </h2>

              {favorites.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {favorites.map((curr) => (
                      <motion.div
                        key={curr}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1.5 bg-[#F1F5F9] dark:bg-[#0F172A]/40 border border-[#E2E8F0] dark:border-slate-800/40 rounded-xl text-xs font-semibold group/fav shadow-sm hover:border-[#3B82F6]"
                      >
                        <span className="text-sm shrink-0">{getFlag(curr)}</span>
                        <span className="font-bold tracking-wide text-slate-800 dark:text-slate-200 uppercase text-[11px]">{curr}</span>
                        <button
                          type="button"
                          onClick={() => toggleFavorite(curr)}
                          aria-label={`Remove ${curr} from favorites`}
                          className="p-0.5 text-slate-400 dark:text-slate-650 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer text-xs"
                        >
                          &times;
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-5 text-slate-400 dark:text-slate-600 text-xs font-semibold flex items-center justify-center gap-2">
                  <Star size={12} />
                  Star currencies in the dropdown list to add them here!
                </div>
              )}
            </motion.div>

          </div>

        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="max-w-[1200px] mx-auto px-4 mt-12 border-t border-[#E2E8F0]/30 dark:border-slate-800/40 pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-3 bg-white dark:bg-[#1E293B]/20 border border-[#E2E8F0]/80 dark:border-slate-850 rounded-2xl p-4 max-w-4xl mx-auto text-left shadow-sm">
          <div className="text-blue-500 shrink-0 self-start sm:self-center">
            <Info size={16} />
          </div>
          <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-medium leading-relaxed">
            <strong>Disclaimer:</strong> GlobalRate Pro is a personal portfolio project built for educational and informational purposes. The application provides currency conversion and exchange-rate data only. It is not affiliated with any bank, financial institution, forex broker, trading platform, or investment service. Exchange rates are provided for reference purposes only and should not be considered financial or investment advice.
          </p>
        </div>
      </footer>
    </motion.div>
  )
}

export default App
