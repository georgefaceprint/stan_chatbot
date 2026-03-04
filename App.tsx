
import React, { useState, useEffect, useRef } from 'react';
import { QuoteRequest, ChatMessage, ProductType, ArtworkStatus, Urgency, Lead, DocumentType } from './types';
import { processConversation } from './geminiService';
import { Icons, PRODUCT_LABELS, COMPANY_DETAILS, BANKING_DETAILS } from './constants';
import QuoteSummary from './components/QuoteSummary';
import ChatBubble from './components/ChatBubble';
import QuoteTemplate from './components/QuoteTemplate';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import LoginView from './components/LoginView';

const INITIAL_QUOTE: Partial<QuoteRequest> = {
  meta: {
    source: 'website_chat',
    createdAt: new Date().toISOString(),
    currency: 'ZAR',
    version: '1.0.0',
    sessionId: Math.random().toString(36).substring(7).toUpperCase(),
    language: 'en-ZA',
    docType: 'QUOTATION'
  },
  customer: { name: '', company: '', email: '', phone: '' },
  deliveryPreference: { channel: 'email' },
  quote: {
    items: [],
    pricing: {
      estimateType: 'range',
      total: { min: 0, max: 0 },
      disclaimer: 'Pricing is based on current material costs and artwork review.'
    },
    turnaround: {
      urgency: Urgency.STANDARD,
      estimate: { minBusinessDays: 3, maxBusinessDays: 5 }
    },
    artwork: { status: ArtworkStatus.TO_BE_SENT }
  }
};

interface ExtendedChatMessage extends ChatMessage {
  sources?: any[];
}

