"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Mic, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import type definitions
import "@/types/speech-recognition.d.ts";

interface SearchBarProps {
  onSearch: (term: string) => void;
  initialTerm?: string;
}

export function SearchBar({ onSearch, initialTerm = "" }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialTerm);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<typeof window.SpeechRecognition | null>(null);
  const { toast } = useToast();

  // Update searchTerm when initialTerm prop changes
  useEffect(() => {
    setSearchTerm(initialTerm);
  }, [initialTerm]);

  useEffect(() => {
    // Check for SpeechRecognition API support
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;

    // Configure recognition settings
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Handle successful recognition
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      handleSearch(transcript);
      setIsListening(false);

      toast({
        title: "Voice Search",
        description: `Searching for: "${transcript}"`,
        variant: "default",
      });
    };

    // Handle recognition errors
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);

      const errorMessages = {
        "no-speech": "No speech detected. Please try again.",
        "audio-capture":
          "Couldn't access your microphone. Please check permissions.",
        "not-allowed":
          "Microphone permission denied. Please enable it in your browser settings.",
        network: "Network error occurred. Please check your connection.",
        aborted: "Speech recognition was aborted.",
        "service-not-allowed": "Speech recognition service not allowed.",
      };

      toast({
        title: "Voice Search Error",
        description:
          errorMessages[event.error as keyof typeof errorMessages] ||
          `Speech recognition error: ${event.error}`,
        variant: "destructive",
      });
    };

    // Handle recognition end
    recognition.onend = () => {
      setIsListening(false);
    };

    // Cleanup function
    return () => {
      if (recognition && isListening) {
        recognition.stop();
      }
    };
  }, [isListening, toast]);

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
      toast({
        title: "Voice Search Unavailable",
        description: "Voice search is not supported in your browser.",
        variant: "destructive",
      });
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
    setSearchTerm("");
    onSearch(""); // Optionally trigger an empty search to reset results
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex w-full max-w-2xl items-center space-x-2 relative"
    >
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
        className={`absolute right-9 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full ${
          isListening
            ? "bg-accent/30 text-accent-foreground animate-pulse"
            : "text-muted-foreground hover:text-accent-foreground hover:bg-accent/10"
        }`} // Adjusted position and styling
      >
        <Mic className="h-5 w-5" />
        <span className="sr-only">
          {isListening ? "Stop listening" : "Search by voice"}
        </span>
      </Button>
      <Button
        type="submit"
        size="icon"
        className="absolute right-1 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-primary hover:bg-primary/90"
      >
        <Search className="h-5 w-5 text-primary-foreground" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}
