// // import React, {
// //   createContext,
// //   useContext,
// //   useState,
// //   useEffect,
// //   ReactNode,
// //   useCallback,
// // } from 'react';
// // import {
// //   fetchPodcasts,
// //   fetchPodcastDetails,
// // } from '@/api/services/podcastService';
// // import { Podcast, DetailedPodcast } from '@/types/PodcastTypes';
// // import { getCachedData, setCachedData } from '@/api/utils/cacheUtil';
// // interface PodcastContextType {
// //   podcasts: Podcast[];
// //   podcastDetails: Record<string, DetailedPodcast>;
// //   fetchPodcastDetail: (id: string) => Promise<void>;
// //   globalLoading: boolean;
// // }

// // interface PodcastProviderProps {
// //   children: ReactNode;
// // }

// // const PodcastContext = createContext<PodcastContextType | undefined>(undefined);

// // export const PodcastProvider: React.FC<PodcastProviderProps> = ({
// //   children,
// // }) => {
// //   const [podcasts, setPodcasts] = useState<Podcast[]>([]);
// //   const [podcastDetails, setPodcastDetails] = useState<
// //     Record<string, DetailedPodcast>
// //   >({});
// //   const [globalLoading, setGlobalLoading] = useState(false);

// //   useEffect(() => {
// //     const loadPodcasts = async () => {
// //       setGlobalLoading(true);
// //       try {
// //         const data = await fetchPodcasts();
// //         setPodcasts(data);
// //         setCachedData('cached-podcasts', data); // Cache all podcasts immediately
// //       } catch (error) {
// //         console.error('Error fetching podcasts:', error);
// //       } finally {
// //         setGlobalLoading(false);
// //       }
// //     };
// //     loadPodcasts();
// //   }, []);

// //   const fetchPodcastDetail = useCallback(
// //     async (podcastId: string) => {
// //       if (podcastDetails[podcastId]) {
// //         return;
// //       }

// //       const cachedData = getCachedData<DetailedPodcast>(
// //         `podcast-${podcastId}`,
// //         86400000
// //       );
// //       if (cachedData) {
// //         setPodcastDetails((prev) => ({ ...prev, [podcastId]: cachedData }));

// //         if (cachedData.episodes.length === 0) {
// //           fetchPodcastDetails(podcastId).then((detail) => {
// //             setPodcastDetails((prev) => ({ ...prev, [podcastId]: detail }));
// //             setCachedData(`podcast-${podcastId}`, detail);
// //           });
// //         }

// //         return;
// //       }

// //       try {
// //         const detail = await fetchPodcastDetails(podcastId);
// //         setPodcastDetails((prev) => ({ ...prev, [podcastId]: detail }));
// //         setCachedData(`podcast-${podcastId}`, detail);
// //       } catch (error) {
// //         console.error('Error fetching podcast details:', error);
// //       }
// //     },
// //     [podcastDetails]
// //   );

// //   return (
// //     <PodcastContext.Provider
// //       value={{ podcasts, podcastDetails, fetchPodcastDetail, globalLoading }}
// //     >
// //       {children}
// //     </PodcastContext.Provider>
// //   );
// // };

// // export const usePodcastContext = () => {
// //   const context = useContext(PodcastContext);
// //   if (!context) {
// //     throw new Error('usePodcastContext must be used within a PodcastProvider');
// //   }
// //   return context;
// // };
// // context/PodcastProvider.ts
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
// import { getCachedData, setCachedData } from '@/api/utils/cacheUtil';
// import { Podcast, DetailedPodcast } from '@/types/PodcastTypes';
// import useLazyLoadPodcasts from '@/hooks/useLazyLoadPodcasts';

// interface PodcastContextType {
//   podcasts: Podcast[];
//   podcastDetail: DetailedPodcast | null;
//   fetchPodcastDetail: (id: string) => void;
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
//   const [currentPodcastId, setCurrentPodcastId] = useState<string | null>(null);
//   const [globalLoading, setGlobalLoading] = useState(true);

