import React, {useId, useState, useEffect, useRef} from 'react'
import { Star, ChevronDown, Check, Search, X } from 'lucide-react'

// Comprehensive flag map for currencies
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

function InputBox({
    label,
    amount,
    onAmountChange,
    onCurrencyChange,
    currencyOptions = [],
    selectCurrency = "inr",
    amountDisabled = false,
    currencyDisabled = false,
    currencyNames = {},
    favorites = [],
    onToggleFavorite,
    className = "",
}) {
   const amountInputId = useId();
   const [isOpen, setIsOpen] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");
   const dropdownRef = useRef(null);

   // Handle click outside to close dropdown
   useEffect(() => {
       const handleClickOutside = (event) => {
           if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
               setIsOpen(false);
           }
       };
       if (isOpen) {
           document.addEventListener('mousedown', handleClickOutside);
       }
       return () => {
           document.removeEventListener('mousedown', handleClickOutside);
       };
   }, [isOpen]);

   // Reset search query when dropdown closes
   useEffect(() => {
       if (!isOpen) {
           setSearchQuery("");
       }
   }, [isOpen]);

   const filteredOptions = currencyOptions.filter((curr) => {
       const searchQueryLower = searchQuery.toLowerCase().trim();
       if (!searchQueryLower) return true;

       const code = curr.toLowerCase();
       const name = (currencyNames[curr] || "").toLowerCase();
       
       return code.includes(searchQueryLower) || name.includes(searchQueryLower);
   });

   return (
        <div className={`bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E2E8F0] dark:border-slate-800/80 p-4 sm:p-5 rounded-2xl focus-within:border-blue-500/80 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 flex items-center justify-between relative shadow-inner ${className}`}>
            
            {/* Input Amount Section */}
            <div className="flex-1 min-w-0 pr-4">
                <label htmlFor={amountInputId} className="text-[#64748B] dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider block mb-1.5">
                    {label}
                </label>
                <input
                    id={amountInputId}
                    aria-label={`${label} amount`}
                    className="outline-none w-full bg-transparent text-[#0F172A] dark:text-white font-mono-numbers text-2xl sm:text-3xl font-bold tracking-tight placeholder-slate-400 dark:placeholder-slate-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    type="number"
                    placeholder="0.00"
                    disabled={amountDisabled}
                    value={amount === 0 ? '' : amount}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (onAmountChange) {
                            onAmountChange(val === '' ? 0 : parseFloat(val));
                        }
                    }}
                />
            </div>
            
            {/* Currency Trigger & Selector Dropdown */}
            <div className="flex flex-col items-end relative shrink-0" ref={dropdownRef}>
                <span className="text-[#64748B] dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">Currency</span>
                <button
                    type="button"
                    disabled={currencyDisabled}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-label={`Select ${label} currency, current ${selectCurrency}`}
                    className="rounded-xl px-3.5 py-2.5 bg-white dark:bg-[#1E293B] text-[#0F172A] dark:text-white border border-[#E2E8F0] dark:border-slate-700/80 hover:border-blue-500 dark:hover:border-blue-500 outline-none cursor-pointer transition-all duration-150 font-bold text-sm shadow-sm flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500/20"
                >
                    <span className="text-lg leading-none">{getFlag(selectCurrency)}</span>
                    <span className="tracking-wide font-extrabold">{selectCurrency.toUpperCase()}</span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
                </button>

                {/* Dropdown Modal Container */}
                {isOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 rounded-2xl shadow-2xl shadow-black/50 p-3 z-50 flex flex-col space-y-2 max-h-[340px] backdrop-blur-xl">
                        
                        {/* Search Input Bar */}
                        <div className="relative flex items-center">
                            <Search size={14} className="absolute left-3.5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search 150+ fiat currencies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                aria-label="Search currency by code or name"
                                className="w-full bg-[#F1F5F9] dark:bg-[#090D16] border border-[#E2E8F0] dark:border-slate-800 text-[#0F172A] dark:text-white text-xs rounded-xl pl-9 pr-8 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 placeholder-slate-400 dark:placeholder-slate-500 font-semibold transition-all"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-200 cursor-pointer"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                        
                        {/* Options List */}
                        <div role="listbox" className="overflow-y-auto max-h-56 pr-1 space-y-0.5 scrollbar-thin">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((currency) => (
                                    <div
                                        key={currency}
                                        role="option"
                                        aria-selected={selectCurrency === currency}
                                        className={`group/item flex items-center justify-between rounded-xl px-1.5 py-0.5 transition-all duration-150 ${
                                            selectCurrency === currency 
                                                ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40' 
                                                : 'hover:bg-slate-100 dark:hover:bg-slate-800/50'
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (onCurrencyChange) {
                                                    onCurrencyChange(currency);
                                                }
                                                setIsOpen(false);
                                            }}
                                            className="flex-1 text-left px-2 py-2 text-xs font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-200 group-hover/item:text-slate-900 dark:group-hover/item:text-white cursor-pointer min-w-0"
                                        >
                                            <span className="text-base leading-none shrink-0">{getFlag(currency)}</span>
                                            <span className="font-bold tracking-wider shrink-0 text-slate-900 dark:text-white">{currency.toUpperCase()}</span>
                                            <span className="text-slate-400 dark:text-slate-600 shrink-0 font-normal">•</span>
                                            <span className="truncate text-slate-500 dark:text-slate-400 font-medium">
                                                {currencyNames[currency] || ''}
                                            </span>
                                        </button>
                                        
                                        <div className="flex items-center gap-1 shrink-0 pr-1">
                                            {selectCurrency === currency && (
                                                <Check size={14} className="text-blue-500 font-bold" />
                                            )}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (onToggleFavorite) onToggleFavorite(currency);
                                                }}
                                                aria-label={favorites.includes(currency) ? `Remove ${currency} from favorites` : `Add ${currency} to favorites`}
                                                className="p-1 hover:text-amber-400 text-slate-300 dark:text-slate-600 transition-colors duration-150 cursor-pointer"
                                            >
                                                <Star 
                                                    size={13} 
                                                    className={favorites.includes(currency) ? "fill-amber-400 text-amber-400 stroke-amber-400" : "hover:scale-110 active:scale-95"} 
                                                />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs font-medium">
                                    No currencies match "{searchQuery}"
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default InputBox;