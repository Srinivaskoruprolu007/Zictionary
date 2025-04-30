/**
 * Represents a Tweet.
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
 *
 * @param term The term to search for.
 * @returns A promise that resolves to an array of Tweets.
 */
export async function getTweets(term: string): Promise<Tweet[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      text: 'I am so skibidi today!',
      author: 'GenZUser123',
      url: 'https://twitter.com/GenZUser123/status/1234567890',
    },
    {
      text: 'This new fit is so bussin bussin.',
      author: 'FashionForward04',
      url: 'https://twitter.com/FashionForward04/status/9876543210',
    },
  ];
}
