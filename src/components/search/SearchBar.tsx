"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Mic, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (term: string) => void;
  initialTerm?: string;
}

export function SearchBar({ onSearch, initialTerm = '' }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialTerm);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check for SpeechRecognition API support
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        handleSearch(transcript); // Trigger search immediately after speech
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        // TODO: Add user feedback (e.g., toast notification)
      };

       recognitionRef.current.onend = () => {
         setIsListening(false);
       };

    } else {
      console.warn('Speech Recognition not supported in this browser.');
      // Optionally disable the mic button
    }

     // Cleanup function to stop recognition if component unmounts while listening
    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]); // Rerun effect if isListening changes

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (term: string) => {
     if (term.trim()) {
        onSearch(term.trim());
     }
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSearch(searchTerm);
  };

  const handleMicClick = () => {
    if (!recognitionRef.current) {
        alert('Voice search is not supported in your browser.');
        return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch(''); // Optionally trigger an empty search to reset results
  };


  return (
    <form onSubmit={handleFormSubmit} className="flex w-full max-w-2xl items-center space-x-2 relative">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search Gen Z slang (e.g., rizz, bussin')..."
        value={searchTerm}
        onChange={handleInputChange}
        className="pl-10 pr-10 text-base md:text-sm h-12 rounded-full shadow-sm focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-0" // Increased height and roundness
      />
       {searchTerm && (
         <Button
           type="button"
           variant="ghost"
           size="icon"
           className="absolute right-20 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
           onClick={clearSearch}
         >
           <X className="h-4 w-4" />
           <span className="sr-only">Clear search</span>
         </Button>
       )}
      <Button
        type="button"
        variant="ghost" // Changed to ghost for cleaner look
        size="icon"
        onClick={handleMicClick}
        disabled={!recognitionRef.current} // Disable if not supported
        className={`absolute right-9 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full ${isListening ? 'bg-accent/30 text-accent-foreground animate-pulse' : 'text-muted-foreground hover:text-accent-foreground hover:bg-accent/10'}`} // Adjusted position and styling
      >
        <Mic className="h-5 w-5" />
        <span className="sr-only">{isListening ? 'Stop listening' : 'Search by voice'}</span>
      </Button>
       <Button type="submit" size="icon" className="absolute right-1 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-primary hover:bg-primary/90">
            <Search className="h-5 w-5 text-primary-foreground" />
            <span className="sr-only">Search</span>
        </Button>
    </form>
  );
}
