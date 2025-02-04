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
// } from '@/api/services/podcastService';
// import { Podcast, DetailedPodcast } from '@/types/PodcastTypes';

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
  useRef,
  useCallback,
} from 'react';
import {
  fetchPodcasts,
  fetchPodcastDetailsBatch,
} from '@/api/services/podcastService';
import { Podcast, DetailedPodcast } from '@/types/PodcastTypes';

interface PodcastContextType {
  podcasts: Podcast[];
  podcastDetails: Record<string, DetailedPodcast>;
  error: string | null;
  fetchPodcastDetail: (id: string) => Promise<void>;
  globalLoading: boolean;
}

const PodcastContext = createContext<PodcastContextType | undefined>(undefined);

export const PodcastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [podcastDetails, setPodcastDetails] = useState<
    Record<string, DetailedPodcast>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [globalLoading, setGlobalLoading] = useState(false);
  const fetchInProgress = useRef(new Set<string>()); // ✅ Prevent multiple fetches
  const podcastsFetched = useRef(false); // ✅ Prevent duplicate podcast list fetch

  useEffect(() => {
    const fetchAllPodcasts = async () => {
      if (podcastsFetched.current) return; // ✅ Skip if already fetched
      podcastsFetched.current = true;

      try {
        setGlobalLoading(true);
        const data = await fetchPodcasts();
        setPodcasts(data);
        setError(null);

        requestIdleCallback(() => {
          const first5Ids = data
            .slice(0, 5)
            .map((podcast) => podcast.id)
            .filter((id) => !podcastDetails[id]);

          if (first5Ids.length > 0) {
            fetchPodcastDetailsBatch(first5Ids).then((details) => {
              const detailsMap = Object.fromEntries(
                details.map((d) => [d.id, d])
              );
              setPodcastDetails((prev) => ({ ...prev, ...detailsMap }));
            });
          }
        });
      } catch (err) {
        console.error('Failed to fetch podcasts:', err);
        setError('Unable to fetch podcasts.');
      } finally {
        setGlobalLoading(false);
      }
    };

    fetchAllPodcasts();
  }, []);

  /**
   * ✅ Fetch Podcast Detail **Only if Not Cached & Not in Progress**
   */
  const fetchPodcastDetail = useCallback(
    async (id: string) => {
      if (podcastDetails[id] || fetchInProgress.current.has(id)) return; // ✅ Skip duplicate fetch

      fetchInProgress.current.add(id); // 🔥 Lock fetch to prevent duplicate calls

      try {
        const details = await fetchPodcastDetailsBatch([id]);
        if (details.length) {
          setPodcastDetails((prev) => ({ ...prev, [id]: details[0] }));
        }
      } catch (err) {
        console.error(`Failed to fetch details for podcast ${id}:`, err);
        setError(`Unable to fetch details for podcast ${id}.`);
      } finally {
        fetchInProgress.current.delete(id); // ✅ Remove from in-progress
      }
    },
    [podcastDetails]
  );

  return (
    <PodcastContext.Provider
      value={{
        podcasts,
        podcastDetails,
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

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
//   useRef,
//   useCallback,
// } from 'react';
// import {
//   fetchPodcasts,
//   fetchPodcastDetailsBatch,
// } from '@/api/services/podcastService';
// import { Podcast, DetailedPodcast } from '@/types/PodcastTypes';

// interface PodcastContextType {
//   podcasts: Podcast[];
//   podcastDetails: Record<string, DetailedPodcast>;
//   error: string | null;
//   fetchPodcastDetail: (id: string) => Promise<void>;
//   globalLoading: boolean;
// }

// const PodcastContext = createContext<PodcastContextType | undefined>(undefined);

// export const PodcastProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [podcasts, setPodcasts] = useState<Podcast[]>([]);
//   const [podcastDetails, setPodcastDetails] = useState<
//     Record<string, DetailedPodcast>
//   >({});
//   const [error, setError] = useState<string | null>(null);
//   const [globalLoading, setGlobalLoading] = useState(false);
//   const fetchInProgress = useRef(false); // Prevents multiple API calls

//   useEffect(() => {
//     const fetchAllPodcasts = async () => {
//       if (fetchInProgress.current) return;
//       fetchInProgress.current = true;

//       try {
//         setGlobalLoading(true);
//         const data = await fetchPodcasts();
//         setPodcasts(data);
//         setError(null);

//         // ✅ Prefetch details for first 5 podcasts **only if not cached**
//         requestIdleCallback(() => {
//           const first5Ids = data
//             .slice(0, 5)
//             .map((podcast) => podcast.id)
//             .filter((id) => !podcastDetails[id]);

//           if (first5Ids.length > 0) {
//             fetchPodcastDetailsBatch(first5Ids).then((details) => {
//               const detailsMap = Object.fromEntries(
//                 details.map((d) => [d.id, d])
//               );
//               setPodcastDetails((prev) => ({ ...prev, ...detailsMap }));
//             });
//           }
//         });
//       } catch (err) {
//         console.error('Failed to fetch podcasts:', err);
//         setError('Unable to fetch podcasts.');
//       } finally {
//         setGlobalLoading(false);
//         fetchInProgress.current = false;
//       }
//     };

//     fetchAllPodcasts();
//   }, []);

//   /**
//    * ✅ Fetch Podcast Detail **Only if Not Cached**
//    */
//   const fetchPodcastDetail = useCallback(
//     async (id: string) => {
//       if (podcastDetails[id]) return; // ✅ Return early if cached

//       try {
//         const details = await fetchPodcastDetailsBatch([id]);
//         if (details.length) {
//           setPodcastDetails((prev) => ({ ...prev, [id]: details[0] }));
//         }
//       } catch (err) {
//         console.error(`Failed to fetch details for podcast ${id}:`, err);
//         setError(`Unable to fetch details for podcast ${id}.`);
//       }
//     },
//     [podcastDetails]
//   );

//   return (
//     <PodcastContext.Provider
//       value={{
//         podcasts,
//         podcastDetails,
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

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
//   useRef,
// } from 'react';
// import {
//   fetchPodcasts,
//   fetchPodcastDetailsBatch,
// } from '@/api/services/podcastService';
// import { Podcast, DetailedPodcast } from '@/types/PodcastTypes';

// interface PodcastContextType {
//   podcasts: Podcast[];
//   podcastDetails: Record<string, DetailedPodcast>;
//   error: string | null;
//   fetchPodcastDetail: (id: string) => Promise<void>;
//   globalLoading: boolean;
// }

// const PodcastContext = createContext<PodcastContextType | undefined>(undefined);

// export const PodcastProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [podcasts, setPodcasts] = useState<Podcast[]>([]);
//   const [podcastDetails, setPodcastDetails] = useState<
//     Record<string, DetailedPodcast>
//   >({});
//   const [error, setError] = useState<string | null>(null);
//   const [globalLoading, setGlobalLoading] = useState(false);
//   const fetchInProgress = useRef(false); // Prevent multiple API calls

//   useEffect(() => {
//     const fetchAllPodcasts = async () => {
//       if (fetchInProgress.current) return;
//       fetchInProgress.current = true;

//       try {
//         setGlobalLoading(true);
//         const data = await fetchPodcasts();
//         setPodcasts(data);
//         setError(null);

//         requestIdleCallback(() => {
//           const first5Ids = data.slice(0, 5).map((podcast) => podcast.id);
//           fetchPodcastDetailsBatch(first5Ids).then((details) => {
//             const detailsMap = Object.fromEntries(
//               details.map((d) => [d.id, d])
//             );
//             setPodcastDetails(detailsMap);
//           });
//         });
//       } catch (err) {
//         console.error('Failed to fetch podcasts:', err);
//         setError('Unable to fetch podcasts.');
//       } finally {
//         setGlobalLoading(false);
//         fetchInProgress.current = false;
//       }
//     };

//     fetchAllPodcasts();
//   }, []);

//   return (
//     <PodcastContext.Provider
//       value={{
//         podcasts,
//         podcastDetails,
//         error,
//         fetchPodcastDetail: async (id) => {
//           // ✅ Return early if podcast is already cached
//           if (podcastDetails[id]) return;

//           const details = await fetchPodcastDetailsBatch([id]);
//           if (details.length) {
//             setPodcastDetails((prev) => ({ ...prev, [id]: details[0] }));
//           }
//         },
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

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
//   useCallback,
//   useRef,
// } from 'react';
// import {
//   fetchPodcasts,
//   fetchPodcastDetailsBatch,
// } from '@/api/services/podcastService';
// import { Podcast, DetailedPodcast } from '@/types/PodcastTypes';

// interface PodcastContextType {
//   podcasts: Podcast[];
//   podcastDetails: Record<string, DetailedPodcast>;
//   error: string | null;
//   fetchPodcastDetail: (id: string) => Promise<void>;
//   globalLoading: boolean;
// }

// const PodcastContext = createContext<PodcastContextType | undefined>(undefined);

// export const PodcastProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [podcasts, setPodcasts] = useState<Podcast[]>([]);
//   const [podcastDetails, setPodcastDetails] = useState<
//     Record<string, DetailedPodcast>
//   >({});
//   const [error, setError] = useState<string | null>(null);
//   const [globalLoading, setGlobalLoading] = useState(false);
//   const fetchInProgress = useRef(false); // Prevent multiple API calls

//   useEffect(() => {
//     const fetchAllPodcasts = async () => {
//       if (fetchInProgress.current) return;
//       fetchInProgress.current = true;

//       try {
//         setGlobalLoading(true);
//         const data = await fetchPodcasts();
//         setPodcasts(data);
//         setError(null);

//         requestIdleCallback(() => {
//           const first5Ids = data.slice(0, 5).map((podcast) => podcast.id);
//           fetchPodcastDetailsBatch(first5Ids).then((details) => {
//             const detailsMap = Object.fromEntries(
//               details.map((d) => [d.id, d])
//             );
//             setPodcastDetails(detailsMap);
//           });
//         });
//       } catch (err) {
//         console.error('Failed to fetch podcasts:', err);
//         setError('Unable to fetch podcasts.');
//       } finally {
//         setGlobalLoading(false);
//         fetchInProgress.current = false;
//       }
//     };

//     fetchAllPodcasts();
//   }, []);

//   return (
//     <PodcastContext.Provider
//       value={{
//         podcasts,
//         podcastDetails,
//         error,
//         fetchPodcastDetail: async (id) => {
//           if (podcastDetails[id]) return;
//           const details = await fetchPodcastDetailsBatch([id]);
//           if (details.length) {
//             setPodcastDetails((prev) => ({ ...prev, [id]: details[0] }));
//           }
//         },
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

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
//   useCallback,
//   useRef,
// } from 'react';
// import {
//   fetchPodcasts,
//   fetchPodcastDetailsBatch,
// } from '@/api/services/podcastService';
// import { Podcast, DetailedPodcast } from '@/types/PodcastTypes';

// interface PodcastContextType {
//   podcasts: Podcast[];
//   podcastDetails: Record<string, DetailedPodcast>;
//   error: string | null;
//   fetchPodcastDetail: (id: string) => Promise<void>;
//   globalLoading: boolean;
// }

// const PodcastContext = createContext<PodcastContextType | undefined>(undefined);

// export const PodcastProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [podcasts, setPodcasts] = useState<Podcast[]>([]);
//   const [podcastDetails, setPodcastDetails] = useState<
//     Record<string, DetailedPodcast>
//   >({});
//   const [error, setError] = useState<string | null>(null);
//   const [globalLoading, setGlobalLoading] = useState(false);
//   const fetchInProgress = useRef(false); // Prevent multiple API calls

//   useEffect(() => {
//     const fetchAllPodcasts = async () => {
//       if (fetchInProgress.current) return;
//       fetchInProgress.current = true;

//       try {
//         setGlobalLoading(true);
//         const data = await fetchPodcasts();
//         setPodcasts(data);
//         setError(null);

//         // **Preload first 5 podcast details**
//         if ('requestIdleCallback' in window) {
//           requestIdleCallback(() => {
//             const first5Ids = data.slice(0, 5).map((podcast) => podcast.id);
//             fetchPodcastDetailsBatch(first5Ids).then((details) => {
//               const detailsMap = Object.fromEntries(
//                 details.map((d) => [d.id, d])
//               );
//               setPodcastDetails(detailsMap);
//             });
//           });
//         }
//       } catch (err) {
//         console.error('Failed to fetch podcasts:', err);
//         setError('Unable to fetch podcasts.');
//       } finally {
//         setGlobalLoading(false);
//         fetchInProgress.current = false;
//       }
//     };

//     fetchAllPodcasts();
//   }, []);

//   const fetchPodcastDetail = useCallback(
//     async (id: string) => {
//       if (podcastDetails[id]) return; // Already fetched, avoid duplicate API call

//       try {
//         setGlobalLoading(true);
//         const details = await fetchPodcastDetailsBatch([id]);
//         if (details.length) {
//           setPodcastDetails((prev) => ({ ...prev, [id]: details[0] }));
//         }
//         setError(null);
//       } catch (err) {
//         console.error('Failed to fetch podcast details:', err);
//         setError('Unable to fetch podcast details.');
//       } finally {
//         setGlobalLoading(false);
//       }
//     },
//     [podcastDetails]
//   );

//   return (
//     <PodcastContext.Provider
//       value={{
//         podcasts,
//         podcastDetails,
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
//   fetchPodcastDetailsBatch,
// } from '@/api/services/podcastService';
// import { Podcast, DetailedPodcast } from '@/types/PodcastTypes';

// interface PodcastContextType {
//   podcasts: Podcast[];
//   podcastDetails: Record<string, DetailedPodcast>;
//   error: string | null;
//   fetchPodcastDetail: (id: string) => Promise<void>;
//   globalLoading: boolean;
// }

// const PodcastContext = createContext<PodcastContextType | undefined>(undefined);

// export const PodcastProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [podcasts, setPodcasts] = useState<Podcast[]>([]);
//   const [podcastDetails, setPodcastDetails] = useState<
//     Record<string, DetailedPodcast>
//   >({});
//   const [error, setError] = useState<string | null>(null);
//   const [globalLoading, setGlobalLoading] = useState(false);

//   useEffect(() => {
//     const fetchAllPodcasts = async () => {
//       try {
//         setGlobalLoading(true);
//         const data = await fetchPodcasts();
//         setPodcasts(data);
//         setError(null);

//         // **Preload first 5 podcast details**
//         if ('requestIdleCallback' in window) {
//           requestIdleCallback(() => {
//             const first5Ids = data.slice(0, 5).map((podcast) => podcast.id);
//             fetchPodcastDetailsBatch(first5Ids).then((details) => {
//               const detailsMap = Object.fromEntries(
//                 details.map((d) => [d.id, d])
//               );
//               setPodcastDetails(detailsMap);
//             });
//           });
//         }
//       } catch (err) {
//         console.error('Failed to fetch podcasts:', err);
//         setError('Unable to fetch podcasts.');
//       } finally {
//         setGlobalLoading(false);
//       }
//     };

//     fetchAllPodcasts();
//   }, []);

//   const fetchPodcastDetail = useCallback(
//     async (id: string) => {
//       if (podcastDetails[id]) return; // Already fetched, avoid duplicate API call

//       try {
//         setGlobalLoading(true);
//         const details = await fetchPodcastDetailsBatch([id]);
//         if (details.length) {
//           setPodcastDetails((prev) => ({ ...prev, [id]: details[0] }));
//         }
//         setError(null);
//       } catch (err) {
//         console.error('Failed to fetch podcast details:', err);
//         setError('Unable to fetch podcast details.');
//       } finally {
//         setGlobalLoading(false);
//       }
//     },
//     [podcastDetails]
//   );

//   return (
//     <PodcastContext.Provider
//       value={{
//         podcasts,
//         podcastDetails,
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
