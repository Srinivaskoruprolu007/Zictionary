"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { Category } from '@/types/slang';

const categories: Category[] = ['emotions', 'social', 'fashion', 'gaming', 'internet', 'food', 'other'];

// Using a fun, meme-style font class (to be defined in globals.css or via import if needed)
// Example: Add a font like 'Comic Sans MS' or a specific meme font if available
const categoryTitleFont = "font-bold text-sm uppercase tracking-wider"; // Default fallback

interface CategoryFilterProps {
  selectedCategories: Category[];
  onCategoryChange: (category: Category) => void;
}

export function CategoryFilter({ selectedCategories, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="mb-6">
      <h3 className={`${categoryTitleFont} text-muted-foreground mb-3`}>Filter by Category:</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategories.includes(category) ? 'default' : 'secondary'}
            onClick={() => onCategoryChange(category)}
            className="capitalize cursor-pointer transition-all hover:scale-105 active:scale-95 text-xs px-3 py-1" // Added interaction styles
            style={{
              // Apply gradient background when selected
               background: selectedCategories.includes(category)
                ? 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))'
                : undefined,
               color: selectedCategories.includes(category) ? 'hsl(var(--primary-foreground))' : undefined,
               border: 'none',
            }}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
}
