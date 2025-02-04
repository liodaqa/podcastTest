// import { apiClient } from '@/api/client/apiClient';
// import { getCachedData, setCachedData } from '@/api/utils/cacheUtil';
// import { Podcast, DetailedPodcast, Episode } from '@/types/PodcastTypes';

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
import { apiClient } from '@/api/client/apiClient';
import { getCachedData, setCachedData } from '@/api/utils/cacheUtil';
import { Podcast, DetailedPodcast, Episode } from '@/types/PodcastTypes';

const CACHE_DURATION = 86400000; // 24 hours
const PODCASTS_ENDPOINT = '/us/rss/toppodcasts/limit=100/genre=1310/json';
const BATCH_SIZE = 10; // Fetch details in batches of 10

/**
 * Fetch all podcasts efficiently with caching.
 */
export const fetchPodcasts = async (): Promise<Podcast[]> => {
  const cacheKey = 'podcasts';
  const cachedData = getCachedData<Podcast[]>(cacheKey, CACHE_DURATION);
  if (cachedData) return cachedData;

  console.time('[PodcastService] Fetch Podcasts Time');

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

    setCachedData(cacheKey, podcasts);
    console.timeEnd('[PodcastService] Fetch Podcasts Time');

    return podcasts;
  } catch (error) {
    console.error('[PodcastService] Error fetching podcasts:', error);
    console.timeEnd('[PodcastService] Fetch Podcasts Time');
    throw error;
  }
};

/**
 * Fetch multiple podcast details in batches, optimizing API requests.
 */
export const fetchPodcastDetailsBatch = async (
  podcastIds: string[]
): Promise<DetailedPodcast[]> => {
  if (!podcastIds.length) return [];
  console.time('[PodcastService] Fetch Podcasts Details Time');

  // ✅ Filter out IDs that are already cached
  const uncachedIds = podcastIds.filter(
    (id) => !getCachedData<DetailedPodcast>(`podcast-${id}`, CACHE_DURATION)
  );

  if (!uncachedIds.length) {
    console.timeEnd('[PodcastService] Fetch Podcasts Details Time');
    return [];
  }

  const fetchBatch = async (batch: string[]) => {
    return Promise.all(
      batch.map(async (podcastId) => {
        const cacheKey = `podcast-${podcastId}`;
        const cachedData = getCachedData<DetailedPodcast>(
          cacheKey,
          CACHE_DURATION
        );
        if (cachedData) return cachedData;

        try {
          const rawData = await apiClient<{ results: any[] }>(
            `/lookup?id=${podcastId}&entity=podcastEpisode`
          );

          if (!rawData?.results?.length)
            throw new Error(`Invalid details for podcast ${podcastId}`);

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
            summary: podcastData.description || 'No summary available',
            description: podcastData.description || 'No description available',
            episodes,
          };

          setCachedData(cacheKey, podcastDetails);
          return podcastDetails;
        } catch (error) {
          console.error(
            `[PodcastService] Error fetching details for podcast ${podcastId}:`,
            error
          );
          return null;
        }
      })
    );
  };

  const allDetails: DetailedPodcast[] = [];
  for (let i = 0; i < uncachedIds.length; i += BATCH_SIZE) {
    const batch = uncachedIds.slice(i, i + BATCH_SIZE);
    const results = await fetchBatch(batch);
    allDetails.push(...results.filter((detail) => detail !== null));
  }

  console.timeEnd('[PodcastService] Fetch Podcasts Details Time');
  return allDetails;
};

// import { apiClient } from '@/api/client/apiClient';
// import { getCachedData, setCachedData } from '@/api/utils/cacheUtil';
// import { Podcast, DetailedPodcast, Episode } from '@/types/PodcastTypes';

// const CACHE_DURATION = 86400000; // 24 hours
// const PODCASTS_ENDPOINT = '/us/rss/toppodcasts/limit=100/genre=1310/json';
// const BATCH_SIZE = 10; // Fetch details in batches of 10

// /**
//  * Fetch all podcasts efficiently with caching.
//  */
// export const fetchPodcasts = async (): Promise<Podcast[]> => {
//   const cacheKey = 'podcasts';
//   const cachedData = getCachedData<Podcast[]>(cacheKey, CACHE_DURATION);
//   if (cachedData) return cachedData;

//   if (console.timeStamp)
//     console.timeStamp('[PodcastService] Fetch Podcasts Started');
//   console.time('[PodcastService] Fetch Podcasts Time');

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

//     setCachedData(cacheKey, podcasts);
//     console.timeEnd('[PodcastService] Fetch Podcasts Time');

//     return podcasts;
//   } catch (error) {
//     console.error('[PodcastService] Error fetching podcasts:', error);
//     console.timeEnd('[PodcastService] Fetch Podcasts Time');
//     throw error;
//   }
// };

// /**
//  * Fetch multiple podcast details in batches to optimize performance.
//  */
// export const fetchPodcastDetailsBatch = async (
//   podcastIds: string[]
// ): Promise<DetailedPodcast[]> => {
//   if (!podcastIds.length) return [];
//   console.time('[PodcastService] Fetch Podcasts Details Time');

