import apiClient from './apiClient';

/**
 * Fetches the target URL via AllOrigins.
 * Note the trailing slash after "get" to avoid 404 errors.
 * @param targetUrl The URL to fetch.
 * @returns Parsed JSON data from the proxied response.
 */
export const getWithAllOrigins = async (targetUrl: string): Promise<any> => {
  const allOriginsBase = 'https://api.allorigins.win/get?url=';
  const fullUrl = `${allOriginsBase}${encodeURIComponent(targetUrl)}`;
  const response = await apiClient.get(fullUrl);
  // AllOrigins returns an object with a "contents" property that is a JSON string.
  return JSON.parse(response.data.contents);
};

export default getWithAllOrigins;
