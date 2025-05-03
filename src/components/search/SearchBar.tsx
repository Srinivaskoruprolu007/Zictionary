"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react"; // Removed Mic import
import { useToast } from "@/hooks/use-toast";

// Import type definitions

interface SearchBarProps {
  onSearch: (term: string) => void;
  initialTerm?: string;
}

export function SearchBar({ onSearch, initialTerm = "" }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(initialTerm);
  // Removed isListening state
  // Removed recognitionRef
  const { toast } = useToast();

  // Update searchTerm when initialTerm prop changes
  useEffect(() => {
    setSearchTerm(initialTerm);
  }, [initialTerm]);

  // Removed useEffect for SpeechRecognition initialization and event handlers

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

  // Removed handleMicClick function

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
        className="pl-10 pr-20 text-base md:text-sm h-12 rounded-full shadow-sm focus-visible:ring-accent focus-visible:ring-2 focus-visible:ring-offset-0" // Adjusted pr for removed mic button
      />
      {searchTerm && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-12 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground" // Adjusted position
          onClick={clearSearch}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
      {/* Removed Microphone Button */}
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
