import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import styles from './Header.module.css';
import { usePodcastContext } from '../../context/PodcastContext';
const Header = () => {
    const { globalLoading } = usePodcastContext();
    return (_jsx("header", { className: styles.headerWrapper, children: _jsxs("div", { className: styles.header, children: [_jsx(Link, { to: '/', className: styles.title, children: "Podcaster" }), globalLoading && _jsx(Spinner, {})] }) }));
};
export default Header;
