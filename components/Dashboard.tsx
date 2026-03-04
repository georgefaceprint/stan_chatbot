import React from 'react';
import { Lead, QuoteRequest } from '../types';
import { PRODUCT_LABELS, Icons } from '../constants';

interface DashboardProps {
  leads: Lead[];
  onSelectQuote: (quote: QuoteRequest) => void;
  onClear: () => void;
  customLogo?: string | null;
  isCompact?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ leads, onSelectQuote, onClear, customLogo, isCompact = false }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
  };

  if (isCompact) {
    return (
      <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
        {/* Compact View Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          <div className="flex justify-between items-center mb-4 px-1 border-b border-slate-200 pb-2">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Saved Documents</p>
             {leads.length > 0 && (
               <button onClick={onClear} className="text-[8px] font-black text-rose-500 hover:text-rose-700 uppercase tracking-widest bg-rose-50 px-2 py-1 rounded-lg">Purge All</button>
             )}
          </div>
          {leads.length === 0 ? (
            <div className="text-center py-16 bg-white/50 border-2 border-dashed border-slate-200 rounded-3xl">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-relaxed">No history found<br/>Start a chat</p>
            </div>
          ) : (
            leads.map((lead) => (
              <div 
                key={lead.id} 
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group animate-in fade-in slide-in-from-bottom-2"
                onClick={() => onSelectQuote(lead.quoteData)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[8px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded uppercase tracking-widest">#{lead.id}</span>
                  <span className="text-[8px] text-slate-400 font-bold">{new Date(lead.timestamp).toLocaleDateString('en-ZA')}</span>
                </div>
                <h4 className="text-xs font-black text-slate-900 mb-1 uppercase tracking-tight truncate leading-none">{lead.name}</h4>
                <p className="text-[10px] text-slate-500 font-bold line-clamp-1 mb-3 opacity-60 italic">"{lead.requestSummary}"</p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <span className="text-sm font-black text-slate-900">{formatCurrency(lead.totalEstimate)}</span>
                  <div className="text-slate-300 group-hover:text-rose-600 transition-colors">
                    <Icons.FileText />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-slate-200 p-6 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-6">
          <Icons.Logo customSrc={customLogo} />
          <div className="h-8 w-px bg-slate-200"></div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">Quote Archive</h1>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Lead Management Portal</p>
          </div>
        </div>
        <button 
          onClick={onClear}
          className="px-5 py-2.5 text-[10px] font-black text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all border border-rose-100 uppercase tracking-[0.2em] shadow-sm"
        >
          Clear All Records
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        <div className="max-w-6xl mx-auto">
          {leads.length === 0 ? (
            <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-slate-200 shadow-xl">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200 border border-slate-100">
                <Icons.FileText />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Archive Empty</h2>
              <p className="text-slate-400 text-sm max-w-xs mx-auto font-black uppercase tracking-widest leading-relaxed">Start a conversation to generate your first professional document.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leads.map((lead) => (
                <div 
                  key={lead.id} 
                  className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm hover:shadow-2xl hover:border-rose-400 transition-all group flex flex-col relative overflow-hidden animate-in fade-in duration-500"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="text-[10px] font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-[0.2em]">
                      REF: #{lead.id}
                    </div>
                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                      {new Date(lead.timestamp).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  <div className="mb-6 flex-1 relative z-10">
                    <h3 className="font-black text-slate-900 text-2xl line-clamp-1 mb-3 leading-none uppercase tracking-tighter">{lead.name}</h3>
                    <p className="text-xs text-slate-400 font-bold italic line-clamp-2 leading-relaxed opacity-80">
                      {lead.requestSummary}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 shadow-inner">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Investment</span>
                      <span className="text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(lead.totalEstimate)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => onSelectQuote(lead.quoteData)}
                    className="w-full py-5 bg-slate-900 group-hover:bg-rose-600 text-white rounded-[20px] text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 relative z-10"
                  >
                    <Icons.FileText /> View Document Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;