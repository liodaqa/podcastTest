import { Podcast } from '@/types/PodcastTypes';
import PodcastItem from '../PodcastItem/PodcastItem';
import PodcastListSkeleton from '../Skeleton/PodcastItemSkeleton/PodcastItemSkeleton';
import styles from './PodcastList.module.css';
import useLazyLoad from '../../hooks/LazyLoad/useLazyLoad';
import { usePodcastContext } from '../../context/PodcastContext';

interface PodcastListProps {
  podcasts: Podcast[];
}

const PodcastList: React.FC<PodcastListProps> = ({ podcasts }) => {
  const { globalLoading } = usePodcastContext();

  const { visibleItems: visiblePodcasts, listRef } = useLazyLoad<Podcast>(
    podcasts,
    16,
    20
  );

  return (
    <div
      ref={listRef}
      className={styles.podcastListWrapper}
      onScroll={(e) => e.preventDefault()}
    >
      <ul className={styles.podcastList}>
        {globalLoading
          ? Array.from({ length: 12 }).map((_, index) => (
              <PodcastListSkeleton key={`skeleton-${index}`} />
            ))
          : Array.isArray(visiblePodcasts)
            ? visiblePodcasts.map((podcast) => (
                <PodcastItem key={podcast.id} podcast={podcast} />
              ))
            : null}
      </ul>
    </div>
  );
};

export default PodcastList;
