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

/**
 * Fetch all podcasts.
 * This function fetches and returns the transformed list of podcasts.
 */
export const fetchPodcasts = async (): Promise<Podcast[]> => {
  const cacheKey = 'podcasts';
  const cachedData = getCachedData<Podcast[]>(cacheKey, CACHE_DURATION);

  if (cachedData) {
    console.log('[PodcastService] ✅ Using cached podcasts data');
    return cachedData; // ✅ Use cached data if available
  }

  try {
    console.log('[PodcastService] ⏳ Fetching podcasts from API...');
    const rawData = await apiClient<{ feed: { entry: any[] } }>(
      PODCASTS_ENDPOINT
    );

    if (!rawData?.feed?.entry) {
      throw new Error('❌ Invalid podcast data format');
    }

    const podcasts: Podcast[] = rawData.feed.entry.map((item) => ({
      id: item.id.attributes['im:id'],
      name: item['im:name'].label,
      artist: item['im:artist'].label,
      artwork: item['im:image']?.[2]?.label || '',
      summary: item.summary?.label || 'No summary available',
    }));

    setCachedData(cacheKey, podcasts);
    console.log('[PodcastService] ✅ Fetched & Cached podcasts');
    return podcasts;
  } catch (error) {
    console.error('[PodcastService] ❌ Error fetching podcasts:', error);
    throw error;
  }
};

/**
 * Fetch details of a specific podcast, including its episodes.
 */
