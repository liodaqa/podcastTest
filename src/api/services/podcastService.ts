// import { apiClient } from '@/api/client/apiClient';
// import { getCachedData, setCachedData } from '@/api/utils/cacheUtil';
// import { Podcast, DetailedPodcast, Episode } from '@/types/PodcastTypes';

// // const CACHE_DURATION = 86400000; // 24 hours
// // const PODCASTS_ENDPOINT = '/us/rss/toppodcasts/limit=100/genre=1310/json';

// // export const fetchPodcasts = async (): Promise<Podcast[]> => {
// //   const cacheKey = 'cached-podcasts';
// //   let cachedData = getCachedData<Podcast[]>(cacheKey, CACHE_DURATION);

// //   if (cachedData && cachedData.length > 0) {
// //     console.log('[PodcastService] Loaded podcasts from cache');
// //     return cachedData;
// //   }

// //   try {
// //     console.log('[PodcastService] Fetching podcasts from API...');
// //     const rawData = await apiClient<{ feed: { entry: any[] } }>(
// //       PODCASTS_ENDPOINT
// //     );
// //     if (!rawData?.feed?.entry) throw new Error('Invalid podcast data format');

//     const podcasts: Podcast[] = rawData.feed.entry.map((item) => ({
// id: item.id.attributes['im:id'],
// name: item['im:name'].label,
// artist: item['im:artist'].label,
// artwork: item['im:image']?.[2]?.label || '',
// summary: item.summary?.label || 'No summary available',
// }));

// //     setCachedData(cacheKey, podcasts);
// //     console.log('[PodcastService] Cached podcasts successfully');

// //     // 🔥 Preload & Cache Podcast Details in Background
// //     podcasts.forEach(async (podcast) => {
// //       const cacheKey = `podcast-${podcast.id}`;
// //       const cachedDetail = getCachedData<DetailedPodcast>(
// //         cacheKey,
// //         CACHE_DURATION
// //       );

// //       if (!cachedDetail) {
// //         fetchPodcastDetails(podcast.id).then((detail) => {
// //           setCachedData(cacheKey, detail);
// //           console.log(
// //             `[PodcastService] Preloaded and cached details for: ${podcast.id}`
// //           );
// //         });
// //       }
// //     });

// //     return podcasts;
// //   } catch (error) {
// //     console.error('[PodcastService] Error fetching podcasts:', error);
// //     throw error;
// //   }
// // };

// // /**
// //  * Fetch details of a specific podcast and cache instantly for immediate display.
// //  */
// // export const fetchPodcastDetails = async (
// //   podcastId: string
// // ): Promise<DetailedPodcast> => {
// //   const cacheKey = `podcast-${podcastId}`;
// //   let cachedData = getCachedData<DetailedPodcast>(cacheKey, CACHE_DURATION);

// //   if (cachedData) {
// //     console.log(
// //       `[PodcastService] Loaded podcast details from cache: ${podcastId}`
// //     );
// //     return cachedData;
// //   }

// //   try {
// //     console.log(
// //       `[PodcastService] Fetching podcast details from API: ${podcastId}`
// //     );
// //     const rawData = await apiClient<{ results: any[] }>(
// //       `/lookup?id=${podcastId}&entity=podcastEpisode`
// //     );
// //     if (!rawData?.results?.length)
// //       throw new Error('Invalid podcast details format');

// //     const podcastData = rawData.results[0];

// //     const episodes: Episode[] = rawData.results.slice(1).map((ep) => ({
// //       trackId: ep.trackId,
// //       trackName: ep.trackName || 'Unknown Title',
// //       releaseDate: ep.releaseDate || 'Unknown Date',
// //       trackTimeMillis: ep.trackTimeMillis || 0,
// //       episodeUrl: ep.episodeUrl || '',
// //       description: ep.description || 'No description available',
// //     }));

// //     const podcastDetails: DetailedPodcast = {
// //       id: podcastId,
// //       artworkUrl600: podcastData.artworkUrl600 || '',
// //       collectionName: podcastData.collectionName || 'Unknown Collection',
// //       artistName: podcastData.artistName || 'Unknown Artist',
// //       summary: podcastData.collectionName || 'No summary available',
// //       description: podcastData.description || 'No description available',
// //       episodes,
// //     };

