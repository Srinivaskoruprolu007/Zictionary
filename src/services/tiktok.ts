/**
 * Represents a TikTok video.
 */
export interface TikTokVideo {
  /**
   * The URL of the TikTok video.
   */
  url: string;
  /**
   * The caption of the TikTok video.
   */
  caption: string;
  /**
   * The username of the TikTok video's author.
   */
  author: string;
}

/**
 * Asynchronously retrieves TikTok videos that contain the given term.
 * MOCK IMPLEMENTATION.
 *
 * @param term The term to search for.
 * @returns A promise that resolves to an array of TikTokVideo objects.
 * @throws {Error} If the mock API call fails.
 */
export async function getTikTokVideos(term: string): Promise<TikTokVideo[]> {
   console.log(`Mock fetching TikTok videos for term: "${term}"`);
   // Simulate network delay
   await new Promise(resolve => setTimeout(resolve, Math.random() * 600 + 150));

   // Simulate potential error
   if (Math.random() < 0.05) { // 5% chance of error
       console.error("Mock TikTok API error");
       throw new Error("Failed to fetch TikTok videos (mock error)");
   }

   // Return mock data, potentially filtering or modifying based on the term
   const mockData: TikTokVideo[] = [
    {
      url: 'https://www.tiktok.com/@trendsetter/video1',
      caption: `Using "${term}" in my latest skit! #slang #genz`,
      author: '@trendsetter',
    },
    {
      url: 'https://www.tiktok.com/@explainer/video2',
      caption: `What does "${term}" actually mean? Let's break it down. #lingo #meaning`,
      author: '@explainer',
    },
     {
      url: 'https://www.tiktok.com/@comedyking/video3',
      caption: `My reaction when someone uses "${term}" incorrectly 😂 #comedy #fail`,
      author: '@comedyking',
    },
  ];

   // Simple filter based on the term being present in the caption (case-insensitive)
   const filteredData = mockData.filter(video =>
       video.caption.toLowerCase().includes(term.toLowerCase())
   );

   // Return only a subset
   return filteredData.slice(0, 2); // Limit results
}
