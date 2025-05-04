"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link"; // Import Link component
import { format, subDays, subMonths, subYears } from "date-fns"; // Import date-fns functions
import { Header } from "@/components/common/Header";
import type { SlangEntry } from "@/types/slang";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SlangFreshnessMeter } from "@/components/slang/SlangFreshnessMeter";
import { Separator } from "@/components/ui/separator";
import { Globe } from "lucide-react"; // Import Globe icon
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components
import { AlertCircle } from "lucide-react"; // Import AlertCircle icon

// Function to generate dynamic mock archive data
const generateMockArchiveData = (): SlangEntry[] => {
  const now = new Date();
  const mockData: SlangEntry[] = [
    // --- 2020 ---
    {
      id: "a1",
      term: "Simp",
      definition: "Someone doing way too much for a person they like.",
      example: "He bought her a car? Total simp.",
      tone: "sarcastic",
      categories: ["social", "internet"],
      freshness: "waning",
      region: "Global",
      createdAt: subYears(subMonths(now, 1), 4),
      upvotes: 800,
      downvotes: 300,
      approved: true,
    },
    {
      id: "a2",
      term: "Karen",
      definition:
        "Stereotype of an entitled, often racist, middle-aged white woman.",
      example:
        "She demanded to speak to the manager, acting like a total Karen.",
      tone: "serious",
      categories: ["social", "internet"],
      freshness: "established",
      region: "Global",
      createdAt: subYears(subMonths(now, 6), 4),
      upvotes: 1400,
      downvotes: 50,
      approved: true,
    },

    // --- 2021 ---
    {
      id: "a3",
      term: "Vibe Check",
      definition: "Assessing someone's mood or general aura.",
      example: "Gotta do a vibe check before we invite him.",
      tone: "neutral",
      categories: ["social", "emotions"],
      freshness: "waning",
      region: "Global",
      createdAt: subYears(subMonths(now, 2), 3),
      upvotes: 1000,
      downvotes: 70,
      approved: true,
    },
    {
      id: "4",
      term: "Bet",
      definition: "Affirmation or agreement.",
      example: 'Wanna grab food later? "Bet."',
      tone: "neutral",
      categories: ["social"],
      freshness: "established",
      region: "Global",
      createdAt: subYears(subMonths(now, 9), 3),
      upvotes: 1100,
      downvotes: 30,
      approved: true,
    }, // Keep existing ID 4

    // --- 2022 ---
    {
      id: "2",
      term: "Bussin'",
      definition: "Really good, especially food.",
      example: "This pizza is bussin' bussin'.",
      tone: "sincere",
      categories: ["food", "social"],
      freshness: "established",
      region: "US-East",
      createdAt: subYears(subMonths(now, 11), 2),
      upvotes: 987,
      downvotes: 102,
      approved: true,
    }, // Keep existing ID 2
    {
      id: "3",
      term: "Mid",
      definition: "Mediocre or average.",
      example: "The movie was kinda mid, tbh.",
      tone: "neutral",
      categories: ["social", "internet"],
      freshness: "established",
      region: "Global",
      createdAt: subYears(subMonths(now, 4), 2),
      upvotes: 765,
      downvotes: 88,
      approved: true,
    }, // Keep existing ID 3
    {
      id: "12",
      term: "Cheugy",
      definition:
        "Describes something that is outdated, basic, or trying too hard to be trendy.",
      example: "Those wooden signs with cursive fonts are so cheugy.",
      tone: "sarcastic",
      categories: ["fashion", "social", "internet"],
      freshness: "waning",
      region: "US-West",
      createdAt: subYears(subMonths(now, 7), 2),
      upvotes: 400,
      downvotes: 250,
      approved: true,
    }, // Keep existing ID 12

    // --- 2023 ---
    {
      id: "1",
      term: "Rizz",
      definition: "Charisma; ability to charm.",
      example: "He's got unspoken rizz.",
      tone: "playful",
      categories: ["social"],
      freshness: "fresh",
      region: "Global",
      createdAt: subYears(subMonths(now, 7), 1),
      upvotes: 1502,
      downvotes: 55,
      approved: true,
    }, // Keep existing ID 1
    {
      id: "6",
      term: "NPC",
      definition: "Someone lacking independent thought.",
      example: "He just stands there nodding, total NPC vibes.",
      tone: "sarcastic",
      categories: ["gaming", "internet", "social"],
      freshness: "fresh",
      region: "Global",
      createdAt: subYears(subMonths(now, 4), 1),
      upvotes: 600,
      downvotes: 150,
      approved: true,
    }, // Keep existing ID 6
    {
      id: "7",
      term: "Skibidi",
      definition: "Nonsensical term from YouTube.",
      example: "What is this skibidi toilet thing everyone is talking about?",
      tone: "playful",
      categories: ["internet"],
      freshness: "fresh",
      region: "Global",
      createdAt: subYears(subMonths(now, 3), 1),
      upvotes: 450,
      downvotes: 200,
      approved: true,
    }, // Keep existing ID 7
    {
      id: "10",
      term: "Ate",
      definition: "Did something extremely well.",
      example: "She absolutely ate that performance.",
      tone: "sincere",
      categories: ["social", "fashion"],
      freshness: "fresh",
      region: "Global",
      createdAt: subYears(subMonths(now, 1), 1),
      upvotes: 950,
      downvotes: 35,
      approved: true,
    }, // Keep existing ID 10
    {
      id: "9",
      term: "Situationship",
      definition:
        "A romantic or sexual relationship that lacks clear definition.",
      example: "We're not dating, it's more of a situationship.",
      tone: "neutral",
      categories: ["social", "emotions"],
      freshness: "established",
      region: "Global",
      createdAt: subYears(subMonths(now, 2), 1),
      upvotes: 1200,
      downvotes: 60,
      approved: true,
    }, // Keep existing ID 9

    // --- 2024 (Current Year - examples) ---
    {
      id: "8",
      term: "Delulu",
      definition: 'Short for "delusional," often used playfully.',
      example: "She thinks he'll text back? She's so delulu.",
      tone: "playful",
      categories: ["social", "internet", "emotions"],
      freshness: "fresh",
      region: "Global",
      createdAt: subMonths(now, 2),
      upvotes: 880,
      downvotes: 40,
      approved: true,
    }, // Keep existing ID 8
    {
      id: "a4",
      term: "IYKYK",
      definition: "If You Know, You Know. Refers to insider knowledge.",
      example: "That ending was wild... IYKYK.",
      tone: "neutral",
      categories: ["internet", "social"],
      freshness: "established",
      region: "Global",
      createdAt: subMonths(now, 5),
      upvotes: 1050,
      downvotes: 25,
      approved: true,
    },

    // --- 2025 (Hypothetical Future - placeholder) ---
    // Add entries for 2025 if needed, adjusting dates accordingly (e.g., addMonths(now, ...))
    // { id: 'future1', term: 'Glimmer', definition: 'A spark of potential or hope.', example: 'Saw a glimmer of the old style in their new album.', tone: 'sincere', categories: ['emotions', 'social'], freshness: 'fresh', region: 'Global', createdAt: addMonths(now, 3), upvotes: 10, downvotes: 0, approved: false },
  ];
  return mockData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort newest first initially
};

