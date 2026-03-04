
import React from 'react';

export const COLORS = {
  primary: '#e11d48', // Expressive Red
  secondary: '#1e293b', // Deep Slate
  accent: '#f59e0b', // Amber
};

export const COMPANY_DETAILS = {
  name: 'EXPRESS PRINT SOUTH AFRICA',
  salesWhatsapp1: '+27631328088',
  salesWhatsapp2: '+27677410422',
  adminPhone: '+2773 625 5637',
  email: 'info@expressprint.co.za',
  website: 'www.expressprint.co.za',
  address: 'Shop: L23, Rivonia Central, Oriental City Rivonia. Corner Rivonia Boulevard and 9th Ave, Rivonia, Sandton, 2128 (OPPOSITE NEWSCAFE RIVONIA)',
};

export const BANKING_DETAILS = {
  bank: 'FNB BANK',
  accountType: 'CHEQUE ACCOUNT',
  accountNumber: '62843156747',
  branchCode: '254405',
  swift: 'FIRNZAJJ',
  accountName: 'BOLDMEDIA BRANDING (PVT) LTD T/A EXPRESS PRINT',
};

export const PRODUCT_LABELS: Record<string, string> = {
  tshirt_print_front: 'T-Shirt (Front Print)',
  business_cards_500: '500 Business Cards',
  a1_selfie_frame: 'A1 Selfie Frame',
  novelty_cheque: 'Novelty Cheque',
  pull_up_banner_2000x850: 'Pull-up Banner (2000x850)',
  wall_banner_3000x2250: 'Wall Banner (3x2.25m)',
  sharkfin_flag_3m: '3m Sharkfin Flag',
  gazebo_3x3: '3x3 Gazebo',
  flyers_a5: 'A5 Flyers',
  flyers_a6: 'A6 Flyers',
  posters_a3: 'A3 Posters',
  posters_a2: 'A2 Posters',
  posters_a1: 'A1 Posters',
  posters_a0: 'A0 Posters',
  booklets: 'Booklets/Catalogues',
  presentation_folders: 'Presentation Folders',
  stickers_vinyl: 'Vinyl Stickers',
  scratch_cards: 'Scratch Cards',
  plastic_bread_bags: 'Plastic Bread Bags (Branded)',
  plastic_cards: 'Plastic Cards (PVC)',
  tissue_wrap_2pk: 'Tissue Wrap (2-Pack Retail)',
  tissue_wrap_4pk: 'Tissue Wrap (4-Pack Retail)',
  tissue_wrap_6pk: 'Tissue Wrap (6-Pack Retail)',
  tissue_wrap_12pk: 'Tissue Wrap (12-Pack Retail)',
  tissue_wrap_18pk: 'Tissue Wrap (18-Pack Retail)',
  tissue_wrap_24pk: 'Tissue Wrap (24-Pack Retail)',
  tissue_wrap_48pk: 'Tissue Wrap (48-Pack Retail)',
  chromadeck_1800x920: 'Chromadeck Sign (1800x920mm)',
  chromadeck_2450x1225: 'Chromadeck Sign (2450x1225mm)',
  chromadeck_3000x1225: 'Chromadeck Sign (3000x1225mm)',
  sign_poles_3m: 'Steel Poles (3m)',
  sign_steel_frame: 'Steel Sign Frame',
  road_sign_600mm: '600mm Road Sign (Reflective)',
  road_sign_900mm: '900mm Road Sign (Reflective)',
  road_sign_1200mm: '1200mm Road Sign (Reflective)',
  galvanised_pole_3m: '3m Galvanised Pole',
  heavy_duty_clamps: 'Heavy-Duty Clamps (Set)',
  design_business_card: 'Professional Business Card Design',
  design_flyer_a5: 'A5 Flyer Layout & Design',
  design_flyer_a4: 'A4 Flyer Layout & Design',
  design_poster_a2: 'A2 Poster Graphic Design',
  design_poster_a1: 'A1 Poster Graphic Design',
  design_poster_a0: 'A0 Poster Graphic Design',
  design_logo: 'Custom Logo Design & Concept',
  design_company_profile: 'Corporate Company Profile Design',
  design_website: 'Responsive Website Design',
  design_brochure: 'Custom Brochure Layout (Hourly)',
  design_corporate_identity: 'Full Corporate Identity Pack'
};

export const Icons = {
  Logo: ({ className = "w-10 h-10", customSrc }: { className?: string, customSrc?: string | null }) => (
    <div className={`flex items-center gap-2 ${className}`}>
      {customSrc ? (
        <img src={customSrc} alt="Logo" className="w-12 h-12 object-contain rounded-xl shadow-lg bg-white p-1" />
      ) : (
        <div className="bg-rose-600 text-white p-2 rounded-xl shadow-lg flex items-center justify-center transform hover:rotate-3 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5"/><rect x="6" y="14" width="12" height="8" rx="2"/></svg>
        </div>
      )}
      <div className="flex flex-col leading-none text-left whitespace-nowrap">
        <span className="font-black text-xl tracking-tighter text-slate-900 uppercase">Express</span>
        <span className="font-black text-xl tracking-tighter text-rose-600 uppercase">Print</span>
      </div>
    </div>
  ),
  Send: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
  ),
  Printer: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5"/><rect x="6" y="14" width="12" height="8" rx="2"/></svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Bot: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
  ),
  MapPin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  ),
  Truck: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5h-7v6h4Z"/><path d="M13 9h4l3 3"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
  ),
  FileText: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
  ),
  Layout: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
  ),
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  LogOut: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
  ),
  Message: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  ),
  External: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
  ),
  Paperclip: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
  ),
  Mail: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  ),
  Phone: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  ),
  WhatsApp: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.187-2.59-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.512-2.96-2.626-.087-.114-.694-.924-.694-1.762 0-.837.44-1.246.596-1.413.155-.167.336-.209.449-.209.112 0 .225.001.322.005.101.004.237-.038.371.288.134.326.46 1.12.5 1.196.04.077.066.166.015.269-.051.103-.077.167-.154.256-.076.09-.161.2-.231.269-.087.086-.178.18-.077.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.088.275.073.376-.044.101-.117.433-.505.549-.677.117-.172.235-.144.394-.087.158.058 1.004.474 1.178.561.174.088.29.131.332.202.041.07.041.408-.103.813zM12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"/></svg>
  ),
  Zap: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
  ),
  TrendingUp: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
  ),
  Edit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121(0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
  ),
  Copy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
  ),
  Image: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
  )
};
