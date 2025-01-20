import { jsx as _jsx } from "react/jsx-runtime";
import styles from './Spinner.module.css';
const Spinner = () => {
    return (_jsx("div", { className: styles.spinnerOverlay, "data-testid": 'spinner-overlay', children: _jsx("div", { className: styles.spinner, "data-testid": 'spinner' }) }));
};
export default Spinner;
