import { jsx as _jsx } from 'react/jsx-runtime';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PodcastItem from './PodcastItem';
import { mockCachedPodcastData } from '../../api/services/__mocks__/podcastMocks'; // Adjust path as necessary
const mockPodcast = mockCachedPodcastData[0]; // Use the first podcast from the mock data
describe('PodcastItem Component', () => {
  it('renders the podcast name as a link', () => {
    render(
      _jsx(BrowserRouter, {
        children: _jsx(PodcastItem, { podcast: mockPodcast }),
      })
    );
    const linkElement = screen.getByRole('link', { name: mockPodcast.name });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', `/podcast/${mockPodcast.id}`);
  });
  it('renders the podcast artist name', () => {
    render(
      _jsx(BrowserRouter, {
        children: _jsx(PodcastItem, { podcast: mockPodcast }),
      })
    );
    const artistElement = screen.getByText(`Author: ${mockPodcast.artist}`);
    expect(artistElement).toBeInTheDocument();
  });
  it('renders the podcast artwork image', () => {
    render(
      _jsx(BrowserRouter, {
        children: _jsx(PodcastItem, { podcast: mockPodcast }),
      })
    );
    const imageElement = screen.getByAltText(mockPodcast.name);
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', mockPodcast.artwork);
  });
});
