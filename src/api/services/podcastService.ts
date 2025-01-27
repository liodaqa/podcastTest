// import { apiClient } from '../client/apiClient';
// import { getCachedData, setCachedData } from '../utils/cacheUtil';
// import { Podcast, DetailedPodcast, Episode } from '../../types/PodcastTypes';

// const CACHE_DURATION = 86400000; // 24 hours
// const PODCASTS_ENDPOINT = '/us/rss/toppodcasts/limit=100/genre=1310/json';

// /**
//  * Fetch all podcasts.
//  * This function fetches and returns the transformed list of podcasts.
//  */
// export const fetchPodcasts = async (): Promise<Podcast[]> => {
//   const cacheKey = 'podcasts';
//   const cachedData = getCachedData<Podcast[]>(cacheKey, CACHE_DURATION);

//   if (cachedData) {
//     return cachedData;
//   }

//   try {
//     const rawData = await apiClient<{ feed: { entry: any[] } }>(
//       PODCASTS_ENDPOINT
//     );

//     if (!rawData?.feed?.entry) {
//       throw new Error('Invalid podcast data format');
//     }

//     const podcasts: Podcast[] = rawData.feed.entry.map((item) => ({
//       id: item.id.attributes['im:id'],
//       name: item['im:name'].label,
//       artist: item['im:artist'].label,
//       artwork: item['im:image']?.[2]?.label || '',
//       summary: item.summary?.label || 'No summary available',
//     }));

//     setCachedData(cacheKey, podcasts);
//     return podcasts;
//   } catch (error) {
//     console.error('[PodcastService] Error fetching podcasts:', error);
//     throw error;
//   }
// };

// /**
//  * Fetch details of a specific podcast, including its episodes.
//  */
// export const fetchPodcastDetails = async (
//   podcastId: string
// ): Promise<DetailedPodcast> => {
//   const cacheKey = `podcast-${podcastId}`;
//   const cachedData = getCachedData<DetailedPodcast>(cacheKey, CACHE_DURATION);

//   if (cachedData) {
//     return cachedData;
//   }

//   try {
//     const [allPodcasts, rawData] = await Promise.all([
//       apiClient<{ feed: { entry: any[] } }>(PODCASTS_ENDPOINT),
//       apiClient<{ results: any[] }>(
//         `/lookup?id=${podcastId}&entity=podcastEpisode`
//       ),
//     ]);

//     if (!rawData?.results?.length || !allPodcasts?.feed?.entry) {
//       throw new Error('Invalid podcast details or data format');
//     }

//     const podcastSummary = allPodcasts.feed.entry.find(
//       (entry) => entry.id.attributes['im:id'] === podcastId
//     )?.summary?.label;

//     const podcastData = rawData.results[0];

//     const episodes: Episode[] = rawData.results.slice(1).map((ep) => ({
//       trackId: ep.trackId ?? 0,
//       trackName: ep.trackName ?? 'Unknown Title',
//       releaseDate: ep.releaseDate ?? 'Unknown Date',
//       trackTimeMillis: ep.trackTimeMillis ?? 0,
//       episodeUrl: ep.episodeUrl || '',
//       description: ep.description || 'No description available.',
//     }));

//     const podcastDetails: DetailedPodcast = {
//       id: podcastId,
//       artworkUrl600: podcastData.artworkUrl600 || '',
//       collectionName: podcastData.collectionName || 'Unknown Collection',
//       artistName: podcastData.artistName || 'Unknown Artist',
//       summary: podcastSummary || 'No summary available',
//       description: podcastData.description || 'No description available',
//       episodes,
//     };

//     setCachedData(cacheKey, podcastDetails);
//     return podcastDetails;
//   } catch (error) {
//     console.error('[PodcastService] Error fetching podcast details:', error);
//     throw error;
//   }
// };
import { apiClient } from '../client/apiClient';
import { getCachedData, setCachedData } from '../utils/cacheUtil';
import { Podcast, DetailedPodcast, Episode } from '../../types/PodcastTypes';

const CACHE_DURATION = 86400000; // 24 hours
const PODCASTS_ENDPOINT = '/us/rss/toppodcasts/limit=100/genre=1310/json';

