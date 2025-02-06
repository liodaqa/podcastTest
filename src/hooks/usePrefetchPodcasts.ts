import { useEffect } from 'react';
import { fetchPodcastDetails } from '@/api/services/podcastService';
import { getCachedData, setCachedData } from '@/api/utils/cacheUtil';
import { Podcast, DetailedPodcast } from '@/types/PodcastTypes';

const CACHE_DURATION = 86400000; // 24 hours;

/**
 * Prefetch podcast details in the background.
 */
export const usePrefetchPodcasts = (podcasts: Podcast[]) => {
  useEffect(() => {
    const prefetchDetails = async () => {
      for (const podcast of podcasts) {
        const cacheKey = `podcast-${podcast.id}`;

        // ✅ Skip if already cached
        const cachedDetail = getCachedData<DetailedPodcast>(
          cacheKey,
          CACHE_DURATION
        );
        if (cachedDetail) continue;

        try {
          const detail = await fetchPodcastDetails(podcast.id);
          setCachedData(cacheKey, detail);
        } catch (error) {
          console.error(
            `[Prefetch] Failed to prefetch details for ${podcast.id}:`,
            error
          );
        }
      }
    };

    if (podcasts.length > 0) prefetchDetails();
  }, [podcasts]);
};
