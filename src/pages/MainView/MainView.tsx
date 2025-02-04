// import React, { useState } from 'react';
// import { usePodcastContext } from '../../context/PodcastContext';
// import useFilteredPodcasts from '../../hooks/useFilteredPodcasts';
// import SearchBar from '../../components/SearchInput/SearchInput';
// import PodcastList from '../../components/PodcastList/PodcastList';
// import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
// import styles from './MainView.module.css';

// const MainView: React.FC = () => {
//   const { podcasts, error } = usePodcastContext();
//   const [searchTerm, setSearchTerm] = useState('');

//   const filteredPodcasts = useFilteredPodcasts(podcasts, searchTerm);

//   const isFetching = !podcasts || podcasts.length === 0;

//   if (error) {
//     return <ErrorMessage message={error} />;
//   }

//   if (isFetching) {
//     return null;
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.searchContainer}>
//         <span className={styles.count}>{filteredPodcasts.length}</span>
//         <SearchBar onSearch={setSearchTerm} />
//       </div>

//     {filteredPodcasts.length > 0 || searchTerm === '' ? (
//       <PodcastList podcasts={filteredPodcasts} />
//     ) : (
//       <div className={styles.noResults}>
//         <img
//           src='/noResults.png'
//           alt='No results found'
//           className={styles.noResultsImage}
//         />
//         <p className={styles.noResultsText}>
//           No podcasts found for (<strong>{searchTerm}</strong>)
//         </p>
//       </div>
//     )}
//   </div>
// );
// };

// export default MainView;
import React, { useState, useMemo } from 'react';
import styles from './MainView.module.css';
import { usePodcastContext } from '../../context/PodcastContext';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import SearchBar from '../../components/SearchInput/SearchInput';
import PodcastList from '../../components/PodcastList/PodcastList';
import useFilteredPodcasts from '../../hooks/useFilteredPodcasts';

const MainView: React.FC = () => {
  const { podcasts, error, globalLoading } = usePodcastContext();
  const [searchTerm, setSearchTerm] = useState('');

  // UseMemo to optimize search filtering performance
  const filteredPodcasts = useFilteredPodcasts(podcasts, searchTerm);

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className={styles.container}>
      {/* Search Bar & Count Display */}
      <div className={styles.searchContainer}>
        <span className={styles.count}>{filteredPodcasts.length}</span>
        <SearchBar onSearch={setSearchTerm} />
      </div>

      {/* Podcast List with loading state */}
      <PodcastList
        podcasts={globalLoading ? [] : filteredPodcasts}
        isLoading={globalLoading}
      />

      {/* No Results Message */}
      {!globalLoading && filteredPodcasts.length === 0 && searchTerm !== '' && (
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

export default React.memo(MainView); // Prevent unnecessary re-renders

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

//   // const isFetching = globalLoading || !podcasts || podcasts.length === 0;
//   const isFetching = globalLoading;
//   if (error) {
//     return <ErrorMessage message={error} />;
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.searchContainer}>
//         <span className={styles.count}>{filteredPodcasts.length}</span>
//         <SearchBar onSearch={setSearchTerm} />
//       </div>

//       <PodcastList
//         podcasts={isFetching ? [] : filteredPodcasts}
//         isLoading={isFetching}
//         // podcasts={isFetching ? [] : filteredPodcasts}
//         // isLoading={isFetching}
//       />

//       {!isFetching && filteredPodcasts.length === 0 && searchTerm !== '' && (
//         <div className={styles.noResults}>
//           <img
//             src='/noResults.png'
//             alt='No results found'
//             className={styles.noResultsImage}
//           />
//           <p className={styles.noResultsText}>
//             No podcasts found for (<strong>{searchTerm}</strong>)
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MainView;
