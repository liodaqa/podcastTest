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
// const BASE_URL =
//   import.meta.env.MODE === 'production'
//     ? import.meta.env.VITE_API_BASE_URL
//     : 'http://localhost:3000/api/proxy';

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

//   const url = `${BASE_URL}?target=https://itunes.apple.com${endpoint}`;
//   console.log('Constructed URL:', url);

//   try {
//     const response = await fetch(url, options);

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('[API Client] Error:', error);
//     throw error;
//   }
// };
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  if (!endpoint) {
    throw new Error('Endpoint cannot be empty');
  }

  const isProduction = import.meta.env.MODE === 'production';
  const url = isProduction
    ? `${BASE_URL}?url=${encodeURIComponent(`https://itunes.apple.com${endpoint}`)}`
    : `${BASE_URL}${endpoint}`;

  console.log(url, 'Final URL used in request');

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[API Client] Error:', error);
    throw error;
  }
};
