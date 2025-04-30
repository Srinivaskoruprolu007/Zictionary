import type { SlangInTheWild } from '@/types/slang';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Twitter, Youtube, MessageSquare } from 'lucide-react'; // Using Youtube as placeholder for TikTok, MessageSquare for Reddit

interface InTheWildSectionProps {
  data?: SlangInTheWild;
  term: string;
}

export function InTheWildSection({ data, term }: InTheWildSectionProps) {
  if (!data || (!data.tweets?.length && !data.tiktoks?.length && !data.redditPosts?.length)) {
    return null; // Don't render if no data
  }

  return (
    <Card className="mt-6 bg-secondary/50 dark:bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><path d="M10.5 20.5 2.5 17V7l8-4 8 4v10l-4.2 2.1"/><path d="m2.5 7 8 4 8-4"/><path d="M12 11v11"/><path d="m17 14-5 2.5-5-2.5"/><circle cx="12" cy="4" r="1"/></svg>
           "{term}" in the Wild
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="twitter" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="twitter" disabled={!data.tweets?.length}>
                <Twitter className="h-4 w-4 mr-1" /> X (Twitter)
            </TabsTrigger>
            <TabsTrigger value="tiktok" disabled={!data.tiktoks?.length}>
                <Youtube className="h-4 w-4 mr-1" /> TikTok
            </TabsTrigger>
             <TabsTrigger value="reddit" disabled={!data.redditPosts?.length}>
                <MessageSquare className="h-4 w-4 mr-1" /> Reddit
             </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[200px] rounded-md border p-4 bg-background dark:bg-muted/50">
             <TabsContent value="twitter">
                {data.tweets?.length ? (
                    <div className="space-y-4">
                        {data.tweets.map((tweet, index) => (
                            <div key={index} className="text-sm p-3 rounded-md border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                                <p className="font-medium text-blue-800 dark:text-blue-300">@{tweet.author}</p>
                                <p className="mt-1 text-blue-700 dark:text-blue-200">{tweet.text}</p>
                                <a href={tweet.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 dark:text-blue-400 hover:underline mt-1 block">View on X</a>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-center text-muted-foreground text-sm">No examples found on X.</p>}
             </TabsContent>

             <TabsContent value="tiktok">
               {data.tiktoks?.length ? (
                    <div className="space-y-4">
                        {data.tiktoks.map((tiktok, index) => (
                             <div key={index} className="text-sm p-3 rounded-md border border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-900/20">
                                <p className="font-medium text-pink-800 dark:text-pink-300">{tiktok.author}</p>
                                <p className="mt-1 text-pink-700 dark:text-pink-200">{tiktok.caption}</p>
                                <a href={tiktok.url} target="_blank" rel="noopener noreferrer" className="text-xs text-pink-500 dark:text-pink-400 hover:underline mt-1 block">View on TikTok</a>
                            </div>
                        ))}
                    </div>
               ) : <p className="text-center text-muted-foreground text-sm">No examples found on TikTok.</p>}
             </TabsContent>

             <TabsContent value="reddit">
                {data.redditPosts?.length ? (
                    <div className="space-y-4">
                        {data.redditPosts.map((post, index) => (
                            <div key={index} className="text-sm p-3 rounded-md border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
                                <p className="font-medium text-orange-800 dark:text-orange-300">u/{post.author}</p>
                                <p className="font-semibold mt-1 text-orange-900 dark:text-orange-200">{post.title}</p>
                                <p className="mt-1 text-orange-700 dark:text-orange-300 truncate">{post.body}</p>
                                <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-500 dark:text-orange-400 hover:underline mt-1 block">View on Reddit</a>
                            </div>
                        ))}
                    </div>
                 ) : <p className="text-center text-muted-foreground text-sm">No examples found on Reddit.</p>}
             </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}
