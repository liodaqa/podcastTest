// const BASE_URL =
//   import.meta.env.MODE === 'production' ? 'https://itunes.apple.com' : '/api';

// export const apiClient = async <T>(
//   endpoint: string,
//   options: RequestInit = {}
// ): Promise<T> => {
//   if (!endpoint) {
//     throw new Error('Endpoint cannot be empty');
//   }

//   const url = `${BASE_URL}${endpoint}`;
//   console.log(url, 'Final URL used in request');

//   try {
//     const response = await fetch(url, options);

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('[API Client] Error:', error);
//     throw error;
//   }
// };
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/proxy';

export const apiClient = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  if (!endpoint) {
    throw new Error('Endpoint cannot be empty');
  }

  const targetUrl = `https://itunes.apple.com${endpoint}`;
  const url = `${BASE_URL}?url=${encodeURIComponent(targetUrl)}`;

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
