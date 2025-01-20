import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, useCallback, } from 'react';
import { fetchPodcasts, fetchPodcastDetails, } from '../api/services/podcastService';
const PodcastContext = createContext(undefined);
export const PodcastProvider = ({ children, }) => {
    const [podcasts, setPodcasts] = useState([]);
    const [podcastDetail, setPodcastDetail] = useState(null);
    const [error, setError] = useState(null);
    const [globalLoading, setGlobalLoading] = useState(false);
    useEffect(() => {
        const fetchAllPodcasts = async () => {
            try {
                setGlobalLoading(true);
                const data = await fetchPodcasts();
                setPodcasts(data);
                setError(null);
            }
            catch (err) {
                console.error('Failed to fetch podcasts:', err);
                setError('Unable to fetch podcasts.');
            }
            finally {
                setGlobalLoading(false);
            }
        };
        fetchAllPodcasts();
    }, []);
    const fetchPodcastDetail = useCallback(async (id) => {
        try {
            setGlobalLoading(true);
            const detail = await fetchPodcastDetails(id);
            setPodcastDetail(detail);
            setError(null);
        }
        catch (err) {
            console.error('Failed to fetch podcast details:', err);
            setError('Unable to fetch podcast details.');
            setPodcastDetail(null);
        }
        finally {
            setGlobalLoading(false);
        }
    }, []);
    return (_jsx(PodcastContext.Provider, { value: {
            podcasts,
            podcastDetail,
            error,
            fetchPodcastDetail,
            globalLoading,
        }, children: children }));
};
export const usePodcastContext = () => {
    const context = useContext(PodcastContext);
    if (!context) {
        throw new Error('usePodcastContext must be used within a PodcastProvider');
    }
    return context;
};
