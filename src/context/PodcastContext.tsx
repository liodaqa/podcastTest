// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
//   useCallback,
// } from 'react';
// import {
//   fetchPodcasts,
//   fetchPodcastDetails,
// } from '../api/services/podcastService';
// import { Podcast, DetailedPodcast } from '../types/PodcastTypes';

// interface PodcastContextType {
//   podcasts: Podcast[];
//   podcastDetail: DetailedPodcast | null;
//   error: string | null;
//   fetchPodcastDetail: (id: string) => Promise<void>;
//   globalLoading: boolean;
// }

// interface PodcastProviderProps {
//   children: ReactNode;
// }

// const PodcastContext = createContext<PodcastContextType | undefined>(undefined);

// export const PodcastProvider: React.FC<PodcastProviderProps> = ({
//   children,
// }) => {
//   const [podcasts, setPodcasts] = useState<Podcast[]>([]);
//   const [podcastDetail, setPodcastDetail] = useState<DetailedPodcast | null>(
//     null
//   );
//   const [error, setError] = useState<string | null>(null);
//   const [globalLoading, setGlobalLoading] = useState(false);

//   useEffect(() => {
//     const fetchAllPodcasts = async () => {
//       try {
//         setGlobalLoading(true);
//         const data = await fetchPodcasts();
//         setPodcasts(data);
//         setError(null);
//       } catch (err) {
//         console.error('Failed to fetch podcasts:', err);
//         setError('Unable to fetch podcasts.');
//       } finally {
//         setGlobalLoading(false);
//       }
//     };

//     fetchAllPodcasts();
//   }, []);

//   const fetchPodcastDetail = useCallback(async (id: string) => {
//     try {
//       setGlobalLoading(true);
//       const detail = await fetchPodcastDetails(id);
//       setPodcastDetail(detail);
//       setError(null);
//     } catch (err) {
//       console.error('Failed to fetch podcast details:', err);
//       setError('Unable to fetch podcast details.');
//       setPodcastDetail(null);
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
  ReactNode,
  useCallback,
  useRef,
} from 'react';
import {
  fetchPodcasts,
  fetchPodcastDetails,
} from '../api/services/podcastService';
import { Podcast, DetailedPodcast } from '../types/PodcastTypes';

interface PodcastContextType {
  podcasts: Podcast[];
  podcastDetail: DetailedPodcast | null;
  error: string | null;
  fetchPodcastDetail: (id: string) => Promise<void>;
  globalLoading: boolean;
  detailLoading: boolean;
}

interface PodcastProviderProps {
  children: ReactNode;
}

const PodcastContext = createContext<PodcastContextType | undefined>(undefined);

export const PodcastProvider: React.FC<PodcastProviderProps> = ({
  children,
}) => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [podcastDetail, setPodcastDetail] = useState<DetailedPodcast | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false); // New loading state

  // ✅ In-memory cache for podcast details (faster than localStorage)
  const podcastCache = useRef<Record<string, DetailedPodcast>>({});

  // ✅ Fetch all podcasts on mount
  useEffect(() => {
    const fetchAllPodcasts = async () => {
      try {
        setGlobalLoading(true);
        const data = await fetchPodcasts();
        setPodcasts(data);
        setError(null);
      } catch (err) {
        console.error('❌ Failed to fetch podcasts:', err);
        setError('Unable to fetch podcasts.');
      } finally {
        setGlobalLoading(false);
      }
    };

    fetchAllPodcasts();
  }, []);

  // ✅ Fetch individual podcast details (only when needed)
  const fetchPodcastDetail = useCallback(async (id: string) => {
    if (podcastCache.current[id]) {
      console.log(
        `[PodcastService] ✅ Using in-memory cache for podcast ${id}`
      );
      setPodcastDetail(podcastCache.current[id]);
      return;
    }

    try {
      setDetailLoading(true);
      console.log(`[PodcastService] Fetching podcast details for ${id}...`);
      const detail = await fetchPodcastDetails(id);
      podcastCache.current[id] = detail; // Store in cache
      setPodcastDetail(detail);
      setError(null);
    } catch (err) {
      console.error('❌ Failed to fetch podcast details:', err);
      setError('Unable to fetch podcast details.');
      setPodcastDetail(null);
    } finally {
      setDetailLoading(false);
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
        detailLoading, // Provide new loading state
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