// //     setCachedData(cacheKey, podcastDetails);
// //     console.log(
// //       `[PodcastService] Cached podcast details successfully: ${podcastId}`
// //     );
// //     return podcastDetails;
// //   } catch (error) {
// //     console.error('[PodcastService] Error fetching podcast details:', error);
// //     throw error;
// //   }
// // };
// // src/api/services/podcastService.ts
// import { apiClient } from '@/api/client/apiClient';
// import { getCachedData, setCachedData } from '@/api/utils/cacheUtil';
// import { Podcast, DetailedPodcast, Episode } from '@/types/PodcastTypes';

// const CACHE_DURATION = 86400000; // 24 hours
// const PODCASTS_ENDPOINT = '/us/rss/toppodcasts/limit=100/genre=1310/json';

// /**
//  * Fetch all podcasts at once and cache them for instant availability.
//  */
// export const fetchPodcasts = async (): Promise<Podcast[]> => {
//   const cacheKey = 'cached-podcasts';
//   let cachedData = getCachedData<Podcast[]>(cacheKey, CACHE_DURATION);

//   if (cachedData && cachedData.length > 0) {
//     console.log('[PodcastService] Loaded podcasts from cache');
//     return cachedData;
//   }

//   try {
//     console.log('[PodcastService] Fetching podcasts from API...');
//     const rawData = await apiClient<{ feed: { entry: any[] } }>(
//       PODCASTS_ENDPOINT
//     );
//     console.log(rawData, 'rawData');
//     if (!rawData?.feed?.entry) throw new Error('Invalid podcast data format');

//     const podcasts: Podcast[] = rawData.feed.entry.map((item) => ({
//       id: item.id.attributes['im:id'],
//       name: item['im:name'].label,
//       artist: item['im:artist'].label,
//       artwork: item['im:image']?.[2]?.label || '',
//       summary: item.summary?.label || 'No summary available',
//     }));
//     setCachedData(cacheKey, podcasts); // Store entire podcast list for fast access
//     console.log('[PodcastService] Cached podcasts successfully');

//     return podcasts;
//   } catch (error) {
//     console.error('[PodcastService] Error fetching podcasts:', error);
//     throw error;
//   }
// };
// // export const fetchPodcasts = async (): Promise<Podcast[]> => {
// //   const cacheKey = 'cached-podcasts';
// //   let cachedData = getCachedData<Podcast[]>(cacheKey, CACHE_DURATION);

// //   if (cachedData?.length) {
// //     console.log('[PodcastService] Loaded podcasts from cache');
// //     return cachedData;
// //   }

// //   try {
// //     console.log('[PodcastService] Fetching podcasts from API...');
// //     const rawData = await apiClient<{ feed: { entry: any[] } }>(
// //       PODCASTS_ENDPOINT
// //     );
// //     if (!rawData?.feed?.entry) throw new Error('Invalid podcast data format');

// //     const podcasts: Podcast[] = rawData.feed.entry.map((item) => ({
// //       id: item.id.attributes['im:id'],
// //       name: item['im:name'].label,
// //       artist: item['im:artist'].label,
// //       artwork: item['im:image']?.[2]?.label || '',
// //       summary: item.summary?.label || 'No summary available',
// //     }));

// //     setCachedData(cacheKey, podcasts);
// //     console.log('[PodcastService] Cached podcasts successfully');

// //     // ✅ Preload podcast details instantly
// //     podcasts.forEach(async (podcast) => {
// //       const cacheKey = `podcast-${podcast.id}`;
// //       if (!getCachedData<DetailedPodcast>(cacheKey, CACHE_DURATION)) {
// //         fetchPodcastDetails(podcast.id).then((detail) =>
// //           setCachedData(cacheKey, detail)
// //         );
// //       }
// //     });

// //     return podcasts;
// //   } catch (error) {
// //     console.error('[PodcastService] Error fetching podcasts:', error);
// //     throw error;
// //   }
// // };

// /**
//  * Fetch details of a specific podcast and cache instantly for immediate display.
//  */
// const ongoingRequests: Record<string, Promise<DetailedPodcast> | undefined> =
//   {};