//   useEffect(() => {
//     const loadPodcasts = async () => {
//       const cachedPodcasts = getCachedData<Podcast[]>('podcasts', 86400000);
//       if (cachedPodcasts) {
//         setPodcasts(cachedPodcasts);
//         setGlobalLoading(false);
//       }

//       try {
//         const freshPodcasts = await fetchPodcasts();
//         setPodcasts(freshPodcasts);
//         setCachedData('podcasts', freshPodcasts);
//       } catch (err) {
//         console.error('Error fetching podcasts:', err);
//       } finally {
//         setGlobalLoading(false);
//       }
//     };
//     loadPodcasts();
//   }, []);

//   // **Apply Lazy Loading to Cache Podcast Details**
//   useLazyLoadPodcasts(podcasts);

//   // Fetch Podcast Details (Uses Cached Data if Available)
//   const fetchPodcastDetail = useCallback(
//     async (id: string) => {
//       if (id === currentPodcastId) return;
//       setCurrentPodcastId(id);

//       const cachedDetail = getCachedData<DetailedPodcast>(
//         `podcast-${id}`,
//         86400000
//       );
//       if (cachedDetail) {
//         setPodcastDetail(cachedDetail);
//         return;
//       }

//       setPodcastDetail(null);
//       setGlobalLoading(true);
//       try {
//         const freshDetail = await fetchPodcastDetails(id);
//         setPodcastDetail(freshDetail);
//         setCachedData(`podcast-${id}`, freshDetail);
//       } catch (err) {
//         console.error('Failed to fetch podcast details:', err);
//       } finally {
//         setGlobalLoading(false);
//       }
//     },
//     [currentPodcastId]
//   );

//   return (
//     <PodcastContext.Provider
//       value={{ podcasts, podcastDetail, fetchPodcastDetail, globalLoading }}
//     >
//       {children}
//     </PodcastContext.Provider>
//   );
// };

// export const usePodcastContext = (): PodcastContextType => {
//   const context = useContext(PodcastContext);
//   if (!context)
//     throw new Error('usePodcastContext must be used within a PodcastProvider');
//   return context;
// };

// // import React, {
// //   createContext,
// //   useContext,
// //   useState,
// //   useEffect,
// //   ReactNode,
// //   useCallback,
// //   useRef,
// // } from 'react';
// // import {
// //   fetchPodcasts,
// //   fetchPodcastDetails,
// // } from '@/api/services/podcastService';
// // import { Podcast, DetailedPodcast } from '@/types/PodcastTypes';
// // import { getCachedData, setCachedData } from '@/api/utils/cacheUtil';

// // interface PodcastContextType {
// //   podcasts: Podcast[];
// //   podcastDetails: Record<string, DetailedPodcast>;
// //   fetchPodcastDetail: (id: string) => Promise<void>;
// //   globalLoading: boolean;
// // }

// // interface PodcastProviderProps {
// //   children: ReactNode;
// // }

// // const PodcastContext = createContext<PodcastContextType | undefined>(undefined);

// // export const PodcastProvider: React.FC<PodcastProviderProps> = ({
// //   children,
// // }) => {
// //   const [podcasts, setPodcasts] = useState<Podcast[]>(
// //     getCachedData('cached-podcasts', 86400000) || []
// //   );
// //   const [podcastDetails, setPodcastDetails] = useState<
// //     Record<string, DetailedPodcast>
// //   >(getCachedData('cached-podcast-details', 86400000) || {});
// //   const [globalLoading, setGlobalLoading] = useState(podcasts.length === 0);

// //   const isFetchingRef = useRef<Record<string, boolean>>({});

// //   const SCROLL_THRESHOLD = 5; // Load 5 ahead while scrolling
// //   useEffect(() => {
// //     if (podcasts.length > 0) return;

// //     const loadPodcasts = async () => {
// //       try {
// //         setGlobalLoading(true);
// //         console.log('[PodcastProvider] Fetching podcasts...');
// //         const data = await fetchPodcasts();

