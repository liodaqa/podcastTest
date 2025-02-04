// import React, { useEffect, lazy } from 'react';
// import { useParams } from 'react-router-dom';
// const PodcastCard = lazy(() => import('@/components/PodcastCard/PodcastCard'));
// import styles from './PodcastDetail.module.css';
// import { usePodcastContext } from '../../context/PodcastContext';
// import EpisodeTable from '../../components/EpisodeTable/EpisodeTable';
// import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
// import PodcastDetailSkeleton from '../../components/Skeleton/PodcastDetailSkeleton/PodcastDetailSkeleton';

// const PodcastDetail: React.FC = () => {
//   const { podcastId } = useParams<{ podcastId: string }>();
//   const { podcastDetail, fetchPodcastDetail, error, globalLoading } =
//     usePodcastContext();

//   useEffect(() => {
//     if (podcastId) {
//       fetchPodcastDetail(podcastId);
//     }
//   }, [podcastId, fetchPodcastDetail]);

//   const isDataValid = podcastDetail?.id === podcastId;

//   if (error) {
//     return <ErrorMessage message={error} />;
//   }

//   if (globalLoading || !isDataValid) {
//     return <PodcastDetailSkeleton />;
//   }

//   const episodes = podcastDetail?.episodes || [];

//   return (
//     <div className={styles.container}>
//       <aside className={styles.sidebar}>
//         <PodcastCard
//           image={podcastDetail?.artworkUrl600 || ''}
//           title={podcastDetail?.collectionName || 'Unknown Title'}
//           author={podcastDetail?.artistName || 'Unknown Author'}
//           description={podcastDetail?.summary || 'No summary available'}
//         />
//       </aside>
//       <main className={styles.content}>
//         <div className={styles.episodesTitleWrapper}>
//           <h2 className={styles.episodesTitle}>Episodes: {episodes.length}</h2>
//         </div>
//         <div className={styles.episodeTableWrapper}>
//           <EpisodeTable episodes={episodes} podcastId={podcastId!} />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default PodcastDetail;
import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { usePodcastContext } from '@/context/PodcastContext';
import EpisodeTable from '@/components/EpisodeTable/EpisodeTable';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import PodcastDetailSkeleton from '@/components/Skeleton/PodcastDetailSkeleton/PodcastDetailSkeleton';
import styles from './PodcastDetail.module.css';
import PodcastCard from '@/components/PodcastCard/PodcastCard';

const PodcastDetail: React.FC = () => {
  const { podcastId } = useParams<{ podcastId: string }>();
  const { podcastDetails, fetchPodcastDetail, error, globalLoading } =
    usePodcastContext();

  // ✅ Memoized cached podcast details
  const podcastDetail = useMemo(
    () => podcastDetails[podcastId!],
    [podcastDetails, podcastId]
  );

  useEffect(() => {
    // ✅ Fetch podcast details only if **not cached**
    if (podcastId && !podcastDetail) {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => fetchPodcastDetail(podcastId));
      } else {
        fetchPodcastDetail(podcastId);
      }
    }
  }, [podcastId, fetchPodcastDetail, podcastDetail]);

  if (error) return <ErrorMessage message={error} />;
  if (!podcastDetail) return <PodcastDetailSkeleton />;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <PodcastCard
          image={podcastDetail.artworkUrl600 || ''}
          title={podcastDetail.collectionName || 'Unknown Title'}
          author={podcastDetail.artistName || 'Unknown Author'}
          description={podcastDetail.summary || 'No summary available'}
        />
      </aside>
      <main className={styles.content}>
        <h2 className={styles.episodesTitle}>
          Episodes: {podcastDetail.episodes.length}
        </h2>
        <EpisodeTable
          episodes={podcastDetail.episodes}
          podcastId={podcastId!}
        />
      </main>
    </div>
  );
};

export default React.memo(PodcastDetail);

// import React, { useEffect, useMemo } from 'react';
// import { useParams } from 'react-router-dom';
// import { usePodcastContext } from '@/context/PodcastContext';
// import EpisodeTable from '@/components/EpisodeTable/EpisodeTable';
// import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
// import PodcastDetailSkeleton from '@/components/Skeleton/PodcastDetailSkeleton/PodcastDetailSkeleton';
// import styles from './PodcastDetail.module.css';
// import PodcastCard from '@/components/PodcastCard/PodcastCard';

// const PodcastDetail: React.FC = () => {
//   const { podcastId } = useParams<{ podcastId: string }>();
//   const { podcastDetails, fetchPodcastDetail, error, globalLoading } =
//     usePodcastContext();

//   // ✅ Get podcast details from cache FIRST
//   const podcastDetail = useMemo(
//     () => podcastDetails[podcastId!],
//     [podcastDetails, podcastId]
//   );

