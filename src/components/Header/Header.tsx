import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import styles from './Header.module.css';
import { PodcastContext } from '../../context/PodcastContext';

const Header: React.FC = () => {
  // const { globalLoading } = usePodcastContext();
  const { podcastsLoading } = useContext(PodcastContext);

  return (
    <header className={styles.headerWrapper}>
      <div className={styles.header}>
        <Link to='/' className={styles.title}>
          Podcaster
        </Link>
        {podcastsLoading && <Spinner />}
      </div>
    </header>
  );
};

export default Header;
