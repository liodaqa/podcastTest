import { jsx as _jsx } from "react/jsx-runtime";
import styles from './PodcastImage.module.css';
const PodcastImage = ({ src, alt, className }) => {
    return (_jsx("img", { src: src, alt: alt, className: `${styles.podcastImage} ${className || ''}`.trim() }));
};
export default PodcastImage;
