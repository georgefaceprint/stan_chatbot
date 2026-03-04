
import React from 'react';
import { ChatMessage, QuoteRequest } from '../types';
import { Icons, PRODUCT_LABELS } from '../constants';

interface ChatBubbleProps {
  message: ChatMessage;
  sources?: any[];
  onViewQuote?: (quote: QuoteRequest) => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, sources, onViewQuote }) => {
  const isAssistant = message.role === 'assistant';

  // Strict check: only show quote card if it's fully populated and has items
  const hasValidQuote = isAssistant && 
                        message.quoteData && 
                        message.quoteData.quote.items.length > 0 && 
                        message.quoteData.customer.name && 
                        message.quoteData.quote.pricing.total.min > 0;

  return (
    <div className={`flex w-full ${isAssistant ? 'justify-start' : 'justify-end animate-in slide-in-from-right-4 duration-500'}`}>
      <div className={`flex max-w-[90%] md:max-w-[75%] gap-4 ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 mt-1 shadow-lg transform transition-transform hover:scale-110 ${isAssistant ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white'}`}>
          {isAssistant ? <Icons.Bot /> : <Icons.User />}
        </div>
        
        <div className="flex flex-col gap-3">
          <div className={`p-5 rounded-[32px] shadow-sm relative group ${
            isAssistant ? 'bg-white text-slate-800 rounded-tl-none border border-slate-100' : 'bg-rose-600 text-white rounded-tr-none shadow-rose-200'
          }`}>
            <p className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>
            
            {/* Visual Confirmation for File Uploads */}
            {message.isAttachment && message.fileName && (
              <div className="mt-4 p-4 bg-white/10 rounded-2xl border border-white/20 flex items-center gap-4 animate-in zoom-in-95 duration-300 backdrop-blur-sm">
                <div className="p-3 bg-white text-rose-600 rounded-xl shadow-lg">
                  <Icons.Image />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-rose-100 mb-1">Upload Successful</p>
                  <p className="text-xs font-bold text-white truncate">{message.fileName}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-[8px] font-black uppercase tracking-widest text-emerald-400">
                    <Icons.Check /> Processed by Systems
                  </div>
                </div>
              </div>
            )}

            {/* Official Document Card */}
            {hasValidQuote && (
              <div 
                className="mt-6 p-6 bg-slate-900 rounded-[28px] flex items-center justify-between group cursor-pointer hover:bg-black transition-all shadow-2xl relative overflow-hidden active:scale-95"
                onClick={() => onViewQuote?.(message.quoteData!)}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-600/20 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform"></div>
                <div className="flex items-center gap-5 relative z-10">
                  <div className="p-4 bg-white/10 text-white rounded-[20px] shadow-inner backdrop-blur-sm group-hover:bg-rose-600 group-hover:scale-110 transition-all">
                    <Icons.FileText />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] leading-none mb-2">Verified Output</p>
                    <p className="text-sm font-black text-white tracking-tight">Review {message.quoteData!.meta.docType || 'Proposal'} #REF-{message.quoteData!.meta.sessionId}</p>
                    <div className="flex gap-3 mt-1 opacity-40 group-hover:opacity-100 transition-opacity">
                       <p className="text-[8px] font-bold text-white uppercase tracking-widest">• A4 Official Template</p>
                       <p className="text-[8px] font-bold text-white uppercase tracking-widest">• Ready for Approval</p>
                    </div>
                  </div>
                </div>
                <div className="text-white/20 group-hover:text-rose-500 transition-colors">
                  <Icons.Printer />
                </div>
              </div>
            )}

            <div className={`flex items-center gap-2 mt-4 opacity-40 text-[9px] font-black uppercase tracking-widest ${isAssistant ? 'text-slate-400' : 'text-white'}`}>
              <Icons.Zap className="w-2.5 h-2.5" />
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          
          {/* Grounding Sources */}
          {isAssistant && sources && sources.length > 0 && (
            <div className="bg-white/60 backdrop-blur-sm border border-slate-200 rounded-[24px] p-4 animate-in fade-in slide-in-from-top-2 duration-700">
              <p className="text-[9px] font-black text-slate-500 mb-3 flex items-center gap-2 uppercase tracking-[0.2em]">
                <div className="w-1 h-1 bg-emerald-500 rounded-full"></div> Sourced from Express Print Inventory
              </p>
              <div className="flex flex-wrap gap-2">
                {sources.map((chunk, i) => (
                  chunk.web?.uri && (
                    <a 
                      key={i} 
                      href={chunk.web.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] font-bold text-rose-600 bg-white border border-slate-100 px-3 py-1.5 rounded-full hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      {chunk.web.title || 'Official Product Info'} <Icons.External />
                    </a>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
