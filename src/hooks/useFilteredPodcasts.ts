import { useMemo } from 'react';
import { Podcast } from '../types/PodcastTypes';

/**
 * Filters the provided podcasts based on the search term.
 *
 * @param podcasts - Array of podcasts to filter.
 * @param searchTerm - The term to filter podcasts by (case-insensitive).
 * @returns The filtered list of podcasts.
 */

const useFilteredPodcasts = (podcasts: Podcast[], searchTerm: string) => {
  return useMemo(() => {
    if (!searchTerm) {
      return podcasts;
    }

    const lowerCaseTerm = searchTerm.toLowerCase();

    return podcasts.filter(
      (podcast) =>
        podcast.name.toLowerCase().includes(lowerCaseTerm) ||
        podcast.artist.toLowerCase().includes(lowerCaseTerm)
    );
  }, [podcasts, searchTerm]);
};

export default useFilteredPodcasts;
// import { useMemo } from 'react';
// import { Podcast } from '../types/PodcastTypes';

// /**
//  * Filters the provided podcasts based on the search term.
//  *
//  * @param podcasts - Array of podcasts to filter.
//  * @param searchTerm - The term to filter podcasts by (case-insensitive).
//  * @returns The filtered list of podcasts.
//  */
// const useFilteredPodcasts = (podcasts: Podcast[], searchTerm: string) => {
//   return useMemo(() => {
//     if (!podcasts || podcasts.length === 0) {
//       return []; // Return an empty array if podcasts is null or empty
//     }

//     if (!searchTerm) {
//       return podcasts; // Return all podcasts if no search term is provided
//     }

//     const lowerCaseTerm = searchTerm.toLowerCase();

//     return podcasts.filter(
//       (podcast) =>
//         podcast.name.toLowerCase().includes(lowerCaseTerm) ||
//         podcast.artist.toLowerCase().includes(lowerCaseTerm)
//     );
//   }, [podcasts, searchTerm]);
// };

// export default useFilteredPodcasts;