//   useEffect(() => {
//     // ✅ Fetch podcast details only if NOT already cached
//     if (podcastId && !podcastDetail) {
//       fetchPodcastDetail(podcastId);
//     }
//   }, [podcastId, fetchPodcastDetail, podcastDetail]);

//   if (error) return <ErrorMessage message={error} />;

//   // ✅ Show cached details immediately, otherwise show skeleton
//   if (!podcastDetail) return <PodcastDetailSkeleton />;

//   return (
//     <div className={styles.container}>
//       <aside className={styles.sidebar}>
//         <PodcastCard
//           image={podcastDetail.artworkUrl600 || ''}
//           title={podcastDetail.collectionName || 'Unknown Title'}
//           author={podcastDetail.artistName || 'Unknown Artist'}
//           description={podcastDetail.summary || 'No summary available'}
//         />
//       </aside>
//       <main className={styles.content}>
//         <h2 className={styles.episodesTitle}>
//           Episodes: {podcastDetail.episodes.length}
//         </h2>
//         <EpisodeTable
//           episodes={podcastDetail.episodes}
//           podcastId={podcastId!}
//         />
//       </main>
//     </div>
//   );
// };

// export default React.memo(PodcastDetail);

// import React, { useEffect, useMemo } from 'react';
// import { useParams } from 'react-router-dom';
// import { usePodcastContext } from '@/context/PodcastContext';
// import EpisodeTable from '@/components/EpisodeTable/EpisodeTable';
// import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
// import Skeleton from '@/components/Skeleton/PodcastDetailSkeleton/PodcastDetailSkeleton';
// import styles from './PodcastDetail.module.css';
// import PodcastCard from '@/components/PodcastCard/PodcastCard';

// const PodcastDetail: React.FC = () => {
//   const { podcastId } = useParams<{ podcastId: string }>();
//   const { podcastDetails, fetchPodcastDetail, error, globalLoading } =
//     usePodcastContext();

//   // Get cached podcast details
//   const podcastDetail = useMemo(
//     () => podcastDetails[podcastId!],
//     [podcastDetails, podcastId]
//   );

//   useEffect(() => {
//     if (podcastId && !podcastDetail) {
//       fetchPodcastDetail(podcastId);
//     }
//   }, [podcastId, fetchPodcastDetail, podcastDetail]);

//   if (error) return <ErrorMessage message={error} />;
//   if (globalLoading || !podcastDetail) return <Skeleton />;

//   return (
//     <div className={styles.container}>
//       <aside className={styles.sidebar}>
//         <PodcastCard
//           image={podcastDetail.artworkUrl600 || ''}
//           title={podcastDetail.collectionName || 'Unknown Title'}
//           author={podcastDetail.artistName || 'Unknown Author'}
//           description={podcastDetail.summary || 'No summary available'}
//         />
//       </aside>
//       <main className={styles.content}>
//         <h2 className={styles.episodesTitle}>
//           Episodes: {podcastDetail.episodes.length}
//         </h2>
//         <EpisodeTable
//           episodes={podcastDetail.episodes}
//           podcastId={podcastId!}
//         />
//       </main>
//     </div>
//   );
// };

// export default React.memo(PodcastDetail);

// import React, { useEffect, lazy, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { usePodcastContext } from '@/context/PodcastContext';
// import EpisodeTable from '@/components/EpisodeTable/EpisodeTable';
// const PodcastCard = lazy(() => import('@/components/PodcastCard/PodcastCard'));
// import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
// import Skeleton from '../../components/Skeleton/PodcastDetailSkeleton/PodcastDetailSkeleton';
// import styles from './PodcastDetail.module.css';

// const PodcastDetail: React.FC = () => {
//   const { podcastId } = useParams<{ podcastId: string }>();
//   const { podcastDetail, fetchPodcastDetail, error, globalLoading } =
//     usePodcastContext();
//   const [isFetching, setIsFetching] = useState(false);

//   useEffect(() => {
//     if (podcastId && podcastDetail?.id !== podcastId && !isFetching) {
//       setIsFetching(true);
//       fetchPodcastDetail(podcastId).finally(() => setIsFetching(false));
//     }
//   }, [podcastId, fetchPodcastDetail, podcastDetail, isFetching]);

//   if (error) {
//     return <ErrorMessage message={error} />;
//   }

//   if (globalLoading || podcastDetail?.id !== podcastId) {
//     return <Skeleton />;
//   }

//   const episodes = podcastDetail?.episodes || [];

