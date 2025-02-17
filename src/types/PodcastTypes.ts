// export interface Podcast {
//   id: string;
//   name: string;
//   artist: string;
//   artwork: string;
// }

// export interface PodcastDetailType {
//   id: string;
//   title: string;
//   author: string;
//   description: string;
//   image: string;
// }

// export interface Episode {
//   id: string;
//   title: string;
//   releaseDate: string;
//   duration: string;
// }

// export interface PodcastDetailData {
//   podcast: PodcastDetailType;
//   episodes: Episode[];
// timestamp: number;
// }

export interface Podcast {
  id: string;
  name: string;
  artist: string;
  artwork: string;
  summary: string;
}

export interface Episode {
  trackId: number;
  trackName: string;
  releaseDate: string;
  trackTimeMillis: number;
  episodeUrl: string;
  description: string;
}

export interface DetailedPodcast {
  id: string;
  artworkUrl600: string;
  collectionName: string;
  artistName: string;
  summary: string;
  description: string;
  episodes: Episode[];
}
