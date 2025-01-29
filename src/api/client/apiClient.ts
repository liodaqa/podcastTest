// /**
//  * Build the full URL for the API request.
//  * Handles proxy logic for allorigins.win.
//  * @param baseUrl - The base URL of the API.
//  * @param endpoint - The relative API endpoint.
//  * @returns The full URL for the API request.
//  */
// const buildUrl = (baseUrl: string, endpoint: string): string => {
//   const isProxy = baseUrl.includes('allorigins.win');
//   return isProxy
//     ? `${baseUrl}?url=${encodeURIComponent(`https://itunes.apple.com${endpoint}`)}`
//     : `${baseUrl}${endpoint}`;
// };

// /**
//  * Centralized function to fetch data from the API.
//  * @param endpoint - The relative API endpoint.
//  * @param options - Additional fetch options (e.g., headers, body).
//  * @param baseUrl - Optional base URL for overriding (used in tests or dynamic cases).
//  * @returns Parsed JSON response.
//  */
// export const apiClient = async <T>(
//   endpoint: string,
//   options: RequestInit = {},
//   baseUrl?: string
// ): Promise<T> => {
//   if (!endpoint) {
//     throw new Error('Endpoint cannot be empty');
//   }

//   const BASE_URL = baseUrl || import.meta.env.VITE_API_BASE_URL || '/api';
//   const url = buildUrl(BASE_URL, endpoint);

//   try {
//     const response = await fetch(url, options);

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const rawData = await response.json();
//     return BASE_URL.includes('allorigins.win') && rawData.contents
//       ? JSON.parse(rawData.contents)
//       : rawData;
//   } catch (error) {
//     console.error('[API Client] Error:', error);
//     throw error;
//   }
// };
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Build the full URL for the API request.
 * Handles proxy logic for allorigins.win.
 * @param baseUrl - The base URL of the API.
 * @param endpoint - The relative API endpoint.
 * @returns The full URL for the API request.
 */
const buildUrl = (baseUrl: string, endpoint: string): string => {
  const isProxy = baseUrl.includes('allorigins.win');
  return isProxy
    ? `${baseUrl}?url=${encodeURIComponent(`https://itunes.apple.com${endpoint}`)}`
    : `${baseUrl}${endpoint}`;
};

/**
 * Centralized function to fetch data from the API.
 * @param endpoint - The relative API endpoint.
 * @param options - Additional fetch options (e.g., headers, body).
 * @param baseUrl - Optional base URL for overriding (used in tests or dynamic cases).
 * @returns Parsed JSON response.
 */
export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {},
  baseUrl?: string
): Promise<T> => {
  if (!endpoint) {
    throw new Error('Endpoint cannot be empty');
  }

  const BASE_URL = baseUrl || import.meta.env.VITE_API_BASE_URL || '/api';
  const url = buildUrl(BASE_URL, endpoint);

  console.log(`[API Client] Requesting URL: ${url}`);

  try {
    const response = await fetch(url, options);

    // Handle non-2xx responses
    if (!response.ok) {
      console.error(`[API Client] HTTP error! Status: ${response.status}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Ensure response is not empty before parsing
    const text = await response.text();
    if (!text) {
      console.error('[API Client] Received empty response from API.');
      throw new Error('Received empty response from API.');
    }

    try {
      const rawData = JSON.parse(text);

      // If using allorigins.win, extract `contents`
      if (BASE_URL.includes('allorigins.win') && rawData.contents) {
        return JSON.parse(rawData.contents);
      }

      return rawData;
    } catch (error) {
      console.error('[API Client] Failed to parse JSON response:', text);
      throw new Error('Failed to parse JSON response.');
    }
  } catch (error) {
    console.error('[API Client] Error:', error);
    throw error;
  }
};
