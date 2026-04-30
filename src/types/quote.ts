export interface QuoteData {
  clientName: string;
  clientEmail?: string;
  clientCompany?: string;
  projectTitle: string;
  projectDescription: string;
  features: QuoteFeature[];
  price: number;
  currency: 'USD' | 'PEN';
  deliveryTime: string;
  includes: string[];
  notes?: string[];
  date?: string;
}

export interface QuoteFeature {
  icon: string;
  title: string;
  description: string;
  items?: string[];
}

export interface QuoteSectionData {
  title: string;
  items: string[];
}