// export const fetchPodcastDetails = async (
//   podcastId: string
// ): Promise<DetailedPodcast> => {
//   // ✅ If request is already ongoing, wait for it instead of making another one
//   if (ongoingRequests[podcastId]) {
//     console.log(`[API] Waiting for ongoing request for ${podcastId}`);
//     return await ongoingRequests[podcastId]!;
//   }

//   ongoingRequests[podcastId] = (async () => {
//     const cacheKey = `podcast-${podcastId}`;
//     const cachedData = getCachedData<DetailedPodcast>(cacheKey, 86400000);
//     if (cachedData) {
//       delete ongoingRequests[podcastId]; // Cleanup after cache hit
//       return cachedData;
//     }

//     console.time(`[API] Fetching podcast ${podcastId}`);
//     try {
//       const rawData = await apiClient<{ contents?: string; results?: any[] }>(
//         `/lookup?id=${podcastId}&media=podcast&entity=podcastEpisode&limit=20`
//       );
//       console.timeEnd(`[API] Fetching podcast ${podcastId}`);
//       console.log(rawData, 'rawData fetchPodcastDetails');

//       const parsedData = rawData.contents
//         ? JSON.parse(rawData.contents)
//         : rawData;
//       if (!parsedData?.results?.length) throw new Error('Invalid podcast data');

//       const episodes = parsedData.results.slice(1, 21).map((ep: any) => ({
//         trackId: ep.trackId,
//         trackName: ep.trackName,
//         releaseDate: ep.releaseDate,
//         episodeUrl: ep.episodeUrl,
//         description: ep.description || 'No description available',
//       }));

//       const podcastDetails: DetailedPodcast = {
//         id: podcastId,
//         artworkUrl600: parsedData.results[0].artworkUrl600 || '',
//         collectionName: parsedData.results[0].collectionName || '',
//         artistName: parsedData.results[0].artistName || '',
//         summary: parsedData.results[0].description || '',
//         description: parsedData.results[0].description || '',
//         episodes,
//       };

//       setCachedData(cacheKey, podcastDetails);
//       return podcastDetails;
//     } catch (error) {
//       console.error(
//         `[PodcastService] Error fetching podcast ${podcastId}:`,
//         error
//       );
//       throw error;
//     } finally {
//       delete ongoingRequests[podcastId]; // ✅ Ensure we clear tracking even if it fails
//     }
//   })();

//   return await ongoingRequests[podcastId]!;
// };

// // export const fetchPodcastDetails = async (
// //   podcastId: string
// // ): Promise<DetailedPodcast> => {
// //   const cacheKey = `podcast-${podcastId}`;
// //   console.time(`[Cache] Checking stored data for ${podcastId}`);
// //   const cachedData = getCachedData<DetailedPodcast>(cacheKey, 86400000);
// //   console.timeEnd(`[Cache] Checking stored data for ${podcastId}`);

// //   if (cachedData) {
// //     console.log(`[Cache] Returning cached data for ${podcastId}`);
// //     return cachedData;
// //   }

// //   console.log(`[API] Fetching fresh data for ${podcastId}`);
// //   console.time(`[API] Request duration for ${podcastId}`);

// //   try {
// //     const allPodcasts = getCachedData<Podcast[]>('cached-podcasts', 86400000);
// //     const podcastSummary =
// //       allPodcasts?.find((p) => p.id === podcastId)?.summary?.trim() ||
// //       'No summary available';

// //     const rawData = await apiClient<{ contents?: string; results?: any[] }>(
// //       `/lookup?id=${podcastId}&entity=podcastEpisode&limit=20`
// //     );
// //     console.log(rawData, 'hamza');
// //     console.timeEnd(`[API] Request duration for ${podcastId}`);

// //     console.time(`[Parsing] Processing response for ${podcastId}`);
// //     const parsedData = rawData.contents
// //       ? JSON.parse(rawData.contents)
// //       : rawData;
// //     console.timeEnd(`[Parsing] Processing response for ${podcastId}`);

// //     if (!parsedData?.results?.length) {
// //       throw new Error('Invalid podcast details or data format');
// //     }

// //     console.time(`[Processing] Transforming API response for ${podcastId}`);
// //     const podcastData = parsedData.results[0];