//   const fetchBatch = async (batch: string[]) => {
//     return Promise.all(
//       batch.map(async (podcastId) => {
//         const cacheKey = `podcast-${podcastId}`;
//         const cachedData = getCachedData<DetailedPodcast>(
//           cacheKey,
//           CACHE_DURATION
//         );

//         // ✅ Return cached data instead of fetching again
//         if (cachedData) return cachedData;

//         try {
//           const rawData = await apiClient<{ results: any[] }>(
//             `/lookup?id=${podcastId}&entity=podcastEpisode`
//           );

//           if (!rawData?.results?.length)
//             throw new Error(`Invalid details for podcast ${podcastId}`);

//           const podcastData = rawData.results[0];

//           const episodes: Episode[] = rawData.results.slice(1).map((ep) => ({
//             trackId: ep.trackId ?? 0,
//             trackName: ep.trackName ?? 'Unknown Title',
//             releaseDate: ep.releaseDate ?? 'Unknown Date',
//             trackTimeMillis: ep.trackTimeMillis ?? 0,
//             episodeUrl: ep.episodeUrl || '',
//             description: ep.description || 'No description available.',
//           }));

//           const podcastDetails: DetailedPodcast = {
//             id: podcastId,
//             artworkUrl600: podcastData.artworkUrl600 || '',
//             collectionName: podcastData.collectionName || 'Unknown Collection',
//             artistName: podcastData.artistName || 'Unknown Artist',
//             summary: podcastData.description || 'No summary available',
//             description: podcastData.description || 'No description available',
//             episodes,
//           };

//           setCachedData(cacheKey, podcastDetails);
//           return podcastDetails;
//         } catch (error) {
//           console.error(
//             `[PodcastService] Error fetching details for podcast ${podcastId}:`,
//             error
//           );
//           return null;
//         }
//       })
//     );
//   };

//   const allDetails: DetailedPodcast[] = [];
//   for (let i = 0; i < podcastIds.length; i += BATCH_SIZE) {
//     const batch = podcastIds.slice(i, i + BATCH_SIZE);
//     const results = await fetchBatch(batch);
//     allDetails.push(...results.filter((detail) => detail !== null));
//   }

//   console.timeEnd('[PodcastService] Fetch Podcasts Details Time');
//   return allDetails;
// };

// import { apiClient } from '@/api/client/apiClient';
// import { getCachedData, setCachedData } from '@/api/utils/cacheUtil';
// import { Podcast, DetailedPodcast, Episode } from '@/types/PodcastTypes';

// const CACHE_DURATION = 86400000; // 24 hours
// const PODCASTS_ENDPOINT = '/us/rss/toppodcasts/limit=100/genre=1310/json';
// const BATCH_SIZE = 10; // Fetch details in batches of 10

// /**
//  * Fetch all podcasts efficiently with caching.
//  */
// export const fetchPodcasts = async (): Promise<Podcast[]> => {
//   const cacheKey = 'podcasts';
//   const cachedData = getCachedData<Podcast[]>(cacheKey, CACHE_DURATION);
//   if (cachedData) return cachedData;

//   console.time('[PodcastService] Fetch Podcasts Time');

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

//     setCachedData(cacheKey, podcasts);
//     console.timeEnd('[PodcastService] Fetch Podcasts Time'); // Ensure timer always ends

//     return podcasts;
//   } catch (error) {
//     console.error('[PodcastService] Error fetching podcasts:', error);
//     console.timeEnd('[PodcastService] Fetch Podcasts Time'); // Ensure timer always ends
//     throw error;
//   }
// };

// /**
//  * Fetch multiple podcast details in batches to optimize performance.
//  */
// export const fetchPodcastDetailsBatch = async (
//   podcastIds: string[]
// ): Promise<DetailedPodcast[]> => {
//   console.time('[PodcastService] Fetch Podcasts Details Time');

//   const fetchBatch = async (batch: string[]) => {
//     return Promise.all(
//       batch.map(async (podcastId) => {
//         const cacheKey = `podcast-${podcastId}`;
//         const cachedData = getCachedData<DetailedPodcast>(
//           cacheKey,
//           CACHE_DURATION
//         );
//         if (cachedData) return cachedData;

//         try {
//           const rawData = await apiClient<{ results: any[] }>(
//             `/lookup?id=${podcastId}&entity=podcastEpisode`
//           );

//           if (!rawData?.results?.length)
//             throw new Error(`Invalid details for podcast ${podcastId}`);

//           const podcastData = rawData.results[0];

//           const episodes: Episode[] = rawData.results.slice(1).map((ep) => ({
//             trackId: ep.trackId ?? 0,
//             trackName: ep.trackName ?? 'Unknown Title',
//             releaseDate: ep.releaseDate ?? 'Unknown Date',
//             trackTimeMillis: ep.trackTimeMillis ?? 0,
//             episodeUrl: ep.episodeUrl || '',
//             description: ep.description || 'No description available.',
//           }));

