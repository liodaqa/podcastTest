// import React, {
//   createContext,
//   useState,
//   useEffect,
//   ReactNode,
//   useCallback,
// } from 'react';
// import { Podcast, DetailedPodcast } from '@/types/PodcastTypes';
// import {
//   fetchPodcasts,
//   fetchPodcastDetail as fetchPodcastDetailApi,
// } from '@/api/services/podcastService';
// import { setCache, getCache, isCacheValid } from '../api/utils/cacheUtil';

// export interface PodcastContextType {
//   podcasts: Podcast[];
//   podcastsLoading: boolean;
//   podcastsError: string | null;
//   fetchPodcasts: () => Promise<void>;
//   podcastDetails: { [podcastId: string]: DetailedPodcast };
//   fetchPodcastDetail: (podcastId: string) => Promise<void>;
// }

// export const PodcastContext = createContext<PodcastContextType>({
//   podcasts: [],
//   podcastsLoading: false,
//   podcastsError: null,
//   fetchPodcasts: async () => {},
//   podcastDetails: {},
//   fetchPodcastDetail: async () => {},
// });

// const PODCASTS_CACHE_KEY = 'podcastsList';
// const PODCASTS_CACHE_EXPIRY = 86400000; // 24 hours
// const PODCAST_DETAIL_CACHE_EXPIRY = 86400000; // 24 hours

// export const PodcastProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [podcasts, setPodcasts] = useState<Podcast[]>([]);
//   const [podcastsLoading, setPodcastsLoading] = useState<boolean>(false);
//   const [podcastsError, setPodcastsError] = useState<string | null>(null);
//   const [podcastDetails, setPodcastDetails] = useState<{
//     [podcastId: string]: DetailedPodcast;
//   }>({});

//   const fetchPodcastsHandler = useCallback(async () => {
//     setPodcastsLoading(true);
//     try {
//       const cached = getCache(PODCASTS_CACHE_KEY);
//       if (cached && isCacheValid(cached.timestamp, PODCASTS_CACHE_EXPIRY)) {
//         setPodcasts(cached.data);
//         setPodcastsLoading(false);
//         return;
//       }
//       const data = await fetchPodcasts();
//       setPodcasts(data);
//       setCache(PODCASTS_CACHE_KEY, data);
//     } catch (error) {
//       setPodcastsError('Error fetching podcasts');
//       console.error(error);
//     } finally {
//       setPodcastsLoading(false);
//     }
//   }, []);

//   const fetchPodcastDetailHandler = useCallback(async (podcastId: string) => {
//     const cacheKey = `podcastDetail_${podcastId}`;
//     const cached = getCache(cacheKey);
//     if (cached && isCacheValid(cached.timestamp, PODCAST_DETAIL_CACHE_EXPIRY)) {
//       setPodcastDetails((prev) => ({
//         ...prev,
//         [podcastId]: cached.data as DetailedPodcast,
//       }));
//       return;
//     }

//     try {
//       const { podcast, episodes } = await fetchPodcastDetailApi(podcastId);
//       const detailData: DetailedPodcast = {
//         id: podcastId,
//         artworkUrl600: podcast.artworkUrl600 || '',
//         collectionName: podcast.collectionName || 'Unknown Collection',
//         artistName: podcast.artistName || 'Unknown Artist',
//         summary: podcast.summary,
//         description: podcast.description || 'No description available',
//         episodes: episodes,
//       };
//       setPodcastDetails((prev) => ({ ...prev, [podcastId]: detailData }));
//       setCache(cacheKey, detailData);
//     } catch (error) {
//       console.error('Error fetching podcast detail:', error);
//     }
//   }, []);

//   useEffect(() => {
//     fetchPodcastsHandler();
//   }, [fetchPodcastsHandler]);

