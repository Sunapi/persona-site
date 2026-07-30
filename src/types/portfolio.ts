export interface PortfolioImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export type Locale = 'en' | 'fi' | 'uk' | 'ru';
export type ProjectLevel = 'eco' | 'std' | 'prem' | '';

export interface PortfolioCategory {
  id: number;
  slug: string;
  name: string;
  sort: number;
  count: number;
  cover: PortfolioImage | null;
}

export interface PortfolioProject {
  id: number;
  slug: string;
  name: string;
  category: Omit<PortfolioCategory, 'count' | 'cover'>;
  article: string;
  type: string;
  size: string;
  cover: PortfolioImage | null;
  images: PortfolioImage[];
}

export interface PortfolioData {
  categories: PortfolioCategory[];
  projects: PortfolioProject[];
  summary: {
    projects: number;
    categories: number;
    galleryImages: number;
    uniqueGalleryAssets: number;
    failures: unknown[];
  };
}

export interface LocalizedProjectText {
  name: string;
}
