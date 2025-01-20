import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});
global.importMeta = {
  env: {
    MODE: 'development',
    VITE_API_BASE_URL: 'https://api.allorigins.win/get',
  },
};