// //     const episodes: Episode[] = parsedData.results
// //       .slice(1, 21)
// //       .map((ep: Episode) => ({
// //         trackId: ep.trackId ?? 0,
// //         trackName: ep.trackName ?? 'Unknown Title',
// //         releaseDate: ep.releaseDate ?? 'Unknown Date',
// //         trackTimeMillis: ep.trackTimeMillis ?? 0,
// //         episodeUrl: ep.episodeUrl || '',
// //         description: ep.description || 'No description available.',
// //       }));
// //     console.timeEnd(`[Processing] Transforming API response for ${podcastId}`);

// //     const podcastDetails: DetailedPodcast = {
// //       id: podcastId,
// //       artworkUrl600: podcastData.artworkUrl600 || '',
// //       collectionName: podcastData.collectionName || 'Unknown Collection',
// //       artistName: podcastData.artistName || 'Unknown Artist',
// //       summary: podcastSummary,
// //       description: podcastData.description || 'No description available',
// //       episodes,
// //     };

// //     console.time(`[Cache] Storing data for ${podcastId}`);
// //     setCachedData(cacheKey, podcastDetails);
// //     console.timeEnd(`[Cache] Storing data for ${podcastId}`);

// //     return podcastDetails;
// //   } catch (error) {
// //     console.error('[PodcastService] Error fetching podcast details:', error);
// //     throw error;
// //   }
// // };

// // export const fetchPodcastDetails = async (
// //   podcastId: string
// // ): Promise<DetailedPodcast> => {
// //   const cacheKey = `podcast-${podcastId}`;
// //   const cachedData = getCachedData<DetailedPodcast>(cacheKey, 86400000);

// //   if (cachedData) {
// //     return cachedData;
// //   }

// //   try {
// //     // Get cached podcast list to extract summary
// //     const allPodcasts = getCachedData<Podcast[]>('cached-podcasts', 86400000);

// //     // Ensure we get the correct summary and avoid incorrect fallback values
// //     const podcastSummary =
// //       allPodcasts?.find((p) => p.id === podcastId)?.summary?.trim() ||
// //       'No summary available';

// //     // Use proxy for podcast details to bypass CORS
// //     const rawData = await apiClient<{ contents?: string; results?: any[] }>(
// //       `/lookup?id=${podcastId}&entity=podcastEpisode&limit=20`
// //     );

// //     const parsedData = rawData.contents
// //       ? JSON.parse(rawData.contents)
// //       : rawData;
// //     if (!parsedData?.results?.length) {
// //       throw new Error('Invalid podcast details or data format');
// //     }

// //     const podcastData = parsedData.results[0];

// //     const episodes: Episode[] = parsedData.results.slice(1).map((ep: any) => ({
// //       trackId: ep.trackId ?? 0,
// //       trackName: ep.trackName ?? 'Unknown Title',
// //       releaseDate: ep.releaseDate ?? 'Unknown Date',
// //       trackTimeMillis: ep.trackTimeMillis ?? 0,
// //       episodeUrl: ep.episodeUrl || '',
// //       description: ep.description || 'No description available.',
// //     }));

// //     const podcastDetails: DetailedPodcast = {
// //       id: podcastId,
// //       artworkUrl600: podcastData.artworkUrl600 || '',
// //       collectionName: podcastData.collectionName || 'Unknown Collection',
// //       artistName: podcastData.artistName || 'Unknown Artist',
// //       summary: podcastSummary, // Ensure summary is used correctly
// //       description: podcastData.description || 'No description available',
// //       episodes,
// //     };

// //     setCachedData(cacheKey, podcastDetails);
// //     return podcastDetails;
// //   } catch (error) {
// //     console.error('[PodcastService] Error fetching podcast details:', error);
// //     throw error;
// //   }
// // };
// // export const fetchPodcastDetails = async (
// //   podcastId: string
// // ): Promise<DetailedPodcast> => {
// //   const cacheKey = `podcast-${podcastId}`;
// //   const cachedData = getCachedData<DetailedPodcast>(cacheKey, CACHE_DURATION);

// //   if (cachedData) {
// //     return cachedData;
// //   }

// //   try {
// //     // Get cached podcast list to extract summary
// //     const allPodcasts = getCachedData<Podcast[]>(
// //       'cached-podcasts',
// //       CACHE_DURATION
// //     );

