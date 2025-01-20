export const formatDuration = (trackTimeMillis) => {
  const minutes = Math.floor(trackTimeMillis / 60000);
  const seconds = Math.floor((trackTimeMillis % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};
