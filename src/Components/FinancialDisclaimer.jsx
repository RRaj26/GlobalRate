import React from 'react'
import { Info } from 'lucide-react'

function FinancialDisclaimer() {
  return (
    <footer className="mt-8 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 text-left shadow-2xs">
        <div className="text-blue-600 dark:text-blue-400 shrink-0 p-1.5 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-100 dark:border-blue-900/40">
          <Info size={16} strokeWidth={2} />
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
          <strong className="text-slate-800 dark:text-slate-200 font-bold">Financial Disclaimer:</strong> GlobalRate Pro provides exchange rate data for educational and informational tracking purposes only. Rates are retrieved from public FX endpoints and should not be used as official quotes for trading, investment, or legal settlement.
        </p>
      </div>
    </footer>
  )
}

export default FinancialDisclaimer
