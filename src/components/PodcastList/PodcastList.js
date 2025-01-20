import { jsx as _jsx } from "react/jsx-runtime";
import PodcastItem from '../PodcastItem/PodcastItem';
import styles from './PodcastList.module.css';
const PodcastList = ({ podcasts }) => {
    if (!podcasts || podcasts.length === 0) {
        return null;
    }
    return (_jsx("div", { className: styles.podcastListWrapper, children: _jsx("ul", { className: styles.podcastList, children: podcasts.map((podcast) => (_jsx(PodcastItem, { podcast: podcast }, podcast.id))) }) }));
};
export default PodcastList;
