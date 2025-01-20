import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import PodcastImage from '../PodcastImage/PodcastImage';
import styles from './PodcastCard.module.css';
const PodcastCard = ({ image, title, author, description, descriptionLabel = 'Description:', }) => {
    return (_jsxs("div", { className: styles.card, children: [_jsx(PodcastImage, { src: image, alt: title, className: styles.image }), _jsx("div", { className: styles.borderBottom }), _jsx("h2", { className: styles.title, children: title }), author && _jsxs("p", { className: styles.author, children: ["By ", author] }), _jsx("div", { className: styles.borderBottom }), description && (_jsxs(_Fragment, { children: [_jsx("h5", { children: descriptionLabel }), _jsx("p", { className: styles.description, children: description })] }))] }));
};
export default PodcastCard;
