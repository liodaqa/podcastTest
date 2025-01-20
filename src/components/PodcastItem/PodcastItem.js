import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import PodcastImage from '../PodcastImage/PodcastImage';
import styles from './PodcastItem.module.css';
const PodcastItem = ({ podcast }) => {
    return (_jsxs("li", { className: styles.podcastItem, children: [_jsx("div", { className: styles.imageWrapper, children: _jsx(PodcastImage, { src: podcast.artwork, alt: podcast.name }) }), _jsxs("div", { className: styles.details, children: [_jsx("h3", { className: styles.podcastTitle, children: _jsx(Link, { to: `/podcast/${podcast.id}`, className: styles.podcastLink, children: podcast.name }) }), _jsxs("p", { className: styles.podcastAuthor, children: ["Author: ", podcast.artist] })] })] }));
};
export default PodcastItem;
