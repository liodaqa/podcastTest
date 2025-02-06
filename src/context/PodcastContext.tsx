// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
// } from 'react';
// import {
//   fetchPodcasts,
//   fetchPodcastDetails,
// } from '@/api/services/podcastService';
// import { Podcast, DetailedPodcast } from '@/types/PodcastTypes';
// import { usePrefetchPodcasts } from '@/hooks/usePrefetchPodcasts'; // Import our prefetch hook

// interface PodcastContextType {
//   podcasts: Podcast[];
//   podcastDetail: DetailedPodcast | null;
//   error: string | null;
//   fetchPodcastDetail: (id: string) => Promise<void>;
//   globalLoading: boolean;
// }

// const PodcastContext = createContext<PodcastContextType | undefined>(undefined);

// export const PodcastProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [podcasts, setPodcasts] = useState<Podcast[]>([]);
//   const [podcastDetail, setPodcastDetail] = useState<DetailedPodcast | null>(
//     null
//   );
//   const [error, setError] = useState<string | null>(null);
//   const [globalLoading, setGlobalLoading] = useState(false);

//   useEffect(() => {
//     const loadPodcasts = async () => {
//       setGlobalLoading(true);
//       try {
//         const data = await fetchPodcasts();
//         setPodcasts(data);
//       } catch (err) {
//         setError('Unable to fetch podcasts.');
//       } finally {
//         setGlobalLoading(false);
//       }
//     };

//     loadPodcasts();
//   }, []);

//   // ✅ Prefetch podcast details in the background
//   usePrefetchPodcasts(podcasts);

//   const fetchPodcastDetail = useCallback(async (id: string) => {
//     setGlobalLoading(true);
//     setPodcastDetail(null);

//     try {
//       const detail = await fetchPodcastDetails(id);
//       setPodcastDetail(detail);
//     } catch (err) {
//       setError('Unable to fetch podcast details.');
//     } finally {
//       setGlobalLoading(false);
//     }
//   }, []);

//   return (
//     <PodcastContext.Provider
//       value={{
//         podcasts,
//         podcastDetail,
//         error,
//         fetchPodcastDetail,
//         globalLoading,
//       }}
//     >
//       {children}
//     </PodcastContext.Provider>
//   );
// };

// export const usePodcastContext = (): PodcastContextType => {
//   const context = useContext(PodcastContext);
//   if (!context) {
//     throw new Error('usePodcastContext must be used within a PodcastProvider');
//   }
//   return context;
// };
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  fetchPodcasts,
  fetchPodcastDetails,
} from '@/api/services/podcastService';
import { Podcast, DetailedPodcast } from '@/types/PodcastTypes';
import { getCachedData, setCachedData } from '@/api/utils/cacheUtil';

interface PodcastContextType {
  podcasts: Podcast[];
  podcastDetail: DetailedPodcast | null;
  error: string | null;
  fetchPodcastDetail: (id: string) => Promise<void>;
  globalLoading: boolean;
}

const PodcastContext = createContext<PodcastContextType | undefined>(undefined);

export const PodcastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [podcastDetail, setPodcastDetail] = useState<DetailedPodcast | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [globalLoading, setGlobalLoading] = useState(false);

  useEffect(() => {
    const loadPodcasts = async () => {
      setGlobalLoading(true);
      try {
        const cachedPodcasts = getCachedData<Podcast[]>('podcasts');
        if (cachedPodcasts) {
          setPodcasts(cachedPodcasts);
        } else {
          const data = await fetchPodcasts();
          setPodcasts(data);
        }
      } catch (err) {
        setError('Unable to fetch podcasts.');
      } finally {
        setGlobalLoading(false);
      }
    };

    loadPodcasts();
  }, []);

  const fetchPodcastDetail = useCallback(async (id: string) => {
    setGlobalLoading(true);

    try {
      const cachedDetail = getCachedData<DetailedPodcast>(`podcast-${id}`);
      if (cachedDetail) {
        setPodcastDetail(cachedDetail);
        return;
      }

      const detail = await fetchPodcastDetails(id);
      setPodcastDetail(detail);
    } catch (err) {
      setError('Unable to fetch podcast details.');
    } finally {
      setGlobalLoading(false);
    }
  }, []);

  return (
    <PodcastContext.Provider
      value={{
        podcasts,
        podcastDetail,
        error,
        fetchPodcastDetail,
        globalLoading,
      }}
    >
      {children}
    </PodcastContext.Provider>
  );
};

export const usePodcastContext = (): PodcastContextType => {
  const context = useContext(PodcastContext);
  if (!context) {
    throw new Error('usePodcastContext must be used within a PodcastProvider');
  }
  return context;
};
