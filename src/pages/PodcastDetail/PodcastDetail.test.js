import { jsx as _jsx } from "react/jsx-runtime";
import { Suspense } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PodcastDetail from './PodcastDetail';
import { usePodcastContext } from '../../context/PodcastContext';
import { mockCachedPodcastDetails } from '../../api/services/__mocks__/podcastMocks';
jest.mock('../../context/PodcastContext', () => ({
    usePodcastContext: jest.fn(),
}));
jest.mock('../../components/EpisodeTable/EpisodeTable', () => jest.fn(() => _jsx("div", { "data-testid": 'episode-table' })));
jest.mock('../../components/PodcastCard/PodcastCard', () => jest.fn(() => _jsx("div", { "data-testid": 'podcast-card' })));
jest.mock('../../components/ErrorMessage/ErrorMessage', () => jest.fn(({ message }) => _jsx("div", { "data-testid": 'error-message', children: message })));
describe('PodcastDetail Component', () => {
    const mockFetchPodcastDetail = jest.fn();
    const podcastId = mockCachedPodcastDetails.id;
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('renders an error message when there is an error', () => {
        usePodcastContext.mockReturnValue({
            podcastDetail: null,
            fetchPodcastDetail: mockFetchPodcastDetail,
            error: 'An error occurred',
        });
        render(_jsx(MemoryRouter, { initialEntries: [`/podcast/${podcastId}`], children: _jsx(Routes, { children: _jsx(Route, { path: '/podcast/:podcastId', element: _jsx(PodcastDetail, {}) }) }) }));
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
        expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });
    it('renders nothing if data is not valid', () => {
        usePodcastContext.mockReturnValue({
            podcastDetail: { ...mockCachedPodcastDetails, id: 'different-id' },
            fetchPodcastDetail: mockFetchPodcastDetail,
            error: null,
        });
        const { container } = render(_jsx(MemoryRouter, { initialEntries: [`/podcast/${podcastId}`], children: _jsx(Routes, { children: _jsx(Route, { path: '/podcast/:podcastId', element: _jsx(PodcastDetail, {}) }) }) }));
        expect(container.firstChild).toBeNull();
    });
    it('renders podcast details and episodes when valid data is available', async () => {
        usePodcastContext.mockReturnValue({
            podcastDetail: mockCachedPodcastDetails,
            fetchPodcastDetail: mockFetchPodcastDetail,
            error: null,
        });
        render(_jsx(Suspense, { fallback: _jsx("div", { children: "Loading..." }), children: _jsx(MemoryRouter, { initialEntries: [`/podcast/${podcastId}`], children: _jsx(Routes, { children: _jsx(Route, { path: '/podcast/:podcastId', element: _jsx(PodcastDetail, {}) }) }) }) }));
        // Verify PodcastCard
        expect(await screen.findByTestId('podcast-card')).toBeInTheDocument();
        // Verify EpisodeTable
        expect(screen.getByTestId('episode-table')).toBeInTheDocument();
        // Verify episode count
        expect(screen.getByText('Episodes: 1')).toBeInTheDocument();
    });
    it('calls fetchPodcastDetail when podcastId changes', () => {
        usePodcastContext.mockReturnValue({
            podcastDetail: null,
            fetchPodcastDetail: mockFetchPodcastDetail,
            error: null,
        });
        render(_jsx(MemoryRouter, { initialEntries: [`/podcast/${podcastId}`], children: _jsx(Routes, { children: _jsx(Route, { path: '/podcast/:podcastId', element: _jsx(PodcastDetail, {}) }) }) }));
        expect(mockFetchPodcastDetail).toHaveBeenCalledWith(podcastId);
    });
});