// //     // Ensure we get the correct summary and avoid incorrect fallback values
//     const podcastSummary =
//       allPodcasts?.find((p) => p.id === podcastId)?.summary?.trim() ||
//       'No summary available';

// //     // Fetch only the podcast details, avoiding the second API call
// //     const rawData = await apiClient<{ results: any[] }>(
// //       `/lookup?id=${podcastId}&entity=podcastEpisode&limit=20`
// //     );

// //     if (!rawData?.results?.length) {
// //       throw new Error('Invalid podcast details or data format');
// //     }

// //     const podcastData = rawData.results[0];

// //     const episodes: Episode[] = rawData.results.slice(1).map((ep) => ({
// //       trackId: ep.trackId ?? 0,
// //       trackName: ep.trackName ?? 'Unknown Title',
// //       releaseDate: ep.releaseDate ?? 'Unknown Date',
// //       trackTimeMillis: ep.trackTimeMillis ?? 0,
// //       episodeUrl: ep.episodeUrl || '',
// //       description: ep.description || 'No description available.',
// //     }));

// //     const podcastDetails: DetailedPodcast = {
// //       id: podcastId,
// //       artworkUrl600: podcastData.artworkUrl600 || '',
// //       collectionName: podcastData.collectionName || 'Unknown Collection',
// //       artistName: podcastData.artistName || 'Unknown Artist',
// //       summary: podcastSummary, // Ensure summary is used correctly
// //       description: podcastData.description || 'No description available',
// //       episodes,
// //     };

// //     setCachedData(cacheKey, podcastDetails);
// //     return podcastDetails;
// //   } catch (error) {
// //     console.error('[PodcastService] Error fetching podcast details:', error);
// //     throw error;
// //   }
// // };

// // export const fetchPodcastDetails = async (
// //   podcastId: string
// // ): Promise<DetailedPodcast> => {
// //   const cacheKey = `podcast-${podcastId}`;
// //   const cachedData = getCachedData<DetailedPodcast>(cacheKey, CACHE_DURATION);

// //   if (cachedData) {
// //     return cachedData;
// //   }

// //   try {
// //     const [allPodcasts, rawData] = await Promise.all([
// //       apiClient<{ feed: { entry: any[] } }>(PODCASTS_ENDPOINT),
// //       apiClient<{ results: any[] }>(
// //         `/lookup?id=${podcastId}&entity=podcastEpisode`
// //       ),
// //     ]);

// //     if (!rawData?.results?.length || !allPodcasts?.feed?.entry) {
// //       throw new Error('Invalid podcast details or data format');
// //     }

// //     const podcastSummary = allPodcasts.feed.entry.find(
// //       (entry) => entry.id.attributes['im:id'] === podcastId
// //     )?.summary?.label;

// //     const podcastData = rawData.results[0];

// //     const episodes: Episode[] = rawData.results.slice(1).map((ep) => ({
// //       trackId: ep.trackId ?? 0,
// //       trackName: ep.trackName ?? 'Unknown Title',
// //       releaseDate: ep.releaseDate ?? 'Unknown Date',
// //       trackTimeMillis: ep.trackTimeMillis ?? 0,
// //       episodeUrl: ep.episodeUrl || '',
// //       description: ep.description || 'No description available.',
// //     }));

// //     const podcastDetails: DetailedPodcast = {
// //       id: podcastId,
// //       artworkUrl600: podcastData.artworkUrl600 || '',
// //       collectionName: podcastData.collectionName || 'Unknown Collection',
// //       artistName: podcastData.artistName || 'Unknown Artist',
// //       summary: podcastSummary || 'No summary available',
// //       description: podcastData.description || 'No description available',
// //       episodes,
// //     };

// //     setCachedData(cacheKey, podcastDetails);
// //     return podcastDetails;
// //   } catch (error) {
// //     console.error('[PodcastService] Error fetching podcast details:', error);
// //     throw error;
// //   }
// // };

// // export const fetchPodcastDetails = async (
// //   podcastId: string
// // ): Promise<DetailedPodcast> => {
// //   const cacheKey = `podcast-${podcastId}`;
// //   let cachedData = getCachedData<DetailedPodcast>(cacheKey, CACHE_DURATION);

// //   if (cachedData) {
// //     console.log(
// //       `[PodcastService] Loaded podcast details from cache: ${podcastId}`
// //     );
// //     return cachedData;
// //   }

