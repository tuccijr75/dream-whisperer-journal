
export type DreamMood = 'happy' | 'sad' | 'scared' | 'confused' | 'peaceful' | 'excited';

export type DreamType = 'normal' | 'lucid' | 'nightmare' | 'recurring';

export type DreamCategory = 'personal' | 'adventure' | 'fantasy' | 'childhood' | 'spiritual' | 'premonition' | 'uncategorized';

export interface DreamComment {
  id: string;
  text: string;
  author: string;
  date: string; // ISO string
}

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
  comments?: DreamComment[]; // Comments on the dream
  challengeId?: string; // Reference to a challenge
}

export interface DreamTemplate {
  id: string;
  name: string;
  description: string;
  mood: DreamMood;
  type: DreamType;
  category: DreamCategory;
  tags: string[];
}

export interface DreamReminder {
  id: string;
  time: string; // HH:MM format
  days: number[]; // 0-6 (Sunday-Saturday)
  enabled: boolean;
  sound: 'gentle' | 'nature' | 'crystal' | 'none';
  volume: number; // 0-100
}

// Dream challenge types
export interface DreamChallenge {
  id: string;
  title: string;
  description: string;
  prompt: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  type: 'daily' | 'weekly';
  isActive: boolean;
  participants?: number; // Number of users who have accepted the challenge
  completions?: number; // Number of dreams created for this challenge
}

// Add calendar-related types
export interface CalendarHighlightedDay {
  date: Date;
  color?: string;
  backgroundColor?: string;
}
