// import { apiClient } from '@/api/client/apiClient';
// import { getCachedData, setCachedData } from '@/api/utils/cacheUtil';
// import { Podcast, DetailedPodcast, Episode } from '@/types/PodcastTypes';

// const CACHE_DURATION = 86400000; // 24 hours
// const PODCASTS_ENDPOINT = '/us/rss/toppodcasts/limit=100/genre=1310/json';

// /**
//  * Fetch all podcasts from cache or API.
//  */
// export const fetchPodcasts = async (): Promise<Podcast[]> => {
//   const cacheKey = 'podcasts';

//   // ✅ Fetch from cache
//   const cachedData = getCachedData<Podcast[]>(cacheKey, CACHE_DURATION);
//   if (cachedData) return cachedData;

//   try {
//     const rawData = await apiClient<{ feed: { entry: any[] } }>(
//       PODCASTS_ENDPOINT
//     );

//     if (!rawData?.feed?.entry) throw new Error('Invalid podcast data format');

//     const podcasts: Podcast[] = rawData.feed.entry.map((item) => ({
//       id: item.id.attributes['im:id'],
//       name: item['im:name'].label,
//       artist: item['im:artist'].label,
//       artwork: item['im:image']?.[2]?.label || '',
//       summary: item.summary?.label || 'No summary available',
//     }));

//     // ✅ Store podcasts list in cache
//     setCachedData(cacheKey, podcasts);

//     return podcasts;
//   } catch (error) {
//     console.error('[PodcastService] Error fetching podcasts:', error);
//     throw error;
//   }
// };

// /**
//  * Fetch details of a specific podcast.
//  */
// export const fetchPodcastDetails = async (
//   podcastId: string
// ): Promise<DetailedPodcast> => {
//   const cacheKey = `podcast-${podcastId}`;

//   // ✅ Fetch from cache
//   const cachedData = getCachedData<DetailedPodcast>(cacheKey, CACHE_DURATION);
//   if (cachedData && cachedData.episodes?.length > 0) return cachedData;

//   try {
//     const rawData = await apiClient<{ results: any[] }>(
//       `/lookup?id=${podcastId}&entity=podcastEpisode`
//     );

//     if (!rawData?.results?.length)
//       throw new Error('Invalid podcast details or data format');

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
//       summary: podcastData.description || 'No summary available',
//       description: podcastData.description || 'No description available',
//       episodes,
//     };

//     // ✅ Store in cache
//     setCachedData(cacheKey, podcastDetails);
//     return podcastDetails;
//   } catch (error) {
//     console.error(
//       `[PodcastService] Error fetching podcast details for ID ${podcastId}:`,
//       error
//     );
//     throw error;
//   }
// };
import { apiClient } from '@/api/client/apiClient';
import { getCachedData, setCachedData } from '@/api/utils/cacheUtil';
import { Podcast, DetailedPodcast, Episode } from '@/types/PodcastTypes';

const CACHE_DURATION = 86400000; // 24 hours
const PODCASTS_ENDPOINT = '/us/rss/toppodcasts/limit=100/genre=1310/json';

/**
 * Fetch all podcasts from cache or API.
 */
export const fetchPodcasts = async (): Promise<Podcast[]> => {
  const cacheKey = 'podcasts';

  // ✅ Fetch from cache
  const cachedData = getCachedData<Podcast[]>(cacheKey, CACHE_DURATION);
  if (cachedData) return cachedData;

  try {
    const rawData = await apiClient<{ feed: { entry: any[] } }>(
      PODCASTS_ENDPOINT
    );

    if (!rawData?.feed?.entry) throw new Error('Invalid podcast data format');

    const podcasts: Podcast[] = rawData.feed.entry.map((item) => ({
      id: item.id.attributes['im:id'],
      name: item['im:name'].label,
      artist: item['im:artist'].label,
      artwork: item['im:image']?.[2]?.label || '',
      summary: item.summary?.label || 'No summary available',
    }));

    // ✅ Store podcasts list in cache
    setCachedData(cacheKey, podcasts);

    return podcasts;
  } catch (error) {
    console.error('[PodcastService] Error fetching podcasts:', error);
    throw error;
  }
};

/**
 * Fetch details of a specific podcast.
 */
export const fetchPodcastDetails = async (
  podcastId: string
): Promise<DetailedPodcast> => {
  const cacheKey = `podcast-${podcastId}`;

  // ✅ Fetch from cache
  const cachedData = getCachedData<DetailedPodcast>(cacheKey, CACHE_DURATION);
  if (cachedData && cachedData.episodes?.length > 0) return cachedData;

  try {
    const rawData = await apiClient<{ results: any[] }>(
      `/lookup?id=${podcastId}&entity=podcastEpisode`
    );

    if (!rawData?.results?.length)
      throw new Error('Invalid podcast details or data format');

    const podcastData = rawData.results[0];

    const episodes: Episode[] = rawData.results.slice(1, 50).map((ep) => ({
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
      summary: podcastData.description || 'No summary available',
      description: podcastData.description || 'No description available',
      episodes,
    };

    // ✅ Store in cache
    setCachedData(cacheKey, podcastDetails);
    return podcastDetails;
  } catch (error) {
    console.error(
      `[PodcastService] Error fetching podcast details for ID ${podcastId}:`,
      error
    );
    throw error;
  }
};
