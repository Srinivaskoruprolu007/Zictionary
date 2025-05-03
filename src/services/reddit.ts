/**
 * Represents a Reddit post.
 */
export interface RedditPost {
  /**
   * The title of the Reddit post.
   */
  title: string;
  /**
   * The body of the Reddit post.
   */
  body: string;
  /**
   * The author of the Reddit post.
   */
  author: string;
  /**
   * The URL of the Reddit post.
   */
  url: string;
}

/**
 * Asynchronously retrieves Reddit posts that contain the given term.
 * MOCK IMPLEMENTATION.
 *
 * @param term The term to search for.
 * @returns A promise that resolves to an array of RedditPost objects.
 * @throws {Error} If the mock API call fails.
 */
export async function getRedditPosts(term: string): Promise<RedditPost[]> {
  console.log(`Mock fetching Reddit posts for term: "${term}"`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));

  // Simulate potential error
  if (Math.random() < 0.05) { // 5% chance of error
    console.error("Mock Reddit API error");
    throw new Error("Failed to fetch Reddit posts (mock error)");
  }

  // Return mock data, potentially filtering or modifying based on the term for more realism
  const mockData: RedditPost[] = [
    {
      title: `Thoughts on the term "${term}"?`,
      body: `Just heard someone use "${term}" and I'm trying to understand the context. Is it cool or cringe?`,
      author: 'CuriousGeorge',
      url: 'https://www.reddit.com/r/slang/post1',
    },
    {
      title: `How often do you use "${term}"?`,
      body: `Seeing "${term}" everywhere lately. Is it part of your daily vocab?`,
      author: 'LingoLover',
      url: 'https://www.reddit.com/r/GenZ/post2',
    },
     {
      title: `Explaining "${term}" to my parents`,
      body: `Tried explaining "${term}" to my boomer parents... it didn't go well. 😂`,
      author: 'TeenTalk',
      url: 'https://www.reddit.com/r/funny/post3',
    },
  ];

   // Simple filter based on the term being present in title or body (case-insensitive)
   const filteredData = mockData.filter(post =>
       post.title.toLowerCase().includes(term.toLowerCase()) ||
       post.body.toLowerCase().includes(term.toLowerCase())
   );


   // Return only a subset if filtered, or the first few if not specifically filtered matching the term
   if(filteredData.length > 0) {
        return filteredData.slice(0, 2); // Limit results
   } else {
        // If the term didn't directly match, return generic results mentioning it
        return mockData.filter(p => p.title.includes(`"${term}"`) || p.body.includes(`"${term}"`)).slice(0, 2);
   }
}
