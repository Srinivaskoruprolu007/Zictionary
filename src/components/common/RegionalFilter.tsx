"use client";

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Region } from '@/types/slang';
import { Globe } from 'lucide-react';

const regions: Region[] = ['Global', 'US-East', 'US-West', 'UK', 'AU'];

interface RegionalFilterProps {
  selectedRegion: Region;
  onRegionChange: (region: Region) => void;
}

export function RegionalFilter({ selectedRegion, onRegionChange }: RegionalFilterProps) {
  return (
    <div className="mb-6 flex items-center gap-2">
       <Globe className="h-5 w-5 text-muted-foreground" />
      <Select value={selectedRegion} onValueChange={(value: Region) => onRegionChange(value)}>
        <SelectTrigger className="w-[180px] h-9 rounded-full text-xs">
          <SelectValue placeholder="Filter by Region" />
        </SelectTrigger>
        <SelectContent>
          {regions.map((region) => (
            <SelectItem key={region} value={region} className="text-xs">
              {region}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
