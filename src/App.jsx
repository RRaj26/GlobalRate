import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpDown, Coins, AlertTriangle, RefreshCw } from 'lucide-react'

import { 
  InputBox, Header, CurrencySummaryCard, RateTrendChart,
  PopularRates, CalculationHistory, FavoriteCurrencies,
  FinancialDisclaimer, ConverterSkeleton 
} from './Components'

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

// Currency symbol mapper
const getCurrencySymbol = (code) => {
  const symbols = {
    usd: '$', eur: '€', gbp: '£', jpy: '¥', inr: '₹', aud: 'A$', cad: 'C$', chf: 'CHF', cny: '¥', aed: 'د.إ'
  }
  return symbols[code.toLowerCase()] || `${code.toUpperCase()} `
}

// Rate formatter
const formatExchangeRate = (rate, targetCurrency) => {
  if (!rate || isNaN(rate)) return '—'
  const symbol = getCurrencySymbol(targetCurrency)
  const value = Number(rate).toFixed(2)
  return `${symbol}${value}`
}

// Standard amount formatter
const formatAmount = (amt) => {
  if (amt === 0 || isNaN(amt)) return '0.00'
  return Number(amt).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function App() {
  // Theme state with localStorage persistence
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') return saved
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'
  })

  // Last updated timestamp & refresh state
  const [lastUpdated, setLastUpdated] = useState(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isApiError, setIsApiError] = useState(false)

  // Sync theme with HTML root class
  useEffect(() => {
    if (theme === 'dark') {
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
    return saved ? JSON.parse(saved) : [
      { id: 1, from: 'USD', to: 'INR', fromAmount: 1000, toAmount: 95673.94, time: '02:09 PM' },
      { id: 2, from: 'USD', to: 'INR', fromAmount: 500, toAmount: 47836.97, time: '01:45 PM' },
      { id: 3, from: 'USD', to: 'INR', fromAmount: 200, toAmount: 19134.79, time: '12:32 PM' }
    ]
  })

  // Favorites state
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites')
    return saved ? JSON.parse(saved) : ['usd', 'eur', 'inr', 'gbp', 'jpy']
  })

  // Chart time range state
  const [chartDays, setChartDays] = useState(30)

  // Full currency names registry
  const [currencyNames, setCurrencyNames] = useState({})

  // Currency Info state containing exchange rates
  const [currencyInfo, setCurrencyInfo] = useState({})

  // Official fiat currency options list
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

  // Fetch fresh exchange rates from API
  const fetchRates = useCallback((baseCurrency) => {
    setIsApiError(false)
    // Add cache buster timestamp to prevent browser/CDN stale cache
    return fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${baseCurrency}.json?_t=${Date.now()}`, { cache: 'no-cache' })
      .then(res => {
        if (!res.ok) throw new Error("HTTP request failed")
        return res.json()
      })
      .then(data => {
        const rates = data[baseCurrency] || {}
        if (Object.keys(rates).length === 0) throw new Error("Empty rates object")
        setCurrencyInfo(rates)
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
        return rates
      })
      .catch(err => {
        console.error("Error fetching rates:", err)
        setIsApiError(true)
        return {}
      })
  }, [])

  // Manual refresh handler - triggers skeleton loading state & refetches rates
  const handleManualRefresh = () => {
    setIsRefreshing(true)
    setIsInitialLoading(true)
    const startTime = Date.now()
    fetchRates(from)
      .finally(() => {
        const elapsedTime = Date.now() - startTime
        const minSpinDuration = 500
        const remainingTime = Math.max(0, minSpinDuration - elapsedTime)
        setTimeout(() => {
          setIsRefreshing(false)
          setIsInitialLoading(false)
        }, remainingTime)
      })
  }

  // Fetch rates whenever base currency "from" changes (Initial Load Driven)
  useEffect(() => {
    setIsInitialLoading(true)
    fetchRates(from)
      .finally(() => {
        setIsInitialLoading(false)
      })
  }, [from, fetchRates])

  // Auto refresh every 60 seconds
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

  const activeRate = currencyInfo[to] || (to === 'inr' ? 83.72 : 1)

  // Calculate summary rates relative to INR or USD
  const inrRate = currencyInfo['inr'] || 83.72
  const eurRate = currencyInfo['eur'] ? (inrRate / currencyInfo['eur']) : 97.21
  const gbpRate = currencyInfo['gbp'] ? (inrRate / currencyInfo['gbp']) : 112.54
  const jpyRate = currencyInfo['jpy'] ? (inrRate / currencyInfo['jpy']) : 0.56

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] dark:bg-[#0B0F19] text-[#111827] dark:text-[#F8FAFC] transition-colors duration-300 antialiased selection:bg-blue-500 selection:text-white">
      
      {/* Centered Full-Width Workspace Container (max-w 1440px) */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* LEVEL 1: Top Navigation Header */}
        <Header 
          lastUpdated={lastUpdated}
          isRefreshing={isRefreshing}
          onRefresh={handleManualRefresh}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        {/* API Error Notification Banner (if network fails on initial load) */}
        {isApiError && (
          <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-rose-700 dark:text-rose-300">
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} className="shrink-0 text-rose-500" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">Unable to sync live market rates</p>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">Please check your connection and retry exchange rate sync.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleManualRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow-sm shrink-0"
            >
              <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
              <span>Retry Sync</span>
            </button>
          </div>
        )}

        {/* LEVEL 2: Currency Summary Cards Row */}
        <section id="section-summary" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          <CurrencySummaryCard 
            fromCode="usd"
            toCode="inr"
            rate={inrRate}
            changePercent={0.42}
            isFavorite={favorites.includes('usd')}
            onToggleFavorite={toggleFavorite}
            isLoading={isInitialLoading}
          />
          <CurrencySummaryCard 
            fromCode="eur"
            toCode="inr"
            rate={eurRate}
            changePercent={0.18}
            isFavorite={favorites.includes('eur')}
            onToggleFavorite={toggleFavorite}
            isLoading={isInitialLoading}
          />
          <CurrencySummaryCard 
            fromCode="gbp"
            toCode="inr"
            rate={gbpRate}
            changePercent={-0.21}
            isFavorite={favorites.includes('gbp')}
            onToggleFavorite={toggleFavorite}
            isLoading={isInitialLoading}
          />
          <CurrencySummaryCard 
            fromCode="jpy"
            toCode="inr"
            rate={jpyRate}
            changePercent={0.31}
            isFavorite={favorites.includes('jpy')}
            onToggleFavorite={toggleFavorite}
            isLoading={isInitialLoading}
          />
        </section>

        {/* LEVEL 3: Side-by-Side Currency Converter (~58%) & Rate Trend Chart (~42%) */}
        <section id="section-converter" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT COLUMN: Currency Converter Card (7 Cols ~ 58%) */}
          <div className="lg:col-span-7">
            <div className="fin-card fin-card-elevated p-5 sm:p-6 space-y-5 h-full flex flex-col justify-between">
              
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-900/40">
                    <Coins size={18} strokeWidth={2.2} />
                  </div>
                  <div>
                    <h2 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Currency Converter
                    </h2>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                      Instant multi-currency exchange matrix
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800/50 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                  Real-time FX
                </span>
              </div>

              {isInitialLoading ? (
                <ConverterSkeleton />
              ) : (
                <form onSubmit={saveToHistory} className="space-y-4">
                  
                  {/* From & To Input Boxes connected by Swap button */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center relative">
                    
                    {/* From Input Box */}
                    <div className="sm:col-span-5">
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
                    </div>

                    {/* Swap Button Divider */}
                    <div className="sm:col-span-2 flex justify-center py-1 sm:py-0">
                      <motion.button
                        type="button"
                        whileHover={{ rotate: 180, scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        onClick={swapCurrency}
                        className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:border-blue-500 shadow-md hover:shadow-blue-500/20 transition-all cursor-pointer"
                        title="Swap currencies"
                      >
                        <ArrowUpDown size={15} strokeWidth={2.2} />
                      </motion.button>
                    </div>

                    {/* To Input Box */}
                    <div className="sm:col-span-5">
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
                    </div>

                  </div>

                  {/* Quick Amounts Presets */}
                  <div className="space-y-1.5 pt-0.5">
                    <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                      Quick Amounts
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[100, 500, 1000, 5000, 10000].map((preset) => {
                        const isActive = amount === preset
                        return (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => handleAmountChange(preset)}
                            className={`text-[11px] font-bold px-3 py-1 rounded-xl border transition-all cursor-pointer ${
                              isActive 
                                ? 'bg-blue-600 border-blue-600 text-white shadow-xs' 
                                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090D16] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                            }`}
                          >
                            ${preset.toLocaleString()}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Pinned & Target Favorites Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    
                    {/* Pinned Currencies */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                        Pinned Currencies
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {['usd', 'eur', 'inr', 'gbp'].map((curr) => (
                          <button
                            key={curr}
                            type="button"
                            onClick={() => {
                              setFrom(curr)
                              setLastEdited('from')
                            }}
                            className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border transition-all cursor-pointer uppercase ${
                              from === curr 
                                ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 text-blue-600 dark:text-blue-400' 
                                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090D16] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {curr}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Target Favorites */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                        Target Favorites
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {['usd', 'eur', 'inr', 'gbp', 'jpy'].map((curr) => (
                          <button
                            key={curr}
                            type="button"
                            onClick={() => {
                              setTo(curr)
                              setLastEdited('from')
                            }}
                            className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg border transition-all cursor-pointer uppercase ${
                              to === curr 
                                ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090D16] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            {curr}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Converted Total & Exchange Rate Summary Box */}
                  {amount > 0 && activeRate && (
                    <div className="bg-slate-50/80 dark:bg-[#090D16] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                      <div>
                        <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          {formatAmount(amount)} {from.toUpperCase()} =
                        </p>
                        <p className="text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-mono-numbers tracking-tight mt-0.5">
                          {formatAmount(convertedAmount)} {to.toUpperCase()}
                        </p>
                      </div>

                      {/* Exchange Rate Pill */}
                      <div className="shrink-0">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#1E293B] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 font-mono-numbers inline-block shadow-2xs">
                          1 {from.toUpperCase()} = {formatExchangeRate(activeRate, to)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Primary Action Button */}
                  <button
                    type="submit"
                    disabled={amount <= 0}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 disabled:opacity-40 text-white font-extrabold rounded-2xl transition-all shadow-md shadow-blue-500/20 cursor-pointer text-xs uppercase tracking-wider"
                  >
                    Save Calculation to History
                  </button>

                </form>
              )}

            </div>
          </div>

          {/* RIGHT COLUMN: Rate Trend Chart Card (5 Cols ~ 42%) */}
          <div className="lg:col-span-5">
            <RateTrendChart 
              fromCurrency={from}
              toCurrency={to}
              rate={activeRate}
              chartDays={chartDays}
              setChartDays={setChartDays}
              isLoading={isInitialLoading}
              theme={theme}
            />
          </div>

        </section>

        {/* LEVEL 4: Market Insights Section (Popular Rates + Recent History + Compact Favorite Chips) */}
        <section id="section-rates" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Popular Rates Board (Wider 5 Cols) */}
          <div id="section-rates-list" className="lg:col-span-5">
            <PopularRates 
              baseCurrency={from}
              currencyInfo={currencyInfo}
              currencyNames={currencyNames}
              isLoading={isInitialLoading}
              formatExchangeRate={formatExchangeRate}
            />
          </div>

          {/* Recent Calculation History (4 Cols) */}
          <div id="section-history" className="lg:col-span-4">
            <CalculationHistory 
              history={history}
              onClearHistory={() => setHistory([])}
              isLoading={isInitialLoading}
            />
          </div>

          {/* Favorite Currencies Chips Manager (3 Cols - Ends naturally without empty space) */}
          <div id="section-favorites" className="lg:col-span-3">
            <FavoriteCurrencies 
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              isLoading={isInitialLoading}
            />
          </div>

        </section>

        {/* LEVEL 5: Financial Disclaimer Footer */}
        <FinancialDisclaimer />

      </div>

    </div>
  )
}

export default App
