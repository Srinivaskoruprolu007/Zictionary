"use client";

import React from 'react';
import type { DefinitionDetail, DefinitionTag } from '@/types/slang';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, UserCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CommunityDefinitionsProps {
  definitions?: DefinitionDetail[];
  onVote: (definitionId: string, voteType: 'up' | 'down') => void; // Function to handle voting
  // Removed isAIGenerated prop, as this component shouldn't render if the parent is AI generated
}

// Function to map tags to badge variants or colors
const getTagVariant = (tag: DefinitionTag): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (tag) {
        case 'funny': return 'secondary';
        case 'accurate': return 'default';
        case 'boomer-safe': return 'outline';
        case 'satirical': return 'destructive'; // Use destructive for standout, or choose another
        default: return 'secondary';
    }
}

export function CommunityDefinitions({ definitions, onVote }: CommunityDefinitionsProps) {
  // Component should not render if parent is AI generated (handled in page.tsx)
  // This check is an additional safeguard.
  if (!definitions || definitions.length === 0) {
    return (
        <div className="mt-6 text-center text-muted-foreground">
            <p>No community definitions yet. Be the first to add one!</p>
            {/* TODO: Add button to submit a definition */}
        </div>
    );
  }

  // Sort definitions by upvotes (descending)
  const sortedDefinitions = [...definitions].sort((a, b) => b.upvotes - a.upvotes);

  return (
    <Card className="mt-6 bg-card border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Community Definitions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedDefinitions.map((def) => (
          <div key={def.id} className="p-4 rounded-md border bg-background dark:bg-muted/30 shadow-sm">
            <p className="text-foreground mb-2">{def.definition}</p>
            <p className="italic text-sm text-muted-foreground mb-2">"{def.example}"</p>
            <div className="flex flex-wrap gap-1 mb-3">
                {def.tags?.map(tag => (
                     <Badge key={tag} variant={getTagVariant(tag)} className="text-xs capitalize">{tag}</Badge>
                ))}
                 <Badge variant="outline" className="text-xs capitalize">{def.tone} Tone</Badge>
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                {/* Voting is handled by the onVote prop */}
                <Button variant="ghost" size="sm" onClick={() => onVote(def.id, 'up')} className="h-7 px-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/50">
                  <ArrowUp className="h-3 w-3 mr-1" /> {def.upvotes}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onVote(def.id, 'down')} className="h-7 px-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50">
                  <ArrowDown className="h-3 w-3 mr-1" /> {def.downvotes}
                </Button>
              </div>
              <div className="flex items-center gap-1">
                 <UserCircle className="h-3 w-3" />
                 <span>{def.submittedBy || 'Anonymous'}</span>
                 <span className="mx-1">•</span>
                 <span>{formatDistanceToNow(new Date(def.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
