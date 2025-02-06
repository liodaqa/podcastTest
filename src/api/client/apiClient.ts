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
/**
 * Utility function to build API request URLs.
 * Supports proxying via allorigins.win.
 */
export const apiClient = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`[API Client] ❌ HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('[API Client] ❌ Error:', error);
    throw error;
  }
};

// const buildUrl = (baseUrl: string, endpoint: string): string => {
//   return `${baseUrl}${endpoint}`;
// };

// export const apiClient = async <T>(
//   endpoint: string,
//   options: RequestInit = {},
//   baseUrl?: string
// ): Promise<T> => {
//   if (!endpoint) {
//     throw new Error('[API Client] ❌ Error: Endpoint cannot be empty');
//   }

//   const BASE_URL = baseUrl || import.meta.env.VITE_API_BASE_URL;
//   const url = buildUrl(BASE_URL, endpoint);

//   // ✅ Debugging logs to verify environment and API URL
//   console.log(`[API Client] Fetching: ${url}`);
//   console.log(`🌎 Environment Mode: ${import.meta.env.MODE}`);
//   console.log(
//     `🔑 SECRET_KEY Exists: ${import.meta.env.VITE_SECRET_KEY ? '✔️ Yes' : '❌ No'}`
//   );
//   console.log(`🔍 Using API Base URL: ${BASE_URL}`);

//   if (!BASE_URL) {
//     console.error(
//       '❌ ERROR: VITE_API_BASE_URL is missing! Check your environment variables.'
//     );
//     throw new Error('VITE_API_BASE_URL is not defined');
//   }

//   try {
//     const response = await fetch(url, options);

//     if (!response.ok) {
//       throw new Error(`[API Client] ❌ HTTP error! Status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('[API Client] ❌ Error:', error);
//     throw error;
//   }
// };
