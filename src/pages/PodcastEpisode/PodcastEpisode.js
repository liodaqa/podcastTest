import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePodcastContext } from '../../context/PodcastContext';
import PodcastCard from '../../components/PodcastCard/PodcastCard';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import styles from './PodcastEpisode.module.css';
const PodcastEpisode = () => {
    const { podcastId, episodeId } = useParams();
    const { podcastDetail, fetchPodcastDetail } = usePodcastContext();
    useEffect(() => {
        if (!podcastDetail || podcastDetail.id !== podcastId) {
            fetchPodcastDetail(podcastId);
        }
    }, [podcastId, podcastDetail, fetchPodcastDetail]);
    if (!podcastDetail || podcastDetail.id !== podcastId) {
        return null;
    }
    const episode = podcastDetail.episodes.find((ep) => ep.trackId === Number(episodeId));
    if (!episode) {
        return _jsx(ErrorMessage, { message: 'Episode not found.' });
    }
    return (_jsxs("div", { className: styles.container, children: [_jsx("aside", { className: styles.sidebar, children: _jsx(PodcastCard, { image: podcastDetail.artworkUrl600, title: podcastDetail.collectionName, author: podcastDetail.artistName, description: podcastDetail.summary }) }), _jsxs("main", { className: styles.mainContent, children: [_jsx("h2", { className: styles.episodeTitle, children: episode.trackName }), _jsx("p", { className: styles.episodeDescription, dangerouslySetInnerHTML: {
                            __html: episode.description || 'No description available.',
                        } }), _jsx("div", { className: styles.audioPlayerContainer, children: _jsxs("audio", { controls: true, className: styles.audioPlayer, "data-testid": 'audio-player', children: [_jsx("source", { src: episode.episodeUrl, type: 'audio/mpeg', "data-testid": 'audio-source' }), "Your browser does not support the audio element."] }) })] })] }));
};
export default PodcastEpisode;