// //         // ✅ Pre-cache minimal details
// //         const basicDetails: Record<string, DetailedPodcast> = data.reduce(
// //           (acc, podcast) => {
// //             acc[podcast.id] = {
// //               id: podcast.id,
// //               artworkUrl600: podcast.artwork,
// //               collectionName: podcast.name,
// //               artistName: podcast.artist,
// //               summary: podcast.summary,
// //               description: '', // Placeholder until full details load
// //               episodes: [], // Placeholder until full details load
// //             };
// //             return acc;
// //           },
// //           {} as Record<string, DetailedPodcast>
// //         );

// //         setPodcasts(data);
// //         setCachedData('cached-podcasts', data);
// //         setCachedData('cached-basic-podcast-details', basicDetails);
// //       } catch (error) {
// //         console.error('[PodcastProvider] Error fetching podcasts:', error);
// //       } finally {
// //         setGlobalLoading(false);
// //       }
// //     };

// //     loadPodcasts();
// //   }, []);
// //   // useEffect(() => {
// //   //   if (podcasts.length > 0) return;

// //   //   const loadPodcasts = async () => {
// //   //     try {
// //   //       setGlobalLoading(true);
// //   //       const data = await fetchPodcasts();

// //   //       // 🚀 Store lightweight metadata instantly
// //   //       const basicDetails: Record<string, DetailedPodcast> = data.reduce(
// //   //         (acc, podcast) => {
// //   //           acc[podcast.id] = {
// //   //             id: podcast.id,
// //   //             artworkUrl600: podcast.artwork,
// //   //             collectionName: podcast.name,
// //   //             artistName: podcast.artist,
// //   //             summary: podcast.summary,
// //   //             description: '',
// //   //             episodes: [],
// //   //           };
// //   //           return acc;
// //   //         },
// //   //         {} as Record<string, DetailedPodcast>
// //   //       );

// //   //       setPodcasts(data);
// //   //       setCachedData('cached-podcasts', data);
// //   //       setCachedData('cached-basic-podcast-details', basicDetails);
// //   //     } catch (error) {
// //   //       console.error('Error fetching podcasts:', error);
// //   //     } finally {
// //   //       setGlobalLoading(false);
// //   //     }
// //   //   };

// //   //   loadPodcasts();
// //   // }, []);
// //   const fetchPodcastDetail = useCallback(
// //     async (podcastId: string): Promise<void> => {
// //       if (
// //         !podcastId ||
// //         podcastDetails[podcastId] ||
// //         isFetchingRef.current[podcastId]
// //       )
// //         return;

// //       console.log(`[PodcastProvider] Fetching details for ${podcastId}...`);
// //       isFetchingRef.current[podcastId] = true;

// //       try {
// //         const detail = await fetchPodcastDetails(podcastId);
// //         setPodcastDetails((prev) => ({ ...prev, [podcastId]: detail }));
// //         setCachedData(`podcast-${podcastId}`, detail);
// //       } catch (error) {
// //         console.error(
// //           `[PodcastProvider] Error fetching details for podcast ${podcastId}:`,
// //           error
// //         );
// //       } finally {
// //         isFetchingRef.current[podcastId] = false;
// //       }
// //     },
// //     [podcastDetails]
// //   );
// //   // const fetchPodcastDetail = useCallback(
// //   //   async (podcastId: string): Promise<void> => {
// //   //     if (podcastDetails[podcastId]) return;

// //   //     console.log(
// //   //       `[PodcastProvider] Checking cache for podcast ${podcastId}...`
// //   //     );

// //   //     // ✅ Show cached metadata instantly
// //   //     const cachedBasicDetails = getCachedData<Record<string, DetailedPodcast>>(
// //   //       'cached-basic-podcast-details',
// //   //       86400000
// //   //     );
// //   //     if (cachedBasicDetails?.[podcastId]) {
// //   //       setPodcastDetails((prev) => ({
// //   //         ...prev,
// //   //         [podcastId]: cachedBasicDetails[podcastId],
// //   //       }));
// //   //     }