export const fetchPodcastDetails = async (
  podcastId: string
): Promise<DetailedPodcast> => {
  const cacheKey = `podcast-${podcastId}`;
  const cachedData = getCachedData<DetailedPodcast>(cacheKey, CACHE_DURATION);

  if (cachedData) {
    console.log(
      `[PodcastService] ✅ Using cached details for podcast ${podcastId}`
    );
    return cachedData;
  }

  try {
    console.log(
      `[PodcastService] ⏳ Fetching details for podcast ${podcastId} from API...`
    );
    const [allPodcasts, rawData] = await Promise.all([
      apiClient<{ feed: { entry: any[] } }>(PODCASTS_ENDPOINT),
      apiClient<{ results: any[] }>(
        `/lookup?id=${podcastId}&entity=podcastEpisode`
      ),
    ]);

    if (!rawData?.results?.length || !allPodcasts?.feed?.entry) {
      throw new Error('❌ Invalid podcast details or data format');
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
    console.log(
      `[PodcastService] ✅ Fetched & Cached details for podcast ${podcastId}`
    );
    return podcastDetails;
  } catch (error) {
    console.error('[PodcastService] ❌ Error fetching podcast details:', error);
    throw error;
  }
};

// import { apiClient } from '../client/apiClient';
// import { getCachedData, setCachedData } from '../utils/cacheUtil';
// import { Podcast, DetailedPodcast, Episode } from '../../types/PodcastTypes';

// const CACHE_DURATION = 86400000; // 24 hours
// const PODCASTS_ENDPOINT = '/us/rss/toppodcasts/limit=100/genre=1310/json';

// // Promise cache to handle concurrent fetches
// let fetchPodcastDetailsPromises: { [key: string]: Promise<DetailedPodcast> } =
//   {};
// let fetchPodcastsPromise: Promise<Podcast[]> | null = null;

// /**
//  * Fetch all podcasts.
//  * This function fetches and returns the transformed list of podcasts.
//  */
// export const fetchPodcasts = async (): Promise<Podcast[]> => {
//   const cacheKey = 'podcasts';

//   // Check cache
//   const cachedData = getCachedData<Podcast[]>(cacheKey, CACHE_DURATION);
//   if (cachedData) {
//     console.log('[PodcastService] Using cached data for podcasts.');
//     return cachedData;
//   }

//   // Handle concurrent fetches
//   if (fetchPodcastsPromise) {
//     console.log(
//       '[PodcastService] Fetch already in progress. Returning existing Promise.'
//     );
//     return fetchPodcastsPromise;
//   }

//   // Start timer only when initiating a new fetch
//   console.time('[PodcastService] FetchPodcasts');

//   try {
//     console.log('[PodcastService] Fetching podcasts from API...');
//     fetchPodcastsPromise = apiClient<{ feed: { entry: any[] } }>(
//       PODCASTS_ENDPOINT
//     )
//       .then((rawData) => {
//         if (!rawData?.feed?.entry) {
//           throw new Error('Invalid podcast data format.');
//         }

//         console.time('[PodcastService] TransformPodcasts');
//         const podcasts: Podcast[] = rawData.feed.entry.map((item) => ({
//           id: item.id.attributes['im:id'],
//           name: item['im:name'].label,
//           artist: item['im:artist'].label,
//           artwork: item['im:image']?.[2]?.label || '',
//           summary: item.summary?.label || 'No summary available',
//         }));
//         console.timeEnd('[PodcastService] TransformPodcasts');

//         console.log('[PodcastService] Caching podcasts data...');
//         setCachedData(cacheKey, podcasts);

//         return podcasts;
//       })
//       .finally(() => {
//         fetchPodcastsPromise = null; // Clear the Promise cache
//         console.timeEnd('[PodcastService] FetchPodcasts'); // End timer when fetch completes
//       });

//     return fetchPodcastsPromise;
//   } catch (error) {
//     console.error('[PodcastService] Error fetching podcasts:', error);
//     fetchPodcastsPromise = null; // Reset on error
//     console.timeEnd('[PodcastService] FetchPodcasts'); // End timer on error
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

//   console.time(`[PodcastService] FetchPodcastDetails ${podcastId}`);

//   // Check cache
//   const cachedData = getCachedData<DetailedPodcast>(cacheKey, CACHE_DURATION);
//   if (cachedData) {
//     console.log(
//       `[PodcastService] Using cached details for podcast: ${podcastId}`
//     );
//     console.timeEnd(`[PodcastService] FetchPodcastDetails ${podcastId}`);
//     return cachedData;
//   }

//   // Handle concurrent fetches for specific podcast IDs
//   if (await fetchPodcastDetailsPromises[podcastId]) {
//     console.log(
//       `[PodcastService] Fetch for podcast ${podcastId} already in progress.`
//     );
//     return fetchPodcastDetailsPromises[podcastId];
//   }

//   try {
//     console.log(`[PodcastService] Fetching details for podcast: ${podcastId}`);
//     fetchPodcastDetailsPromises[podcastId] = Promise.all([
//       apiClient<{ feed: { entry: any[] } }>(PODCASTS_ENDPOINT),
//       apiClient<{ results: any[] }>(
//         `/lookup?id=${podcastId}&entity=podcastEpisode`
//       ),
//     ])
//       .then(([allPodcasts, rawData]) => {
//         if (!rawData?.results?.length || !allPodcasts?.feed?.entry) {
//           throw new Error('Invalid podcast details or data format');
//         }

//         // Extract podcast summary from all podcasts
//         const podcastSummary = allPodcasts.feed.entry.find(
//           (entry) => entry.id.attributes['im:id'] === podcastId
//         )?.summary?.label;

//         const podcastData = rawData.results[0];

//         console.time(`[PodcastService] TransformEpisodes ${podcastId}`);
//         const episodes: Episode[] = rawData.results.slice(1).map((ep) => ({
//           trackId: ep.trackId ?? 0,
//           trackName: ep.trackName ?? 'Unknown Title',
//           releaseDate: ep.releaseDate ?? 'Unknown Date',
//           trackTimeMillis: ep.trackTimeMillis ?? 0,
//           episodeUrl: ep.episodeUrl || '',
//           description: ep.description || 'No description available.',
//         }));
//         console.timeEnd(`[PodcastService] TransformEpisodes ${podcastId}`);

//         const podcastDetails: DetailedPodcast = {
//           id: podcastId,
//           artworkUrl600: podcastData.artworkUrl600 || '',
//           collectionName: podcastData.collectionName || 'Unknown Collection',
//           artistName: podcastData.artistName || 'Unknown Artist',
//           summary: podcastSummary || 'No summary available',
//           description: podcastData.description || 'No description available',
//           episodes,
//         };

//         console.log(
//           `[PodcastService] Caching details for podcast: ${podcastId}`
//         );
//         setCachedData(cacheKey, podcastDetails);

//         return podcastDetails;
//       })
//       .finally(() => {
//         delete fetchPodcastDetailsPromises[podcastId]; // Clear the Promise cache
//         console.timeEnd(`[PodcastService] FetchPodcastDetails ${podcastId}`);
//       });

//     return fetchPodcastDetailsPromises[podcastId];
//   } catch (error) {
//     console.error(
//       `[PodcastService] Error fetching details for podcast ${podcastId}:`,
//       error
//     );
//     delete fetchPodcastDetailsPromises[podcastId]; // Reset on error
//     console.timeEnd(`[PodcastService] FetchPodcastDetails ${podcastId}`);
//     throw error;
//   }
// };
