"use client"; // Needed for state and client-side interactions

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { SearchBar } from '@/components/search/SearchBar';
import { CategoryFilter } from '@/components/common/CategoryFilter';
import { TrendingWords } from '@/components/common/TrendingWords';
import { SlangCard } from '@/components/slang/SlangCard';
import { InTheWildSection } from '@/components/slang/InTheWildSection';
import { Button } from '@/components/ui/button';
import { BoomerTranslatorModal } from '@/components/common/BoomerTranslatorModal';
import type { SlangEntry, Category, SlangInTheWild } from '@/types/slang';
import { getTweets } from '@/services/twitter';
import { getTikTokVideos } from '@/services/tiktok';
import { getRedditPosts } from '@/services/reddit';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


// Mock Data - Replace with API calls
const MOCK_SLANG_DATA: SlangEntry[] = [
  { id: '1', term: 'Rizz', definition: 'Short for charisma; the ability to charm or flirt successfully.', example: 'He\'s got unspoken rizz.', tone: 'playful', categories: ['social'], freshness: 'fresh', createdAt: new Date(2023, 5, 1), upvotes: 1502, downvotes: 55, approved: true, submittedBy: 'ZMaster', thenVsNow: { traditionalMeaning: 'Not applicable (new term)', genZMeaning: 'Skill in charming potential romantic partners.' }, origin: 'Popularized by streamer Kai Cenat'},
  { id: '2', term: 'Bussin\'', definition: 'Used to describe something that is really good, especially food.', example: 'This pizza is bussin\' bussin\'.', tone: 'sincere', categories: ['food', 'social'], freshness: 'established', createdAt: new Date(2022, 1, 10), upvotes: 987, downvotes: 102, approved: true, origin: 'African American Vernacular English (AAVE), popularized on TikTok' },
  { id: '3', term: 'Mid', definition: 'Used to describe something as mediocre or average, often unimpressive.', example: 'The movie was kinda mid, tbh.', tone: 'neutral', categories: ['social', 'internet'], freshness: 'established', createdAt: new Date(2022, 8, 20), upvotes: 765, downvotes: 88, approved: true },
  { id: '4', term: 'Bet', definition: 'An affirmation, agreement, or response meaning "Okay," "Alright," or "For sure."', example: 'Wanna grab food later? "Bet."', tone: 'neutral', categories: ['social'], freshness: 'established', createdAt: new Date(2021, 3, 5), upvotes: 1100, downvotes: 30, approved: true, thenVsNow: { traditionalMeaning: 'A wager or agreement based on an uncertain outcome.', genZMeaning: 'A simple affirmation or agreement.' } },
  { id: '5', term: 'Slay', definition: 'To do something exceptionally well; to impress or succeed.', example: 'She slayed that presentation!', tone: 'sincere', categories: ['social', 'fashion', 'emotions'], freshness: 'established', createdAt: new Date(2020, 10, 15), upvotes: 1350, downvotes: 45, approved: true, origin: 'Ballroom culture, popularized through RuPaul\'s Drag Race and general internet usage.'},
  { id: '6', term: 'NPC', definition: 'Non-Player Character; Used to describe someone who seems to lack independent thought or acts predictably, like a background character in a video game.', example: 'He just stands there nodding, total NPC vibes.', tone: 'sarcastic', categories: ['gaming', 'internet', 'social'], freshness: 'fresh', createdAt: new Date(2023, 8, 1), upvotes: 600, downvotes: 150, approved: true, origin: 'Video game terminology, adopted as internet slang.' },
   { id: '7', term: 'Skibidi', definition: 'Originating from a viral YouTube series featuring bizarre singing toilet characters. Often used nonsensically or to refer to the trend itself.', example: 'What is this skibidi toilet thing everyone is talking about?', tone: 'playful', categories: ['internet'], freshness: 'fresh', createdAt: new Date(2023, 9, 1), upvotes: 450, downvotes: 200, approved: true, origin: 'YouTube series "Skibidi Toilet" by DaFuq!?Boom!' },
];

const MOCK_TRENDING_WORDS = [
    { term: 'Rizz', id: '1' },
    { term: 'NPC', id: '6' },
    { term: 'Skibidi', id: '7' },
    { term: 'Delulu', id: '8' }, // Assuming an ID 8 exists or will be added
    { term: 'Situationship', id: '9' }, // Assuming an ID 9 exists or will be added
];

// Mock fetch function (replace with actual API call)
async function fetchSlang(term: string, categories: Category[]): Promise<SlangEntry[]> {
  console.log(`Fetching slang for term: "${term}", categories: ${categories.join(', ')}`);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

  let results = MOCK_SLANG_DATA;

  if (term) {
    results = results.filter(entry =>
      entry.term.toLowerCase().includes(term.toLowerCase()) ||
      entry.definition.toLowerCase().includes(term.toLowerCase())
    );
  }

  if (categories.length > 0) {
    results = results.filter(entry =>
      entry.categories.some(cat => categories.includes(cat))
    );
  }

   // Simulate fetching "in the wild" data for the first result if available
  if (results.length > 0) {
    const firstResultTerm = results[0].term;
    try {
        const [tweets, tiktoks, redditPosts] = await Promise.all([
            getTweets(firstResultTerm),
            getTikTokVideos(firstResultTerm),
            getRedditPosts(firstResultTerm)
        ]);
        results[0].inTheWild = { tweets, tiktoks, redditPosts };
    } catch (error) {
        console.error("Failed to fetch 'in the wild' data:", error);
        // Assign empty arrays or handle error appropriately
         results[0].inTheWild = { tweets: [], tiktoks: [], redditPosts: [] };
    }
  }


  return results;
}

