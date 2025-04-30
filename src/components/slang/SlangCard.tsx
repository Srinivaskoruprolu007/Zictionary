import type { SlangEntry } from '@/types/slang';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, Share2, Volume2, ArrowUp, ArrowDown, History, Globe } from 'lucide-react'; // Added Globe icon
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SlangFreshnessMeter } from './SlangFreshnessMeter';

interface SlangCardProps {
  slang: SlangEntry;
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
}

export function SlangCard({ slang, onUpvote, onDownvote }: SlangCardProps) {

  const handlePronunciation = () => {
    if (slang.pronunciationUrl) {
      const audio = new Audio(slang.pronunciationUrl);
      audio.play();
    } else {
      // Fallback using Web Speech API if no URL
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(slang.term);
        // Optional: Find a Gen Z-sounding voice if available
        // const voices = window.speechSynthesis.getVoices();
        // const voice = voices.find(v => v.lang.startsWith('en') && /female|young/i.test(v.name));
        // if (voice) utterance.voice = voice;
        utterance.pitch = 1.2; // Slightly higher pitch
        utterance.rate = 1.1; // Slightly faster rate
        window.speechSynthesis.speak(utterance);
      } else {
        alert('Pronunciation playback not supported in this browser.');
      }
    }
  };

   // Determine the definition to show (prioritize main one)
  const mainDefinition = slang.definition;
  const mainExample = slang.example;
  const mainTone = slang.tone;


  return (
    <Card className="w-full transition-shadow duration-300 hover:shadow-lg dark:hover:shadow-primary/20">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              {slang.term}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                     <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handlePronunciation}>
                        <Volume2 className="h-4 w-4 text-muted-foreground hover:text-accent-foreground" />
                        <span className="sr-only">Play pronunciation</span>
                     </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Hear Pronunciation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
             <CardDescription className="text-sm text-muted-foreground capitalize flex items-center gap-1">
                 {mainTone} Tone
                 {slang.region !== 'Global' && (
                    <>
                        <span className="mx-1">•</span>
                        <Globe className="h-3 w-3 inline-block mr-0.5" /> {slang.region}
                    </>
                 )}
             </CardDescription>
          </div>
          <div className="flex items-center space-x-1">
            <TooltipProvider>
               <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Bookmark className="h-4 w-4" />
                    <span className="sr-only">Bookmark</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Save Term</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Share Term</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Display Main Definition */}
        <p className="text-foreground">{mainDefinition}</p>
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground mb-1">Example:</h4>
          <p className="italic text-foreground/90">"{mainExample}"</p>
        </div>

        {slang.thenVsNow && (
          <div className="p-3 rounded-md bg-secondary dark:bg-card">
             <h4 className="text-sm font-semibold text-secondary-foreground dark:text-primary-foreground mb-1 flex items-center gap-1">
                <History className="h-4 w-4" /> Then vs. Now
            </h4>
            <p className="text-xs text-secondary-foreground/80 dark:text-primary-foreground/80">
              <span className="font-medium">Then:</span> {slang.thenVsNow.traditionalMeaning}
            </p>
             <p className="text-xs text-secondary-foreground/80 dark:text-primary-foreground/80 mt-1">
              <span className="font-medium">Now (Gen Z):</span> {slang.thenVsNow.genZMeaning}
            </p>
          </div>
        )}
         {slang.origin && (
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-1">Origin:</h4>
            <p className="text-xs text-foreground/80">{slang.origin}</p>
          </div>
        )}
         <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-1">Freshness:</h4>
            <SlangFreshnessMeter freshness={slang.freshness} />
         </div>

        <div className="flex flex-wrap gap-2">
          {slang.categories.map((category) => (
            <Badge key={category} variant="secondary" className="capitalize text-xs">
              {category}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
           {/* These votes now apply to the main term/definition */}
          <Button variant="ghost" size="sm" onClick={() => onUpvote(slang.id)} className="text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/50">
            <ArrowUp className="h-4 w-4 mr-1" /> {slang.upvotes}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDownvote(slang.id)} className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/50">
            <ArrowDown className="h-4 w-4 mr-1" /> {slang.downvotes}
          </Button>
        </div>
         {slang.submittedBy && <span className="text-xs text-muted-foreground">Added by {slang.submittedBy}</span>}
      </CardFooter>
    </Card>
  );
}
