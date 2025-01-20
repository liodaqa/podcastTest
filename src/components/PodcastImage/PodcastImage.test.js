import { jsx as _jsx } from 'react/jsx-runtime';
import { render, screen } from '@testing-library/react';
import PodcastImage from './PodcastImage';
jest.mock('./PodcastImage.module.css', () => ({
  podcastImage: 'podcastImage',
}));
describe('PodcastImage Component', () => {
  const mockProps = {
    src: 'https://test.com/image.jpg',
    alt: 'Podcast Cover Image',
  };
  it('renders the image with correct src and alt attributes', () => {
    render(_jsx(PodcastImage, { ...mockProps }));
    const image = screen.getByAltText(mockProps.alt);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockProps.src);
  });
  it('applies the default podcastImage class', () => {
    render(_jsx(PodcastImage, { ...mockProps }));
    const image = screen.getByAltText(mockProps.alt);
    expect(image).toHaveClass('podcastImage');
  });
  it('applies additional className when provided', () => {
    const additionalClass = 'customClass';
    render(_jsx(PodcastImage, { ...mockProps, className: additionalClass }));
    const image = screen.getByAltText(mockProps.alt);
    expect(image).toHaveClass('podcastImage');
    expect(image).toHaveClass(additionalClass);
  });
});
