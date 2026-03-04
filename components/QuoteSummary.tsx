
import React from 'react';
import { QuoteRequest, FulfillmentMethod, ProductType, Urgency } from '../types';
import { PRODUCT_LABELS, Icons } from '../constants';

interface QuoteSummaryProps {
  quote: QuoteRequest;
  onFinalize?: () => void;
  isReady?: boolean;
  isSubmitting?: boolean;
  isSubmitted?: boolean;
}

const QuoteSummary: React.FC<QuoteSummaryProps> = ({ quote, onFinalize, isReady, isSubmitting, isSubmitted }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
  };

  const hasItems = quote.quote.items.length > 0;
  
  // Validation for gated flow
  const isNameMissing = !quote.customer.name;
  const isEmailMissing = !quote.customer.email;
  const isPhoneMissing = !quote.customer.phone;
  const isCompanyMissing = !quote.customer.company;

  const getUrgencyLabel = (u: string) => {
    switch (u) {
      case 'same_day': return 'Same Day Priority';
      case '23_hours': return '23 Hour Express';
      case '3_5_days': return '3-5 Business Days';
      case '1_14_days': return '1-14 Days (Bulk)';
      default: return u?.replace('_', ' ') || 'Standard';
    }
  };

  const calculateProgress = () => {
    let score = 0;
    if (quote.customer.name) score += 25;
    if (quote.customer.email && quote.customer.phone) score += 25;
    if (hasItems) score += 25;
    if (quote.quote.pricing.total.min > 0) score += 25;
    return score;
  };

  const progress = calculateProgress();

  return (
    <div className="space-y-6">
      {/* Dynamic Funnel Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-[9px] font-black text-slate-400 mb-2 uppercase tracking-widest">
          <span>Quote Readiness</span>
          <span className={`${progress === 100 ? 'text-emerald-500' : 'text-rose-600'}`}>
            {progress === 100 ? 'Ready for Submission' : `${progress}% Complete`}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${
              progress === 100 ? 'bg-emerald-500' : 'bg-rose-600'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Mandatory Client Information */}
      <section className="animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.15em] flex items-center gap-2">
            <Icons.User className="w-3 h-3 text-rose-600" /> Client Profile
          </h3>
          { (isNameMissing || isEmailMissing || isPhoneMissing) && (
            <span className="text-[7px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full uppercase border border-rose-100 animate-pulse">Action Required</span>
          ) }
        </div>
        
        <div className={`p-5 rounded-[24px] border transition-all duration-500 ${!isNameMissing ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-dashed border-slate-300'}`}>
          <div className="space-y-4">
            <div className="relative">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Full Name</span>
              <p className={`text-xs font-bold transition-colors ${isNameMissing ? 'text-rose-300 italic' : 'text-slate-900'}`}>
                {quote.customer.name || 'Awaiting entry...'}
              </p>
              {isNameMissing && <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Email</span>
                <p className={`text-[10px] font-bold truncate transition-colors ${isEmailMissing ? 'text-rose-300 italic' : 'text-slate-700'}`}>
                  {quote.customer.email || 'Required...'}
                </p>
                {isEmailMissing && <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>}
              </div>
              <div className="relative">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Phone</span>
                <p className={`text-[10px] font-bold transition-colors ${isPhoneMissing ? 'text-rose-300 italic' : 'text-slate-700'}`}>
                  {quote.customer.phone || 'Required...'}
                </p>
                {isPhoneMissing && <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>}
              </div>
            </div>

            <div className="relative">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Company / Organization</span>
              <p className={`text-[10px] font-bold transition-colors ${isCompanyMissing ? 'text-slate-300 italic' : 'text-slate-700'}`}>
                {quote.customer.company || 'Private (Optional)'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Order Requirements Summary */}
      <section className="animate-in fade-in slide-in-from-top-4 duration-700">
        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
          <Icons.Printer className="w-3 h-3 text-rose-600" /> Order Specifications
        </h3>
        <div className="space-y-3">
          {hasItems ? (
            quote.quote.items.map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-rose-200 transition-all group relative overflow-hidden animate-in zoom-in-95">
                <div className="absolute top-0 right-0 p-1">
                   <Icons.Check className="w-3 h-3 text-emerald-500 opacity-50" />
                </div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[8px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100 uppercase tracking-widest">Qty: {item.quantity}</span>
                </div>
                <h4 className="text-xs font-black text-slate-900 uppercase leading-tight mb-2 tracking-tight">
                  {PRODUCT_LABELS[item.productType] || item.productType}
                </h4>
                {item.specs && (
                  <div className="space-y-1">
                    {item.specs.printSize && <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">• Size: {item.specs.printSize}</p>}
                    {item.specs.notes && <p className="text-[9px] text-slate-400 italic leading-snug border-l-2 border-slate-100 pl-2">"{item.specs.notes}"</p>}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-[24px] bg-slate-50/30">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-50">Awaiting Specifications...</p>
            </div>
          )}
        </div>
      </section>

      {/* Final Investment (Only show if pricing exists) */}
      <section className="animate-in fade-in slide-in-from-top-4 duration-1000">
        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.15em] mb-3">Investment Summary</h3>
        <div className={`p-6 rounded-[28px] transition-all duration-500 shadow-xl overflow-hidden relative ${
          quote.quote.pricing.total.min > 0 ? 'bg-slate-900 text-white scale-100' : 'bg-slate-100 text-slate-300 scale-95 opacity-50 grayscale'
        }`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Total Estimated</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black tracking-tighter">
                {quote.quote.pricing.total.min > 0 ? formatCurrency(quote.quote.pricing.total.min) : 'R 0.00'}
              </span>
              {quote.quote.pricing.total.max > quote.quote.pricing.total.min && (
                <span className="text-xs font-bold text-slate-500 line-through">
                  {formatCurrency(quote.quote.pricing.total.max)}
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
             <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
                <span className="text-slate-500">Service Speed</span>
                <span className="text-rose-500">{getUrgencyLabel(quote.quote.turnaround.urgency)}</span>
             </div>
             <p className="text-[8px] text-slate-500 italic leading-tight">
               {quote.quote.pricing.disclaimer}
             </p>
          </div>
        </div>
      </section>
      
      {/* Success Guidance */}
      {isSubmitted && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in bounce-in duration-500">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest text-center mb-1">Transaction Logged</p>
          <p className="text-[9px] text-emerald-500 text-center leading-relaxed">Please refer to the chat for your reference number and production steps.</p>
        </div>
      )}
    </div>
  );
};

export default QuoteSummary;
