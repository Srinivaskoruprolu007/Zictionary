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
 *
 * @param term The term to search for.
 * @returns A promise that resolves to an array of RedditPost objects.
 */
export async function getRedditPosts(term: string): Promise<RedditPost[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      title: 'What does this slang mean?',
      body: 'I saw someone use this slang, and I am so confused.',
      author: 'confusedUser',
      url: 'https://www.reddit.com/r/example/post1',
    },
    {
      title: 'Is this slang cringe?',
      body: 'I think this slang is cringe. What do you think?',
      author: 'opinionatedUser',
      url: 'https://www.reddit.com/r/example/post2',
    },
  ];
}
