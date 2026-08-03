import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Globe, ArrowUpDown, Star, Trash2, 
  Clock, TrendingUp, Sparkles, Coins, Info, CheckCircle2,
  RefreshCw, Sun, Moon
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

import { InputBox, ConverterSkeleton, RatesSkeleton, ChartSkeleton } from './Components'

// Official flag map for fiat currencies
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

// Popular currencies displayed in the sidebar panel
const popularCodes = ['usd', 'eur', 'gbp', 'jpy', 'aud', 'cad', 'aed']

// Mapping of common currency symbols
const getCurrencySymbol = (code) => {
  const symbols = {
    usd: '$', eur: '€', gbp: '£', jpy: '¥', inr: '₹', aud: 'A$', cad: 'C$', chf: 'CHF', cny: '¥', aed: 'د.إ'
  }
  return symbols[code.toLowerCase()] || `${code.toUpperCase()} `
}

// User-friendly rate formatter (limited strictly to 2 decimal places)
const formatExchangeRate = (rate, targetCurrency) => {
  if (!rate || isNaN(rate)) return '—'
  const symbol = getCurrencySymbol(targetCurrency)
  const value = Number(rate).toFixed(2)
  return `${symbol}${value}`
}

// Standard amount formatter (strictly 2 decimal places)
const formatAmount = (amt) => {
  if (amt === 0 || isNaN(amt)) return '0.00'
  return Number(amt).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Pseudo-random deterministic historical chart generator
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
    const value = Number((rate * (1 + changePercent / 100)).toFixed(2))
    
    data.push({
      name: dateStr,
      rate: value
    })
  }
  return data
}

