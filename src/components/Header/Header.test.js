import { jsx as _jsx } from 'react/jsx-runtime';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import { usePodcastContext } from '../../context/PodcastContext';
jest.mock('../../context/PodcastContext', () => ({
  usePodcastContext: jest.fn(),
}));
describe('Header Component', () => {
  it('renders the title link', () => {
    usePodcastContext.mockReturnValue({ globalLoading: false });
    render(_jsx(BrowserRouter, { children: _jsx(Header, {}) }));
    const titleLink = screen.getByRole('link', { name: /podcaster/i });
    expect(titleLink).toBeInTheDocument();
    expect(titleLink).toHaveAttribute('href', '/');
  });
  it('does not render the Spinner when globalLoading is false', () => {
    usePodcastContext.mockReturnValue({ globalLoading: false });
    render(_jsx(BrowserRouter, { children: _jsx(Header, {}) }));
    expect(screen.queryByTestId('spinner-overlay')).not.toBeInTheDocument();
  });
  it('renders the Spinner when globalLoading is true', () => {
    usePodcastContext.mockReturnValue({ globalLoading: true });
    render(_jsx(BrowserRouter, { children: _jsx(Header, {}) }));
    const spinnerOverlay = screen.getByTestId('spinner-overlay');
    expect(spinnerOverlay).toBeInTheDocument();
  });
});
