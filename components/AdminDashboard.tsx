import React, { useState, useMemo, useRef } from 'react';
import { Lead, DocumentType, QuoteRequest } from '../types';
import { PRODUCT_LABELS, Icons } from '../constants';

interface AdminDashboardProps {
  leads: Lead[];
  onClose: () => void;
  onClear: () => void;
  onUpdateLeadDocType?: (leadId: string, docType: DocumentType) => void;
  onUpdateLead?: (lead: Lead) => void;
  onViewDoc?: (quote: QuoteRequest) => void;
  customLogo?: string | null;
  onUpdateLogo?: (logo: string | null) => void;
  isSidebarView?: boolean;
}

type FolderType = 'ALL' | 'QUOTATION' | 'INVOICE' | 'INTELLIGENCE' | 'BRANDING' | 'INSTALLATION';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  leads, 
  onClose, 
  onClear, 
  onUpdateLeadDocType, 
  onUpdateLead, 
  onViewDoc, 
  customLogo,
  onUpdateLogo,
  isSidebarView = false 
}) => {
  const [activeFolder, setActiveFolder] = useState<FolderType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [widgetColor, setWidgetColor] = useState('#e11d48');
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const filteredLeads = leads.filter(l => {
    const matchesFolder = activeFolder === 'ALL' || (l.docType || 'QUOTATION') === activeFolder;
    const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (l.company?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const stats = useMemo(() => {
    const totalValue = leads.reduce((sum, l) => sum + (l.totalEstimate || 0), 0);
    const avgValue = leads.length ? totalValue / leads.length : 0;
    const topProducts = leads.reduce((acc: Record<string, number>, l) => {
      l.quoteData.quote.items.forEach(i => {
        acc[i.productType] = (acc[i.productType] || 0) + 1;
      });
      return acc;
    }, {});
    const converted = leads.filter(l => l.status === 'converted').length;
    return { totalValue, avgValue, topProducts, conversionRate: leads.length ? (converted / leads.length) * 100 : 0 };
  }, [leads]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
  };

  const handleStatusToggle = (lead: Lead) => {
    const statuses: Lead['status'][] = ['new', 'contacted', 'converted'];
    const nextStatus = statuses[(statuses.indexOf(lead.status) + 1) % statuses.length];
    onUpdateLead?.({ ...lead, status: nextStatus });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateLogo?.(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const FolderItem = ({ type, icon, label, count }: { type: FolderType, icon: React.ReactNode, label: string, count?: number }) => (
    <button 
      onClick={() => setActiveFolder(type)}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeFolder === type ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'text-slate-500 hover:bg-slate-100'}`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      {count !== undefined && (
        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${activeFolder === type ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
          {count}
        </span>
      )}
    </button>
  );

  const BrandingView = () => (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-3">
          <Icons.Image /> Corporate Identity
        </h3>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-8 leading-relaxed">
          Upload your company logo to customize quotes, invoices, and the chat assistant interface. Recommended size: Square or Horizontal, max 500KB.
        </p>
        
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-48 h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center overflow-hidden relative group">
            {customLogo ? (
              <img src={customLogo} alt="Logo Preview" className="w-full h-full object-contain p-4" />
            ) : (
              <div className="text-center">
                <div className="text-slate-300 mb-2 flex justify-center"><Icons.Logo className="w-12 h-12" /></div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Default Logo</p>
              </div>
            )}
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button onClick={() => logoInputRef.current?.click()} className="p-3 bg-white text-rose-600 rounded-full shadow-xl hover:scale-110 transition-transform"><Icons.Edit /></button>
              {customLogo && <button onClick={() => onUpdateLogo?.(null)} className="p-3 bg-white text-slate-600 rounded-full shadow-xl hover:scale-110 transition-transform"><Icons.X /></button>}
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <button 
              onClick={() => logoInputRef.current?.click()}
              className="w-full py-4 bg-rose-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-rose-100 flex items-center justify-center gap-3"
            >
              <Icons.Image /> {customLogo ? 'Change Company Logo' : 'Upload Company Logo'}
            </button>
            <input 
              type="file" 
              ref={logoInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleLogoUpload} 
            />
            {customLogo && (
              <button 
                onClick={() => onUpdateLogo?.(null)}
                className="w-full py-4 bg-white text-slate-600 border border-slate-200 font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-slate-50 transition-colors"
              >
                Reset to Default
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const IntelligenceView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-rose-600 to-rose-700 p-8 rounded-[32px] text-white shadow-xl shadow-rose-100">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Total Pipeline Value</p>
          <h3 className="text-4xl font-black tracking-tighter">{formatCurrency(stats.totalValue)}</h3>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Lead Conversion</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stats.conversionRate.toFixed(1)}%</h3>
        </div>
        <div className="bg-slate-900 p-8 rounded-[32px] text-white shadow-xl shadow-slate-200 flex flex-col justify-center">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Avg. Deal</p>
          <h3 className="text-3xl font-black tracking-tighter">{formatCurrency(stats.avgValue)}</h3>
        </div>
      </div>
      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">Product Popularity</h3>
        <div className="space-y-4">
          {(Object.entries(stats.topProducts) as [string, number][]).sort((a,b) => b[1] - a[1]).map(([key, count]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-600">
                <span>{PRODUCT_LABELS[key] || key}</span>
                <span className="text-rose-600">{count} Requests</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-600 rounded-full" 
                  style={{ width: `${(count / Math.max(...(Object.values(stats.topProducts) as number[]))) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const InstallationView = () => (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6">Widget Configuration</h3>
        <div className="flex gap-4 mb-8">
           {['#e11d48', '#1e293b', '#2563eb', '#059669', '#d97706'].map(color => (
             <button key={color} onClick={() => setWidgetColor(color)} className={`w-10 h-10 rounded-2xl border-4 ${widgetColor === color ? 'border-slate-900' : 'border-transparent'}`} style={{ backgroundColor: color }} />
           ))}
        </div>
        <div className="bg-slate-900 rounded-2xl p-6 text-slate-300 font-mono text-xs overflow-x-auto shadow-2xl">
{`<script src="https://cdn.expressprint.co.za/ai.js" 
  data-color="${widgetColor}" 
  data-id="EP-CRM-99">
</script>`}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex h-full bg-slate-50 overflow-hidden ${isSidebarView ? '' : 'fixed inset-0 z-[60]'}`}>
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 relative z-20">
        <div className="p-6 border-b border-slate-100">
          <Icons.Logo className="scale-90 origin-left" customSrc={customLogo} />
          <p className="text-[8px] font-black text-rose-600 uppercase tracking-[0.3em] mt-3 text-center">Admin CRM</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <FolderItem type="ALL" icon={<Icons.Layout />} label="Archive" count={leads.length} />
          <FolderItem type="BRANDING" icon={<Icons.Image />} label="Branding" />
          <FolderItem type="INTELLIGENCE" icon={<Icons.TrendingUp />} label="Analytics" />
          <FolderItem type="QUOTATION" icon={<Icons.FileText />} label="Quotes" count={leads.filter(l => (l.docType || 'QUOTATION') === 'QUOTATION').length} />
          <FolderItem type="INVOICE" icon={<Icons.Printer />} label="Invoices" count={leads.filter(l => l.docType === 'INVOICE').length} />
          <FolderItem type="INSTALLATION" icon={<Icons.Zap />} label="Installation" />
        </nav>
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <button onClick={onClear} className="w-full py-3 bg-white text-rose-600 border border-rose-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-sm">Clear Archive</button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-200 p-6 flex items-center justify-between shrink-0 shadow-sm z-10">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
            {activeFolder === 'INTELLIGENCE' ? 'Intelligence' : activeFolder === 'INSTALLATION' ? 'Widget Installation' : activeFolder === 'BRANDING' ? 'Branding & Identity' : `${activeFolder} Leads`}
          </h2>
          {!isSidebarView && <button onClick={onClose} className="p-2 text-slate-300 hover:text-rose-600 transition-colors"><Icons.X /></button>}
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeFolder === 'INTELLIGENCE' ? (
            <IntelligenceView />
          ) : activeFolder === 'INSTALLATION' ? (
            <InstallationView />
          ) : activeFolder === 'BRANDING' ? (
            <BrandingView />
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-32 opacity-30">
              <Icons.FileText className="mx-auto mb-6 w-16 h-16" />
              <p className="font-black uppercase tracking-widest">No matching leads</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filteredLeads.map((lead) => (
                <div key={lead.id} className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-200 hover:border-rose-300 transition-all flex gap-6 items-center">
                  <div 
                    onClick={() => handleStatusToggle(lead)}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 cursor-pointer shadow-lg transition-colors ${lead.status === 'converted' ? 'bg-emerald-600 text-white' : lead.status === 'contacted' ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white'}`}
                  >
                    {lead.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight truncate leading-none">{lead.name}</h4>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingLead(lead)} className="p-2 text-slate-300 hover:text-rose-600 transition-colors"><Icons.Edit /></button>
                        <span className="text-[9px] font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-lg uppercase tracking-widest">#{lead.id}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 font-bold mb-3 truncate italic">"{lead.requestSummary}"</p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <div><p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Value</p><p className="text-sm font-black text-slate-900">{formatCurrency(lead.totalEstimate)}</p></div>
                      <button onClick={() => onViewDoc?.(lead.quoteData)} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95">Open File</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {editingLead && (
          <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
             <div className="bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
                <h3 className="text-2xl font-black text-slate-900 uppercase mb-8 tracking-tighter">Edit Lead Override</h3>
                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Client Name</label><input className="w-full p-4 bg-slate-50 rounded-2xl font-bold" defaultValue={editingLead.name} onChange={e => { if (editingLead) editingLead.name = e.target.value; }} /></div>
                      <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Company</label><input className="w-full p-4 bg-slate-50 rounded-2xl font-bold" defaultValue={editingLead.company} onChange={e => { if (editingLead) editingLead.company = e.target.value; }} /></div>
                   </div>
                   <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quoted Value (ZAR)</label><input type="number" className="w-full p-4 bg-slate-50 rounded-2xl font-black text-rose-600" defaultValue={editingLead.totalEstimate} onChange={e => { if (editingLead) editingLead.totalEstimate = Number(e.target.value); }} /></div>
                   <div className="flex gap-4 pt-4">
                      <button onClick={() => { if (editingLead) { onUpdateLead?.(editingLead); setEditingLead(null); } }} className="flex-1 py-4 bg-rose-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs">Save</button>
                      <button onClick={() => setEditingLead(null)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl uppercase tracking-widest text-xs">Cancel</button>
                   </div>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;