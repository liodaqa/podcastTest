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
 * @param timeout - Timeout in milliseconds for the request (default: 10 seconds).
 * @returns Parsed JSON response.
 */
export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {},
  timeout = 10000
): Promise<T> => {
  if (!endpoint) {
    throw new Error('[API Client] Endpoint cannot be empty.');
  }

  const isProduction = import.meta.env.MODE === 'production';
  const fullUrl = isProduction
    ? `${BASE_URL}?url=${encodeURIComponent(`https://itunes.apple.com${endpoint}`)}`
    : `${BASE_URL}${endpoint}`;

  console.log('[API Client] Final URL used in request:', fullUrl);

  // AbortController for timeout handling
  const controller = new AbortController();
  const signal = controller.signal;

  // Set a timeout to abort the request
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(fullUrl, { ...options, signal });

    clearTimeout(timeoutId); // Clear the timeout once the response is received

    if (!response.ok) {
      throw new Error(
        `[API Client] HTTP error! status: ${response.status}, URL: ${fullUrl}`
      );
    }

    const textResponse = await response.text(); // Get raw response as text
    console.log('[API Client] Raw Response:', textResponse);

    const data = JSON.parse(textResponse);

    // In production, handle `contents` field if using a proxy service like allorigins.win
    if (isProduction && data.contents) {
      console.log('[API Client] Parsed contents:', data.contents);
      return JSON.parse(data.contents) as T;
    }

    // Validate and return the parsed data
    validateResponse(data, endpoint);
    return data as T;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('[API Client] Request timed out:', fullUrl);
      } else {
        console.error('[API Client] Error:', error.message);
      }
    } else {
      console.error('[API Client] Unknown error:', error);
    }

    throw error;
  }
};

/**
 * Validate the API response structure to ensure completeness.
 * @param data - The parsed API response.
 * @param endpoint - The endpoint for logging.
 */
const validateResponse = (data: any, endpoint: string): void => {
  if (!data || typeof data !== 'object') {
    throw new Error(
      `[API Client] Invalid response format for endpoint: ${endpoint}`
    );
  }

  if (!data.feed || !data.feed.entry) {
    console.warn(
      '[API Client] Response might be incomplete. Missing feed or entry:',
      data
    );
  }
};

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

//   const isProduction = import.meta.env.MODE === 'production';
//   const url = isProduction
//     ? `${BASE_URL}?url=${encodeURIComponent(`https://itunes.apple.com${endpoint}`)}`
//     : `${BASE_URL}${endpoint}`;

//   console.log('Final URL used in request:', url);

//   try {
//     const response = await fetch(url, options);

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();

//     // Parse the `contents` field if in production
//     if (isProduction && data.contents) {
//       return JSON.parse(data.contents) as T;
//     }

//     return data as T;
//   } catch (error) {
//     console.error('[API Client] Error:', error);
//     throw error;
//   }
// };
