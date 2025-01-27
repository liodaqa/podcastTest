// import { Podcast } from '@/types/PodcastTypes';
// import PodcastItem from '../PodcastItem/PodcastItem';
// import PodcastListSkeleton from '../Skeleton/PodcastItemSkeleton/PodcastItemSkeleton';
// import styles from './PodcastList.module.css';
// import useLazyLoad from '../../hooks/LazyLoad/useLazyLoad';
// import { usePodcastContext } from '../../context/PodcastContext';

// interface PodcastListProps {
//   podcasts: Podcast[];
//   isLoading: boolean;
// }

// const PodcastList: React.FC<PodcastListProps> = ({ podcasts, isLoading }) => {
//   const { visibleItems: visiblePodcasts, listRef } = useLazyLoad<Podcast>(
//     podcasts,
//     16,
//     20
//   );
//   console.log(isLoading, 'list');
//   return (
//     <div
//       ref={listRef}
//       className={styles.podcastListWrapper}
//       onScroll={(e) => e.preventDefault()}
//     >
//       <ul className={styles.podcastList}>
//         {/* {isLoading
//           ? Array.from({ length: 12 }).map((_, index) => (
//               <PodcastListSkeleton key={`skeleton-${index}`} />
//             ))
//           : Array.isArray(visiblePodcasts)
//             ? visiblePodcasts.map((podcast) => (
//                 <PodcastItem key={podcast.id} podcast={podcast} />
//               ))
//             : null} */}
//         {isLoading
//           ? Array.from({ length: 12 }).map((_, index) => (
//               <PodcastListSkeleton key={`skeleton-${index}`} />
//             ))
//           : visiblePodcasts.map((podcast) => (
//               <PodcastItem key={podcast.id} podcast={podcast} />
//             ))}
//       </ul>
//     </div>
//   );
// };

// export default PodcastList;
import React from 'react';
import { Podcast } from '@/types/PodcastTypes';
import PodcastItem from '../PodcastItem/PodcastItem';
import PodcastListSkeleton from '../Skeleton/PodcastItemSkeleton/PodcastItemSkeleton';
import styles from './PodcastList.module.css';
import useLazyLoad from '../../hooks/LazyLoad/useLazyLoad';

interface PodcastListProps {
  podcasts: Podcast[];
  isLoading: boolean;
}

const PodcastList: React.FC<PodcastListProps> = ({ podcasts, isLoading }) => {
  const { visibleItems: visiblePodcasts, listRef } = useLazyLoad<Podcast>(
    podcasts,
    16,
    20
  );

  console.log('PodcastList -> isLoading:', isLoading);
  console.log('PodcastList -> podcasts:', podcasts);
  console.log('PodcastList -> visiblePodcasts:', visiblePodcasts);

  return (
    <div
      ref={listRef}
      className={styles.podcastListWrapper}
      onScroll={(e) => e.preventDefault()}
    >
      <ul className={styles.podcastList}>
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => (
              <PodcastListSkeleton key={`skeleton-${index}`} />
            ))
          : visiblePodcasts.map((podcast) => (
              <PodcastItem key={podcast.id} podcast={podcast} />
            ))}
      </ul>
    </div>
  );
};

export default PodcastList;