// Mock upvote/downvote functions
async function handleVote(id: string, type: 'upvote' | 'downvote') {
    console.log(`${type} received for ID: ${id}`);
    // Find the item and update its count locally (in real app, call API)
    const itemIndex = MOCK_SLANG_DATA.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        if (type === 'upvote') {
            MOCK_SLANG_DATA[itemIndex].upvotes += 1;
        } else {
            MOCK_SLANG_DATA[itemIndex].downvotes += 1;
        }
        // Force re-render might be needed depending on state management
    }
     await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API call delay
    return true; // Indicate success/failure
}


export default function Home() {
  const searchParams = useSearchParams();
  const initialSearchTerm = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [slangResults, setSlangResults] = useState<SlangEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTranslatorOpen, setIsTranslatorOpen] = useState(false);

  const loadSlang = useCallback(async (term: string, categories: Category[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await fetchSlang(term, categories);
      setSlangResults(results);
    } catch (err) {
      console.error("Error fetching slang:", err);
      setError("Failed to load slang. Please try again.");
      setSlangResults([]); // Clear results on error
    } finally {
      setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    // Load initial data or based on URL search param
    loadSlang(searchTerm, selectedCategories);
  }, [loadSlang, searchTerm, selectedCategories]); // Dependencies for initial load and subsequent searches/filter changes

  const handleSearch = (newTerm: string) => {
    setSearchTerm(newTerm);
    // Optional: Update URL
    // window.history.pushState({}, '', newTerm ? `/?search=${encodeURIComponent(newTerm)}` : '/');
  };

  const handleCategoryChange = (category: Category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

   const handleUpvote = async (id: string) => {
        const success = await handleVote(id, 'upvote');
        if (success) {
            // Update local state optimistically or refetch
            setSlangResults(prev => prev.map(item => item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item));
        }
        // Handle failure (e.g., show toast)
    };

    const handleDownvote = async (id: string) => {
       const success = await handleVote(id, 'downvote');
        if (success) {
            // Update local state optimistically or refetch
            setSlangResults(prev => prev.map(item => item.id === id ? { ...item, downvotes: item.downvotes + 1 } : item));
        }
         // Handle failure (e.g., show toast)
    };

  return (
    <div className="flex flex-col min-h-screen gradient-bg">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-center mb-8">
          <SearchBar onSearch={handleSearch} initialTerm={searchTerm} />
        </div>

         <div className="mb-6 flex justify-center">
             <Button onClick={() => setIsTranslatorOpen(true)} variant="outline" className="rounded-full bg-gradient-to-r from-secondary to-accent/30 hover:opacity-90 transition-opacity border-primary/30 text-primary font-semibold shadow-sm">
                👵🏻 Boomer Translator Mode
             </Button>
        </div>

        <TrendingWords words={MOCK_TRENDING_WORDS} />

        <CategoryFilter selectedCategories={selectedCategories} onCategoryChange={handleCategoryChange} />

        {isLoading ? (
           <div className="space-y-4">
             <Skeleton className="h-64 w-full" />
             <Skeleton className="h-64 w-full" />
           </div>
        ) : error ? (
             <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        ) : slangResults.length > 0 ? (
          <div className="space-y-6">
            {slangResults.map((slang) => (
              <div key={slang.id}>
                <SlangCard slang={slang} onUpvote={handleUpvote} onDownvote={handleDownvote} />
                {/* Conditionally render "In the Wild" only for the first result for now */}
                {slangResults.length === 1 && slang.inTheWild && (
                    <InTheWildSection data={slang.inTheWild} term={slang.term} />
                )}
                {/* Or if it's the currently searched single term */}
                 {slang.term.toLowerCase() === searchTerm.toLowerCase() && slang.inTheWild && (
                    <InTheWildSection data={slang.inTheWild} term={slang.term} />
                 )}
              </div>
            ))}
          </div>
        ) : (
           <div className="text-center text-muted-foreground mt-10">
             <p className="text-lg font-medium">No results found {searchTerm ? `for "${searchTerm}"` : ''} {selectedCategories.length > 0 ? `in selected categories` : ''}.</p>
             <p className="text-sm mt-2">Try searching for another term or adjusting filters. Maybe submit this word?</p>
              {/* TODO: Add Submit New Word button here */}
           </div>
        )}

      </main>
       <footer className="text-center py-4 text-xs text-muted-foreground border-t">
            Built with 💜 for Zictionary.
        </footer>

        <BoomerTranslatorModal isOpen={isTranslatorOpen} onOpenChange={setIsTranslatorOpen} />
    </div>
  );
}
