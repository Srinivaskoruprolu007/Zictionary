"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/common/Header";
import type { BoomerTrap } from "@/types/slang";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle, MessageSquareQuote } from "lucide-react"; // Using MessageSquareQuote for examples
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
// Mock data - replace with data fetching
const MOCK_BOOMER_TRAPS: BoomerTrap[] = [
  {
    id: "trap1",
    term: "Bet",
    correctUsage: '"Wanna grab food later?" "Bet." (Meaning: Okay/Sure)',
    incorrectUsageExample:
      '"I bet you can\'t finish that pizza!" (Using the traditional meaning of wager)',
    explanation:
      'While "bet" still means wager, Gen Z mostly uses it as a simple "okay" or agreement. Using it for an actual bet sounds a bit formal or dated in casual chat.',
  },
  {
    id: "trap2",
    term: "Slay",
    correctUsage:
      '"OMG, your outfit slays!" (Meaning: Looks amazing/You did great)',
    incorrectUsageExample:
      '"Did you slay the dragon in that game?" (Using the literal meaning of kill)',
    explanation:
      'Unless you\'re actually talking medieval combat, "slay" in Gen Z context means doing something exceptionally well or looking fantastic. Using the literal meaning is a classic boomer trap!',
  },
  {
    id: "trap3",
    term: "Rizz",
    correctUsage:
      '"He tried to rizz her up at the party." (Meaning: Charm or flirt with)',
    incorrectUsageExample:
      '"My car has great rizz, it\'s very shiny." (Applying it to inanimate objects)',
    explanation:
      '"Rizz" (charisma) is typically applied to people and their ability to attract or charm others. Attributing it to objects misses the social nuance.',
  },
  {
    id: "trap4",
    term: "Mid",
    correctUsage: '"The movie was kinda mid." (Meaning: Mediocre/Unimpressive)',
    incorrectUsageExample:
      '"I\'ll have the mid-size coffee." (Confusing it with "medium")',
    explanation:
      '"Mid" specifically implies something is average *at best*, often with a negative connotation of being disappointing. It\'s not just a synonym for "medium".',
  },
];

// Mock fetch function
async function fetchBoomerTraps(): Promise<BoomerTrap[]> {
  await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate loading
  return MOCK_BOOMER_TRAPS;
}

export default function BoomerTrapsPage() {
  const [traps, setTraps] = useState<BoomerTrap[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTraps = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchBoomerTraps();
        setTraps(data);
      } catch (err) {
        console.error("Error fetching boomer traps:", err);
        setError("Couldn't load the boomer traps. Maybe the vibes are off?");
      } finally {
        setIsLoading(false);
      }
    };
    loadTraps();
  }, []);

  return (
    <div className="flex flex-col min-h-screen gradient-bg">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
          🚨 Boomer Traps 🚨
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Commonly misused slang and how *not* to use it. Stay hip, avoid the
          cringe!
        </p>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        )}
        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Loading Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && traps.length > 0 && (
          <div className="space-y-6">
            {traps.map((trap) => (
              <Card
                key={trap.id}
                className="border-destructive/30 dark:border-destructive/50 shadow-sm"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-destructive flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" /> Potential Trap: "
                    {trap.term}"
                  </CardTitle>
                  {/* <CardDescription>Don't fall for it!</CardDescription> */}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Correct Usage Example:
                      </h4>
                      <p className="text-sm text-foreground/90">
                        "{trap.correctUsage}"
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-red-700 dark:text-red-300">
                        Common Misuse Example:
                      </h4>
                      <p className="text-sm text-red-800 dark:text-red-200">
                        "{trap.incorrectUsageExample}"
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MessageSquareQuote className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        The Lowdown:
                      </h4>
                      <p className="text-sm text-foreground/90">
                        {trap.explanation}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {!isLoading && !error && traps.length === 0 && (
          <p className="text-center text-muted-foreground mt-10">
            No boomer traps found! Everyone's slaying it today.
          </p>
        )}
      </main>
      <footer className="text-center py-4 text-xs text-muted-foreground border-t">
        Navigate the slang minefield with Zictionary.
      </footer>
    </div>
  );
}
