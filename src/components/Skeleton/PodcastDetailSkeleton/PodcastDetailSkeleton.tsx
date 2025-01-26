// import React from 'react';
// import styles from './PodcastSkeleton.module.css';

// const PodcastSkeleton: React.FC = () => {
//   return (
//     <li className={styles.podcastSkeleton}>
//       <div className={styles.imageWrapper}></div>
//       <div className={styles.details}>
//         <div className={styles.title}></div>
//         <div className={styles.author}></div>
//       </div>
//     </li>
//   );
// };

// export default PodcastSkeleton;
import React from 'react';
import styles from './PodcastDetailSkeleton.module.css';

const PodcastDetailSkeleton: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Sidebar Skeleton */}
      <aside className={styles.sidebar}>
        <div className={styles.imageSkeleton}></div>
        <div className={styles.textSkeleton} style={{ width: '80%' }}></div>
        <div className={styles.textSkeleton} style={{ width: '60%' }}></div>
        <div className={styles.divider}></div>
        <div className={styles.textSkeleton} style={{ width: '90%' }}></div>
        <div className={styles.textSkeleton} style={{ width: '95%' }}></div>
        <div className={styles.textSkeleton} style={{ width: '70%' }}></div>
      </aside>

      {/* Content Skeleton */}
      <main className={styles.content}>
        {/* Episodes Title Skeleton */}
        <div className={styles.episodesTitleSkeleton}></div>

        {/* Table Skeleton */}
        <div className={styles.tableSkeleton}>
          {/* Table Header Skeleton */}
          <div className={styles.tableHeaderSkeleton}>
            <div className={styles.cellSkeleton} style={{ width: '40%' }}></div>
            <div className={styles.cellSkeleton} style={{ width: '20%' }}></div>
            <div className={styles.cellSkeleton} style={{ width: '15%' }}></div>
          </div>
          {/* Table Rows Skeleton */}
          {Array.from({ length: 10 }).map((_, index) => (
            <div className={styles.tableRowSkeleton} key={index}>
              <div
                className={styles.cellSkeleton}
                style={{ width: '40%' }}
              ></div>
              <div
                className={styles.cellSkeleton}
                style={{ width: '20%' }}
              ></div>
              <div
                className={styles.cellSkeleton}
                style={{ width: '15%' }}
              ></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default PodcastDetailSkeleton;

// const PodcastDetailSkeleton: React.FC = () => {
//   return (
//     <div className={styles.container}>
//       {/* Sidebar Skeleton */}
//       <aside className={styles.sidebar}>
//         <div className={styles.imageSkeleton}></div>
//         <div className={styles.textSkeleton} style={{ width: '80%' }}></div>
//         <div className={styles.textSkeleton} style={{ width: '60%' }}></div>
//         <div className={styles.divider}></div>
//         <div className={styles.textSkeleton} style={{ width: '90%' }}></div>
//         <div className={styles.textSkeleton} style={{ width: '95%' }}></div>
//         <div className={styles.textSkeleton} style={{ width: '70%' }}></div>
//       </aside>

//       {/* Content Skeleton */}
//       <main className={styles.content}>
//         <div className={styles.episodesTitleSkeleton}></div>
//         <div className={styles.tableSkeleton}>
//           <div className={styles.tableRowSkeleton}>
//             <div className={styles.cellSkeleton} style={{ width: '40%' }}></div>
//             <div className={styles.cellSkeleton} style={{ width: '20%' }}></div>
//             <div className={styles.cellSkeleton} style={{ width: '15%' }}></div>
//           </div>
//           {Array.from({ length: 10 }).map((_, index) => (
//             <div className={styles.tableRowSkeleton} key={index}>
//               <div
//                 className={styles.cellSkeleton}
//                 style={{ width: '40%' }}
//               ></div>
//               <div
//                 className={styles.cellSkeleton}
//                 style={{ width: '20%' }}
//               ></div>
//               <div
//                 className={styles.cellSkeleton}
//                 style={{ width: '15%' }}
//               ></div>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default PodcastDetailSkeleton;