// //   try {
// //     console.log(
// //       `[PodcastService] Fetching podcast details from API: ${podcastId}`
// //     );
// //     const rawData = await apiClient<{ results: any[] }>(
// //       `/lookup?id=${podcastId}&entity=podcastEpisode`
// //     );
// //     if (!rawData?.results?.length)
// //       throw new Error('Invalid podcast details format');

// //     const podcastData = rawData.results[0];

// //     const episodes: Episode[] = rawData.results.slice(1).map((ep) => ({
// //       trackId: ep.trackId,
// //       trackName: ep.trackName || 'Unknown Title',
// //       releaseDate: ep.releaseDate || 'Unknown Date',
// //       trackTimeMillis: ep.trackTimeMillis || 0,
// //       episodeUrl: ep.episodeUrl || '',
// //       description: ep.description || 'No description available',
// //     }));

// //     const podcastDetails: DetailedPodcast = {
// //       id: podcastId,
// //       artworkUrl600: podcastData.artworkUrl600 || '',
// //       collectionName: podcastData.collectionName || 'Unknown Collection',
// //       artistName: podcastData.artistName || 'Unknown Artist',
// //       summary: podcastData.collectionName || 'No summary available',
// //       description: podcastData.description || 'No description available',
// //       episodes,
// //     };
// //     // console.log(podcastDetails, 'podcastDetails');
// //     setCachedData(cacheKey, podcastDetails);
// //     console.log(
// //       `[PodcastService] Cached podcast details successfully: ${podcastId}`
// //     );
// //     return podcastDetails;
// //   } catch (error) {
// //     console.error('[PodcastService] Error fetching podcast details:', error);
// //     throw error;
// //   }
// // };
import { Podcast, DetailedPodcast, Episode } from '@/types/PodcastTypes';
import { apiClient } from '@/api/client/apiClient';
import { getCache } from '../utils/cacheUtil';

export const fetchPodcasts = async (): Promise<Podcast[]> => {
  const data = await apiClient<any>(
    '/us/rss/toppodcasts/limit=100/genre=1310/json'
  );
  const items = data.feed?.entry || [];
  return items.map((item: any) => ({
    id: item.id.attributes['im:id'],
    name: item['im:name'].label,
    artist: item['im:artist'].label,
    artwork: item['im:image'][2].label,
    summary: item.summary?.label || 'No summary available',
  }));
};

export const fetchPodcastDetail = async (
  podcastId: string
): Promise<{ podcast: DetailedPodcast; episodes: Episode[] }> => {
  const data = await apiClient<any>(
    `/lookup?id=${podcastId}&media=podcast&entity=podcastEpisode&limit=20`
  );
  const results = data.results;
  if (!results || results.length === 0) throw new Error('Podcast not found');

  const podcastData = results[0];
  let summary = podcastData.summary || '';
  if (!summary) {
    const podcastsCache = getCache('podcastsList');
    if (podcastsCache && podcastsCache.data) {
      const found = podcastsCache.data.find((p: Podcast) => p.id === podcastId);
      summary = found ? found.summary : 'No summary available';
    } else {
      summary = 'No summary available';
    }
  }

  const podcast: DetailedPodcast = {
    id: podcastId,
    artworkUrl600: podcastData.artworkUrl600 || '',
    collectionName: podcastData.collectionName || 'Unknown Collection',
    artistName: podcastData.artistName || 'Unknown Artist',
    description: podcastData.description || 'No description available',
    summary: summary,
    episodes: [],
  };

  const episodes: Episode[] = results.slice(1).map((ep: any) => ({
    trackId: ep.trackId ?? 0,
    trackName: ep.trackName ?? 'Unknown Title',
    releaseDate: new Date(ep.releaseDate).toLocaleDateString(),
    trackTimeMillis: ep.trackTimeMillis
      ? `${Math.floor(ep.trackTimeMillis / 60000)} min`
      : 'Unknown',
    episodeUrl: ep.episodeUrl || '',
    description: ep.description || 'No description available.',
  }));

  return { podcast, episodes };
};