//   return (
//     <div className={styles.container}>
//       <aside className={styles.sidebar}>
//         <PodcastCard
//           image={podcastDetail?.artworkUrl600 || ''}
//           title={podcastDetail?.collectionName || 'Unknown Title'}
//           author={podcastDetail?.artistName || 'Unknown Author'}
//           description={podcastDetail?.summary || 'No summary available'}
//         />
//       </aside>
//       <main className={styles.content}>
//         <div className={styles.episodesTitleWrapper}>
//           <h2 className={styles.episodesTitle}>Episodes: {episodes.length}</h2>
//         </div>
//         <div className={styles.episodeTableWrapper}>
//           <EpisodeTable episodes={episodes} podcastId={podcastId!} />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default PodcastDetail;

// import React, { useEffect, lazy } from 'react';
// import { useParams } from 'react-router-dom';
// import { usePodcastContext } from '@/context/PodcastContext';
// import EpisodeTable from '@/components/EpisodeTable/EpisodeTable';
// const PodcastCard = lazy(() => import('@/components/PodcastCard/PodcastCard'));
// import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
// import Skeleton from '../../components/Skeleton/PodcastDetailSkeleton/PodcastDetailSkeleton'; // Import the Skeleton component
// import styles from './PodcastDetail.module.css';

// const PodcastDetail: React.FC = () => {
//   const { podcastId } = useParams<{ podcastId: string }>();
//   const { podcastDetail, fetchPodcastDetail, error, globalLoading } =
//     usePodcastContext();

//   useEffect(() => {
//     if (podcastId) {
//       fetchPodcastDetail(podcastId);
//     }
//   }, [podcastId, fetchPodcastDetail]);

//   const isDataValid = podcastDetail?.id === podcastId;

//   if (error) {
//     return <ErrorMessage message={error} />;
//   }

//   // ✅ Show Skeleton component while loading or data is invalid
//   if (globalLoading || !isDataValid) {
//     return <Skeleton />;
//   }

//   const episodes = podcastDetail?.episodes || [];

//   return (
//     <div className={styles.container}>
//       <aside className={styles.sidebar}>
//         <PodcastCard
//           image={podcastDetail?.artworkUrl600 || ''}
//           title={podcastDetail?.collectionName || 'Unknown Title'}
//           author={podcastDetail?.artistName || 'Unknown Author'}
//           description={podcastDetail?.summary || 'No summary available'}
//         />
//       </aside>
//       <main className={styles.content}>
//         <div className={styles.episodesTitleWrapper}>
//           <h2 className={styles.episodesTitle}>Episodes: {episodes.length}</h2>
//         </div>
//         <div className={styles.episodeTableWrapper}>
//           <EpisodeTable episodes={episodes} podcastId={podcastId!} />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default PodcastDetail;

// import React, { useEffect, lazy, useMemo } from 'react';
// import { useParams } from 'react-router-dom';
// const PodcastCard = lazy(() => import('@/components/PodcastCard/PodcastCard'));
// import styles from './PodcastDetail.module.css';
// import { usePodcastContext } from '../../context/PodcastContext';
// import EpisodeTable from '../../components/EpisodeTable/EpisodeTable';
// import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
// import PodcastDetailSkeleton from '../../components/Skeleton/PodcastDetailSkeleton/PodcastDetailSkeleton';

// const PodcastDetail: React.FC = () => {
//   const { podcastId } = useParams<{ podcastId: string }>();
//   const { podcastDetail, fetchPodcastDetail, error, globalLoading } =
//     usePodcastContext();

//   // ✅ UseMemo to ensure `podcastDetail` is correctly referenced
//   const isDataValid = useMemo(
//     () => podcastDetail?.id === podcastId,
//     [podcastDetail, podcastId]
//   );

//   useEffect(() => {
//     if (podcastId && !isDataValid) {
//       fetchPodcastDetail(podcastId);
//     }
//   }, [podcastId, fetchPodcastDetail, isDataValid]); // ✅ Prevents redundant re-fetches

//   if (error) {
//     return <ErrorMessage message={error} />;
//   }

//   if (globalLoading || !isDataValid) {
//     return <PodcastDetailSkeleton />;
//   }

//   const episodes = podcastDetail?.episodes || [];

//   return (
//     <div className={styles.container}>
//       <aside className={styles.sidebar}>
//         <PodcastCard
//           image={podcastDetail?.artworkUrl600 || ''}
//           title={podcastDetail?.collectionName || 'Unknown Title'}
//           author={podcastDetail?.artistName || 'Unknown Author'}
//           description={podcastDetail?.summary || 'No summary available'}
//         />
//       </aside>
//       <main className={styles.content}>
//         <div className={styles.episodesTitleWrapper}>
//           <h2 className={styles.episodesTitle}>Episodes: {episodes.length}</h2>
//         </div>
//         <div className={styles.episodeTableWrapper}>
//           <EpisodeTable episodes={episodes} podcastId={podcastId!} />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default PodcastDetail;
