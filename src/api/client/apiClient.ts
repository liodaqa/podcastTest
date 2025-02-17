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
export const buildUrl = (baseUrl: string, endpoint: string): string => {
  // In development, use relative URLs so that Vite's proxy is used.
  if (import.meta.env.DEV) {
    return endpoint;
  }
  // In production, if it's a lookup endpoint, use corsproxy.io.
  if (endpoint.startsWith('/lookup')) {
    return `https://corsproxy.io/?${encodeURIComponent(`${baseUrl}${endpoint}`)}`;
  }
  // Otherwise, use the full URL.
  return `${baseUrl}${endpoint}`;
};

export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {},
  baseUrl?: string
): Promise<T> => {
  if (!endpoint) {
    throw new Error('Endpoint cannot be empty');
  }

  const BASE_URL =
    baseUrl || import.meta.env.VITE_API_BASE_URL || 'https://itunes.apple.com';
  const url = buildUrl(BASE_URL, endpoint);

  console.log('[API Client] Full URL:', url);

  try {
    const response = await fetch(url, options);
    console.log('[API Client] Response Status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const rawData = await response.json();
    // Some proxies wrap the response in { contents: "stringified JSON" }
    return rawData.contents ? JSON.parse(rawData.contents) : rawData;
  } catch (error) {
    console.error('[API Client] Error:', error);
    throw error;
  }
};

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

//     export const buildUrl = (baseUrl: string, endpoint: string): string => {
//       if (endpoint.startsWith('/lookup')) {
//         return `https://corsproxy.io/?${encodeURIComponent(`${baseUrl}${endpoint}`)}`;
//       }
//       return `${baseUrl}${endpoint}`;
//     };
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
//     return BASE_URL.includes('allorigins.win') && rawData.contents
//       ? JSON.parse(rawData.contents)
//       : rawData;
//   } catch (error) {
//     console.error('[API Client] Error:', error);
//     throw error;
//   }
// };

// src/hooks/usePodcastData.ts

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
// const response = await fetch(url, options);

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

// export const apiClient = async <T>(endpoint: string): Promise<T> => {
//   try {
//     const response = await fetch(`https://itunes.apple.com${endpoint}`);

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error(`[API Client] Request failed for ${endpoint}:`, error);
//     throw error;
//   }
// };

// const isDevelopment = import.meta.env.MODE === 'development';
// const API_BASE = isDevelopment ? '/api' : 'https://itunes.apple.com';
// const PROXY_URL = 'https://api.allorigins.win/get?url=';

// /** Fetch Data (No Caching Here) */
// export const apiClient = async <T>(endpoint: string): Promise<T> => {
//   try {
//     let url = isDevelopment
//       ? `${API_BASE}${endpoint}`
//       : `${PROXY_URL}${encodeURIComponent(`${API_BASE}${endpoint}`)}`;

//     const response = await fetch(url);
//     if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//     const data = await response.json();
//     return isDevelopment ? data : JSON.parse(data.contents); // Handle proxy response
//   } catch (error) {
//     console.error(`[API Client] Fetch failed for ${endpoint}:`, error);
//     throw error;
//   }
// };

// import { getCachedData, setCachedData } from '@/api/utils/cacheUtil';

// const PROXY_URL = 'https://api.allorigins.win/get?url='; // Proxy service URL
// const API_BASE = 'https://itunes.apple.com';

// /** Fetch Data with Caching */
// export const apiClient = async <T>(endpoint: string): Promise<T> => {
//   const cacheKey = `api-${endpoint}`;
//   const cachedResponse = await getCachedData<T>(cacheKey);

//   // Return cached data if available
//   if (cachedResponse) return cachedResponse;

//   try {
//     // Use the proxy to fetch data
//     const url = `${API_BASE}${endpoint}`;
//     const proxyUrl = `${PROXY_URL}${encodeURIComponent(url)}`;

//     const response = await fetch(proxyUrl);
//     if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//     // Parse the response from the proxy
//     const data = await response.json();
//     const parsedData = JSON.parse(data.contents); // Proxy wraps the response in `contents`

//     // Cache the parsed data
//     await setCachedData(cacheKey, parsedData);
//     return parsedData;
//   } catch (error) {
//     console.error(`[API Client] Fetch failed for ${endpoint}:`, error);
//     throw error;
//   }
// };
// import { getCachedData, setCachedData } from '@/api/utils/cacheUtil';

// const API_BASE = 'https://itunes.apple.com';

// /** Fetch Data with Caching */
// export const apiClient = async <T>(endpoint: string): Promise<T> => {
//   const cacheKey = `api-${endpoint}`;
//   const cachedResponse = await getCachedData<T>(cacheKey);
//   if (cachedResponse) return cachedResponse;

//   try {
//     const response = await fetch(`${API_BASE}${endpoint}`);
//     if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//     const data = await response.json();
//     await setCachedData(cacheKey, data); // ✅ Store in IndexedDB
//     return data;
//   } catch (error) {
//     console.error(`[API Client] Fetch failed for ${endpoint}:`, error);
//     throw error;
//   }
// };
// export const apiClient = async <T>(endpoint: string): Promise<T> => {
//   const BASE_URL = '/itunes'; // Proxy set in vite.config.ts
//   const url = `${BASE_URL}${endpoint}`;

//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     return response.json();
//   } catch (error) {
//     console.error(`[API Client] Error fetching ${url}:`, error);
//     throw error;
//   }
// };

// const CORS_PROXIES = [
//   'https://api.codetabs.com/v1/proxy/?quest=',
//   'https://thingproxy.freeboard.io/fetch/',
//   'https://api.allorigins.win/get?url=',
// ];

// const buildUrl = (endpoint: string, proxyIndex = 0): string => {
//   if (proxyIndex >= CORS_PROXIES.length) {
//     throw new Error('All CORS proxies failed!');
//   }
//   return `${CORS_PROXIES[proxyIndex]}${encodeURIComponent(`https://itunes.apple.com${endpoint}`)}`;
// };

// export const apiClient = async <T>(
//   endpoint: string,
//   options: RequestInit = {},
//   proxyIndex = 0
// ): Promise<T> => {
//   if (!endpoint) throw new Error('Endpoint cannot be empty');

//   const url = buildUrl(endpoint, proxyIndex);

//   try {
//     const response = await fetch(url, options);
//     if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//     const rawData = await response.json();
//     return CORS_PROXIES[proxyIndex].includes('allorigins.win') &&
//       rawData.contents
//       ? JSON.parse(rawData.contents)
//       : rawData;
//   } catch (error) {
//     console.warn(`[API Client] Proxy ${proxyIndex} failed, trying next one...`);
//     return apiClient(endpoint, options, proxyIndex + 1);
//   }
// };

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