// //   //     // ✅ Fetch full details only if needed
// //   //     const cachedFullDetail = getCachedData<DetailedPodcast>(
// //   //       `podcast-${podcastId}`,
// //   //       86400000
// //   //     );
// //   //     if (cachedFullDetail) {
// //   //       setPodcastDetails((prev) => ({
// //   //         ...prev,
// //   //         [podcastId]: cachedFullDetail,
// //   //       }));
// //   //       return;
// //   //     }

// //   //     console.log(
// //   //       `[PodcastProvider] Fetching fresh details for ${podcastId}...`
// //   //     );

// //   //     try {
// //   //       const detail = await fetchPodcastDetails(podcastId);
// //   //       setPodcastDetails((prev) => ({ ...prev, [podcastId]: detail }));
// //   //       setCachedData(`podcast-${podcastId}`, detail);
// //   //       console.log(
// //   //         `[PodcastProvider] Successfully fetched details for ${podcastId}.`
// //   //       );
// //   //     } catch (error) {
// //   //       console.error(
// //   //         `Error fetching details for podcast ${podcastId}:`,
// //   //         error
// //   //       );
// //   //     }
// //   //   },
// //   //   [podcastDetails]
// //   // );

// //   return (
// //     <PodcastContext.Provider
// //       value={{ podcasts, podcastDetails, fetchPodcastDetail, globalLoading }}
// //     >
// //       {children}
// //     </PodcastContext.Provider>
// //   );
// // };

// // export const usePodcastContext = () => {
// //   const context = useContext(PodcastContext);
// //   if (!context) {
// //     throw new Error('usePodcastContext must be used within a PodcastProvider');
// //   }
// //   return context;
// // };

// // import React, {
// //   createContext,
// //   useContext,
// //   useState,
// //   useEffect,
// //   ReactNode,
// //   useCallback,
// // } from 'react';
// // import {
// //   fetchPodcasts,
// //   fetchPodcastDetails,
// // } from '@/api/services/podcastService';
// // import { Podcast, DetailedPodcast } from '@/types/PodcastTypes';
// // import { getCachedData, setCachedData } from '@/api/utils/cacheUtil';

// // interface PodcastContextType {
// //   podcasts: Podcast[];
// //   podcastDetails: Record<string, DetailedPodcast>;
// //   fetchPodcastDetail: (id: string) => Promise<void>;
// //   globalLoading: boolean;
// // }

// // interface PodcastProviderProps {
// //   children: ReactNode;
// // }

// // const PodcastContext = createContext<PodcastContextType | undefined>(undefined);
// // export const PodcastProvider: React.FC<PodcastProviderProps> = ({
// //   children,
// // }) => {
// //   const [podcasts, setPodcasts] = useState<Podcast[]>(
// //     getCachedData('cached-podcasts', 86400000) || []
// //   );
// //   const [podcastDetails, setPodcastDetails] = useState<
// //     Record<string, DetailedPodcast>
// //   >(getCachedData('cached-podcast-details', 86400000) || {});
// //   const [globalLoading, setGlobalLoading] = useState(podcasts.length === 0);

// //   useEffect(() => {
// //     if (podcasts.length > 0) return;

// //     const loadPodcasts = async () => {
// //       try {
// //         setGlobalLoading(true);
// //         const data = await fetchPodcasts();
// //         setPodcasts(data);
// //         setCachedData('cached-podcasts', data);
// //       } catch (error) {
// //         console.error('Error fetching podcasts:', error);
// //       } finally {
// //         setGlobalLoading(false);
// //       }
// //     };

// //     loadPodcasts();
// //   }, []);
// //   const fetchPodcastDetail = useCallback(
// //     async (podcastId: string): Promise<void> => {
// //       if (podcastDetails[podcastId]) return;

// //       const cachedData = getCachedData<DetailedPodcast>(
// //         `podcast-${podcastId}`,
// //         86400000
// //       );
// //       if (cachedData) {
// //         setPodcastDetails((prev) => ({ ...prev, [podcastId]: cachedData }));
// //         return;
// //       }

// //       const detail = await fetchPodcastDetails(podcastId);
// //       setPodcastDetails((prev) => ({ ...prev, [podcastId]: detail }));
// //       setCachedData(`podcast-${podcastId}`, detail);
// //     },
// //     [podcastDetails]
// //   );
// //   // const fetchPodcastDetail = useCallback(async (podcastId: string) => {
// //   //   if (podcastDetails[podcastId]) {
// //   //     return;
// //   //   }

