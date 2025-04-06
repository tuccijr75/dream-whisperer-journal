
export type DreamMood = 'happy' | 'sad' | 'scared' | 'confused' | 'peaceful' | 'excited';

export type DreamType = 'normal' | 'lucid' | 'nightmare' | 'recurring';

export type DreamCategory = 'personal' | 'adventure' | 'fantasy' | 'childhood' | 'spiritual' | 'premonition' | 'uncategorized';

export interface Dream {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string
  mood: DreamMood;
  type: DreamType;
  category: DreamCategory;
  isStarred?: boolean;
  tags?: string[];
  interpretation?: string;
  imageUrl?: string; // URL to AI-generated image
  isPublic?: boolean; // Whether the dream can be shared
}
