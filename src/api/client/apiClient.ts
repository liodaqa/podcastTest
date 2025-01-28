// const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// /**
//  * Fetch data from the configured API.
//  * @param endpoint - Relative endpoint (e.g., `/us/rss/toppodcasts/limit=100/genre=1310/json`).
//  * @param options - Additional fetch options.
//  * @returns Parsed JSON response.
//  */
// export const apiClient = async <T>(
//   endpoint: string,
//   options: RequestInit = {}
// ): Promise<T> => {
//   if (!endpoint) {
//     throw new Error('Endpoint cannot be empty');
//   }

//   let url = BASE_URL;

//   // Handle special case for `allorigins.win` in production
//   if (BASE_URL.includes('allorigins.win')) {
//     url = `${BASE_URL}?url=${encodeURIComponent(`https://itunes.apple.com${endpoint}`)}`;
//   } else {
//     url = `${BASE_URL}${endpoint}`;
//   }

//   try {
//     console.info('[API Client] Fetching URL:', url);
//     const response = await fetch(url, options);

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const json = await response.json();

//     // If `allorigins.win`, extract the contents
//     return BASE_URL.includes('allorigins.win')
//       ? JSON.parse(json.contents)
//       : json;
//   } catch (error) {
//     console.error('[API Client] Error:', error);
//     throw error;
//   }
// };
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://api.allorigins.win/get';

/**
 * Fetch data from the configured API.
 * @param endpoint - The relative API endpoint (e.g., `/us/rss/toppodcasts/limit=100/genre=1310/json`).
 * @param options - Additional fetch options.
 * @returns Parsed JSON response.
 */
export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  if (!endpoint) {
    throw new Error('Endpoint cannot be empty');
  }

  // Construct the full URL with the CORS proxy
  const url = `${BASE_URL}?url=${encodeURIComponent(`https://itunes.apple.com${endpoint}`)}`;

  try {
    console.info('[API Client] Fetching URL:', url);
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const rawData = await response.json();

    // Extract `contents` returned by the proxy
    return JSON.parse(rawData.contents);
  } catch (error) {
    console.error('[API Client] Error:', error);
    throw error;
  }
};
