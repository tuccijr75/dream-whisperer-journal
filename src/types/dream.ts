
export type DreamMood = 'happy' | 'sad' | 'scared' | 'confused' | 'peaceful' | 'excited';

export type DreamType = 'normal' | 'lucid' | 'nightmare' | 'recurring';

export interface Dream {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string
  mood: DreamMood;
  type: DreamType;
  isStarred?: boolean;
  tags?: string[];
}