//           const podcastDetails: DetailedPodcast = {
//             id: podcastId,
//             artworkUrl600: podcastData.artworkUrl600 || '',
//             collectionName: podcastData.collectionName || 'Unknown Collection',
//             artistName: podcastData.artistName || 'Unknown Artist',
//             summary: podcastData.description || 'No summary available',
//             description: podcastData.description || 'No description available',
//             episodes,
//           };

//           setCachedData(cacheKey, podcastDetails);
//           return podcastDetails;
//         } catch (error) {
//           console.error(
//             `[PodcastService] Error fetching details for podcast ${podcastId}:`,
//             error
//           );
//           return null;
//         }
//       })
//     );
//   };

//   const allDetails: DetailedPodcast[] = [];
//   for (let i = 0; i < podcastIds.length; i += BATCH_SIZE) {
//     const batch = podcastIds.slice(i, i + BATCH_SIZE);
//     const results = await fetchBatch(batch);
//     allDetails.push(...results.filter((detail) => detail !== null));
//   }

//   console.timeEnd('[PodcastService] Fetch Podcasts Details Time'); // Ensure timer always ends
//   return allDetails;
// };

// import { apiClient } from '@/api/client/apiClient';
// import { getCachedData, setCachedData } from '@/api/utils/cacheUtil';
// import { Podcast, DetailedPodcast, Episode } from '@/types/PodcastTypes';

// const CACHE_DURATION = 86400000; // 24 hours
// const PODCASTS_ENDPOINT = '/us/rss/toppodcasts/limit=100/genre=1310/json';
// const BATCH_SIZE = 10; // Fetch details in batches of 10 for efficiency

// /**
//  * Fetch all podcasts efficiently.
//  * Uses caching & streaming for faster responses.
//  */
// export const fetchPodcasts = async (): Promise<Podcast[]> => {
//   const cacheKey = 'podcasts';
//   const cachedData = getCachedData<Podcast[]>(cacheKey, CACHE_DURATION);
//   if (cachedData) return cachedData;

//   console.time('[PodcastService] Fetch Podcasts Time');

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

//     setCachedData(cacheKey, podcasts);
//     console.timeEnd('[PodcastService] Fetch Podcasts Time');

//     return podcasts;
//   } catch (error) {
//     console.error('[PodcastService] Error fetching podcasts:', error);
//     console.timeEnd('[PodcastService] Fetch Podcasts Time');
//     throw error;
//   }
// };

// /**
//  * Fetch multiple podcast details in batches for speed.
//  */
// export const fetchPodcastDetailsBatch = async (
//   podcastIds: string[]
// ): Promise<DetailedPodcast[]> => {
//   console.time('[PodcastService] Fetch Podcasts Details Time');

//   const fetchBatch = async (batch: string[]) => {
//     return Promise.all(
//       batch.map(async (podcastId) => {
//         const cacheKey = `podcast-${podcastId}`;
//         const cachedData = getCachedData<DetailedPodcast>(
//           cacheKey,
//           CACHE_DURATION
//         );
//         if (cachedData) return cachedData;

//         try {
//           const rawData = await apiClient<{ results: any[] }>(
//             `/lookup?id=${podcastId}&entity=podcastEpisode`
//           );

//           if (!rawData?.results?.length)
//             throw new Error(`Invalid details for podcast ${podcastId}`);

//           const podcastData = rawData.results[0];

//           const episodes: Episode[] = rawData.results.slice(1).map((ep) => ({
//             trackId: ep.trackId ?? 0,
//             trackName: ep.trackName ?? 'Unknown Title',
//             releaseDate: ep.releaseDate ?? 'Unknown Date',
//             trackTimeMillis: ep.trackTimeMillis ?? 0,
//             episodeUrl: ep.episodeUrl || '',
//             description: ep.description || 'No description available.',
//           }));

//           const podcastDetails: DetailedPodcast = {
//             id: podcastId,
//             artworkUrl600: podcastData.artworkUrl600 || '',
//             collectionName: podcastData.collectionName || 'Unknown Collection',
//             artistName: podcastData.artistName || 'Unknown Artist',
//             summary: podcastData.description || 'No summary available',
//             description: podcastData.description || 'No description available',
//             episodes,
//           };

//           setCachedData(cacheKey, podcastDetails);
//           return podcastDetails;
//         } catch (error) {
//           console.error(
//             `[PodcastService] Error fetching details for podcast ${podcastId}:`,
//             error
//           );
//           return null;
//         }
//       })
//     );
//   };

//   const allDetails: DetailedPodcast[] = [];
//   for (let i = 0; i < podcastIds.length; i += BATCH_SIZE) {
//     const batch = podcastIds.slice(i, i + BATCH_SIZE);
//     const results = await fetchBatch(batch);
//     allDetails.push(...results.filter((detail) => detail !== null));
//   }

//   console.timeEnd('[PodcastService] Fetch Podcasts Details Time');
//   return allDetails;
// };
