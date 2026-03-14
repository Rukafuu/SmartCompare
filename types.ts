
export interface Smartphone {
  id: string;
  model: string;
  brand: string;
  processor: string;
  clockSpeed: string;
  screenSize: number;
  ram: {
    physical: number;
    virtual: number;
    total: number;
  };
  storage: number;
  nfc: boolean;
  is5G: boolean;
  battery: number;
  frontCamera: string;
  rearCamera: string;
  refreshRate: string;
  protection: string;
  screenType: string;
  antutu: number;
  isAnatelCertified: boolean;
  anatelCertificate?: string; // Número do certificado Anatel
  officialDistributor: string;
  imageUrl?: string;
  dataSource?: 'AI_REALTIME' | 'DATABASE_CACHE';
  confidenceScore?: number;
}

export interface ComparisonRanking {
  bestProcessor: string;
  bestRam: string;
  bestBattery: string;
  bestCamera: string;
  bestDisplay: string;
  bestAntutu: string;
}
