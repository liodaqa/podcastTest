// import React from 'react';
// import styles from './PodcastImage.module.css';

// interface PodcastImageProps {
//   src: string;
//   alt: string;
//   className?: string;
// }

// const PodcastImage: React.FC<PodcastImageProps> = ({ src, alt, className }) => {
//   return (
//     <img
//       src={src}
//       alt={alt}
//       className={`${styles.podcastImage} ${className || ''}`.trim()}
//     />
//   );
// };

// export default PodcastImage;
import React, { useState, useEffect } from 'react';
import styles from './PodcastImage.module.css';

interface PodcastImageProps {
  src: string;
  alt: string;
  className?: string;
}

const placeholder =
  'https://digitalreach.asia/wp-content/uploads/2021/11/placeholder-image.png';

const PodcastImage: React.FC<PodcastImageProps> = ({ src, alt, className }) => {
  const [currentSrc, setCurrentSrc] = useState(placeholder);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
    };
    // Optionally, you can handle errors here:
    img.onerror = () => {
      // Keep the placeholder if loading fails
      console.warn('Error loading image, using placeholder instead');
    };
  }, [src]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={`${styles.podcastImage} ${className || ''}`.trim()}
    />
  );
};

export default PodcastImage;

// import React from 'react';
// import styles from './PodcastImage.module.css';

// interface PodcastImageProps {
//   src?: string; // Image source might be undefined initially
//   alt: string;
//   className?: string;
// }

// const PLACEHOLDER_IMAGE =
//   'https://digitalreach.asia/wp-content/uploads/2021/11/placeholder-image.png';

// const PodcastImage: React.FC<PodcastImageProps> = ({ src, alt, className }) => {
//   return (
//     <img
//       src={src || PLACEHOLDER_IMAGE} // If `src` is falsy, use the placeholder
//       alt={alt}
//       className={`${styles.podcastImage} ${className || ''}`}
//       loading='lazy'
//     />
//   );
// };

// export default PodcastImage;
