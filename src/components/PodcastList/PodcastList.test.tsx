import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PodcastList from './PodcastList';
import { mockCachedPodcastData } from '../../api/services/__mocks__/podcastMocks';
jest.mock('../../hooks/LazyLoad/useLazyLoad', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    visibleItems: [],
    listRef: { current: null },
  })),
}));

jest.mock('../PodcastItem/PodcastItem', () =>
  jest.fn(() => <li data-testid='podcast-item'></li>)
);
jest.mock('../Skeleton/PodcastItemSkeleton/PodcastItemSkeleton', () =>
  jest.fn(() => <li data-testid='podcast-skeleton'></li>)
);

describe('PodcastList Component', () => {
  const mockPodcasts = mockCachedPodcastData.map((podcast) => ({
    id: podcast.id,
    name: podcast.name,
    artist: podcast.artist,
    artwork: podcast.artwork,
    summary: podcast.summary,
  }));

  it('renders skeletons while loading', () => {
    render(<PodcastList podcasts={mockPodcasts} isLoading={true} />);
    const skeletons = screen.getAllByTestId('podcast-skeleton');
    expect(skeletons).toHaveLength(12);
  });

  it('renders podcasts when loading is false', () => {
    const useLazyLoadMock = jest.requireMock(
      '../../hooks/LazyLoad/useLazyLoad'
    ).default;
    useLazyLoadMock.mockReturnValue({
      visibleItems: mockPodcasts,
      listRef: { current: null },
    });

    render(<PodcastList podcasts={mockPodcasts} isLoading={false} />);
    const podcastItems = screen.getAllByTestId('podcast-item');
    expect(podcastItems).toHaveLength(mockPodcasts.length);
  });

  it('renders empty state when podcasts array is empty', () => {
    const useLazyLoadMock = jest.requireMock(
      '../../hooks/LazyLoad/useLazyLoad'
    ).default;
    useLazyLoadMock.mockReturnValue({
      visibleItems: [],
      listRef: { current: null },
    });

    render(<PodcastList podcasts={[]} isLoading={false} />);
    const podcastItems = screen.queryByTestId('podcast-item');
    expect(podcastItems).not.toBeInTheDocument();
  });

  it('handles lazy loading correctly', () => {
    const useLazyLoadMock = jest.requireMock(
      '../../hooks/LazyLoad/useLazyLoad'
    ).default;
    useLazyLoadMock.mockReturnValue({
      visibleItems: mockPodcasts.slice(0, 1),
      listRef: { current: null },
    });

    render(<PodcastList podcasts={mockPodcasts} isLoading={false} />);
    const podcastItems = screen.getAllByTestId('podcast-item');
    expect(podcastItems).toHaveLength(1);
  });

  it('handles invalid data gracefully', () => {
    const useLazyLoadMock = jest.requireMock(
      '../../hooks/LazyLoad/useLazyLoad'
    ).default;
    useLazyLoadMock.mockReturnValue({
      visibleItems: [],
      listRef: { current: null },
    });

    render(<PodcastList podcasts={[]} isLoading={false} />);
    const podcastItems = screen.queryByTestId('podcast-item');
    expect(podcastItems).not.toBeInTheDocument();
  });
});
