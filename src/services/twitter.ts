/**
 * Represents a Tweet (or post on X).
 */
export interface Tweet {
  /**
   * The text of the tweet.
   */
  text: string;
  /**
   * The username of the tweet's author.
   */
  author: string;

  /**
   * The URL to the tweet.
   */
  url: string;
}

/**
 * Asynchronously retrieves Tweets that contain the given term.
 * MOCK IMPLEMENTATION.
 *
 * @param term The term to search for.
 * @returns A promise that resolves to an array of Tweets.
 * @throws {Error} If the mock API call fails.
 */
export async function getTweets(term: string): Promise<Tweet[]> {
   console.log(`Mock fetching Tweets for term: "${term}"`);
   // Simulate network delay
   await new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 100));

   // Simulate potential error
   if (Math.random() < 0.05) { // 5% chance of error
       console.error("Mock Twitter API error");
       throw new Error("Failed to fetch Tweets (mock error)");
   }

   // Return mock data, potentially filtering or modifying based on the term
   const mockData: Tweet[] = [
    {
      text: `Just learned what "${term}" means lol, feeling old.`,
      author: 'MillennialMike',
      url: 'https://twitter.com/MillennialMike/status/12345',
    },
    {
      text: `Is it just me or is "${term}" already kinda overused? 🤔 #genzslang`,
      author: 'SlangWatcher',
      url: 'https://twitter.com/SlangWatcher/status/67890',
    },
     {
      text: `My friend just used "${term}" in a sentence and I pretended to know what it meant.`,
      author: 'ConfusedConnie',
      url: 'https://twitter.com/ConfusedConnie/status/11223',
    },
  ];

   // Simple filter based on the term being present in the text (case-insensitive)
   const filteredData = mockData.filter(tweet =>
       tweet.text.toLowerCase().includes(term.toLowerCase())
   );

   // Return only a subset
   return filteredData.slice(0, 2); // Limit results
}
