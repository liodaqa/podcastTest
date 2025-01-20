import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { PodcastProvider } from './context/PodcastContext';
// Mock lazy-loaded components with proper type
jest.mock('./pages/MainView/MainView', () => ({
    __esModule: true,
    default: () => _jsx("div", { "data-testid": 'main-view', children: "MainView Component" }),
}));
jest.mock('./pages/PodcastDetail/PodcastDetail', () => ({
    __esModule: true,
    default: () => (_jsx("div", { "data-testid": 'podcast-detail', children: "PodcastDetail Component" })),
}));
jest.mock('./pages/PodcastEpisode/PodcastEpisode', () => ({
    __esModule: true,
    default: () => (_jsx("div", { "data-testid": 'episode-detail', children: "EpisodeDetail Component" })),
}));
// Mock the Spinner
jest.mock('./components/Spinner/Spinner', () => ({
    __esModule: true,
    default: () => (_jsx("div", { className: 'spinner', "data-testid": 'spinner', children: "Loading..." })),
}));
// Mock the Header
jest.mock('./components/Header/Header', () => ({
    __esModule: true,
    default: () => (_jsx("header", { "data-testid": 'header', children: _jsx("a", { href: '/', className: 'title', children: "Podcaster" }) })),
}));
describe('App Component', () => {
    const renderApp = () => {
        render(_jsx(PodcastProvider, { children: _jsx(App, {}) }));
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('shows the Spinner while a lazy-loaded component is loading', async () => {
        renderApp();
        // Verify the Spinner is rendered during the loading phase
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
        // Wait for the MainView component to load
        await waitFor(() => expect(screen.getByTestId('main-view')).toBeInTheDocument());
        // Verify the Spinner is removed after loading
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });
    it('renders the MainView component at the root route ("/")', async () => {
        window.history.pushState({}, 'Root Route', '/');
        renderApp();
        expect(await screen.findByTestId('main-view')).toBeInTheDocument();
    });
    it('renders the PodcastDetail component at the "/podcast/:podcastId" route', async () => {
        window.history.pushState({}, 'Podcast Detail Route', '/podcast/1234');
        renderApp();
        expect(await screen.findByTestId('podcast-detail')).toBeInTheDocument();
    });
    it('renders the EpisodeDetail component at the "/podcast/:podcastId/episode/:episodeId" route', async () => {
        window.history.pushState({}, 'Episode Detail Route', '/podcast/1234/episode/5678');
        renderApp();
        expect(await screen.findByTestId('episode-detail')).toBeInTheDocument();
    });
});