// //   //   let cachedData = getCachedData<DetailedPodcast>(
// //   //     `podcast-${podcastId}`,
// //   //     86400000
// //   //   );
// //   //   if (!cachedData) {
// //   //     try {
// //   //       cachedData = await fetchPodcastDetails(podcastId);
// //   //       setCachedData(`podcast-${podcastId}`, cachedData);
// //   //     } catch (error) {
// //   //       console.error('Error fetching podcast details:', error);
// //   //       return;
// //   //     }
// //   //   }

// //   //   setPodcastDetails((prev) => ({ ...prev, [podcastId]: cachedData! }));
// //   // }, []);

// //   return (
// //     <PodcastContext.Provider
// //       value={{ podcasts, podcastDetails, fetchPodcastDetail, globalLoading }}
// //     >
// //       {children}
// //     </PodcastContext.Provider>
// //   );
// // };
// // export const usePodcastContext = () => {
// //   const context = useContext(PodcastContext);
// //   if (!context) {
// //     throw new Error('usePodcastContext must be used within a PodcastProvider');
// //   }
// //   return context;
// // };

// // export const PodcastProvider: React.FC<PodcastProviderProps> = ({
// //   children,
// // }) => {
// //   const [podcasts, setPodcasts] = useState<Podcast[]>(
// //     getCachedData('cached-podcasts', 86400000) || []
// //   );
// //   const [podcastDetails, setPodcastDetails] = useState<
// //     Record<string, DetailedPodcast>
// //   >({});
// //   const [globalLoading, setGlobalLoading] = useState(podcasts.length === 0);

// //   useEffect(() => {
// //     if (podcasts.length > 0) return;
// //     const loadPodcasts = async () => {
// //       try {
// //         setGlobalLoading(true);
// //         const data = await fetchPodcasts();
// //         setPodcasts(data);
// //         setCachedData('cached-podcasts', data);
// //       } catch (error) {
// //         console.error('Error fetching podcasts:', error);
// //       } finally {
// //         setGlobalLoading(false);
// //       }
// //     };
// //     loadPodcasts();
// //   }, []);

// //   // const fetchPodcastDetail = useCallback(async (podcastId: string) => {
// //   //   if (!podcastId) return;

// //   //   let cachedData = getCachedData<DetailedPodcast>(
// //   //     `podcast-${podcastId}`,
// //   //     86400000
// //   //   );
// //   //   if (!cachedData) {
// //   //     try {
// //   //       cachedData = await fetchPodcastDetails(podcastId);
// //   //       setCachedData(`podcast-${podcastId}`, cachedData);
// //   //     } catch (error) {
// //   //       console.error('Error fetching podcast details:', error);
// //   //       return;
// //   //     }
// //   //   }

// //   //   setPodcastDetails((prev) => {
// //   //     const newCache = { ...prev, [podcastId]: cachedData! };
// //   //     const keys = Object.keys(newCache);

// //   //     // Implement LRU caching - keep only the latest `MAX_CACHED_PODCASTS`
// //   //     if (keys.length > MAX_CACHED_PODCASTS) {
// //   //       delete newCache[keys[0]];
// //   //     }

// //   //     return newCache;
// //   //   });
// //   // }, []);
// //   const fetchPodcastDetail = useCallback(
// //     async (podcastId: string) => {
// //       if (podcastDetails[podcastId]) {
// //         return;
// //       }

// //       const cachedData = getCachedData<DetailedPodcast>(
// //         `podcast-${podcastId}`,
// //         86400000
// //       );
// //       if (cachedData) {
// //         setPodcastDetails((prev) => ({ ...prev, [podcastId]: cachedData }));
// //         return;
// //       }

// //       try {
// //         const detail = await fetchPodcastDetails(podcastId);
// //         setPodcastDetails((prev) => ({ ...prev, [podcastId]: detail }));
// //         setCachedData(`podcast-${podcastId}`, detail);
// //       } catch (error) {
// //         console.error('Error fetching podcast details:', error);
// //       }
// //     },
// //     [podcastDetails]
// //   );

