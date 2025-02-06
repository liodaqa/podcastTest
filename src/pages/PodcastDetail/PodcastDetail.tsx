// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { usePodcastContext } from '@/context/PodcastContext';
// import EpisodeTable from '@/components/EpisodeTable/EpisodeTable';
// import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
// import Skeleton from '@/components/Skeleton/PodcastDetailSkeleton/PodcastDetailSkeleton';
// import styles from './PodcastDetail.module.css';
// import PodcastCard from '@/components/PodcastCard/PodcastCard';
// import { getCachedData } from '@/api/utils/cacheUtil';
// import { DetailedPodcast } from '@/types/PodcastTypes';

// const CACHE_DURATION = 86400000; // 24 hours

// const PodcastDetail: React.FC = () => {
//   const { podcastId } = useParams<{ podcastId: string }>();
//   const { podcastDetail, fetchPodcastDetail, error } = usePodcastContext();
//   const [cachedDetail, setCachedDetail] = useState<DetailedPodcast | null>(
//     null
//   );

//   useEffect(() => {
//     if (podcastId) {
//       // ✅ Step 1: Show cached data immediately
//       const cachedData = getCachedData<DetailedPodcast>(
//         `podcast-${podcastId}`,
//         CACHE_DURATION
//       );
//       if (cachedData) {
//         setCachedDetail(cachedData);
//       }

//       // ✅ Step 2: Fetch fresh data only if necessary (fallback)
//       if (!cachedData) {
//         fetchPodcastDetail(podcastId);
//       }
//     }
//   }, [podcastId, fetchPodcastDetail]);

//   // ✅ Use cached data first, fallback to fetched data
//   const dataToShow = podcastDetail || cachedDetail;

//   if (error) return <ErrorMessage message={error} />;
//   if (!dataToShow) return <Skeleton />; // ✅ Show Skeleton ONLY if no cached data exists

//   return (
//     <div className={styles.container}>
//       <aside className={styles.sidebar}>
//         <PodcastCard
//           image={dataToShow.artworkUrl600 || ''}
//           title={dataToShow.collectionName || 'Unknown Title'}
//           author={dataToShow.artistName || 'Unknown Author'}
//           description={dataToShow.summary || 'No summary available'}
//         />
//       </aside>
//       <main className={styles.content}>
//         <h2 className={styles.episodesTitle}>
//           Episodes: {dataToShow.episodes.length}
//         </h2>
//         <EpisodeTable episodes={dataToShow.episodes} podcastId={podcastId!} />
//       </main>
//     </div>
//   );
// };

// export default PodcastDetail;
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePodcastContext } from '@/context/PodcastContext';
import EpisodeTable from '@/components/EpisodeTable/EpisodeTable';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Skeleton from '@/components/Skeleton/PodcastDetailSkeleton/PodcastDetailSkeleton';
import styles from './PodcastDetail.module.css';
import PodcastCard from '@/components/PodcastCard/PodcastCard';
import { getCachedData } from '@/api/utils/cacheUtil';
import { DetailedPodcast } from '@/types/PodcastTypes';

const CACHE_DURATION = 86400000; // 24 hours

const PodcastDetail: React.FC = () => {
  const { podcastId } = useParams<{ podcastId: string }>();
  const { podcastDetail, fetchPodcastDetail, error } = usePodcastContext();
  const [cachedDetail, setCachedDetail] = useState<DetailedPodcast | null>(
    null
  );

  useEffect(() => {
    if (!podcastId) return;

    // ✅ Step 1: Use cached data if available (NO API CALL)
    const cachedData = getCachedData<DetailedPodcast>(
      `podcast-${podcastId}`,
      CACHE_DURATION
    );
    if (cachedData) {
      console.log(`[Cache] Loaded podcast details for ID ${podcastId} ✅`);
      setCachedDetail(cachedData);
      return; // ⛔ Avoid fetching again
    }

    // ✅ Step 2: Fetch only if cache is empty
    console.log(`[API] Fetching podcast details for ID ${podcastId}...`);
    fetchPodcastDetail(podcastId);
  }, [podcastId, fetchPodcastDetail]);

  const dataToShow = podcastDetail || cachedDetail;

  if (error) return <ErrorMessage message={error} />;
  if (!dataToShow) return <Skeleton />; // Show Skeleton **only if no cache**

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <PodcastCard
          image={dataToShow.artworkUrl600 || ''}
          title={dataToShow.collectionName || 'Unknown Title'}
          author={dataToShow.artistName || 'Unknown Author'}
          description={dataToShow.summary || 'No summary available'}
        />
      </aside>
      <main className={styles.content}>
        <h2 className={styles.episodesTitle}>
          Episodes: {dataToShow.episodes.length}
        </h2>
        <EpisodeTable episodes={dataToShow.episodes} podcastId={podcastId!} />
      </main>
    </div>
  );
};

export default PodcastDetail;
