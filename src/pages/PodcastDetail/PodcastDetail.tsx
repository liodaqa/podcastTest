// import React, { useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { usePodcastContext } from '@/context/PodcastContext';
// import EpisodeTable from '@/components/EpisodeTable/EpisodeTable';
// import PodcastCard from '@/components/PodcastCard/PodcastCard';
// import styles from './PodcastDetail.module.css';

// const PodcastDetail: React.FC = () => {
//   const { podcastId } = useParams<{ podcastId?: string }>();
//   const { podcastDetails, fetchPodcastDetail } = usePodcastContext();

//   // Fetch details but do not block UI
// useEffect(() => {
//   if (podcastId && !podcastDetails[podcastId]) {
//     fetchPodcastDetail(podcastId);
//   }
// }, [podcastId, fetchPodcastDetail]);

//   if (!podcastId) {
//     return <div>Error: Podcast ID is missing.</div>;
//   }

//   const podcast = podcastDetails[podcastId];

//   if (!podcast) {
//     return null; // No loading UI, just wait for React to re-render with cached data
//   }

//   return (
//     <div className={styles.container}>
//       <aside className={styles.sidebar}>
//         <PodcastCard
//           image={podcast.artworkUrl600 || ''}
//           title={podcast.collectionName || 'Unknown Title'}
//           author={podcast.artistName || 'Unknown Author'}
//           description={podcast.summary || 'No summary available'}
//         />
//       </aside>
//       <main className={styles.content}>
//         <h2 className={styles.episodesTitle}>
//           Episodes: {podcast.episodes.length}
//         </h2>
//         <EpisodeTable episodes={podcast.episodes} podcastId={podcastId} />
//       </main>
//     </div>
//   );
// };

// export default PodcastDetail;
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PodcastContext } from '@/context/PodcastContext';
import PodcastCard from '@/components/PodcastCard/PodcastCard';
import EpisodeTable from '@/components/EpisodeTable/EpisodeTable';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import styles from './PodcastDetail.module.css';

const PodcastDetail: React.FC = () => {
  const { podcastId } = useParams<{ podcastId: string }>();
  const { podcastDetails, fetchPodcastDetail } = useContext(PodcastContext);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    if (podcastId) {
      setIsRefreshing(true);
      fetchPodcastDetail(podcastId).finally(() => setIsRefreshing(false));
    }
  }, [podcastId, fetchPodcastDetail]);

  // Show loading if no data is available for this podcast
  if (!podcastId || !podcastDetails[podcastId]) {
    return null;
    // <p>Loading podcast details...</p>;
  }

  const detail = podcastDetails[podcastId];

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <PodcastCard
          image={detail.artworkUrl600}
          title={detail.collectionName || 'Unknown Title'}
          author={detail.artistName || 'Unknown Author'}
          description={detail.summary || 'No summary available'}
        />
      </aside>
      <main className={styles.content}>
        <h2 className={styles.episodesTitle}>
          Episodes: {detail.episodes.length}
        </h2>
        <EpisodeTable episodes={detail.episodes} podcastId={podcastId} />
      </main>
    </div>
  );
};

export default PodcastDetail;

// import React, { useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { usePodcastContext } from '@/context/PodcastContext';
// import EpisodeTable from '@/components/EpisodeTable/EpisodeTable';
// import PodcastCard from '@/components/PodcastCard/PodcastCard';
// import styles from './PodcastDetail.module.css';
// import { usePodcastData } from '../../hooks/usePodcastData';
// import PodcastDetailSkeleton from '../../components/Skeleton/PodcastDetailSkeleton/PodcastDetailSkeleton';
// const PodcastDetail: React.FC = () => {
//   const { podcastId } = useParams<{ podcastId?: string }>();
//   const podcast = usePodcastData(podcastId);

//   // const { podcastId } = useParams<{ podcastId?: string }>();
//   // const { podcastDetails, fetchPodcastDetail, globalLoading } =
//   //   usePodcastContext();

//   // useEffect(() => {
//   //   if (podcastId && !podcastDetails[podcastId]) {
//   //     fetchPodcastDetail(podcastId);
//   //   }
//   // }, [podcastId, fetchPodcastDetail]);

//   if (!podcastId) {
//     return <div>Error: Podcast ID is missing.</div>;
//   }

//   // 🔥 Instead of returning null, show cached data immediately
//   if (!podcast) {
//     return null;
//   }

//   return (
//     <div className={styles.container}>
//       <aside className={styles.sidebar}>
//         <PodcastCard
//   image={podcast.artworkUrl600}
//   title={podcast.collectionName || 'Unknown Title'}
//   author={podcast.artistName || 'Unknown Author'}
//   description={podcast.summary || 'No summary available'}
// />
//       </aside>
//       <main className={styles.content}>
//         <h2 className={styles.episodesTitle}>
//           Episodes: {podcast.episodes.length}
//         </h2>
//         <EpisodeTable episodes={podcast.episodes} podcastId={podcastId} />
//       </main>
//     </div>
//   );
// };

// export default PodcastDetail;

// const PodcastDetail: React.FC = () => {
//   const { podcastId } = useParams<{ podcastId?: string }>();
//   const { podcastDetails } = usePodcastContext();

//   if (!podcastId) {
//     return <div>Error: Podcast ID is missing.</div>;
//   }

//   const podcast = podcastDetails[podcastId];

//   if (!podcast) {
//     return null;
//   }

//   return (
//     <div className={styles.container}>
//       <aside className={styles.sidebar}>
//         <PodcastCard
//           image={podcast.artworkUrl600 || ''}
//           title={podcast.collectionName || 'Unknown Title'}
//           author={podcast.artistName || 'Unknown Author'}
//           description={podcast.summary || 'No summary available'}
//         />
//       </aside>
//       <main className={styles.content}>
//         <h2 className={styles.episodesTitle}>
//           Episodes: {podcast.episodes.length}
//         </h2>
//         <EpisodeTable episodes={podcast.episodes} podcastId={podcastId} />
//       </main>
//     </div>
//   );
// };

// export default PodcastDetail;
// import React, { useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { usePodcastContext } from '@/context/PodcastContext';
// import EpisodeTable from '@/components/EpisodeTable/EpisodeTable';
// import PodcastCard from '@/components/PodcastCard/PodcastCard';
// import styles from './PodcastDetail.module.css';

// const PodcastDetail: React.FC = () => {
//   const { podcastId } = useParams<{ podcastId?: string }>();
//   const { podcastDetails, fetchPodcastDetail } = usePodcastContext();

//   useEffect(() => {
//     if (podcastId && !podcastDetails[podcastId]) {
//       fetchPodcastDetail(podcastId);
//     }
//   }, [podcastId, fetchPodcastDetail]);

//   if (!podcastId) {
//     return <div>Error: Podcast ID is missing.</div>;
//   }

//   const podcast = podcastDetails[podcastId];

//   if (!podcast) {
//     return null;
//   }

//   return (
//     <div className={styles.container}>
//       <aside className={styles.sidebar}>
//         <PodcastCard
//           image={podcast.artworkUrl600 || ''}
//           title={podcast.collectionName || 'Unknown Title'}
//           author={podcast.artistName || 'Unknown Author'}
//           description={podcast.summary || 'No summary available'}
//         />
//       </aside>
//       <main className={styles.content}>
//         <h2 className={styles.episodesTitle}>
//           Episodes: {podcast.episodes.length}
//         </h2>
//         <EpisodeTable episodes={podcast.episodes} podcastId={podcastId} />
//       </main>
//     </div>
//   );
// };

// export default PodcastDetail;