const App: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [view, setView] = useState<'chat' | 'history'>('chat');
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Welcome to Express Print! 👋\n\nNeed high-impact **A5 Flyers or Posters** ready in **24 hours**? I can generate your quote in seconds. We also specialize in Professional Branding, Road Signage, and Tissue Wrapping Plastic.\n\nTo start, may I have your **Name and Company**?",
      timestamp: Date.now()
    }
  ]);
  const [quote, setQuote] = useState<QuoteRequest>(INITIAL_QUOTE as QuoteRequest);
  const [viewingQuote, setViewingQuote] = useState<QuoteRequest | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [dynamicHints, setDynamicHints] = useState<string[]>(['A5 Flyers Quote', 'Poster Printing', 'Logo Design', 'Road Signage']);
  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploadedArtwork, setUploadedArtwork] = useState<File | null>(null);
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedLeads = localStorage.getItem('ep_leads_v2');
    if (savedLeads) setLeads(JSON.parse(savedLeads));
    
    const savedLogo = localStorage.getItem('ep_custom_logo');
    if (savedLogo) setCustomLogo(savedLogo);

    if (localStorage.getItem('ep_admin') === 'active') {
      setIsAdmin(true);
      setIsMinimized(false);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleUpdateLogo = (logoBase64: string | null) => {
    setCustomLogo(logoBase64);
    if (logoBase64) {
      localStorage.setItem('ep_custom_logo', logoBase64);
    } else {
      localStorage.removeItem('ep_custom_logo');
    }
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    const updated = leads.map(l => l.id === updatedLead.id ? updatedLead : l);
    setLeads(updated);
    localStorage.setItem('ep_leads_v2', JSON.stringify(updated));
  };

  const handleUpdateLeadDocType = (id: string, docType: DocumentType) => {
    const lead = leads.find(l => l.id === id);
    if (lead) handleUpdateLead({ ...lead, docType });
  };

  const handleSend = async (override?: string, isFile: boolean = false) => {
    const text = (override || input).trim();
    if (!text && !uploadedArtwork) return;
    
    // Explicit trigger for finalization if the hint is clicked
    if (text.toLowerCase() === 'finalize order') {
      handleFinalSubmit();
      return;
    }

    const currentFile = uploadedArtwork;
    
    setInput('');
    setIsTyping(true);
    
    const userMsg: ExtendedChatMessage = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: text || `Uploaded artwork: ${currentFile?.name}`, 
      timestamp: Date.now(),
      isAttachment: isFile,
      fileName: currentFile?.name
    };
    
    setMessages(prev => [...prev, userMsg]);

    try {
      const result = await processConversation(
        messages.map(m => ({ role: m.role, content: m.content })).concat({ role: 'user', content: userMsg.content }), 
        quote, 
        currentFile?.name
      );
      
      setQuote(result.quote);
      setMessages(prev => [...prev, { 
        id: (Date.now()+1).toString(), 
        role: 'assistant', 
        content: result.responseText, 
        timestamp: Date.now(), 
        sources: result.groundingChunks, 
        quoteData: result.quote 
      }]);
      setDynamicHints(result.hints);
      
      // Clear file after successful send
      if (isFile) setUploadedArtwork(null);
      
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I'm having trouble connecting to our systems in Sandton. Please try again in a moment, or reach out to us directly via WhatsApp at +27 63 132 8088.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFinalSubmit = async () => {
    if (isSubmitting || submittedSuccessfully) return;
    
    setIsSubmitting(true);
    
    // Artificial delay for "processing" feel
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newLead: Lead = {
      id: quote.meta.sessionId,
      name: quote.customer.name,
      email: quote.customer.email || '',
      phone: quote.customer.phone || '',
      company: quote.customer.company,
      requestSummary: quote.quote.items.map(i => `${i.quantity}x ${PRODUCT_LABELS[i.productType] || i.productType}`).join(', '),
      timestamp: new Date().toISOString(),
      totalEstimate: quote.quote.pricing.total.min,
      status: 'new',
      quoteData: { ...quote },
      docType: quote.meta.docType || 'QUOTATION'
    };
    
    // Save to history
    const updated = [newLead, ...leads.filter(l => l.id !== newLead.id)];
    setLeads(updated);
    localStorage.setItem('ep_leads_v2', JSON.stringify(updated));

    // Construct Professional WhatsApp Message
    const itemsList = quote.quote.items.map(i => `- ${i.quantity}x ${PRODUCT_LABELS[i.productType] || i.productType}`).join('%0A');
    const msg = encodeURIComponent(
      `*EXPRESS PRINT OFFICIAL ORDER*%0A` +
      `*Reference:* #${newLead.id}%0A` +
      `*Client:* ${newLead.name}%0A` +
      `*Company:* ${newLead.company || 'N/A'}%0A%0A` +
      `*Items:*%0A${itemsList}%0A%0A` +
      `*Value:* R${newLead.totalEstimate}%0A` +
      `*Turnaround:* ${quote.quote.turnaround.urgency.replace('_', ' ').toUpperCase()}%0A%0A` +
      `Please confirm receipt and provide next steps for payment/artwork.`
    );
    
    window.open(`https://wa.me/27631328088?text=${msg}`, '_blank');
    
    setSubmittedSuccessfully(true);
    setIsSubmitting(false);

    // AI confirmation message
    setMessages(prev => [...prev, {
      id: 'success-bot',
      role: 'assistant',
      content: `### Order Confirmed! ✅\n\nYour reference is **#${newLead.id}**. I've opened a WhatsApp link to our production team with your details.\n\n**Next Steps:**\n1. Confirm the order details on WhatsApp.\n2. We'll verify your artwork (24hr turnaround begins after approval).\n3. Payment details are on the official quote.\n\nThank you for choosing Express Print!`,
      timestamp: Date.now()
    }]);
  };

  // Business logic: quote is ready only when all contact fields AND items AND pricing are populated
  const isQuoteReady = !!(
    quote.customer.name && 
    quote.customer.email && 
    quote.customer.phone && 
    quote.quote.items.length > 0 && 
    quote.quote.pricing.total.min > 0
  );

  if (isMinimized && !isAdmin) {
    return (
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10 duration-500">
        <button onClick={() => setIsMinimized(false)} className="bg-rose-600 text-white px-8 py-5 rounded-[28px] shadow-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center gap-3 transform hover:scale-105 active:scale-95 transition-all">
          <div className="p-1 bg-white/20 rounded-lg"><Icons.Message /></div> Start 24hr Quote
        </button>
        <div className="flex gap-2">
           <a href="https://wa.me/27631328088" className="bg-emerald-600 text-white p-4 rounded-2xl shadow-xl hover:bg-emerald-700 transition-all active:scale-90"><Icons.WhatsApp /></a>
           <a href="tel:+27736255637" className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl hover:bg-black transition-all active:scale-90"><Icons.Phone /></a>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen bg-slate-50 ${!isAdmin ? 'fixed bottom-6 right-6 z-[100] w-[95vw] md:w-[980px] h-[90vh] rounded-[48px] shadow-2xl overflow-hidden border-[6px] border-white flex-col md:flex-row' : 'w-full flex-col md:flex-row'}`}>
      {viewingQuote && <QuoteTemplate quote={viewingQuote} onClose={() => setViewingQuote(null)} customLogo={customLogo} />}
      {showLogin && <LoginView onLogin={(e, p) => { if (e==='brandbuildsa@gmail.com' && p==='Fungai1969#') { setIsAdmin(true); setShowLogin(false); localStorage.setItem('ep_admin', 'active'); } }} onCancel={() => setShowLogin(false)} customLogo={customLogo} />}
      
      <aside className={`bg-white border-r border-slate-200 flex flex-col shrink-0 ${isAdmin ? 'w-full md:w-3/5' : 'w-[400px]'}`}>
        <div className="p-6 border-b flex justify-between items-center bg-white z-10">
           <Icons.Logo className="scale-75 origin-left" customSrc={customLogo} />
           <div className="flex gap-2">
              {isAdmin ? (
                <button onClick={() => { setIsAdmin(false); localStorage.removeItem('ep_admin'); }} className="p-3 bg-slate-100 rounded-2xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all"><Icons.LogOut /></button>
              ) : (
                <button onClick={() => setShowLogin(true)} className="p-3 bg-slate-100 rounded-2xl text-slate-300 hover:text-rose-600 transition-all"><Icons.User /></button>
              )}
           </div>
        </div>

        {!isAdmin && (
          <div className="px-6 py-4 flex gap-3 border-b bg-slate-50/50 z-10">
             <button onClick={() => setView('chat')} className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${view === 'chat' ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'bg-white text-slate-400 border border-slate-100'}`}>Live Proposal</button>
             <button onClick={() => setView('history')} className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${view === 'history' ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'bg-white text-slate-400 border border-slate-100'}`}>My Archive</button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isAdmin ? (
            <AdminDashboard 
              leads={leads} 
              onClose={() => setIsAdmin(false)} 
              onClear={() => { if(confirm("Clear lead history?")) {setLeads([]); localStorage.removeItem('ep_leads_v2');}}} 
              onUpdateLead={handleUpdateLead} 
              onUpdateLeadDocType={handleUpdateLeadDocType} 
              onViewDoc={setViewingQuote} 
              customLogo={customLogo}
              onUpdateLogo={handleUpdateLogo}
              isSidebarView 
            />
          ) : view === 'chat' ? (
            <div className="p-6 animate-in fade-in slide-in-from-left-4 duration-500">
              <QuoteSummary quote={quote} onFinalize={handleFinalSubmit} isReady={isQuoteReady} isSubmitting={isSubmitting} isSubmitted={submittedSuccessfully} />
            </div>
          ) : (
            <Dashboard leads={leads} onSelectQuote={setViewingQuote} onClear={() => {}} customLogo={customLogo} isCompact />
          )}
        </div>

        {!isAdmin && view === 'chat' && (
          <div className="p-6 border-t bg-white space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.04)]">
             <div className="grid grid-cols-3 gap-3">
                <a href="https://wa.me/27631328088" className="flex flex-col items-center gap-1.5 py-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all transform active:scale-95"><Icons.WhatsApp /><span className="text-[8px] font-black uppercase tracking-widest">Support</span></a>
                <a href="mailto:info@expressprint.co.za" className="flex flex-col items-center gap-1.5 py-3 bg-sky-50 text-sky-600 rounded-2xl hover:bg-sky-600 hover:text-white transition-all transform active:scale-95"><Icons.Mail /><span className="text-[8px] font-black uppercase tracking-widest">Email</span></a>
                <a href="tel:+27736255637" className="flex flex-col items-center gap-1.5 py-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-900 hover:text-white transition-all transform active:scale-95"><Icons.Phone /><span className="text-[8px] font-black uppercase tracking-widest">Call</span></a>
             </div>
             <button 
                disabled={!isQuoteReady || isSubmitting || submittedSuccessfully} 
                onClick={handleFinalSubmit} 
                className={`w-full py-5 rounded-[24px] font-black uppercase text-xs tracking-[0.3em] text-white transition-all duration-500 shadow-2xl relative overflow-hidden ${
                  submittedSuccessfully ? 'bg-emerald-600 shadow-emerald-200 cursor-default' : 
                  isQuoteReady ? 'bg-rose-600 shadow-rose-200 active:scale-95' : 
                  'bg-slate-300 shadow-none grayscale opacity-60'
                }`}
             >
                {isSubmitting && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
                {isSubmitting ? "Processing Order..." : submittedSuccessfully ? "Order Sent Successfully" : `Send ${quote.meta.docType} Order`}
             </button>
          </div>
        )}
      </aside>

      <main className="flex-1 flex flex-col bg-white border-l border-slate-200 overflow-hidden">
        <header className="p-6 border-b flex items-center gap-4 bg-white z-10 shadow-sm">
           <div className="p-3 bg-rose-600 rounded-2xl text-white shadow-xl rotate-3"><Icons.Bot /></div>
           <div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Systems Core</p>
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
               <p className="text-[10px] text-slate-900 font-black uppercase tracking-widest">Lead Sales Consultant</p>
             </div>
           </div>
           {!isAdmin && (
             <button onClick={() => setIsMinimized(true)} className="ml-auto p-3 bg-slate-50 rounded-2xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all"><Icons.X /></button>
           )}
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/40 custom-scrollbar">
          {messages.map(m => <ChatBubble key={m.id} message={m} sources={m.sources} onViewQuote={setViewingQuote} />)}
          {isTyping && (
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 animate-in slide-in-from-left-4 bg-white p-4 rounded-[28px] w-fit shadow-xl border border-slate-100">
              <div className="animate-spin text-rose-600"><Icons.Zap /></div>
              Calculating Investment Matrix...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-6 border-t bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
          <div className="flex gap-3">
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="p-5 bg-slate-50 rounded-[24px] text-slate-400 hover:bg-rose-600 hover:text-white transition-all transform active:scale-90"
              title="Upload Artwork"
            >
              <Icons.Paperclip />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={e => { 
                if(e.target.files?.[0]) { 
                  setUploadedArtwork(e.target.files[0]); 
                  handleSend("", true); 
                } 
              }} 
            />
            <div className="flex-1 relative group">
              <input 
                type="text" 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSend()} 
                placeholder="A5 Flyers, Posters, or Logo Design..." 
                className="w-full p-5 bg-slate-50 rounded-[28px] outline-none font-bold text-sm focus:bg-white focus:ring-[6px] ring-rose-500/5 transition-all shadow-inner placeholder-slate-300" 
              />
              <button 
                onClick={() => handleSend()} 
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-rose-600 text-white rounded-2xl shadow-xl hover:bg-rose-700 active:scale-90 transition-all"
              >
                <Icons.Send />
              </button>
            </div>
          </div>
          <div className="flex gap-2 mt-5 overflow-x-auto no-scrollbar pb-1">
            {dynamicHints.map(h => (
              <button 
                key={h} 
                onClick={() => handleSend(h)} 
                className="whitespace-nowrap px-5 py-2.5 bg-white border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-xl transition-all active:scale-95 shadow-sm"
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