//   return (
//     <PodcastContext.Provider
//       value={{
//         podcasts,
//         podcastsLoading,
//         podcastsError,
//         fetchPodcasts: fetchPodcastsHandler,
//         podcastDetails,
//         fetchPodcastDetail: fetchPodcastDetailHandler,
//       }}
//     >
//       {children}
//     </PodcastContext.Provider>
//   );
// };
import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { Podcast, DetailedPodcast } from '@/types/PodcastTypes';
import {
  fetchPodcasts,
  fetchPodcastDetail as fetchPodcastDetailApi,
} from '@/api/services/podcastService';
import { setCache, getCache, isCacheValid } from '../api/utils/cacheUtil';

export interface PodcastContextType {
  podcasts: Podcast[];
  podcastsLoading: boolean;
  podcastsError: string | null;
  fetchPodcasts: () => Promise<void>;
  podcastDetails: { [podcastId: string]: DetailedPodcast };
  // Added an optional prefetch flag: when true, the global loading is not set.
  fetchPodcastDetail: (podcastId: string, prefetch?: boolean) => Promise<void>;
}

export const PodcastContext = createContext<PodcastContextType>({
  podcasts: [],
  podcastsLoading: false,
  podcastsError: null,
  fetchPodcasts: async () => {},
  podcastDetails: {},
  fetchPodcastDetail: async () => {},
});

const PODCASTS_CACHE_KEY = 'podcastsList';
const PODCASTS_CACHE_EXPIRY = 86400000; // 24 hours
const PODCAST_DETAIL_CACHE_EXPIRY = 86400000; // 24 hours

export const PodcastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [podcastsLoading, setPodcastsLoading] = useState<boolean>(false);
  const [podcastsError, setPodcastsError] = useState<string | null>(null);
  const [podcastDetails, setPodcastDetails] = useState<{
    [podcastId: string]: DetailedPodcast;
  }>({});

  const fetchPodcastsHandler = useCallback(async () => {
    setPodcastsLoading(true);
    try {
      const cached = getCache(PODCASTS_CACHE_KEY);
      if (cached && isCacheValid(cached.timestamp, PODCASTS_CACHE_EXPIRY)) {
        setPodcasts(cached.data);
        return;
      }
      const data = await fetchPodcasts();
      setPodcasts(data);
      setCache(PODCASTS_CACHE_KEY, data);
    } catch (error) {
      setPodcastsError('Error fetching podcasts');
      console.error(error);
    } finally {
      setPodcastsLoading(false);
    }
  }, []);

  const fetchPodcastDetailHandler = useCallback(
    async (podcastId: string, prefetch: boolean = false) => {
      // Only set the global loading flag if this is not a prefetch
      if (!prefetch) {
        setPodcastsLoading(true);
      }
      const cacheKey = `podcastDetail_${podcastId}`;
      const cached = getCache(cacheKey);
      if (
        cached &&
        isCacheValid(cached.timestamp, PODCAST_DETAIL_CACHE_EXPIRY)
      ) {
        setPodcastDetails((prev) => ({
          ...prev,
          [podcastId]: cached.data as DetailedPodcast,
        }));
        if (!prefetch) {
          setPodcastsLoading(false);
        }
        return;
      }

      try {
        const { podcast, episodes } = await fetchPodcastDetailApi(podcastId);
        const detailData: DetailedPodcast = {
          id: podcastId,
          artworkUrl600: podcast.artworkUrl600 || '',
          collectionName: podcast.collectionName || 'Unknown Collection',
          artistName: podcast.artistName || 'Unknown Artist',
          summary: podcast.summary,
          description: podcast.description || 'No description available',
          episodes: episodes,
        };
        setPodcastDetails((prev) => ({ ...prev, [podcastId]: detailData }));
        setCache(cacheKey, detailData);
      } catch (error) {
        console.error('Error fetching podcast detail:', error);
      } finally {
        if (!prefetch) {
          setPodcastsLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    fetchPodcastsHandler();
  }, [fetchPodcastsHandler]);

  return (
    <PodcastContext.Provider
      value={{
        podcasts,
        podcastsLoading,
        podcastsError,
        fetchPodcasts: fetchPodcastsHandler,
        podcastDetails,
        fetchPodcastDetail: fetchPodcastDetailHandler,
      }}
    >
      {children}
    </PodcastContext.Provider>
  );
};
