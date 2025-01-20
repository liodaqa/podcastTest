import { jsx as _jsx } from 'react/jsx-runtime';
import { debounce } from '../../api/utils/debounce';
import styles from './SearchInput.module.css';
const SearchBar = ({ onSearch }) => {
  const handleSearch = debounce(onSearch, 300);
  return _jsx('input', {
    className: styles.search,
    type: 'text',
    placeholder: 'Filter podcasts...',
    onChange: (e) => handleSearch(e.target.value),
  });
};
export default SearchBar;
