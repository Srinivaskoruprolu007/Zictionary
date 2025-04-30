import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TrendingWordsProps {
  words: { term: string; id: string }[];
}

export function TrendingWords({ words }: TrendingWordsProps) {
  if (!words || words.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 border-accent shadow-sm dark:border-accent/50">
       <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-accent-foreground dark:text-accent">
          <TrendingUp className="h-5 w-5" /> Trending Now
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {words.map((word) => (
             <Link href={`/?search=${encodeURIComponent(word.term)}`} key={word.id} passHref legacyBehavior>
                <a >
                    <Badge variant="outline" className="cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground border-accent text-accent dark:border-accent/70 dark:text-accent hover:dark:bg-accent/80 hover:dark:text-accent-foreground text-sm px-3 py-1">
                        {word.term}
                    </Badge>
                </a>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