// Mock fetch function
async function fetchArchiveData(): Promise<SlangEntry[]> {
  await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate loading delay
  // In a real app, fetch data from your backend/database
  return generateMockArchiveData(); // Use the dynamic data generator
}

// Determine years dynamically based on data, including future years if present
const getYearsFromData = (data: SlangEntry[]): number[] => {
  const currentYear = new Date().getFullYear();
  const yearsInData = Array.from(
    new Set(data.map((slang) => slang.createdAt.getFullYear()))
  );
  const minYear = Math.min(...yearsInData, 2020); // Ensure we go back at least to 2020
  const maxYear = Math.max(...yearsInData, currentYear, 2025); // Ensure we go up to at least 2025

  const allYears = [];
  for (let year = maxYear; year >= minYear; year--) {
    allYears.push(year);
  }
  return allYears;
};

export default function ArchivePage() {
  const [archiveData, setArchiveData] = useState<SlangEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const [yearsToDisplay, setYearsToDisplay] = useState<number[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchArchiveData(); // Use the mock fetch function
        setArchiveData(data);
        setYearsToDisplay(getYearsFromData(data)); // Calculate years after data is fetched
      } catch (err) {
        console.error("Error fetching archive data:", err);
        setError("Failed to load archive data. The timeline seems broken!");
        setYearsToDisplay([2025, 2024, 2023, 2022, 2021, 2020]); // Fallback years
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []); // Empty dependency array ensures this runs once on mount

  // Group slang by year
  const slangByYear = useMemo(() => {
    const grouped: { [year: number]: SlangEntry[] } = {};
    archiveData.forEach((slang) => {
      // Use archiveData state here
      const year = slang.createdAt.getFullYear();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(slang);
    });
    // Sort entries within each year by term alphabetically
    Object.keys(grouped).forEach((year) => {
      const numericYear = parseInt(year, 10); // Ensure year is treated as a number
      if (!isNaN(numericYear)) {
        // Check if parsing was successful
        grouped[numericYear].sort((a, b) => a.term.localeCompare(b.term));
      }
    });
    return grouped;
  }, [archiveData]); // Recalculate when archiveData changes

  return (
    <div className="flex flex-col min-h-screen gradient-bg">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
          Slang Archive & Timeline
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Explore the evolution of Gen Z slang through the years.
        </p>

        {isLoading && (
          <div className="space-y-8">
            {yearsToDisplay.map(
              (
                year // Use yearsToDisplay state
              ) => (
                <div key={year}>
                  <Skeleton className="h-8 w-24 mb-4" />{" "}
                  {/* Skeleton for year title */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Skeleton className="h-36 w-full" />
                    <Skeleton className="h-36 w-full" />
                    <Skeleton className="h-36 w-full" />
                  </div>
                  {year !== yearsToDisplay[yearsToDisplay.length - 1] && (
                    <Skeleton className="h-px w-full my-8" />
                  )}{" "}
                  {/* Skeleton for Separator */}
                </div>
              )
            )}
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
            {yearsToDisplay.map((year) => {
              // Use yearsToDisplay state
              const yearSlang = slangByYear[year];
              if (!yearSlang || yearSlang.length === 0) {
                return (
                  <div key={year}>
                    <h2 className="text-2xl font-semibold mb-4 sticky top-[55px] bg-background/80 backdrop-blur py-2 z-10 border-b">
                      {year}
                    </h2>
                    <p className="text-muted-foreground ml-2">
                      No major slang entries recorded for this year (yet!).
                    </p>
                    {year !== yearsToDisplay[yearsToDisplay.length - 1] && (
                      <Separator className="my-8" />
                    )}
                  </div>
                );
              }

              return (
                <div key={year}>
                  <h2 className="text-2xl font-semibold mb-4 sticky top-[55px] bg-background/80 backdrop-blur py-2 z-10 border-b">
                    {year}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {yearSlang.map((slang) => (
                      <Link
                        key={slang.id}
                        href={`/?search=${encodeURIComponent(slang.term)}`}
                        className="block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg"
                      >
                        <Card className="flex flex-col justify-between h-full transition-transform hover:scale-[1.02] shadow-sm hover:shadow-md">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg font-semibold text-primary hover:underline">
                              {slang.term}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {slang.definition}
                            </p>
                          </CardHeader>
                          <CardContent className="pt-2 flex-grow flex flex-col justify-end">
                            <SlangFreshnessMeter freshness={slang.freshness} />
                            <div className="mt-2 flex flex-wrap gap-1">
                              {slang.categories.slice(0, 2).map(
                                (
                                  cat // Show max 2 categories
                                ) => (
                                  <Badge
                                    key={cat}
                                    variant="secondary"
                                    className="text-xs capitalize"
                                  >
                                    {cat}
                                  </Badge>
                                )
                              )}
                              {slang.region !== "Global" &&
                                slang.region !== "Unknown" && (
                                  <Badge variant="outline" className="text-xs">
                                    <Globe className="h-3 w-3 mr-1" />
                                    {slang.region}
                                  </Badge>
                                )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                  {year !== yearsToDisplay[yearsToDisplay.length - 1] && (
                    <Separator className="my-8" />
                  )}
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
