import type { Tweet } from "@/services/twitter";
import type { TikTokVideo } from "@/services/tiktok";
import type { RedditPost } from "@/services/reddit";

export type Tone = 'sarcastic' | 'sincere' | 'ironic' | 'playful' | 'serious' | 'neutral';
export type Category = 'emotions' | 'social' | 'fashion' | 'gaming' | 'internet' | 'food' | 'other';
export type Freshness = 'fresh' | 'established' | 'waning' | 'cringe' | 'dead';

export interface SlangDefinition {
  id: string;
  term: string;
  definition: string;
  example: string;
  tone: Tone;
  categories: Category[];
  freshness: Freshness;
  origin?: string; // Optional: TikTok trend, meme, artist, etc.
  createdAt: Date; // To track trending/new submissions
  upvotes: number;
  downvotes: number;
  submittedBy?: string; // Optional: User ID or name
  approved: boolean; // For moderation
  thenVsNow?: {
    traditionalMeaning: string;
    genZMeaning: string;
  };
  pronunciationUrl?: string; // Optional URL for audio playback
}

export interface SlangInTheWild {
  tweets: Tweet[];
  tiktoks: TikTokVideo[];
  redditPosts: RedditPost[];
}

export interface SlangEntry extends SlangDefinition {
  inTheWild?: SlangInTheWild; // Make it optional as fetching might fail or not exist
}
