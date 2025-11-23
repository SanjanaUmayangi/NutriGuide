export interface Tip {
  id: string;
  title: string;
  category: string;
  content: string;
  description?: string;
  source?: string;
  isBookmarked?: boolean;
  readTime?: number; // in minutes
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface TipsResponse {
  tips: Tip[];
  categories: string[];
}