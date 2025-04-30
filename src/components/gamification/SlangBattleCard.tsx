"use client";

import React, { useState } from 'react';
import type { SlangBattlePair } from '@/types/slang';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Scale } from 'lucide-react';

interface SlangBattleCardProps {
  battle: SlangBattlePair;
  onVote: (battleId: string, winningTermId: string) => Promise<void>; // Simulate async action
}

export function SlangBattleCard({ battle, onVote }: SlangBattleCardProps) {
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (termId: string) => {
    if (selectedTermId || isVoting) return; // Prevent multiple votes or voting while busy

    setIsVoting(true);
    setSelectedTermId(termId);
    try {
      await onVote(battle.id, termId);
      // Optionally show a success state or feedback
      console.log(`Voted for ${termId} in battle ${battle.id}`);
    } catch (error) {
      console.error("Voting failed:", error);
      setSelectedTermId(null); // Reset selection on error
      // Optionally show error feedback
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <Card className="mb-6 bg-gradient-to-br from-secondary/30 to-accent/10 dark:from-secondary/20 dark:to-accent/5 border-primary/20 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" /> Slang Battle!
        </CardTitle>
         <CardDescription className="text-sm text-muted-foreground">{battle.question}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row justify-around items-center gap-4">
        <Button
          variant={selectedTermId === battle.term1.id ? 'default' : 'outline'}
          className={`flex-1 text-center py-4 px-6 rounded-lg transition-all ${selectedTermId && selectedTermId !== battle.term1.id ? 'opacity-50' : ''}`}
          onClick={() => handleVote(battle.term1.id)}
          disabled={isVoting || !!selectedTermId}
        >
           {selectedTermId === battle.term1.id && <ThumbsUp className="mr-2 h-4 w-4" />}
          {battle.term1.term}
        </Button>

         <span className="font-bold text-muted-foreground">vs</span>

        <Button
           variant={selectedTermId === battle.term2.id ? 'default' : 'outline'}
           className={`flex-1 text-center py-4 px-6 rounded-lg transition-all ${selectedTermId && selectedTermId !== battle.term2.id ? 'opacity-50' : ''}`}
           onClick={() => handleVote(battle.term2.id)}
           disabled={isVoting || !!selectedTermId}
        >
           {selectedTermId === battle.term2.id && <ThumbsUp className="mr-2 h-4 w-4" />}
          {battle.term2.term}
        </Button>
      </CardContent>
        {selectedTermId && (
            <p className="text-center text-sm text-green-600 dark:text-green-400 pb-4">Thanks for voting!</p>
        )}
         {isVoting && (
            <p className="text-center text-sm text-muted-foreground pb-4 animate-pulse">Voting...</p>
         )}
    </Card>
  );
}
