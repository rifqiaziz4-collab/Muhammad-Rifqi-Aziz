export type ArticleType = "journal" | "blog";

export interface ArticleSection {
  heading: string;
  content: string;
}

export interface Article {
  id: string;
  type: ArticleType;
  title: string;
  author: string;
  affiliation?: string;
  publishDate: string;
  abstract?: string; // Optional for blog, required for journal
  abstractEn?: string; // English abstract for journals
  keywords?: string[]; // Keywords for journals
  sections: ArticleSection[]; // Clear structural sections: Pendahuluan, Metode, dll.
  references?: string[]; // References/Daftar Pustaka
  doi?: string; // Digital Object Identifier
  volume?: string; // e.g., Vol. 1, No. 2 (2026)
  category: string;
  tags: string[];
  viewCount: number;
  citationCount?: number;
  readingTime: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface CitationStyle {
  name: string;
  format: string;
}
