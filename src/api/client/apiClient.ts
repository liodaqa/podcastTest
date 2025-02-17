// const CORS_PROXY = 'https://corsproxy.io/?'; // Use a reliable CORS proxy

// export const apiClient = async <T>(
//   endpoint: string,
//   retries = 3
// ): Promise<T | null> => {
//   const url = `${CORS_PROXY}https://itunes.apple.com${endpoint}`;

//   for (let attempt = 1; attempt <= retries; attempt++) {
//     try {
//       const response = await fetch(url);

//       if (!response.ok) {
//         console.warn(
//           `[API Client] Attempt ${attempt} failed for ${endpoint}: ${response.statusText}`
//         );
//         continue;
//       }

//       const data = await response.json();

//       if (data) {
//         return data as T;
//       }
//     } catch (error) {
//       console.error(`[API Client] Attempt ${attempt} failed:`, error);
//     }
//   }

//   console.error(`[API Client] Failed after ${retries} retries.`);
//   return null; // Ensure a return statement at the end of the function
// };
// src/api/client/apiClient.ts
/**
 * Build the full URL for the API request.
 * Handles proxy logic for allorigins.win.
 * @param baseUrl - The base URL of the API.
 * @param endpoint - The relative API endpoint.
 * @returns The full URL for the API request.
 */
// const buildUrl = (baseUrl: string, endpoint: string): string => {
//   const isUsingProxy = baseUrl.includes('allorigins.win');

//   return isUsingProxy
//     ? `${baseUrl}/get?url=${encodeURIComponent(`https://itunes.apple.com${endpoint}`)}`
//     : `https://itunes.apple.com${endpoint}`;
// };
// export const buildUrl = (baseUrl: string, endpoint: string): string => {
//   if (endpoint.startsWith('/lookup')) {
//     // Use a proxy only for podcast details
//     return `https://api.allorigins.win/get?url=${encodeURIComponent(`${baseUrl}${endpoint}`)}`;
//   }
//   return `${baseUrl}${endpoint}`;
// };

// export const buildUrl = (baseUrl: string, endpoint: string): string => {
//   if (endpoint.startsWith('/lookup')) {
//     return `https://api.allorigins.win/get?url=${encodeURIComponent(`${baseUrl}${endpoint}`)}`;
//   }
//   return `${baseUrl}${endpoint}`;
// };
// export const buildUrl = (baseUrl: string, endpoint: string): string => {
//   if (endpoint.startsWith('/lookup')) {
//     return `https://corsproxy.io/?${encodeURIComponent(`${baseUrl}${endpoint}`)}`;
//   }
//   return `${baseUrl}${endpoint}`;
// };

// export const buildUrl = (baseUrl: string, endpoint: string): string => {
//   if (endpoint.startsWith('/lookup')) {
//     return `${baseUrl}${endpoint}`;
//   }
//   return `${baseUrl}${endpoint}`;
// };

// export const apiClient = async <T>(
//   endpoint: string,
//   options: RequestInit = {},
//   baseUrl?: string
// ): Promise<T> => {
//   if (!endpoint) {
//     throw new Error('Endpoint cannot be empty');
//   }

//   const BASE_URL =
//     baseUrl || import.meta.env.VITE_API_BASE_URL || 'https://itunes.apple.com';
//   const url = buildUrl(BASE_URL, endpoint);

//   console.log('[API Client] Full URL:', url);

//   try {
//     const response = await fetch(url, options);
//     console.log('[API Client] Response Status:', response.status);

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const rawData = await response.json();

//     // allorigins.win wraps the response in { contents: "stringified JSON" }
//     return rawData.contents ? JSON.parse(rawData.contents) : rawData;
//   } catch (error) {
//     console.error('[API Client] Error:', error);
//     throw error;
//   }
// };

// export const buildUrl = (baseUrl: string, endpoint: string): string => {
//   if (endpoint.startsWith('/lookup')) {
//     return `https://corsproxy.io/?${baseUrl}${endpoint}`; // Fix: No double encoding
//   }
//   return `${baseUrl}${endpoint}`;
// };

// export const apiClient = async <T>(
//   endpoint: string,
//   options: RequestInit = {},
//   baseUrl?: string
// ): Promise<T> => {
//   if (!endpoint) {
//     throw new Error('Endpoint cannot be empty');
//   }

//   const BASE_URL =
//     baseUrl || import.meta.env.VITE_API_BASE_URL || 'https://itunes.apple.com';
//   const url = buildUrl(BASE_URL, endpoint);

//   console.log('[API Client] Full URL:', url);

//   try {
//     const response = await fetch(url, options);

//     console.log('[API Client] Response Status:', response.status);

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const rawData = await response.json();
//     return rawData;
//   } catch (error) {
//     console.error('[API Client] Error:', error);
//     throw error;
//   }
// };
import axios from 'axios';

const apiClient = axios.create({
  timeout: 15000, // 15 seconds timeout
  // No baseURL is set, as requests will use relative URLs and be proxied by Vite.
});

export default apiClient;

// import axios from 'axios';

// const apiClient = axios.create({
//   baseURL: 'https://itunes.apple.com',
//   // You can configure interceptors or headers here if needed.
// });

// export default apiClient;