// export const fetchPodcasts = async (): Promise<Podcast[]> => {
//   // Use the relative URL that Vite's proxy will forward to https://itunes.apple.com
//   const response = await apiClient.get(
//     '/us/rss/toppodcasts/limit=100/genre=1310/json'
//   );
//   const items = response.data?.feed?.entry || [];
//   return items.map((item: any) => ({
//     id: item.id.attributes['im:id'],
//     name: item['im:name'].label,
//     artist: item['im:artist'].label,
//     artwork: item['im:image'][2].label,
//     summary: item.summary?.label || 'No summary available',
//   }));
// };

// export const fetchPodcastDetail = async (
//   podcastId: string
// ): Promise<{ podcast: DetailedPodcast; episodes: Episode[] }> => {
//   // Use the relative URL so that the proxy forwards it to https://itunes.apple.com
//   const response = await apiClient.get(
//     `/lookup?id=${podcastId}&media=podcast&entity=podcastEpisode&limit=20`
//   );
//   const results = response.data.results;
//   if (!results || results.length === 0) throw new Error('Podcast not found');

//   const podcastData = results[0];

//   // Attempt to obtain the summary from the lookup result.
//   let summary = podcastData.summary || '';
//   // If missing, try to fall back to the cached podcasts list.
//   if (!summary) {
//     const podcastsCache = getCache('podcastsList');
//     if (podcastsCache && podcastsCache.data) {
//       const found = podcastsCache.data.find((p: Podcast) => p.id === podcastId);
//       summary = found ? found.summary : 'No summary available';
//     } else {
//       summary = 'No summary available';
//     }
//   }

//   const podcast: DetailedPodcast = {
//     id: podcastId,
//     artworkUrl600: podcastData.artworkUrl600 || '',
//     collectionName: podcastData.collectionName || 'Unknown Collection',
//     artistName: podcastData.artistName || 'Unknown Artist',
//     description: podcastData.description || 'No description available',
//     summary: summary,
//     episodes: [],
//   };

//   const episodes: Episode[] = results.slice(1).map((ep: any) => ({
//     trackId: ep.trackId ?? 0,
//     trackName: ep.trackName ?? 'Unknown Title',
//     releaseDate: new Date(ep.releaseDate).toLocaleDateString(),
//     trackTimeMillis: ep.trackTimeMillis
//       ? `${Math.floor(ep.trackTimeMillis / 60000)} min`
//       : 'Unknown',
//     episodeUrl: ep.episodeUrl || '',
//     description: ep.description || 'No description available.',
//   }));

//   return { podcast, episodes };
// };

// import apiClient from '@/api/client/apiClient';
// import { Podcast, DetailedPodcast, Episode } from '@/types/PodcastTypes';
// import { getCache } from '../utils/cacheUtil';

// export const fetchPodcasts = async (): Promise<Podcast[]> => {
//   const response = await apiClient.get(
//     '/us/rss/toppodcasts/limit=100/genre=1310/json'
//   );
//   const items = response.data?.feed?.entry || [];

//   return items.map((item: any) => ({
//     id: item.id.attributes['im:id'],
//     name: item['im:name'].label,
//     artist: item['im:artist'].label,
//     artwork: item['im:image'][2].label,

//     summary: item.summary?.label || 'No summary available',
//   }));
// };

// export const fetchPodcastDetail = async (
//   podcastId: string
// ): Promise<{ podcast: DetailedPodcast; episodes: Episode[] }> => {
//   const response = await apiClient.get(
//     `/lookup?id=${podcastId}&media=podcast&entity=podcastEpisode&limit=20`
//   );
//   const results = response.data.results;
//   if (!results || results.length === 0) throw new Error('Podcast not found');
//   const podcastData = results[0];
//   // Attempt to get the summary from the lookup result.
//   let summary = podcastData.summary || '';
//   // If not available, try to retrieve it from the cached podcasts list.
//   if (!summary) {
//     const podcastsCache = getCache('podcastsList');
//     if (podcastsCache && podcastsCache.data) {
//       const found = podcastsCache.data.find((p: Podcast) => p.id === podcastId);
//       summary = found ? found.summary : 'No summary available';
//     } else {
//       summary = 'No summary available';
//     }
//   }
//   const podcast: DetailedPodcast = {
//     id: podcastId,
//     // title: info.collectionName,
//     // author: info.artistName,
//     // description: info.description || info.longDescription || 'No description available',
//     // image: info.artworkUrl600,
//     artworkUrl600: podcastData.artworkUrl600 || '',
//     collectionName: podcastData.collectionName || 'Unknown Collection',
//     artistName: podcastData.artistName || 'Unknown Artist',
//     description: podcastData.description || 'No description available',

