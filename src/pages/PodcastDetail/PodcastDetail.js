import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useEffect, lazy } from 'react';
import { useParams } from 'react-router-dom';
import { usePodcastContext } from '../../context/PodcastContext';
import EpisodeTable from '../../components/EpisodeTable/EpisodeTable';
const PodcastCard = lazy(
  () => import('../../components/PodcastCard/PodcastCard')
);
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import styles from './PodcastDetail.module.css';
const PodcastDetail = () => {
  const { podcastId } = useParams();
  const { podcastDetail, fetchPodcastDetail, error } = usePodcastContext();
  useEffect(() => {
    if (podcastId) {
      fetchPodcastDetail(podcastId);
    }
  }, [podcastId, fetchPodcastDetail]);
  const isDataValid = podcastDetail?.id === podcastId;
  if (error) {
    return _jsx(ErrorMessage, { message: error });
  }
  if (!isDataValid) {
    return null;
  }
  const episodes = podcastDetail?.episodes || [];
  return _jsxs('div', {
    className: styles.container,
    children: [
      _jsx('aside', {
        className: styles.sidebar,
        children: _jsx(PodcastCard, {
          image: podcastDetail?.artworkUrl600 || '',
          title: podcastDetail?.collectionName || 'Unknown Title',
          author: podcastDetail?.artistName || 'Unknown Author',
          description: podcastDetail?.summary || 'No summary available',
        }),
      }),
      _jsxs('main', {
        className: styles.content,
        children: [
          _jsx('div', {
            className: styles.episodesTitleWrapper,
            children: _jsxs('h2', {
              className: styles.episodesTitle,
              children: ['Episodes: ', episodes.length],
            }),
          }),
          _jsx('div', {
            className: styles.episodeTableWrapper,
            children: _jsx(EpisodeTable, {
              episodes: episodes,
              podcastId: podcastId,
            }),
          }),
        ],
      }),
    ],
  });
};
export default PodcastDetail;
