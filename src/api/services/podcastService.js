import { apiClient } from '../client/apiClient';
import { getCachedData, setCachedData } from '../utils/cacheUtil';
const CACHE_DURATION = 86400000; // 24 hours
const PODCASTS_ENDPOINT = '/us/rss/toppodcasts/limit=100/genre=1310/json';
/**
 * Fetch all podcasts.
 * This function fetches and returns the transformed list of podcasts.
 */
export const fetchPodcasts = async () => {
  const cacheKey = 'podcasts';
  const cachedData = getCachedData(cacheKey, CACHE_DURATION);
  if (cachedData) {
    return cachedData;
  }
  try {
    const rawData = await apiClient(PODCASTS_ENDPOINT);
    if (!rawData?.feed?.entry) {
      throw new Error('Invalid podcast data format');
    }
    const podcasts = rawData.feed.entry.map((item) => ({
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
    throw error;
  }
};
/**
 * Fetch details of a specific podcast, including its episodes.
 */
export const fetchPodcastDetails = async (podcastId) => {
  const cacheKey = `podcast-${podcastId}`;
  const cachedData = getCachedData(cacheKey, CACHE_DURATION);
  if (cachedData) {
    return cachedData;
  }
  try {
    const [allPodcasts, rawData] = await Promise.all([
      apiClient(PODCASTS_ENDPOINT),
      apiClient(`/lookup?id=${podcastId}&entity=podcastEpisode`),
    ]);
    if (!rawData?.results?.length || !allPodcasts?.feed?.entry) {
      throw new Error('Invalid podcast details or data format');
    }
    const podcastSummary = allPodcasts.feed.entry.find(
      (entry) => entry.id.attributes['im:id'] === podcastId
    )?.summary?.label;
    const podcastData = rawData.results[0];
    const episodes = rawData.results.slice(1).map((ep) => ({
      trackId: ep.trackId ?? 0,
      trackName: ep.trackName ?? 'Unknown Title',
      releaseDate: ep.releaseDate ?? 'Unknown Date',
      trackTimeMillis: ep.trackTimeMillis ?? 0,
      episodeUrl: ep.episodeUrl || '',
      description: ep.description || 'No description available.',
    }));
    const podcastDetails = {
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
