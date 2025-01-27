import React, { useState } from 'react';
import styles from './MainView.module.css';
import useFilteredPodcasts from '../../hooks/useFilteredPodcasts';
import { usePodcastContext } from '../../context/PodcastContext';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import SearchBar from '../../components/SearchInput/SearchInput';
import PodcastList from '../../components/PodcastList/PodcastList';

const MainView: React.FC = () => {
  const { podcasts, error, globalLoading } = usePodcastContext();
  const [searchTerm, setSearchTerm] = useState('');
  const filteredPodcasts = useFilteredPodcasts(podcasts, searchTerm);

  const isFetching = globalLoading || !podcasts || podcasts.length === 0;

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <span className={styles.count}>{filteredPodcasts.length}</span>
        <SearchBar onSearch={setSearchTerm} />
      </div>

      {filteredPodcasts.length > 0 || searchTerm === '' ? (
        <PodcastList
          podcasts={isFetching ? [] : filteredPodcasts}
          isLoading={isFetching}
        />
      ) : (
        <div className={styles.noResults}>
          <img
            src='/noResults.png'
            alt='No results found'
            className={styles.noResultsImage}
          />
          <p className={styles.noResultsText}>
            No podcasts found for (<strong>{searchTerm}</strong>)
          </p>
        </div>
      )}
    </div>
  );
};

export default MainView;
// import React, { useState } from 'react';
// import styles from './MainView.module.css';
// import useFilteredPodcasts from '../../hooks/useFilteredPodcasts';
// import { usePodcastContext } from '../../context/PodcastContext';
// import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
// import SearchBar from '../../components/SearchInput/SearchInput';
// import PodcastList from '../../components/PodcastList/PodcastList';

// const MainView: React.FC = () => {
//   const { podcasts, error, globalLoading } = usePodcastContext();
//   const [searchTerm, setSearchTerm] = useState('');
//   const filteredPodcasts = useFilteredPodcasts(podcasts, searchTerm);

//   const isFetching = !podcasts || podcasts.length === 0;

//   if (error) {
//     return <ErrorMessage message={error} />;
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.searchContainer}>
//         <span className={styles.count}>
//           {globalLoading ? 0 : filteredPodcasts.length}
//         </span>
//         <SearchBar onSearch={setSearchTerm} />
//       </div>

//       <PodcastList
//         podcasts={filteredPodcasts}
//         isLoading={globalLoading || podcasts.length === 0}
//       />
//     </div>
//   );
// };

// export default MainView;
