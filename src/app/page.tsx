
"use client"; // Needed for state and client-side interactions
import React, { useState, useEffect, useCallback, Suspense } from 'react'; // Ensure React and Suspense are imported
import Link from 'next/link'; // Ensure Link is imported
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { SearchBar } from '@/components/search/SearchBar';
import { CategoryFilter } from '@/components/common/CategoryFilter';
import { RegionalFilter } from '@/components/common/RegionalFilter';
import { TrendingWords } from '@/components/common/TrendingWords';
import { SlangCard } from '@/components/slang/SlangCard';
import { CommunityDefinitions } from '@/components/slang/CommunityDefinitions';
import { InTheWildSection } from '@/components/slang/InTheWildSection';
import { Button } from '@/components/ui/button';
import { BoomerTranslatorModal } from '@/components/common/BoomerTranslatorModal';
import { SlangGeneratorModal } from '@/components/ai/SlangGeneratorModal';
import { SlangBattleCard } from '@/components/gamification/SlangBattleCard';
import type { SlangEntry, Category, SlangInTheWild, Region, SlangBattlePair, DefinitionDetail } from '@/types/slang';
import { getTweets } from '@/services/twitter';
import { getTikTokVideos } from '@/services/tiktok';
import { getRedditPosts } from '@/services/reddit';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Bot, PlusCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from '@/components/ui/separator';
import { defineSlang, DefineSlangInput, DefineSlangOutput } from '@/ai/flows/define-slang-flow'; // Import AI definition flow
import { useToast } from '@/hooks/use-toast'; // Import useToast

// --- Mock Data (Initial State) ---
const INITIAL_MOCK_SLANG_DATA: SlangEntry[] = [
  { id: '1', term: 'Rizz', definition: 'Short for charisma; the ability to charm or flirt successfully.', example: 'He\'s got unspoken rizz.', tone: 'playful', categories: ['social'], freshness: 'fresh', region: 'Global', createdAt: new Date(2023, 5, 1), upvotes: 1502, downvotes: 55, approved: true, submittedBy: 'ZMaster', thenVsNow: { traditionalMeaning: 'Not applicable (new term)', genZMeaning: 'Skill in charming potential romantic partners.' }, origin: 'Popularized by streamer Kai Cenat',
    communityDefinitions: [
        { id: 'def1-1', definition: "Like, when someone's smooth with words and actions, especially when flirting.", example: "Dude walked up to her and just started rizzing, it was wild.", tone: 'playful', tags: ['accurate'], upvotes: 120, downvotes: 5, submittedBy: 'User123', createdAt: new Date(2023, 6, 10) },
        { id: 'def1-2', definition: "It's the aura someone gives off that makes people attracted to them, doesn't even have to be romantic.", example: "The way she commands the room? Pure rizz.", tone: 'sincere', tags: ['accurate', 'funny'], upvotes: 85, downvotes: 2, submittedBy: 'AnotherUser', createdAt: new Date(2023, 6, 15) }
    ]
  },
  { id: '2', term: 'Bussin\'', definition: 'Used to describe something that is really good, especially food.', example: 'This pizza is bussin\' bussin\'.', tone: 'sincere', categories: ['food', 'social'], freshness: 'established', region: 'US-East', createdAt: new Date(2022, 1, 10), upvotes: 987, downvotes: 102, approved: true, origin: 'African American Vernacular English (AAVE), popularized on TikTok' },
  { id: '3', term: 'Mid', definition: 'Used to describe something as mediocre or average, often unimpressive.', example: 'The movie was kinda mid, tbh.', tone: 'neutral', categories: ['social', 'internet'], freshness: 'established', region: 'Global', createdAt: new Date(2022, 8, 20), upvotes: 765, downvotes: 88, approved: true },
  { id: '4', term: 'Bet', definition: 'An affirmation, agreement, or response meaning "Okay," "Alright," or "For sure."', example: 'Wanna grab food later? "Bet."', tone: 'neutral', categories: ['social'], freshness: 'established', region: 'Global', createdAt: new Date(2021, 3, 5), upvotes: 1100, downvotes: 30, approved: true, thenVsNow: { traditionalMeaning: 'A wager or agreement based on an uncertain outcome.', genZMeaning: 'A simple affirmation or agreement.' } },
  { id: '5', term: 'Slay', definition: 'To do something exceptionally well; to impress or succeed.', example: 'She slayed that presentation!', tone: 'sincere', categories: ['social', 'fashion', 'emotions'], freshness: 'established', region: 'Global', createdAt: new Date(2020, 10, 15), upvotes: 1350, downvotes: 45, approved: true, origin: 'Ballroom culture, popularized through RuPaul\'s Drag Race and general internet usage.'},
  { id: '6', term: 'NPC', definition: 'Non-Player Character; Used to describe someone who seems to lack independent thought or acts predictably, like a background character in a video game.', example: 'He just stands there nodding, total NPC vibes.', tone: 'sarcastic', categories: ['gaming', 'internet', 'social'], freshness: 'fresh', region: 'Global', createdAt: new Date(2023, 8, 1), upvotes: 600, downvotes: 150, approved: true, origin: 'Video game terminology, adopted as internet slang.' },
   { id: '7', term: 'Skibidi', definition: 'Originating from a viral YouTube series featuring bizarre singing toilet characters. Often used nonsensically or to refer to the trend itself.', example: 'What is this skibidi toilet thing everyone is talking about?', tone: 'playful', categories: ['internet'], freshness: 'fresh', region: 'Global', createdAt: new Date(2023, 9, 1), upvotes: 450, downvotes: 200, approved: true, origin: 'YouTube series "Skibidi Toilet" by DaFuq!?Boom!' },
   { id: '10', term: 'Ate', definition: 'Similar to "slay," meaning someone did something extremely well or looked amazing.', example: "She absolutely ate that performance.", tone: 'sincere', categories: ['social', 'fashion'], freshness: 'fresh', region: 'Global', createdAt: new Date(2023, 11, 1), upvotes: 950, downvotes: 35, approved: true, origin: 'AAVE, popularized online.' },
];
const MOCK_TRENDING_WORDS = [
    { term: 'Rizz', id: '1' },
    { term: 'NPC', id: '6' },
    { term: 'Ate', id: '10' },
    { term: 'Delulu', id: '8' }, // Assuming an ID 8 exists or will be added
    { term: 'Situationship', id: '9' }, // Assuming an ID 9 exists or will be added
];
const MOCK_BATTLE: SlangBattlePair = {
    id: 'battle1',
    term1: { id: '5', term: 'Slay' },
    term2: { id: '10', term: 'Ate' },
    question: "Which one's currently hitting harder?",
};

// --- Component Wrapper for Suspense ---
// Next.js recommends using Suspense at the layout level or higher
// but for client components needing searchParams, wrapping the component using them is necessary.
function HomePageContent() {
  const searchParams = useSearchParams();
  const initialSearchTerm = searchParams?.get('search') || '';
  const initialRegion = (searchParams?.get('region') as Region) || 'Global';

  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region>(initialRegion);
  const [slangResults, setSlangResults] = useState<SlangEntry[]>([]);
  const [allSlangData, setAllSlangData] = useState<SlangEntry[]>(INITIAL_MOCK_SLANG_DATA);
  const [currentBattle, setCurrentBattle] = useState<SlangBattlePair | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isBattleLoading, setIsBattleLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTranslatorOpen, setIsTranslatorOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const { toast } = useToast();


  // --- Mock Fetch Functions (Now using allSlangData state) ---
  const fetchSlang = useCallback(async (term: string, categories: Category[], region: Region): Promise<SlangEntry[]> => {
      console.log(`Fetching slang for term: "${term}", categories: ${categories.join(', ')}, region: ${region}`);
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

      let results = allSlangData.filter(entry => entry.region === region || entry.region === 'Global' || entry.region === 'Unknown'); // Include 'Unknown' region

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

      // Simulate fetching "in the wild" data for the first result if available and it's a single result search
      if (results.length === 1 && term) {
          const firstResultTerm = results[0].term;
          try {
              console.log(`Fetching 'in the wild' for: ${firstResultTerm}`);
              // Use Promise.allSettled for resilience if one API fails
              const settledResults = await Promise.allSettled([
                  getTweets(firstResultTerm),
                  getTikTokVideos(firstResultTerm),
                  getRedditPosts(firstResultTerm)
              ]);

              const tweets = settledResults[0].status === 'fulfilled' ? settledResults[0].value : [];
              const tiktoks = settledResults[1].status === 'fulfilled' ? settledResults[1].value : [];
              const redditPosts = settledResults[2].status === 'fulfilled' ? settledResults[2].value : [];

              // Create a new object for the result to avoid direct mutation
              results[0] = { ...results[0], inTheWild: { tweets, tiktoks, redditPosts } };

              // Log errors for failed fetches
              settledResults.forEach((result, index) => {
                if (result.status === 'rejected') {
                  const serviceName = ['Twitter', 'TikTok', 'Reddit'][index];
                  console.error(`Failed to fetch 'in the wild' data from ${serviceName}:`, result.reason);
                }
              });

          } catch (error) { // Catch potential errors in Promise.allSettled itself (unlikely)
              console.error("Unexpected error fetching 'in the wild' data:", error);
              results[0] = { ...results[0], inTheWild: { tweets: [], tiktoks: [], redditPosts: [] } };
          }
      } else if (results.length > 0) {
          // Clear inTheWild if it's not a single specific search result
           results = results.map(r => {
               const { inTheWild, ...rest } = r; // Destructure to remove inTheWild
               return rest;
           });
      }

      return results;
  }, [allSlangData]); // Depend on allSlangData

  // Function to generate AI definition
  const generateAIDefinition = useCallback(async (term: string): Promise<SlangEntry | null> => {
      console.log(`Generating AI definition for: "${term}"`);
      try {
          const input: DefineSlangInput = { term };
          const output: DefineSlangOutput = await defineSlang(input);

          // Create a SlangEntry object from the AI output
          const aiEntry: SlangEntry = {
              id: `ai-${term.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`, // Generate a unique ID
              term: term, // Use the original searched term for consistency
              definition: output.definition,
              example: output.example,
              tone: output.tone,
              categories: output.categories,
              freshness: output.freshness,
              region: 'Unknown', // AI doesn't determine region yet
              createdAt: new Date(),
              upvotes: 0, // AI entries start with 0 votes
              downvotes: 0,
              submittedBy: 'Zictionary AI',
              approved: true, // Assume AI definitions are approved
              isAIGenerated: true, // Flag as AI generated
              // AI doesn't provide these details
              origin: undefined,
              thenVsNow: undefined,
              pronunciationUrl: undefined,
              communityDefinitions: [],
              inTheWild: undefined, // No "in the wild" for AI generated on the fly
          };
          return aiEntry;
      } catch (err) {
          console.error(`AI definition generation failed for "${term}":`, err);
          toast({ // Inform user about AI failure
            variant: "destructive",
            title: "AI Generation Failed",
            description: `Could not generate a definition for "${term}". Please try again later.`,
          });
          return null;
      }
  }, [toast]); // Added toast dependency

  // Define loadSlang before handleVote which uses it in dependencies
  const loadSlang = useCallback(async (term: string, categories: Category[], region: Region) => {
    setIsLoading(true);
    setIsGeneratingAI(false); // Reset AI generating state
    setError(null);
    // setSlangResults([]); // Clear previous results visually later if needed, or keep for smoother transition

    try {
      let results = await fetchSlang(term, categories, region);

      // If no results found and a specific term was searched, try AI generation
      // Only trigger AI if specific conditions are met (term exists, no categories, global region)
      if (results.length === 0 && term.trim() && categories.length === 0 && region === 'Global') {
        console.log(`No results for "${term}", attempting AI generation...`);
        setIsGeneratingAI(true); // Set AI generating state
        const aiResult = await generateAIDefinition(term.trim());
         setIsGeneratingAI(false); // Unset AI generating state after attempt
        if (aiResult) {
            console.log(`AI generated definition for "${term}" successfully.`);
            results = [aiResult]; // Use AI result
             // Optionally add the AI result to the main data pool if desired (consider implications)
            // setAllSlangData(prev => [...prev, aiResult]);
        } else {
            console.log(`AI generation failed or returned null for "${term}".`);
             // Keep results empty to show "No results found" message
             results = []; // Explicitly set to empty array
        }
      }

      setSlangResults(results);
    } catch (err) {
      console.error("Error fetching slang:", err);
      setError("Failed to load slang. The vibes might be off, try again?");
      setSlangResults([]); // Clear results on error
    } finally {
      setIsLoading(false);
      setIsGeneratingAI(false); // Ensure AI generating state is false at the end
    }
  }, [fetchSlang, generateAIDefinition]); // Added dependencies

  // Mock upvote/downvote functions (Updates allSlangData state)
   const handleVote = useCallback(async (id: string, type: 'upvote' | 'downvote', target: 'term' | 'definition', definitionId?: string): Promise<boolean> => {
    console.log(`${type} received for ${target} ID: ${id}` + (definitionId ? ` (Def ID: ${definitionId})` : ''));
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API call delay

    let updated = false;
    let voteDisabled = false; // Flag to check if voting was disabled

    setAllSlangData(prevData => {
        const newData = prevData.map(item => {
            if (item.id === id) {
                 // Cannot vote on AI generated entries for now
                if (item.isAIGenerated) {
                    console.log("Voting disabled for AI generated entries.");
                    voteDisabled = true; // Set the flag
                    return item; // Return unchanged item
                }

                if (target === 'term') {
                    updated = true;
                    return {
                        ...item,
                        upvotes: type === 'upvote' ? item.upvotes + 1 : item.upvotes,
                        downvotes: type === 'downvote' ? item.downvotes + 1 : item.downvotes,
                    };
                } else if (target === 'definition' && definitionId && item.communityDefinitions) {
                    const newDefs = item.communityDefinitions.map(def => {
                        if (def.id === definitionId) {
                            updated = true;
                            return {
                                ...def,
                                upvotes: type === 'upvote' ? def.upvotes + 1 : def.upvotes,
                                downvotes: type === 'downvote' ? def.downvotes + 1 : def.downvotes,
                            };
                        }
                        return def;
                    });
                    return { ...item, communityDefinitions: newDefs };
                }
            }
            return item;
        });
        return newData;
    });

    // Show toast only if voting was attempted but disabled
    if (voteDisabled) {
        toast({
            variant: "destructive",
            title: "Voting Disabled",
            description: "Can't vote on AI-generated entries.",
        });
        return false; // Indicate vote failed because it was disabled
    }


    // After state update, trigger a re-fetch/filter of slangResults
    // This ensures the UI reflects the change from allSlangData
    if (updated) {
        // Re-run the filter/fetch logic based on current search/filter state
        loadSlang(searchTerm, selectedCategories, selectedRegion);
    }

    return updated; // Indicate success/failure based on whether state was potentially changed
   }, [toast, loadSlang, searchTerm, selectedCategories, selectedRegion]); // Add dependencies


  const fetchBattle = useCallback(async (): Promise<SlangBattlePair | null> => {
      console.log("Fetching slang battle");
      await new Promise(resolve => setTimeout(resolve, 300));
      // In a real app, fetch a random or current battle
       // Basic error simulation
       if (Math.random() < 0.1) { // 10% chance of error
         throw new Error("Failed to fetch battle - Network Glitch");
       }
      return MOCK_BATTLE;
  }, []);


  const handleBattleVote = useCallback(async (battleId: string, winningTermId: string): Promise<void> => {
      console.log(`Processing vote for battle ${battleId}, winner: ${winningTermId}`);
      await new Promise(resolve => setTimeout(resolve, 200));
      // In real app: Record vote, update stats, maybe fetch next battle
      const winningTerm = allSlangData.find(s=>s.id === winningTermId)?.term;
      if (winningTerm) {
        toast({
            title: "Vote Recorded!",
            description: `You voted for "${winningTerm}".`,
        });
      } else {
          console.warn("Winning term not found for toast notification");
      }
        // Optionally fetch a new battle after voting
        // loadBattle();
  }, [toast, allSlangData]); // Add toast dependency


   const loadBattle = useCallback(async () => {
    setIsBattleLoading(true);
    try {
        const battle = await fetchBattle();
        setCurrentBattle(battle);
    } catch (err) {
        console.error("Error fetching battle:", err);
        setError(prev => prev ? `${prev} | Failed to load battle.` : "Failed to load battle."); // Append or set error
        setCurrentBattle(null); // Ensure battle is null on error
    } finally {
        setIsBattleLoading(false);
    }
   }, [fetchBattle]); // Added fetchBattle dependency

  useEffect(() => {
    // Initial load based on URL params
    loadSlang(searchTerm, selectedCategories, selectedRegion);
    loadBattle(); // Load battle on initial mount

     // Only update URL if searchParams is available (client-side)
     if (searchParams) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) params.set('search', searchTerm); else params.delete('search');
        if (selectedRegion !== 'Global') params.set('region', selectedRegion); else params.delete('region');
        // Add category params later if needed

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        // Use replaceState to avoid adding to browser history for filter/search changes
        window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
     }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadSlang, loadBattle, searchTerm, selectedCategories, selectedRegion]); // Only run on relevant state changes, loadSlang/loadBattle have their own deps

  // Separate effect for just updating URL on param changes to avoid re-running fetches unnecessarily
  useEffect(() => {
     if (typeof window !== 'undefined') {
         const params = new URLSearchParams(window.location.search);
         if (searchTerm) params.set('search', searchTerm); else params.delete('search');
         if (selectedRegion !== 'Global') params.set('region', selectedRegion); else params.delete('region');
         // Add category params later if needed
         selectedCategories.forEach(cat => params.append('category', cat)); // Example for categories

         const newUrl = `${window.location.pathname}?${params.toString()}`;
         window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
     }
   }, [searchTerm, selectedRegion, selectedCategories]); // Depend only on state that affects the URL

  const handleSearch = (newTerm: string) => {
    setSearchTerm(newTerm);
    // Fetching is handled by the useEffect hook that depends on searchTerm
  };

  const handleCategoryChange = (category: Category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    // Fetching is handled by the useEffect hook that depends on selectedCategories
  };

   const handleRegionChange = (region: Region) => {
     setSelectedRegion(region);
     // Fetching is handled by the useEffect hook that depends on selectedRegion
   };

   // Renamed handleVoteCallback to handleTermVote for clarity
   const handleTermVote = async (id: string, type: 'upvote' | 'downvote') => {
        await handleVote(id, type, 'term');
        // Feedback (toast) handled within handleVote
    };

   const handleDefinitionVote = async (definitionId: string, voteType: 'up' | 'down') => {
        // Find the parent SlangEntry ID based on the definitionId
        const parentSlang = allSlangData.find(slang => slang.communityDefinitions?.some(def => def.id === definitionId));
        if (!parentSlang) {
             console.error(`Parent slang entry not found for definition ID: ${definitionId}`);
             return;
        }

        await handleVote(parentSlang.id, voteType === 'up' ? 'upvote' : 'downvote', 'definition', definitionId);
         // Feedback handled in handleVote
   };


  return (
    <div className="flex flex-col min-h-screen gradient-bg">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-center mb-6">
          <SearchBar onSearch={handleSearch} initialTerm={searchTerm} />
        </div>

         <div className="flex flex-wrap justify-center gap-2 mb-6">
             <Button onClick={() => setIsTranslatorOpen(true)} variant="outline" className="rounded-full bg-gradient-to-r from-secondary to-accent/30 hover:opacity-90 transition-opacity border-primary/30 text-primary font-semibold shadow-sm">
                👵🏻 Boomer Translator
             </Button>
             <Button onClick={() => setIsGeneratorOpen(true)} variant="outline" className="rounded-full bg-gradient-to-r from-accent/30 to-primary/30 hover:opacity-90 transition-opacity border-accent/30 text-accent-foreground dark:text-accent font-semibold shadow-sm">
                <Bot className="mr-2 h-4 w-4" /> AI Slangify
             </Button>
        </div>

         {/* Slang Battle Section */}
         {isBattleLoading ? (
             <Skeleton className="h-48 w-full mb-6" />
         ) : currentBattle ? (
           <SlangBattleCard battle={currentBattle} onVote={handleBattleVote} />
         ) : error?.includes("Failed to load battle") ? ( // Only show battle error if it specifically failed
             <Alert variant="destructive" className="mt-6 mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Battle Error</AlertTitle>
                <AlertDescription>Could not load the Slang Battle right now.</AlertDescription>
            </Alert>
         ) : null}


        <TrendingWords words={MOCK_TRENDING_WORDS} />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <CategoryFilter selectedCategories={selectedCategories} onCategoryChange={handleCategoryChange} />
            <RegionalFilter selectedRegion={selectedRegion} onRegionChange={handleRegionChange} />
        </div>

        <Separator className="mb-6" />

        {isLoading ? (
           <div className="space-y-4">
             <Skeleton className="h-64 w-full" />
             <Skeleton className="h-64 w-full" />
           </div>
        ) : isGeneratingAI ? (
            <div className="text-center text-muted-foreground mt-10">
                <Bot className="h-8 w-8 mx-auto mb-2 animate-pulse text-primary" />
                <p className="text-lg font-medium">AI is cooking up a definition for "{searchTerm}"...</p>
                <p className="text-sm mt-1">This might take a moment.</p>
            </div>
        ) : error && !error.includes("Failed to load battle") ? ( // Don't show generic error if only battle failed
             <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        ) : slangResults.length > 0 ? (
          <div className="space-y-6">
            {slangResults.map((slang) => (
              <div key={slang.id}>
                <SlangCard slang={slang} onUpvote={() => handleTermVote(slang.id, 'upvote')} onDownvote={() => handleTermVote(slang.id, 'downvote')} />
                 {/* "In the Wild" only shows if it's the *only* result, was specifically searched, AND not AI generated */}
                 {slangResults.length === 1 && searchTerm && !slang.isAIGenerated && slang.term.toLowerCase() === searchTerm.toLowerCase() && slang.inTheWild && (
                    <InTheWildSection data={slang.inTheWild} term={slang.term} />
                 )}
                 {/* Community Definitions - Only show if it's the *only* result, specifically searched, AND not AI generated */}
                 {slangResults.length === 1 && searchTerm && !slang.isAIGenerated && slang.term.toLowerCase() === searchTerm.toLowerCase() && (
                     <CommunityDefinitions definitions={slang.communityDefinitions} onVote={handleDefinitionVote} />
                 )}
                 {/* Add Definition Button for single result view (and not AI generated) */}
                 {slangResults.length === 1 && searchTerm && !slang.isAIGenerated && slang.term.toLowerCase() === searchTerm.toLowerCase() && (
                     <div className="mt-4 text-center">
                         {/* TODO: Implement Add Definition Modal/Form */}
                         <Button variant="outline" size="sm">
                             <PlusCircle className="mr-2 h-4 w-4" /> Add Your Definition
                         </Button>
                    </div>
                 )}
              </div>
            ))}
          </div>
        ) : searchTerm && !isLoading && !isGeneratingAI ? ( // Show "No results" only if a search was performed
           <div className="text-center text-muted-foreground mt-10">
             <p className="text-lg font-medium">No results found {searchTerm ? `for "${searchTerm}"` : ''} {selectedCategories.length > 0 ? `in selected categories` : ''} {selectedRegion !== 'Global' ? ` in ${selectedRegion}` : ''}.</p>
             <p className="text-sm mt-2">Try searching for another term, adjusting filters, or changing the region. Maybe submit this word?</p>
                {/* TODO: Implement Submit New Slang Modal/Form */}
               <Button variant="outline" size="sm" className="mt-4">
                 <PlusCircle className="mr-2 h-4 w-4" /> Submit New Slang
               </Button>
           </div>
        ) : (
            // Initial state or cleared search - maybe show featured words or welcome message
            <div className="text-center text-muted-foreground mt-10">
             <p className="text-lg font-medium">Search for slang or explore trending terms!</p>
           </div>
        )}

      </main>
       <footer className="text-center py-4 text-xs text-muted-foreground border-t">
            Built with 💜 for Zictionary. | <Link href="/archive" className="hover:underline">Timeline</Link> | <Link href="/boomer-traps" className="hover:underline">Boomer Traps</Link>
        </footer>

        <BoomerTranslatorModal isOpen={isTranslatorOpen} onOpenChange={setIsTranslatorOpen} />
        <SlangGeneratorModal isOpen={isGeneratorOpen} onOpenChange={setIsGeneratorOpen} />
    </div>
  );
}

// --- Main Export with Suspense ---
export default function Home() {
  // Wrap the component that uses useSearchParams in Suspense
  // Adding a simple loading fallback
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><p>Loading page...</p></div>}>
      <HomePageContent />
    </Suspense>
  );
}