//     summary: summary,
//     episodes: [],
//   };

//   const episodes: Episode[] = results.slice(1).map((ep: any) => ({
//     // id: ep.trackId,
//     // title: ep.trackName,
//     // releaseDate: new Date(ep.releaseDate).toLocaleDateString(),
//     // duration: ep.trackTimeMillis
//     //   ? `${Math.floor(ep.trackTimeMillis / 60000)} min`
//     //   : 'Unknown',

//     trackId: ep.trackId ?? 0,
//     trackName: ep.trackName ?? 'Unknown Title',
//     releaseDate: new Date(ep.releaseDate).toLocaleDateString(),
//     trackTimeMillis: ep.trackTimeMillis
//       ? `${Math.floor(ep.trackTimeMillis / 60000)} min`
//       : 'Unknown',
//     episodeUrl: ep.episodeUrl || '',
//     description: ep.description || 'No description available.',
//   }));
//   return { podcast, episodes };
// };

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
// export const fetchPodcastDetails = async (
//   podcastId: string
// ): Promise<DetailedPodcast> => {
//   const cacheKey = `podcast-${podcastId}`;
//   console.time(`[Cache] Checking stored data for ${podcastId}`);
//   const cachedData = getCachedData<DetailedPodcast>(cacheKey, 86400000);
//   console.timeEnd(`[Cache] Checking stored data for ${podcastId}`);

//   if (cachedData) {
//     console.log(`[Cache] Returning cached data for ${podcastId}`);
//     return cachedData;
//   }

//   console.log(`[API] Fetching fresh data for ${podcastId}`);
//   console.time(`[API] Request duration for ${podcastId}`);

//   try {
//     const allPodcasts = getCachedData<Podcast[]>('cached-podcasts', 86400000);
//     const podcastSummary =
//       allPodcasts?.find((p) => p.id === podcastId)?.summary?.trim() ||
//       'No summary available';

//     const rawData = await apiClient<{ contents?: string; results?: any[] }>(
//       `/lookup?id=${podcastId}&entity=podcastEpisode&limit=20`
//     );
//     console.log(rawData, 'hamza');
//     console.timeEnd(`[API] Request duration for ${podcastId}`);

//     console.time(`[Parsing] Processing response for ${podcastId}`);
//     const parsedData = rawData.contents
//       ? JSON.parse(rawData.contents)
//       : rawData;
//     console.timeEnd(`[Parsing] Processing response for ${podcastId}`);

//     if (!parsedData?.results?.length) {
//       throw new Error('Invalid podcast details or data format');
//     }

//     console.time(`[Processing] Transforming API response for ${podcastId}`);
//     const podcastData = parsedData.results[0];

//     const episodes: Episode[] = parsedData.results
//       .slice(1, 21)
//       .map((ep: Episode) => ({
// trackId: ep.trackId ?? 0,
// trackName: ep.trackName ?? 'Unknown Title',
// releaseDate: ep.releaseDate ?? 'Unknown Date',
// trackTimeMillis: ep.trackTimeMillis ?? 0,
// episodeUrl: ep.episodeUrl || '',
// description: ep.description || 'No description available.',
//       }));
//     console.timeEnd(`[Processing] Transforming API response for ${podcastId}`);

//     const podcastDetails: DetailedPodcast = {
// id: podcastId,
// artworkUrl600: podcastData.artworkUrl600 || '',
// collectionName: podcastData.collectionName || 'Unknown Collection',
// artistName: podcastData.artistName || 'Unknown Artist',
// summary: podcastSummary,
// description: podcastData.description || 'No description available',
// episodes,
//     };

//     console.time(`[Cache] Storing data for ${podcastId}`);
//     setCachedData(cacheKey, podcastDetails);
//     console.timeEnd(`[Cache] Storing data for ${podcastId}`);

//     return podcastDetails;
//   } catch (error) {
//     console.error('[PodcastService] Error fetching podcast details:', error);
//     throw error;
//   }
// };
