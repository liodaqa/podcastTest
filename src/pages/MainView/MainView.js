import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { usePodcastContext } from '../../context/PodcastContext';
import useFilteredPodcasts from '../../hooks/useFilteredPodcasts';
import SearchBar from '../../components/SearchInput/SearchInput';
import PodcastList from '../../components/PodcastList/PodcastList';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import styles from './MainView.module.css';
const MainView = () => {
  const { podcasts, error } = usePodcastContext();
  const [searchTerm, setSearchTerm] = useState('');
  const filteredPodcasts = useFilteredPodcasts(podcasts, searchTerm);
  const isFetching = !podcasts || podcasts.length === 0;
  if (error) {
    return _jsx(ErrorMessage, { message: error });
  }
  if (isFetching) {
    return null;
  }
  return _jsxs('div', {
    className: styles.container,
    children: [
      _jsxs('div', {
        className: styles.searchContainer,
        children: [
          _jsx('span', {
            className: styles.count,
            children: filteredPodcasts.length,
          }),
          _jsx(SearchBar, { onSearch: setSearchTerm }),
        ],
      }),
      filteredPodcasts.length > 0 || searchTerm === ''
        ? _jsx(PodcastList, { podcasts: filteredPodcasts })
        : _jsxs('div', {
            className: styles.noResults,
            children: [
              _jsx('img', {
                src: '/noResults.png',
                alt: 'No results found',
                className: styles.noResultsImage,
              }),
              _jsxs('p', {
                className: styles.noResultsText,
                children: [
                  'No podcasts found for (',
                  _jsx('strong', { children: searchTerm }),
                  ')',
                ],
              }),
            ],
          }),
    ],
  });
};
export default MainView;