function App() {
  // Theme state with localStorage persistence
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'
  })

  // Last updated timestamp & refresh state
  const [lastUpdated, setLastUpdated] = useState(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Sync theme with HTML root class
  useEffect(() => {
    if (theme === 'dark'
    ) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  // Converter state
  const [amount, setAmount] = useState(1000)
  const [from, setFrom] = useState("usd")
  const [to, setTo] = useState("inr")
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

  // Currency Info state containing exchange rates
  const [currencyInfo, setCurrencyInfo] = useState({})

  // Only display official fiat currencies in the options list (filters out non-fiat cryptos)
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

  // Fetch fresh exchange rates from the API
  const fetchRates = useCallback((baseCurrency) => {
    return fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency}.json`)
      .then(res => res.json())
      .then(data => {
        const rates = data[baseCurrency] || {}
        setCurrencyInfo(rates)
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
        return rates
      })
      .catch(err => {
        console.error("Error fetching rates:", err)
        return {}
      })
  }, [])

  // Manual refresh handler
  const handleManualRefresh = () => {
    setIsRefreshing(true)
    fetchRates(from)
      .then(() => {
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      })
      .finally(() => {
        setTimeout(() => setIsRefreshing(false), 500)
      })
  }

  // Fetch rates whenever the base currency "from" changes
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
      setConvertedAmount(Number((val * currencyInfo[to]).toFixed(2)))
    }
  }, [currencyInfo, to])

  const handleConvertedAmountChange = useCallback((val) => {
    setConvertedAmount(val)
    setLastEdited('to')
    if (currencyInfo && currencyInfo[to]) {
      setAmount(Number((val / currencyInfo[to]).toFixed(2)))
    }
  }, [currencyInfo, to])

  const convert = useCallback(() => {
    if (currencyInfo && currencyInfo[to]) {
      if (lastEdited === 'from') {
        setConvertedAmount(Number((amount * currencyInfo[to]).toFixed(2)))
      } else {
        setAmount(Number((convertedAmount / currencyInfo[to]).toFixed(2)))
      }
    }
  }, [amount, convertedAmount, to, currencyInfo, lastEdited])

  // Real-time conversion updates
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
    <div className="w-full min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] bg-grid text-[#0F172A] dark:text-[#F8FAFC] transition-colors duration-300 pb-16 antialiased selection:bg-blue-500 selection:text-white">
      
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md border-b border-[#E2E8F0] dark:border-[#334155]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/20">
              <Globe size={18} />
            </div>
            <div>
              <h1 className="text-md font-bold tracking-tight text-slate-900 dark:text-white">
                GlobalRate <span className="text-blue-500 font-extrabold text-[10px] tracking-widest uppercase ml-1 px-1.5 py-0.5 bg-blue-500/10 rounded border border-blue-500/20">Pro</span>
              </h1>
              <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-semibold hidden sm:block">
                Real-time Currency Exchange Rate Tracker & Converter
              </p>
            </div>
          </div>

          {/* Live Sync Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Live Rates</span>
          </div>
        </div>
      </header>

      {/* Main Container Grid Layout (8px Spacing System) */}
      <main className="max-w-[1280px] mx-auto px-4 sm:px-8 mt-8 sm:mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Hero Converter, Trend History Chart, Calculation History */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* HERO MODULE: Currency Converter Card */}
            <section className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800/90 rounded-3xl p-6 sm:p-7 hero-glow relative overflow-hidden transition-all duration-300">
              
              {/* Subtle accent glow line on top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400"></div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-500">
                    <Coins size={16} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Currency Converter
                  </h2>
                </div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800">
                  Real-time FX
                </span>
              </div>

              {isInitialLoading ? (
                <ConverterSkeleton />
              ) : (
                <form onSubmit={saveToHistory} className="space-y-5">
                  
                  {/* From Input Box Module */}
                  <div className="space-y-3">
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
                    
                    {/* Preset Amount Chips & Favorites Quick Select */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      
                      {/* Presets Row */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Quick:</span>
                        {[100, 500, 1000, 5000, 10000].map((preset) => {
                          const isActive = amount === preset
                          return (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => handleAmountChange(preset)}
                              className={`text-[11px] font-bold px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                                isActive 
                                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/30' 
                                  : 'border-[#E2E8F0] dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#090D16] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                              }`}
                            >
                              ${preset.toLocaleString()}
                            </button>
                          )
                        })}
                      </div>

                      {/* Favorites Quick selection */}
                      {favorites.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Pinned:</span>
                          <div className="flex gap-1 max-w-[160px] overflow-x-auto scrollbar-none">
                            {favorites.map((curr) => (
                              <button
                                key={curr}
                                type="button"
                                onClick={() => {
                                  setFrom(curr)
                                  setLastEdited('from')
                                }}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer shrink-0 ${
                                  from === curr 
                                    ? 'bg-blue-500/20 border-blue-500/60 text-blue-500' 
                                    : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-200'
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

                  {/* Floating Circular Swap Divider */}
                  <div className="relative flex justify-center items-center my-[-10px] z-10">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-[#E2E8F0] dark:border-slate-800/80"></div>
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ rotate: 180, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      onClick={swapCurrency}
                      className="relative flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:border-blue-500 shadow-md hover:shadow-blue-500/20 transition-all cursor-pointer focus:ring-2 focus:ring-blue-500/30"
                      title="Swap currencies"
                    >
                      <ArrowUpDown size={15} strokeWidth={2.2} />
                    </motion.button>
                  </div>

                  {/* To Input Box Module */}
                  <div className="space-y-3">
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

                    {/* Destination Favorites Quick Select */}
                    {favorites.length > 0 && (
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Target Favorite:</span>
                        <div className="flex gap-1 max-w-[200px] overflow-x-auto scrollbar-none">
                          {favorites.map((curr) => (
                            <button
                              key={curr}
                              type="button"
                              onClick={() => {
                                setTo(curr)
                                setLastEdited('from')
                              }}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all cursor-pointer shrink-0 ${
                                to === curr 
                                  ? 'bg-indigo-500/20 border-indigo-500/60 text-indigo-400' 
                                  : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {curr.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Conversion Summary Card */}
                  {amount > 0 && currencyInfo[to] && (
                    <div className="bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-4 sm:p-5 text-center space-y-1.5 shadow-inner">
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                        Converted Total
                      </p>
                      <div className="flex items-baseline justify-center gap-2 flex-wrap">
                        <span className="text-slate-500 dark:text-slate-400 font-mono-numbers text-base font-bold">
                          {formatAmount(amount)} {from.toUpperCase()}
                        </span>
                        <span className="text-slate-400 dark:text-slate-600 font-bold">≈</span>
                        <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono-numbers tracking-tight">
                          {formatAmount(convertedAmount)}
                        </span>
                        <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 uppercase">
                          {to}
                        </span>
                      </div>
                      
                      {/* Rate summary pill */}
                      <div className="pt-1">
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800/80 px-3 py-1 rounded-full border border-slate-300/40 dark:border-slate-700/50 inline-block">
                          1 {from.toUpperCase()} = {formatExchangeRate(currencyInfo[to], to)} ({Number(currencyInfo[to]).toFixed(2)} {to.toUpperCase()})
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Primary Action Button */}
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.98 }}
                    disabled={amount <= 0}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 cursor-pointer text-sm tracking-wide"
                  >
                    Save Calculation to History
                  </motion.button>
                </form>
              )}
            </section>

            {/* Exchange Rate History Chart Card */}
            <section className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800/90 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-500">
                    <TrendingUp size={16} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {from.toUpperCase()} / {to.toUpperCase()} Rate Trend
                  </h2>
                </div>
                
                {/* Time Range Segmented Toggle */}
                <div className="flex bg-[#F8FAFC] dark:bg-[#090D16] p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                  {[7, 30].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setChartDays(days)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        chartDays === days 
                          ? 'bg-white dark:bg-[#1E293B] text-blue-500 shadow-sm' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {days}D
                    </button>
                  ))}
                </div>
              </div>

              {isInitialLoading ? (
                <ChartSkeleton />
              ) : activeRate ? (
                <div className="h-52 w-full pt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="name" 
                        stroke="#64748B" 
                        fontSize={10} 
                        fontWeight={600}
                        tickLine={false} 
                        axisLine={false}
                      />
                      <YAxis 
                        domain={['auto', 'auto']} 
                        tickFormatter={(v) => Number(v).toFixed(2)} 
                        stroke="#64748B" 
                        fontSize={10} 
                        fontWeight={600}
                        tickLine={false} 
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#111827',
                          borderColor: '#1E293B',
                          borderRadius: '16px',
                          color: '#F8FAFC',
                          fontSize: '12px',
                          fontWeight: '700',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                        }}
                        formatter={(value) => [`${Number(value).toFixed(2)} ${to.toUpperCase()}`, 'Rate']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="rate" 
                        stroke="#3B82F6" 
                        strokeWidth={2.5} 
                        fillOpacity={1} 
                        fill="url(#colorRate)" 
                        activeDot={{ r: 6, fill: '#3B82F6', stroke: '#111827', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-52 w-full flex items-center justify-center text-xs font-semibold text-slate-500">
                  Select valid currencies to display rate trends
                </div>
              )}
            </section>

            {/* Calculation History Card */}
            <section className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800/90 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-500">
                    <Clock size={16} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Recent Calculation History
                  </h2>
                </div>
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setHistory([])}
                    className="text-[10px] font-bold text-red-500 hover:text-red-400 transition-colors uppercase tracking-wider flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded-lg hover:bg-red-500/10"
                  >
                    <Trash2 size={11} />
                    Clear Log
                  </button>
                )}
              </div>

              {history.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                  <AnimatePresence mode="popLayout">
                    {history.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        layout
                        className="flex justify-between items-center bg-[#F8FAFC] dark:bg-[#090D16] hover:bg-slate-100 dark:hover:bg-[#1E293B]/60 border border-[#E2E8F0] dark:border-slate-800/80 rounded-2xl p-3 text-xs transition-all duration-200"
                      >
                        <div className="flex items-center gap-1.5 font-semibold min-w-0">
                          <span className="font-mono-numbers text-slate-900 dark:text-white font-bold">{item.fromAmount.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{item.from}</span>
                          <span className="text-slate-400">→</span>
                          <span className="font-mono-numbers text-blue-600 dark:text-blue-400 font-bold">{item.toAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                          <span className="text-[10px] text-blue-500 font-bold uppercase">{item.to}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium shrink-0 ml-2">{item.time}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                /* Redesigned Empty State */
                <div className="text-center py-8 px-4 bg-[#F8FAFC] dark:bg-[#090D16]/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/80 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-400 flex items-center justify-center mx-auto">
                    <Clock size={18} />
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No Calculation History Saved</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-500 max-w-xs mx-auto">
                    Click "Save Calculation to History" after converting to log rates for future reference.
                  </p>
                </div>
              )}
            </section>

          </div>

          {/* RIGHT COLUMN: Popular Exchange Rates & Favorites Panel */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Popular Rates Board Module */}
            <section className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800/90 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-500">
                    <Sparkles size={16} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Popular Exchange Rates
                  </h2>
                </div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Base: {from.toUpperCase()}
                </span>
              </div>

              {isInitialLoading ? (
                <RatesSkeleton />
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {popularCodes.filter(c => c !== from).map((code) => {
                    const rawRate = currencyInfo[code]
                    const displayRate = rawRate ? (1 / rawRate) : null
                    
                    return (
                      <div 
                        key={code}
                        className="flex justify-between items-center py-2.5 px-2 hover:bg-[#F8FAFC] dark:hover:bg-[#090D16] rounded-xl transition-all duration-150"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-lg leading-none shrink-0">{getFlag(code)}</span>
                          <div className="min-w-0">
                            <span className="font-extrabold text-xs tracking-wider block text-slate-900 dark:text-white uppercase">{code}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium block capitalize truncate max-w-[130px]">
                              {currencyNames[code] || ''}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-bold text-xs font-mono-numbers block text-slate-900 dark:text-white">
                            {displayRate ? formatExchangeRate(displayRate, from) : '—'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>

            {/* Favorites Manager Card Module */}
            <section className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800/90 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-500">
                    <Star size={16} strokeWidth={2.5} className="fill-amber-500/20" />
                  </div>
                  <h2 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Favorite Currencies
                  </h2>
                </div>
              </div>

              {favorites.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {favorites.map((curr) => (
                      <motion.div
                        key={curr}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-2 pl-3 pr-2 py-2 bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E2E8F0] dark:border-slate-800 rounded-xl text-xs font-semibold group/fav shadow-sm hover:border-blue-500/60 transition-all"
                      >
                        <span className="text-base shrink-0">{getFlag(curr)}</span>
                        <span className="font-extrabold tracking-wider text-slate-900 dark:text-white uppercase text-xs">{curr}</span>
                        <button
                          type="button"
                          onClick={() => toggleFavorite(curr)}
                          aria-label={`Remove ${curr} from favorites`}
                          className="p-0.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer text-xs rounded-md"
                        >
                          &times;
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                /* Redesigned Empty State */
                <div className="text-center py-6 px-4 bg-[#F8FAFC] dark:bg-[#090D16]/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800/80 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-slate-200/50 dark:bg-slate-800/50 text-slate-400 flex items-center justify-center mx-auto">
                    <Star size={18} />
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No Favorites Pinned</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-500 max-w-xs mx-auto">
                    Star any currency in the dropdown selector to bookmark it for 1-click access.
                  </p>
                </div>
              )}
            </section>

          </div>

        </div>
      </main>

      {/* Compliance & Educational Disclaimer Footer */}
      <footer className="max-w-[1240px] mx-auto px-4 sm:px-6 mt-16 border-t border-[#E2E8F0]/80 dark:border-slate-800/80 pt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-3.5 bg-white dark:bg-[#111827]/80 border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-5 max-w-4xl mx-auto text-left shadow-sm">
          <div className="text-blue-500 shrink-0 self-start sm:self-center p-2 bg-blue-500/10 rounded-xl">
            <Info size={18} strokeWidth={2} />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
            <strong className="text-slate-700 dark:text-slate-300">Financial Disclaimer:</strong> GlobalRate Pro is an independent portfolio dashboard designed for educational and informational tracking. All exchange rates are derived from public real-time market APIs and CDN endpoints. Data is provided for general reference only and should not be relied upon for trading, investment decisions, or official financial settlement.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