// //   return (
// //     <PodcastContext.Provider
// //       value={{ podcasts, podcastDetails, fetchPodcastDetail, globalLoading }}
// //     >
// //       {children}
// //     </PodcastContext.Provider>
// //   );
// // };

// // export const usePodcastContext = () => {
// //   const context = useContext(PodcastContext);
// //   if (!context) {
// //     throw new Error('usePodcastContext must be used within a PodcastProvider');
// //   }
// //   return context;
// // };
// // interface PodcastContextType {
// //   podcasts: Podcast[];
// //   podcastDetails: Record<string, DetailedPodcast>;
// //   fetchPodcastDetail: (id: string) => Promise<void>;
// //   globalLoading: boolean;
// // }

// // interface PodcastProviderProps {
// //   children: ReactNode;
// // }

// // const PodcastContext = createContext<PodcastContextType | undefined>(undefined);

// // export const PodcastProvider: React.FC<PodcastProviderProps> = ({
// //   children,
// // }) => {
// //   const [podcasts, setPodcasts] = useState<Podcast[]>([]);
// //   const [podcastDetails, setPodcastDetails] = useState<
// //     Record<string, DetailedPodcast>
// //   >({});
// //   const [globalLoading, setGlobalLoading] = useState(false);

// //   useEffect(() => {
// //     const loadPodcasts = async () => {
// //       setGlobalLoading(true);
// //       try {
// //         const data = await fetchPodcasts();
// //         setPodcasts(data);
// //         setCachedData('cached-podcasts', data);
// //       } catch (error) {
// //         console.error('Error fetching podcasts:', error);
// //       } finally {
// //         setGlobalLoading(false);
// //       }
// //     };
// //     loadPodcasts();
// //   }, []);

// //   const fetchPodcastDetail = useCallback(
// //     async (podcastId: string) => {
// //       if (podcastDetails[podcastId]) {
// //         return;
// //       }

// //       const cachedData = getCachedData<DetailedPodcast>(
// //         `podcast-${podcastId}`,
// //         86400000
// //       );
// //       if (cachedData) {
// //         setPodcastDetails((prev) => ({ ...prev, [podcastId]: cachedData }));
// //         return;
// //       }

// //       try {
// //         setGlobalLoading(true);
// //         const detail = await fetchPodcastDetails(podcastId);
// //         setPodcastDetails((prev) => ({ ...prev, [podcastId]: detail }));
// //         setCachedData(`podcast-${podcastId}`, detail);
// //       } catch (error) {
// //         console.error('Error fetching podcast details:', error);
// //       } finally {
// //         setGlobalLoading(false);
// //       }
// //     },
// //     [podcastDetails]
// //   );

// //   return (
// //     <PodcastContext.Provider
// //       value={{ podcasts, podcastDetails, fetchPodcastDetail, globalLoading }}
// //     >
// //       {children}
// //     </PodcastContext.Provider>
// //   );
// // };

// // export const usePodcastContext = () => {
// //   const context = useContext(PodcastContext);
// //   if (!context) {
// //     throw new Error('usePodcastContext must be used within a PodcastProvider');
// //   }
// //   return context;
// // };

// id: string;
//   name: string;
//   artist: string;
//   artwork: string;
//   summary: string;
//   episodes?: Episode[]; // Make episodes optional to avoid errors
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
  fetchPodcastDetail: (podcastId: string) => Promise<void>;
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
        setPodcastsLoading(false);
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

  const fetchPodcastDetailHandler = useCallback(async (podcastId: string) => {
    const cacheKey = `podcastDetail_${podcastId}`;
    const cached = getCache(cacheKey);
    if (cached && isCacheValid(cached.timestamp, PODCAST_DETAIL_CACHE_EXPIRY)) {
      setPodcastDetails((prev) => ({
        ...prev,
        [podcastId]: cached.data as DetailedPodcast,
      }));
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
    }
  }, []);

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
