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

// Global Promise cache to prevent duplicate API calls
let fetchPodcastsPromise: Promise<Podcast[]> | null = null;
let fetchPodcastDetailsPromises: { [key: string]: Promise<DetailedPodcast> } =
  {};

/**
 * Fetch all podcasts.
 */
export const fetchPodcasts = async (): Promise<Podcast[]> => {
  const cacheKey = 'podcasts';

  // Check cache first
  const cachedData = getCachedData<Podcast[]>(cacheKey, CACHE_DURATION);
  if (cachedData) {
    console.log('[PodcastService] ✅ Using cached podcasts.');
    return cachedData;
  }

  // If a fetch is already in progress, return the existing promise
  if (fetchPodcastsPromise) {
    console.log(
      '[PodcastService] ⏳ Fetch already in progress, returning existing Promise.'
    );
    return fetchPodcastsPromise;
  }

  console.time('[PodcastService] FetchPodcasts');

  fetchPodcastsPromise = apiClient<{ feed: { entry: any[] } }>(
    PODCASTS_ENDPOINT
  )
    .then((rawData) => {
      if (!rawData?.feed?.entry) {
        throw new Error('Invalid podcast data format.');
      }

      console.time('[PodcastService] TransformPodcasts');
      const podcasts: Podcast[] = rawData.feed.entry.map((item) => ({
        id: item.id.attributes['im:id'],
        name: item['im:name'].label,
        artist: item['im:artist'].label,
        artwork: item['im:image']?.[2]?.label || '',
        summary: item.summary?.label || 'No summary available',
      }));
      console.timeEnd('[PodcastService] TransformPodcasts');

      console.log('[PodcastService] 🏆 Caching podcasts.');
      setCachedData(cacheKey, podcasts);

      return podcasts;
    })
    .finally(() => {
      fetchPodcastsPromise = null;
      console.timeEnd('[PodcastService] FetchPodcasts');
    });

  return fetchPodcastsPromise;
};

/**
 * Fetch details of a specific podcast.
 */
export const fetchPodcastDetails = async (
  podcastId: string
): Promise<DetailedPodcast> => {
  const cacheKey = `podcast-${podcastId}`;

  // Check cache first
  const cachedData = getCachedData<DetailedPodcast>(cacheKey, CACHE_DURATION);
  if (cachedData) {
    console.log(
      `[PodcastService] ✅ Using cached details for podcast: ${podcastId}`
    );
    return cachedData;
  }

  // If a fetch is already in progress, return the existing promise
  if (await fetchPodcastDetailsPromises[podcastId]) {
    console.log(
      `[PodcastService] ⏳ Fetch already in progress for podcast ${podcastId}`
    );
    return await fetchPodcastDetailsPromises[podcastId]; // FIX: Await the promise correctly
  }

  console.time(`[PodcastService] FetchPodcastDetails ${podcastId}`);

  fetchPodcastDetailsPromises[podcastId] = Promise.all([
    apiClient<{ feed: { entry: any[] } }>(PODCASTS_ENDPOINT),
    apiClient<{ results: any[] }>(
      `/lookup?id=${podcastId}&entity=podcastEpisode`
    ),
  ])
    .then(([allPodcasts, rawData]) => {
      if (!rawData?.results?.length || !allPodcasts?.feed?.entry) {
        throw new Error('Invalid podcast details or data format.');
      }

      // Extract podcast summary from the full list
      const podcastSummary = allPodcasts.feed.entry.find(
        (entry) => entry.id.attributes['im:id'] === podcastId
      )?.summary?.label;

      const podcastData = rawData.results[0];

      console.time(`[PodcastService] TransformEpisodes ${podcastId}`);
      const episodes: Episode[] = rawData.results.slice(1).map((ep) => ({
        trackId: ep.trackId ?? 0,
        trackName: ep.trackName ?? 'Unknown Title',
        releaseDate: ep.releaseDate ?? 'Unknown Date',
        trackTimeMillis: ep.trackTimeMillis ?? 0,
        episodeUrl: ep.episodeUrl || '',
        description: ep.description || 'No description available.', // FIX: Ensure description is included
      }));
      console.timeEnd(`[PodcastService] TransformEpisodes ${podcastId}`);

      const podcastDetails: DetailedPodcast = {
        id: podcastId,
        artworkUrl600: podcastData.artworkUrl600 || '',
        collectionName: podcastData.collectionName || 'Unknown Collection',
        artistName: podcastData.artistName || 'Unknown Artist',
        summary: podcastSummary || 'No summary available',
        description: podcastData.description || 'No description available',
        episodes,
      };

      console.log(
        `[PodcastService] 🏆 Caching details for podcast: ${podcastId}`
      );
      setCachedData(cacheKey, podcastDetails);

      return podcastDetails;
    })
    .finally(() => {
      delete fetchPodcastDetailsPromises[podcastId]; // Clear the Promise cache
      console.timeEnd(`[PodcastService] FetchPodcastDetails ${podcastId}`);
    });

  return fetchPodcastDetailsPromises[podcastId];
};
