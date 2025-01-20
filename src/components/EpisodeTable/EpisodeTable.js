import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Link } from 'react-router-dom';
import { formatDuration } from '../../api/utils/formatUtils';
import styles from './EpisodeTable.module.css';
const EpisodeTable = ({ episodes, podcastId }) => {
  return _jsxs('table', {
    className: styles.episodesTable,
    children: [
      _jsx('thead', {
        children: _jsxs('tr', {
          children: [
            _jsx('th', { children: 'Title' }),
            _jsx('th', { children: 'Date' }),
            _jsx('th', { children: 'Duration' }),
          ],
        }),
      }),
      _jsx('tbody', {
        children: episodes.map((episode) =>
          _jsxs(
            'tr',
            {
              children: [
                _jsx('td', {
                  children: _jsx(Link, {
                    to: `/podcast/${podcastId}/episode/${episode.trackId}`,
                    className: styles.episodeLink,
                    children: episode.trackName,
                  }),
                }),
                _jsx('td', {
                  children: new Date(episode.releaseDate).toLocaleDateString(),
                }),
                _jsx('td', {
                  children: formatDuration(episode.trackTimeMillis),
                }),
              ],
            },
            episode.trackId
          )
        ),
      }),
    ],
  });
};
export default EpisodeTable;
