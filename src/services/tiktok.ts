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
 *
 * @param term The term to search for.
 * @returns A promise that resolves to an array of TikTokVideo objects.
 */
export async function getTikTokVideos(term: string): Promise<TikTokVideo[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      url: 'https://www.tiktok.com/@example/video1',
      caption: 'Using the new slang!',
      author: '@example',
    },
    {
      url: 'https://www.tiktok.com/@another/video2',
      caption: 'Is this slang dead?',
      author: '@another',
    },
  ];
}
