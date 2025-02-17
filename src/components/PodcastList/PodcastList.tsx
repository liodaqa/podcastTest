// import React from 'react';
// import { Podcast } from '@/types/PodcastTypes';
// import PodcastItem from '../PodcastItem/PodcastItem';
// import styles from './PodcastList.module.css';

// interface PodcastListProps {
//   podcasts: Podcast[];
// }

// const PodcastList: React.FC<PodcastListProps> = React.memo(({ podcasts }) => {
//   if (!podcasts || podcasts.length === 0) {
//     return null;
//   }

//   return (
//     <div className={styles.podcastListWrapper}>
//       <ul className={styles.podcastList}>
//         {podcasts.map((podcast) => (
//           <PodcastItem key={podcast.id} podcast={podcast} />
//         ))}
//       </ul>
//     </div>
//   );
// });

// export default PodcastList;
import React from 'react';
import { Podcast } from '@/types/PodcastTypes';
import PodcastItem from '../PodcastItem/PodcastItem';
import styles from './PodcastList.module.css';
import PodcastItemSkeleton from '../Skeleton/PodcastItemSkeleton/PodcastItemSkeleton';

interface PodcastListProps {
  podcasts: Podcast[];
  loading: boolean;
}

const PodcastList: React.FC<PodcastListProps> = React.memo(
  ({ podcasts, loading }) => {
    return (
      <div className={styles.podcastListWrapper}>
        <ul className={styles.podcastList}>
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <PodcastItemSkeleton key={index} />
              ))
            : podcasts.map((podcast) => (
                <PodcastItem key={podcast.id} podcast={podcast} />
              ))}
        </ul>
      </div>
    );
  }
);

export default PodcastList;
