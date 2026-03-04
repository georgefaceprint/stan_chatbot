import React, { useState } from 'react';
import { QuoteRequest } from '../types';
import { COMPANY_DETAILS, BANKING_DETAILS, PRODUCT_LABELS, Icons } from '../constants';

interface QuoteTemplateProps {
  quote: QuoteRequest;
  onClose: () => void;
  customLogo?: string | null;
}

const QuoteTemplate: React.FC<QuoteTemplateProps> = ({ quote, onClose, customLogo }) => {
  const [copied, setCopied] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  const getUrgencyText = (u: string) => {
    switch (u) {
      case 'same_day': return 'SAME DAY PRIORITY';
      case '23_hours': return '23 HOUR EXPRESS';
      case '3_5_days': return '3-5 WORKING DAYS';
      case '1_14_days': return '1-14 WORKING DAYS (BULK)';
      default: return u?.toUpperCase().replace('_', ' ') || 'STANDARD';
    }
  };

  const handleCopy = async () => {
    const today = new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });
    const docType = quote.meta.docType || 'QUOTATION';
    const urgencyLabel = getUrgencyText(quote.quote.turnaround.urgency);

    let text = `${COMPANY_DETAILS.name}\n`;
    text += `DOCUMENT: ${docType}\n`;
    text += `REF: #${docType === 'INVOICE' ? 'INV' : 'QUO'}-${quote.meta.sessionId.toUpperCase()}\n`;
    text += `DATE: ${today}\n\n`;

    text += `CLIENT: ${quote.customer.name}\n`;
    text += `COMPANY: ${quote.customer.company || 'N/A'}\n`;
    text += `EMAIL: ${quote.customer.email}\n`;
    text += `PHONE: ${quote.customer.phone}\n\n`;

    text += `ORDER DETAILS:\n`;
    quote.quote.items.forEach((item, idx) => {
      text += `${idx + 1}. ${item.quantity}x ${PRODUCT_LABELS[item.productType] || item.productType}\n`;
      if (item.specs?.printSize) text += `   - Size: ${item.specs.printSize}\n`;
      if (item.specs?.notes) text += `   - Notes: ${item.specs.notes}\n`;
    });

    text += `\nTOTAL ESTIMATE: ${formatCurrency(quote.quote.pricing.total.min)}\n\n`;
    text += `TURNAROUND: ${urgencyLabel}\n`;
    text += `BANKING: ${BANKING_DETAILS.bank} | Acc: ${BANKING_DETAILS.accountNumber}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const today = new Date().toLocaleDateString('en-ZA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const docType = quote.meta.docType || 'QUOTATION';

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-900/95 backdrop-blur-xl overflow-y-auto print:bg-white print:block no-scrollbar">
      {/* Action bar (Hidden on Print) */}
      <div className="sticky top-0 z-[110] bg-slate-900/40 backdrop-blur-md border-b border-white/5 p-4 flex justify-center gap-4 print:hidden shrink-0">
        <button 
          onClick={handleCopy}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl transition-all border ${copied ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-100'}`}
        >
          {copied ? <Icons.Check /> : <Icons.Copy />}
          {copied ? 'Details Copied' : 'Copy Quote Text'}
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-rose-700 transition-all border border-rose-500"
        >
          <Icons.Printer /> Download PDF / Print
        </button>
        <button 
          onClick={onClose}
          className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all border border-slate-600"
        >
          <Icons.X /> Exit Preview
        </button>
      </div>

      {/* Responsive A4 Wrapper */}
      <div className="flex-1 flex justify-center py-12 px-4 print:p-0">
        <div 
          className="bg-white shadow-2xl relative flex flex-col text-slate-800 font-sans print:shadow-none print:m-0 transform scale-90 md:scale-100 origin-top"
          style={{ 
            width: '210mm', 
            minHeight: '297mm',
            padding: '20mm',
            boxSizing: 'border-box'
          }}
        >
          {/* Official Letterhead */}
          <div className="flex justify-between items-start mb-14 border-b-2 border-slate-900 pb-10">
            <div className="max-w-[65%]">
              <div className="flex items-center gap-3 mb-8">
                <Icons.Logo className="scale-100" customSrc={customLogo} />
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-3 uppercase tracking-tighter leading-none">
                {COMPANY_DETAILS.name}
              </h1>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.15em] space-y-1.5">
                <p className="flex items-center gap-2 opacity-80"><Icons.MapPin /> {COMPANY_DETAILS.address}</p>
                <div className="flex gap-6">
                  <p className="flex items-center gap-2">Email: <span className="text-slate-900">{COMPANY_DETAILS.email}</span></p>
                  <p className="flex items-center gap-2">Web: <span className="text-slate-900">{COMPANY_DETAILS.website}</span></p>
                </div>
                <div className="flex gap-6">
                  <p className="flex items-center gap-2">Sales: <span className="text-slate-900">{COMPANY_DETAILS.salesWhatsapp1}</span></p>
                  <p className="flex items-center gap-2">Admin: <span className="text-slate-900">{COMPANY_DETAILS.adminPhone}</span></p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="mb-6">
                <h2 className="text-7xl font-black text-slate-100 uppercase tracking-tighter leading-none mb-0 select-none print:text-slate-200">
                  {docType}
                </h2>
                <div className="bg-slate-900 text-white px-4 py-1.5 rounded-lg inline-block transform -translate-y-4">
                  <p className="text-sm font-black uppercase tracking-widest">#{docType.substring(0,3)}-{quote.meta.sessionId.toUpperCase()}</p>
                </div>
              </div>
              <div className="mt-4 text-[11px] font-black text-slate-400 uppercase tracking-widest space-y-1">
                <p>Issued: <span className="text-slate-900">{today}</span></p>
                <p>Expires: <span className="text-slate-900">7 Days From Issue</span></p>
              </div>
            </div>
          </div>

          {/* Detailed Client Information Section */}
          <div className="grid grid-cols-2 gap-16 mb-12">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <p className="text-[9px] font-black text-rose-600 uppercase tracking-[0.25em] mb-4">Client Detail</p>
              <h3 className="text-2xl font-black text-slate-900 mb-1 leading-tight">{quote.customer.name}</h3>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">{quote.customer.company || 'Private Client'}</p>
              
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Email Address</span>
                  <span className="text-xs font-bold text-slate-700">{quote.customer.email || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Contact Phone</span>
                  <span className="text-xs font-bold text-slate-700">{quote.customer.phone || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center text-right pr-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4">Service Agreement</p>
              <div className="space-y-4">
                <div>
                  <span className="text-[8px] font-black text-slate-400 uppercase block tracking-widest">Logistics Strategy</span>
                  <span className="text-sm font-black text-slate-900 uppercase">
                    {quote.quote.fulfillment?.method?.replace('_', ' ') || 'Express Collection'}
                  </span>
                </div>
                <div>
                  <span className="text-[8px] font-black text-slate-400 uppercase block tracking-widest">Production Turnaround</span>
                  <span className="text-sm font-black text-rose-600 uppercase">
                    {getUrgencyText(quote.quote.turnaround.urgency)}
                  </span>
                </div>
                <div>
                   <p className="text-[10px] text-slate-400 font-medium italic">
                    {quote.quote.fulfillment?.notes || 'Collection from Sandton Rivonia Branch'}
                   </p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table - Explicit Breakdown */}
          <div className="flex-grow">
            <table className="w-full">
              <thead>
                <tr className="border-y-2 border-slate-900">
                  <th className="py-5 px-3 text-left text-[10px] font-black uppercase tracking-[0.2em] w-12 text-slate-400">#</th>
                  <th className="py-5 px-3 text-left text-[10px] font-black uppercase tracking-[0.2em]">Product / Specification</th>
                  <th className="py-5 px-3 text-right text-[10px] font-black uppercase tracking-[0.2em] w-24">Quantity</th>
                  <th className="py-5 px-3 text-right text-[10px] font-black uppercase tracking-[0.2em] w-36">Rate (ZAR)</th>
                  <th className="py-5 px-3 text-right text-[10px] font-black uppercase tracking-[0.2em] w-36">Total (ZAR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quote.quote.items.map((item, index) => {
                  const lineItem = quote.quote.pricing.lineItems?.find(li => 
                    li.label.toLowerCase().includes(item.productType.toLowerCase()) || 
                    li.label.toLowerCase().includes(PRODUCT_LABELS[item.productType].toLowerCase())
                  );
                  
                  const lineTotal = lineItem ? lineItem.amount.min : (quote.quote.pricing.total.min / (quote.quote.items.length || 1));
                  const unitPrice = lineTotal / (item.quantity || 1);

                  return (
                    <tr key={index} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-7 px-3 text-sm font-black text-slate-300 align-top">{(index + 1).toString().padStart(2, '0')}</td>
                      <td className="py-7 px-3 align-top">
                        <p className="font-black text-slate-900 uppercase text-sm mb-2 leading-tight">
                          {PRODUCT_LABELS[item.productType] || item.productType}
                        </p>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider space-y-1 border-l-2 border-rose-500/20 pl-4 py-1">
                          {item.specs?.printSize && <p>Size: {item.specs.printSize}</p>}
                          {item.specs?.shirtColor && <p>Color: {item.specs.shirtColor}</p>}
                          {item.specs?.notes && <p className="italic lowercase text-slate-400 leading-normal font-medium whitespace-pre-wrap">"{item.specs.notes}"</p>}
                        </div>
                      </td>
                      <td className="py-7 px-3 text-sm text-right align-top font-black text-slate-900">{item.quantity.toLocaleString()}</td>
                      <td className="py-7 px-3 text-sm text-right align-top text-slate-500 font-medium">{formatCurrency(unitPrice)}</td>
                      <td className="py-7 px-3 text-sm text-right font-black text-slate-900 align-top">{formatCurrency(lineTotal)}</td>
                    </tr>
                  );
                })}

                {/* Additional Charges Section */}
                {quote.quote.pricing.lineItems?.filter(li => 
                  !quote.quote.items.some(it => 
                    li.label.toLowerCase().includes(it.productType.toLowerCase()) || 
                    li.label.toLowerCase().includes(PRODUCT_LABELS[it.productType].toLowerCase())
                  )
                ).map((line, idx) => (
                  <tr key={`service-${idx}`} className="bg-slate-50/50">
                    <td className="py-7 px-3 text-sm font-black text-slate-200 align-top">{(quote.quote.items.length + idx + 1).toString().padStart(2, '0')}</td>
                    <td className="py-7 px-3 align-top">
                      <p className="font-black text-slate-900 uppercase text-xs mb-1">{line.label}</p>
                      <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-1.5 py-0.5 rounded">Service Fee</span>
                    </td>
                    <td className="py-7 px-3 text-sm text-right align-top font-black">1</td>
                    <td className="py-7 px-3 text-sm text-right align-top text-slate-400 font-medium">{formatCurrency(line.amount.min)}</td>
                    <td className="py-7 px-3 text-sm text-right font-black text-slate-900 align-top">{formatCurrency(line.amount.min)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Footer */}
          <div className="mt-14 border-t-2 border-slate-900 pt-10 grid grid-cols-2 gap-12">
            <div>
              <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.25em] mb-6 border-b border-slate-200 pb-2">Business Guidelines</h4>
              <div className="space-y-4 text-[10px] leading-relaxed text-slate-500 font-bold uppercase tracking-tight">
                <p>• <span className="text-rose-600">PRODUCTION:</span> {getUrgencyText(quote.quote.turnaround.urgency)} (Approval by 10AM).</p>
                <p>• <span className="text-slate-900">DEPOSIT:</span> 65% Deposit required for orders above R5,000. Full payment required below R5,000.</p>
                <p>• <span className="text-slate-900">BANKING:</span> {BANKING_DETAILS.bank} | Acc: {BANKING_DETAILS.accountNumber} | Branch: {BANKING_DETAILS.branchCode}</p>
                <p className="italic text-slate-400 normal-case font-medium">Verified by Express Print SA System. All prices inclusive of current material rates.</p>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="w-full space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Net Investment Value</span>
                  <span className="text-slate-900">{formatCurrency(quote.quote.pricing.total.min)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest pb-4 border-b border-slate-100">
                  <span>VAT (0% Exempt)</span>
                  <span className="text-slate-900">R0.00</span>
                </div>
                <div className="flex justify-between items-center py-6 px-8 bg-slate-900 text-white rounded-3xl shadow-2xl">
                  <span className="font-black text-[11px] uppercase tracking-[0.3em] opacity-60">Total Amount Due</span>
                  <span className="text-3xl font-black">{formatCurrency(quote.quote.pricing.total.min)}</span>
                </div>
              </div>

              <div className="mt-14 text-center w-full max-w-[220px]">
                <p className="font-script text-5xl text-rose-600 leading-none mb-2">Express Print</p>
                <div className="border-b-2 border-slate-900 w-full mb-3"></div>
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Authorized Sales Consultant</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Express Print South Africa</p>
              </div>
            </div>
          </div>

          {/* Security Footer Metadata */}
          <div className="mt-auto pt-14 text-center border-t border-slate-50">
            <p className="text-[8px] text-slate-300 font-black uppercase tracking-[0.8em]">
              OFFICIAL SYSTEM OUTPUT • SANDTON BRANCH • {quote.meta.sessionId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteTemplate;