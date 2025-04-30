"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link'; // Import Link component
import { Header } from '@/components/common/Header';
import type { SlangEntry } from '@/types/slang';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SlangFreshnessMeter } from '@/components/slang/SlangFreshnessMeter';
import { Separator } from '@/components/ui/separator';
import { Globe } from 'lucide-react'; // Import Globe icon
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; // Import Alert components
import { AlertCircle } from 'lucide-react'; // Import AlertCircle icon


// Mock data - replace with data fetching based on year
const MOCK_ARCHIVE_DATA: SlangEntry[] = [
   // Add more entries spanning different years (2020-2025)
   { id: '5', term: 'Slay', definition: 'To do something exceptionally well.', example: 'She slayed that presentation!', tone: 'sincere', categories: ['social', 'fashion', 'emotions'], freshness: 'established', region: 'Global', createdAt: new Date(2020, 10, 15), upvotes: 1350, downvotes: 45, approved: true },
   { id: '4', term: 'Bet', definition: 'Affirmation or agreement.', example: 'Wanna grab food later? "Bet."', tone: 'neutral', categories: ['social'], freshness: 'established', region: 'Global', createdAt: new Date(2021, 3, 5), upvotes: 1100, downvotes: 30, approved: true },
   { id: '2', term: 'Bussin\'', definition: 'Really good, especially food.', example: 'This pizza is bussin\' bussin\'.', tone: 'sincere', categories: ['food', 'social'], freshness: 'established', region: 'US-East', createdAt: new Date(2022, 1, 10), upvotes: 987, downvotes: 102, approved: true },
   { id: '3', term: 'Mid', definition: 'Mediocre or average.', example: 'The movie was kinda mid, tbh.', tone: 'neutral', categories: ['social', 'internet'], freshness: 'established', region: 'Global', createdAt: new Date(2022, 8, 20), upvotes: 765, downvotes: 88, approved: true },
   { id: '1', term: 'Rizz', definition: 'Charisma; ability to charm.', example: 'He\'s got unspoken rizz.', tone: 'playful', categories: ['social'], freshness: 'fresh', region: 'Global', createdAt: new Date(2023, 5, 1), upvotes: 1502, downvotes: 55, approved: true },
   { id: '6', term: 'NPC', definition: 'Someone lacking independent thought.', example: 'He just stands there nodding, total NPC vibes.', tone: 'sarcastic', categories: ['gaming', 'internet', 'social'], freshness: 'fresh', region: 'Global', createdAt: new Date(2023, 8, 1), upvotes: 600, downvotes: 150, approved: true },
   { id: '7', term: 'Skibidi', definition: 'Nonsensical term from YouTube.', example: 'What is this skibidi toilet thing everyone is talking about?', tone: 'playful', categories: ['internet'], freshness: 'fresh', region: 'Global', createdAt: new Date(2023, 9, 1), upvotes: 450, downvotes: 200, approved: true },
   { id: '10', term: 'Ate', definition: 'Did something extremely well.', example: "She absolutely ate that performance.", tone: 'sincere', categories: ['social', 'fashion'], freshness: 'fresh', region: 'Global', createdAt: new Date(2023, 11, 1), upvotes: 950, downvotes: 35, approved: true },
   // Add hypothetical 2024/2025 entries if desired
];

// Mock fetch function
async function fetchArchiveData(): Promise<SlangEntry[]> {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate loading delay
    // In a real app, fetch data from your backend/database
    return MOCK_ARCHIVE_DATA;
}


const YEARS = [2025, 2024, 2023, 2022, 2021, 2020]; // Reverse chronological

export default function ArchivePage() {
  const [archiveData, setArchiveData] = useState<SlangEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchArchiveData(); // Use the mock fetch function
        setArchiveData(data);
      } catch (err) {
        console.error("Error fetching archive data:", err);
        setError("Failed to load archive data. The timeline seems broken!");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []); // Empty dependency array ensures this runs once on mount


  // Group slang by year
  const slangByYear = useMemo(() => {
    const grouped: { [year: number]: SlangEntry[] } = {};
    archiveData.forEach(slang => { // Use archiveData state here
      const year = slang.createdAt.getFullYear();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(slang);
    });
     // Sort entries within each year by term alphabetically
     Object.keys(grouped).forEach((year) => {
        const numericYear = parseInt(year, 10); // Ensure year is treated as a number
        if (!isNaN(numericYear)) { // Check if parsing was successful
            grouped[numericYear].sort((a, b) => a.term.localeCompare(b.term));
        }
     });
    return grouped;
  }, [archiveData]); // Recalculate when archiveData changes

  return (
    <div className="flex flex-col min-h-screen gradient-bg">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">Slang Archive & Timeline</h1>
        <p className="text-center text-muted-foreground mb-8">Explore the evolution of Gen Z slang through the years.</p>

        {isLoading && (
             <div className="space-y-8">
                {YEARS.map((year) => (
                    <div key={year}>
                        <Skeleton className="h-8 w-24 mb-4" /> {/* Skeleton for year title */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Skeleton className="h-36 w-full" />
                            <Skeleton className="h-36 w-full" />
                            <Skeleton className="h-36 w-full" />
                        </div>
                        {year !== YEARS[YEARS.length - 1] && <Skeleton className="h-px w-full my-8" />} {/* Skeleton for Separator */}
                    </div>
                ))}
            </div>
        )}
        {error && (
            <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Loading Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {!isLoading && !error && (
          <div className="space-y-8">
            {YEARS.map((year) => {
              const yearSlang = slangByYear[year];
              if (!yearSlang || yearSlang.length === 0) {
                 return (
                    <div key={year}>
                        <h2 className="text-2xl font-semibold mb-4 sticky top-[55px] bg-background/80 backdrop-blur py-2 z-10 border-b">{year}</h2>
                        <p className="text-muted-foreground ml-2">No major slang entries recorded for this year (yet!).</p>
                         {year !== YEARS[YEARS.length - 1] && <Separator className="my-8" />}
                    </div>
                 )
              }

              return (
                <div key={year}>
                  <h2 className="text-2xl font-semibold mb-4 sticky top-[55px] bg-background/80 backdrop-blur py-2 z-10 border-b">{year}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {yearSlang.map((slang) => (
                      <Link key={slang.id} href={`/?search=${encodeURIComponent(slang.term)}`} className="block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
                        <Card className="flex flex-col justify-between h-full transition-transform hover:scale-[1.02] shadow-sm hover:shadow-md">
                              <CardHeader className="pb-2">
                                  <CardTitle className="text-lg font-semibold text-primary hover:underline">{slang.term}</CardTitle>
                                  <p className="text-xs text-muted-foreground line-clamp-2">{slang.definition}</p>
                              </CardHeader>
                              <CardContent className="pt-2 flex-grow flex flex-col justify-end">
                                  <SlangFreshnessMeter freshness={slang.freshness} />
                                  <div className="mt-2 flex flex-wrap gap-1">
                                  {slang.categories.slice(0, 2).map(cat => ( // Show max 2 categories
                                      <Badge key={cat} variant="secondary" className="text-xs capitalize">{cat}</Badge>
                                  ))}
                                  {slang.region !== 'Global' && slang.region !== 'Unknown' && <Badge variant="outline" className="text-xs"><Globe className="h-3 w-3 mr-1"/>{slang.region}</Badge>}
                                  </div>
                              </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                  {year !== YEARS[YEARS.length - 1] && <Separator className="my-8" />}
                </div>
              );
            })}
          </div>
        )}
      </main>
      <footer className="text-center py-4 text-xs text-muted-foreground border-t">
            Zictionary Slang Archive
       </footer>
    </div>
  );
}
