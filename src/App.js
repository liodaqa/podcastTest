import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PodcastProvider } from './context/PodcastContext';
import Header from './components/Header/Header';
import Spinner from './components/Spinner/Spinner';
const MainView = lazy(() => import('./pages/MainView/MainView'));
const PodcastDetail = lazy(() => import('./pages/PodcastDetail/PodcastDetail'));
const EpisodeDetail = lazy(() => import('./pages/PodcastEpisode/PodcastEpisode'));
const App = () => {
    return (_jsx(PodcastProvider, { children: _jsxs(Router, { children: [_jsx(Header, {}), _jsxs("main", { className: 'mainContainer', children: [_jsx("h1", { children: "new Test" }), _jsx(Suspense, { fallback: _jsx(Spinner, {}), children: _jsxs(Routes, { children: [_jsx(Route, { path: '/', element: _jsx(MainView, {}) }), _jsx(Route, { path: '/podcast/:podcastId', element: _jsx(PodcastDetail, {}) }), _jsx(Route, { path: '/podcast/:podcastId/episode/:episodeId', element: _jsx(EpisodeDetail, {}) })] }) })] })] }) }));
};
export default App;
