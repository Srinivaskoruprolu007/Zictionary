"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Bot } from 'lucide-react';
import { slangGenerator, SlangGeneratorInput, SlangGeneratorOutput } from '@/ai/flows/slang-generator-flow';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SlangGeneratorModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SlangGeneratorModal({ isOpen, onOpenChange }: SlangGeneratorModalProps) {
  const [plainEnglish, setPlainEnglish] = useState('');
  const [genZTranslation, setGenZTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!plainEnglish.trim()) return;

    setIsLoading(true);
    setError(null);
    setGenZTranslation(''); // Clear previous translation

    try {
      const input: SlangGeneratorInput = { plainEnglishSentence: plainEnglish };
      const output: SlangGeneratorOutput = await slangGenerator(input);
      setGenZTranslation(output.genZTranslation);
    } catch (err) {
      console.error("Slang generation error:", err);
      setError("Yikes, couldn't generate slang for that. Maybe try different wording?");
    } finally {
      setIsLoading(false);
    }
  };

   // Reset state when modal closes
  const handleModalChange = (open: boolean) => {
    if (!open) {
      setPlainEnglish('');
      setGenZTranslation('');
      setError(null);
      setIsLoading(false);
    }
    onOpenChange(open);
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleModalChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Bot className="h-5 w-5 text-primary" />
            AI Slang Generator ✨
          </DialogTitle>
          <DialogDescription>
            Enter a regular sentence, and our AI will try to translate it into Gen Z speak. No cap!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            id="plain-english"
            placeholder="e.g., I'm really tired and going to sleep soon."
            value={plainEnglish}
            onChange={(e) => setPlainEnglish(e.target.value)}
            className="min-h-[100px] focus-visible:ring-accent"
            disabled={isLoading}
          />
          <Button onClick={handleGenerate} disabled={isLoading || !plainEnglish.trim()} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Slang...
              </>
            ) : (
              'Make it Gen Z'
            )}
          </Button>

          {error && (
             <Alert variant="destructive" className="mt-4">
                <AlertTitle>Generation Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
           )}

          {genZTranslation && (
            <div className="mt-4 rounded-md border bg-secondary p-4 dark:bg-card">
              <h4 className="font-semibold text-secondary-foreground dark:text-primary-foreground mb-2 flex items-center gap-1">
                 <Sparkles className="h-4 w-4 text-accent" /> Gen Z Version:
              </h4>
              <p className="text-secondary-foreground dark:text-primary-foreground/90 font-medium">{genZTranslation}</p>
            </div>
          )}
        </div>
         <DialogFooter>
            {/* Optional: Add a close button if needed, though clicking outside or X works */}
             {/* <Button variant="outline" onClick={() => handleModalChange(false)}>Close</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
