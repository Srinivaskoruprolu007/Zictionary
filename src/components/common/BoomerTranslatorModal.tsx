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
import { Loader2, Sparkles } from 'lucide-react';
import { boomerTranslator, BoomerTranslatorInput, BoomerTranslatorOutput } from '@/ai/flows/boomer-translator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BoomerTranslatorModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BoomerTranslatorModal({ isOpen, onOpenChange }: BoomerTranslatorModalProps) {
  const [genZSlang, setGenZSlang] = useState('');
  const [plainEnglish, setPlainEnglish] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (!genZSlang.trim()) return;

    setIsLoading(true);
    setError(null);
    setPlainEnglish(''); // Clear previous translation

    try {
      const input: BoomerTranslatorInput = { genZSlang };
      const output: BoomerTranslatorOutput = await boomerTranslator(input);
      setPlainEnglish(output.plainEnglish);
    } catch (err) {
      console.error("Translation error:", err);
      setError("Oops! Couldn't translate that. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

   // Reset state when modal closes
  const handleModalChange = (open: boolean) => {
    if (!open) {
      setGenZSlang('');
      setPlainEnglish('');
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
            <Sparkles className="h-5 w-5 text-primary" />
            Boomer Translator Mode 👵🏻👴🏻
          </DialogTitle>
          <DialogDescription>
            Enter some Gen Z slang, and we'll translate it into plain English for you.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            id="genz-slang"
            placeholder="e.g., That fit is bussin', no cap fr fr..."
            value={genZSlang}
            onChange={(e) => setGenZSlang(e.target.value)}
            className="min-h-[100px] focus-visible:ring-accent"
            disabled={isLoading}
          />
          <Button onClick={handleTranslate} disabled={isLoading || !genZSlang.trim()} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Translating...
              </>
            ) : (
              'Translate to Plain English'
            )}
          </Button>

          {error && (
             <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
           )}

          {plainEnglish && (
            <div className="mt-4 rounded-md border bg-secondary p-4 dark:bg-card">
              <h4 className="font-semibold text-secondary-foreground dark:text-primary-foreground mb-2">Plain English Translation:</h4>
              <p className="text-secondary-foreground dark:text-primary-foreground/90">{plainEnglish}</p>
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
