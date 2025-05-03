import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Ensure the API key is available before initializing
const googleApiKey = process.env.GOOGLE_GENAI_API_KEY;
if (!googleApiKey) {
    console.error("Missing GOOGLE_GENAI_API_KEY environment variable. Genkit Google AI plugin will not be initialized.");
    // Optionally throw an error to prevent startup if the key is essential
    // throw new Error("Missing GOOGLE_GENAI_API_KEY environment variable.");
}

export const ai = genkit({
  promptDir: './prompts',
  plugins: [
    // Only initialize the plugin if the API key exists
    googleApiKey ? googleAI({ apiKey: googleApiKey }) : undefined,
  ].filter(Boolean) as any[], // Filter out undefined plugins and assert type
  // Consider setting a default model or handling cases where no model is available if the API key is missing
  model: googleApiKey ? 'googleai/gemini-2.0-flash' : undefined, // Make model conditional
   logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'info', // Adjust log level for production
});
