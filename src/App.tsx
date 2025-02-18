import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Spinner from './components/Spinner/Spinner';
import { PodcastProvider } from './context/PodcastContext';
const MainView = lazy(() => import('./pages/MainView/MainView'));
const PodcastDetail = lazy(() => import('./pages/PodcastDetail/PodcastDetail'));
const EpisodeDetail = lazy(
  () => import('./pages/PodcastEpisode/PodcastEpisode')
);

const App: React.FC = () => {
  return (
    <PodcastProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Header />
        <h1>HAMZA</h1>
        <main className='mainContainer'>
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path='/' element={<MainView />} />
              <Route path='/podcast/:podcastId' element={<PodcastDetail />} />
              <Route
                path='/podcast/:podcastId/episode/:episodeId'
                element={<EpisodeDetail />}
              />
            </Routes>
          </Suspense>
        </main>
      </Router>
    </PodcastProvider>
  );
};
export default App;
