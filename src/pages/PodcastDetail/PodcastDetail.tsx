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
import React, { useEffect, lazy, useMemo } from 'react';
import { useParams } from 'react-router-dom';
const PodcastCard = lazy(() => import('@/components/PodcastCard/PodcastCard'));
import styles from './PodcastDetail.module.css';
import { usePodcastContext } from '../../context/PodcastContext';
import EpisodeTable from '../../components/EpisodeTable/EpisodeTable';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import PodcastDetailSkeleton from '../../components/Skeleton/PodcastDetailSkeleton/PodcastDetailSkeleton';

const PodcastDetail: React.FC = () => {
  const { podcastId } = useParams<{ podcastId: string }>();
  const { podcastDetail, fetchPodcastDetail, error, globalLoading } =
    usePodcastContext();

  // ✅ UseMemo to ensure `podcastDetail` is correctly referenced
  const isDataValid = useMemo(
    () => podcastDetail?.id === podcastId,
    [podcastDetail, podcastId]
  );

  useEffect(() => {
    if (podcastId && !isDataValid) {
      fetchPodcastDetail(podcastId);
    }
  }, [podcastId, fetchPodcastDetail, isDataValid]); // ✅ Prevents redundant re-fetches

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (globalLoading || !isDataValid) {
    return <PodcastDetailSkeleton />;
  }

  const episodes = podcastDetail?.episodes || [];

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <PodcastCard
          image={podcastDetail?.artworkUrl600 || ''}
          title={podcastDetail?.collectionName || 'Unknown Title'}
          author={podcastDetail?.artistName || 'Unknown Author'}
          description={podcastDetail?.summary || 'No summary available'}
        />
      </aside>
      <main className={styles.content}>
        <div className={styles.episodesTitleWrapper}>
          <h2 className={styles.episodesTitle}>Episodes: {episodes.length}</h2>
        </div>
        <div className={styles.episodeTableWrapper}>
          <EpisodeTable episodes={episodes} podcastId={podcastId!} />
        </div>
      </main>
    </div>
  );
};

export default PodcastDetail;