console.log('[PodcastService] Environment:', import.meta.env.MODE);
console.log('[PodcastService] Fetching podcasts from:', PODCASTS_ENDPOINT);

/**
 * Helper function to add timeout handling to API requests.
 */
const fetchWithTimeout = async <T>(
  fetchPromise: Promise<T>,
  timeout = 10000
): Promise<T> => {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out')), timeout)
  );
  return Promise.race([fetchPromise, timeoutPromise]);
};

/**
 * Fetch all podcasts.
 * This function fetches and returns the transformed list of podcasts.
 */
export const fetchPodcasts = async (): Promise<Podcast[]> => {
  const cacheKey = 'podcasts';
  const cachedData = getCachedData<Podcast[]>(cacheKey, CACHE_DURATION);

  if (cachedData) {
    console.info('[PodcastService] Returning cached podcasts.');
    return cachedData;
  }

  try {
    // Attempt to fetch data from the API
    const rawData = await apiClient<{ feed: { entry: any[] } }>(
      PODCASTS_ENDPOINT
    );

    if (!rawData?.feed?.entry) {
      throw new Error('Invalid podcast data format');
    }

    const podcasts: Podcast[] = rawData.feed.entry.map((item) => ({
      id: item.id.attributes['im:id'],
      name: item['im:name'].label,
      artist: item['im:artist'].label,
      artwork: item['im:image']?.[2]?.label || '',
      summary: item.summary?.label || 'No summary available',
    }));

    setCachedData(cacheKey, podcasts);
    return podcasts;
  } catch (error) {
    console.error('[PodcastService] Error fetching podcasts:', error);

    // If API fails, use the fallback JSON data
    try {
      const fallbackResponse = await fetch('/fallback-podcasts.json');
      const fallbackData: Podcast[] = await fallbackResponse.json();
      console.info('[PodcastService] Using fallback data.');
      return fallbackData;
    } catch (fallbackError) {
      console.error(
        '[PodcastService] Fallback data failed to load:',
        fallbackError
      );
      throw fallbackError;
    }
  }
};

/**
 * Fetch details of a specific podcast, including its episodes.
 */
export const fetchPodcastDetails = async (
  podcastId: string,
  forceRefresh = false
): Promise<DetailedPodcast> => {
  const cacheKey = `podcast-${podcastId}`;
  const cachedData = getCachedData<DetailedPodcast>(
    cacheKey,
    CACHE_DURATION,
    forceRefresh
  );

  if (cachedData) {
    console.info(
      `[PodcastService] Returning cached details for podcast ${podcastId}.`
    );
    return cachedData;
  }

  try {
    const [allPodcasts, rawData] = await Promise.all([
      fetchWithTimeout(
        apiClient<{ feed: { entry: any[] } }>(PODCASTS_ENDPOINT),
        10000
      ),
      fetchWithTimeout(
        apiClient<{ results: any[] }>(
          `/lookup?id=${podcastId}&entity=podcastEpisode`
        ),
        10000
      ),
    ]);

    if (!rawData?.results?.length || !allPodcasts?.feed?.entry) {
      throw new Error('Invalid podcast details or data format');
    }

    const podcastSummary = allPodcasts.feed.entry.find(
      (entry) => entry.id.attributes['im:id'] === podcastId
    )?.summary?.label;

    const podcastData = rawData.results[0];

    const episodes: Episode[] = rawData.results.slice(1).map((ep) => ({
      trackId: ep.trackId ?? 0,
      trackName: ep.trackName ?? 'Unknown Title',
      releaseDate: ep.releaseDate ?? 'Unknown Date',
      trackTimeMillis: ep.trackTimeMillis ?? 0,
      episodeUrl: ep.episodeUrl || '',
      description: ep.description || 'No description available.',
    }));

    const podcastDetails: DetailedPodcast = {
      id: podcastId,
      artworkUrl600: podcastData.artworkUrl600 || '',
      collectionName: podcastData.collectionName || 'Unknown Collection',
      artistName: podcastData.artistName || 'Unknown Artist',
      summary: podcastSummary || 'No summary available',
      description: podcastData.description || 'No description available',
      episodes,
    };

    setCachedData(cacheKey, podcastDetails);
    return podcastDetails;
  } catch (error) {
    console.error('[PodcastService] Error fetching podcast details:', error);
    throw error;
  }
};
