import type { Tweet } from "@/services/twitter";
import type { TikTokVideo } from "@/services/tiktok";
import type { RedditPost } from "@/services/reddit";

export type Tone = 'sarcastic' | 'sincere' | 'ironic' | 'playful' | 'serious' | 'neutral';
export type Category = 'emotions' | 'social' | 'fashion' | 'gaming' | 'internet' | 'food' | 'other';
export type Freshness = 'fresh' | 'established' | 'waning' | 'cringe' | 'dead';
export type Region = 'Global' | 'US-East' | 'US-West' | 'UK' | 'AU';
export type DefinitionTag = 'funny' | 'accurate' | 'boomer-safe' | 'satirical';

export interface DefinitionDetail {
  id: string;
  definition: string;
  example: string;
  tone: Tone;
  tags?: DefinitionTag[];
  upvotes: number;
  downvotes: number;
  submittedBy?: string;
  createdAt: Date;
}

export interface SlangDefinition {
  id: string;
  term: string;
  definition: string; // Main/Top definition
  example: string; // Main/Top example
  tone: Tone; // Main/Top tone
  categories: Category[];
  freshness: Freshness;
  region: Region;
  origin?: string; // Optional: TikTok trend, meme, artist, etc.
  createdAt: Date; // To track trending/new submissions
  upvotes: number; // Overall term upvotes (or votes for the main definition)
  downvotes: number; // Overall term downvotes
  submittedBy?: string; // Optional: User ID or name of main definition submitter
  approved: boolean; // For moderation
  thenVsNow?: {
    traditionalMeaning: string;
    genZMeaning: string;
  };
  pronunciationUrl?: string; // Optional URL for audio playback
  communityDefinitions?: DefinitionDetail[]; // Array for community submissions
}

export interface SlangInTheWild {
  tweets: Tweet[];
  tiktoks: TikTokVideo[];
  redditPosts: RedditPost[];
}

export interface SlangEntry extends SlangDefinition {
  inTheWild?: SlangInTheWild; // Make it optional as fetching might fail or not exist
}

export interface SlangBattlePair {
  id: string;
  term1: Pick<SlangEntry, 'id' | 'term'>;
  term2: Pick<SlangEntry, 'id' | 'term'>;
  question: string; // e.g., "Which one's still fire?"
}

export interface BoomerTrap {
    id: string;
    term: string;
    correctUsage: string;
    incorrectUsageExample: string;
    explanation: string; // Why it's wrong/funny
}
