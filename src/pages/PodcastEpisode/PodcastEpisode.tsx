import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PodcastCard from '@/components/PodcastCard/PodcastCard';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import styles from './PodcastEpisode.module.css';
import { Episode } from '@/types/PodcastTypes';
import { PodcastContext } from '../../context/PodcastContext';
const PodcastEpisode: React.FC = () => {
  const { podcastId, episodeId } = useParams<{
    podcastId: string;
    episodeId: string;
  }>();
  const { podcastDetails, fetchPodcastDetail } = useContext(PodcastContext);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const cachedData = podcastId ? podcastDetails[podcastId] : null;

  useEffect(() => {
    if (podcastId) {
      setIsRefreshing(true);
      fetchPodcastDetail(podcastId).finally(() => setIsRefreshing(false));
    }
  }, [podcastId, fetchPodcastDetail]);

  if (!cachedData) return <p>Loading episode details...</p>;

  // Here, cachedData is a DetailedPodcast (which includes episodes)
  const { episodes } = cachedData;
  const episode = episodes.find((ep) => String(ep.trackId) === episodeId);

  if (!episode) return <p>Episode not found.</p>;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <PodcastCard
          image={cachedData.artworkUrl600}
          title={cachedData.collectionName}
          author={cachedData.artistName}
          description={cachedData.summary}
        />
      </aside>
      <main className={styles.mainContent}>
        <h2 className={styles.episodeTitle}>{episode.trackName}</h2>
        <p
          className={styles.episodeDescription}
          dangerouslySetInnerHTML={{
            __html: episode.description || 'No description available.',
          }}
        />
        <div className={styles.audioPlayerContainer}>
          <audio
            controls
            className={styles.audioPlayer}
            data-testid='audio-player'
          >
            <source
              src={episode.episodeUrl}
              type='audio/mpeg'
              data-testid='audio-source'
            />
            Your browser does not support the audio element.
          </audio>
        </div>
      </main>
    </div>
  );
};

export default PodcastEpisode;
