
export enum ProductType {
  TSHIRT_FRONT = 'tshirt_print_front',
  BUSINESS_CARDS_500 = 'business_cards_500',
  A1_SELFIE_FRAME = 'a1_selfie_frame',
  NOVELTY_CHEQUE = 'novelty_cheque',
  PULL_UP_BANNER = 'pull_up_banner_2000x850',
  WALL_BANNER = 'wall_banner_3000x2250',
  SHARKFIN_FLAG = 'sharkfin_flag_3m',
  GAZEBO_3X3 = 'gazebo_3x3',
  FLYERS_A5 = 'flyers_a5',
  FLYERS_A6 = 'flyers_a6',
  POSTERS_A3 = 'posters_a3',
  POSTERS_A2 = 'posters_a2',
  POSTERS_A1 = 'posters_a1',
  POSTERS_A0 = 'posters_a0',
  BOOKLETS = 'booklets',
  FOLDERS = 'presentation_folders',
  STICKERS_VINYL = 'stickers_vinyl',
  SCRATCH_CARDS = 'scratch_cards',
  PLASTIC_BREAD_BAGS = 'plastic_bread_bags',
  PLASTIC_CARDS = 'plastic_cards',
  TISSUE_WRAP_2 = 'tissue_wrap_2pk',
  TISSUE_WRAP_4 = 'tissue_wrap_4pk',
  TISSUE_WRAP_6 = 'tissue_wrap_6pk',
  TISSUE_WRAP_12 = 'tissue_wrap_12pk',
  TISSUE_WRAP_18 = 'tissue_wrap_18pk',
  TISSUE_WRAP_24 = 'tissue_wrap_24pk',
  TISSUE_WRAP_48 = 'tissue_wrap_48pk',
  CHROMADECK_1800 = 'chromadeck_1800x920',
  CHROMADECK_2450 = 'chromadeck_2450x1225',
  CHROMADECK_3000 = 'chromadeck_3000x1225',
  SIGN_POLES = 'sign_poles_3m',
  SIGN_FRAME = 'sign_steel_frame',
  ROAD_SIGN_600 = 'road_sign_600mm',
  ROAD_SIGN_900 = 'road_sign_900mm',
  ROAD_SIGN_1200 = 'road_sign_1200mm',
  GALV_POLE_3M = 'galvanised_pole_3m',
  SIGN_CLAMPS = 'heavy_duty_clamps',
  DESIGN_BUSINESS_CARD = 'design_business_card',
  DESIGN_FLYER_A5 = 'design_flyer_a5',
  DESIGN_FLYER_A4 = 'design_flyer_a4',
  DESIGN_POSTER_A2 = 'design_poster_a2',
  DESIGN_POSTER_A1 = 'design_poster_a1',
  DESIGN_POSTER_A0 = 'design_poster_a0',
  DESIGN_LOGO = 'design_logo',
  DESIGN_COMPANY_PROFILE = 'design_company_profile',
  DESIGN_WEBSITE = 'design_website',
  DESIGN_BROCHURE = 'design_brochure',
  DESIGN_CORP_IDENTITY = 'design_corporate_identity'
}

export enum ArtworkStatus {
  PROVIDED = 'provided',
  TO_BE_SENT = 'to_be_sent',
  NEEDS_ASSISTANCE = 'needs_assistance'
}

export enum FulfillmentMethod {
  PICKUP = 'pickup',
  DELIVERY = 'delivery',
  INSTALLATION_REQUIRED = 'installation_required'
}

export enum Urgency {
  SAME_DAY = 'same_day',
  TWENTY_THREE_HOURS = '23_hours',
  THREE_TO_FIVE_DAYS = '3_5_days',
  ONE_TO_FOURTEEN_DAYS = '1_14_days',
  STANDARD = 'standard',
  URGENT = 'urgent'
}

export interface MoneyRange {
  min: number;
  max: number;
}

export interface QuoteItem {
  productType: ProductType;
  quantity: number;
  specs?: {
    printSize?: 'A6' | 'A5' | 'A4' | 'A3' | 'A2' | string;
    sides?: 'single_sided' | 'double_sided';
    shirtColor?: string;
    notes?: string;
  };
}

export type DocumentType = 'QUOTATION' | 'INVOICE';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  requestSummary: string;
  timestamp: string;
  totalEstimate: number;
  status: 'new' | 'contacted' | 'converted';
  quoteData: QuoteRequest;
  docType?: DocumentType;
}

export interface QuoteRequest {
  meta: {
    source: 'website_chat' | 'whatsapp_chat' | 'email_form' | 'manual_entry';
    createdAt: string;
    currency: 'ZAR';
    version: '1.0.0';
    sessionId: string;
    language: string;
    docType?: DocumentType;
  };
  customer: {
    name: string;
    company?: string;
    phone?: string;
    email?: string;
    preferredContactTime?: string;
  };
  deliveryPreference: {
    channel: 'whatsapp' | 'email';
    whatsapp?: { toNumber: string };
    email?: { toAddress: string };
  };
  quote: {
    items: QuoteItem[];
    pricing: {
      estimateType: 'range';
      total: MoneyRange;
      lineItems?: Array<{ label: string; amount: MoneyRange }>;
      notes?: string[];
      disclaimer: string;
    };
    turnaround: {
      urgency: Urgency;
      estimate: {
        minBusinessDays: number;
        maxBusinessDays: number;
      };
      deadline?: string;
    };
    artwork: {
      status: ArtworkStatus;
      designBrief?: string;
    };
    fulfillment?: {
      method: FulfillmentMethod;
      location?: string;
      notes?: string;
    };
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  quoteData?: QuoteRequest;
  isAttachment?: boolean;
  fileName?: string;
}
