import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './ErrorMessage.module.css';
const ErrorMessage = ({ message, retryAction, }) => {
    return (_jsxs("div", { className: styles.errorContainer, "data-testid": 'error-message', children: [_jsx("p", { className: styles.errorMessage, children: message }), retryAction && (_jsx("button", { className: styles.retryButton, onClick: retryAction, children: "Retry" }))] }));
};
export default ErrorMessage;
