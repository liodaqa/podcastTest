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

//   const url = BASE_URL ? `${BASE_URL}${endpoint}` : endpoint;

//   try {
//     const response = await fetch(url, options);

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     try {
//       return await response.json();
//     } catch (error) {
//       console.error('[API Client] Failed to parse JSON response:', error);
//       throw new Error('Failed to parse JSON response');
//     }
//   } catch (error) {
//     console.error('[API Client] Error:', error);
//     throw error;
//   }
// };
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Fetch data from the configured API.
 * @param endpoint - Relative endpoint (e.g., `/us/rss/toppodcasts/limit=100/genre=1310/json`).
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

  let url = BASE_URL;

  // Handle special case for `allorigins.win` in production
  if (BASE_URL.includes('allorigins.win')) {
    url = `${BASE_URL}?url=${encodeURIComponent(`https://itunes.apple.com${endpoint}`)}`;
  } else {
    url = `${BASE_URL}${endpoint}`;
  }

  try {
    console.info('[API Client] Fetching URL:', url);
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    // If `allorigins.win`, extract the contents
    return BASE_URL.includes('allorigins.win')
      ? JSON.parse(json.contents)
      : json;
  } catch (error) {
    console.error('[API Client] Error:', error);
    throw error;
  }
};
