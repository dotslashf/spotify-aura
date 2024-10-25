export interface Playlist {
  name: string;
  id: string;
}

export interface Playlists {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: Item[];
}

export interface Item {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  public: boolean;
  snapshot_id: string;
  tracks: Tracks;
  type: string;
  uri: string;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Image {
  url: string;
  height: number;
  width: number;
}

export interface Owner {
  external_urls: ExternalUrls;
  followers: Tracks;
  href: string;
  id: string;
  type: string;
  uri: string;
  display_name: string;
}

export interface Tracks {
  href: string;
  total: number;
}

export interface PlaylistDetail {
  data: PlaylistDetailData;
}

export interface PlaylistDetailData {
  items: PlaylistDetailItem[];
}

export interface PlaylistDetailItem {
  track: Track;
}

export interface Track {
  artists: Artist[];
}

export interface ArtistDetails {
  artists: Artist[];
}

export interface Artist {
  external_urls: ExternalUrls;
  followers: Followers;
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface ExternalUrls {
  spotify: string;
}

export interface Followers {
  href: string;
  total: number;
}

export interface Image {
  url: string;
  height: number;
  width: number;
}

export interface AuraJSON {
  auraScore: number;
  auraColors: AuraColors;
  translations: Translations;
}

export interface AuraColors {
  primary: Ary;
  secondary: Ary;
  gradientPosition: string;
}

export interface Ary {
  hex: string;
  name: string;
}

export interface Translations {
  english: Aura;
  indonesian: Aura;
}

export interface Aura {
  musicNickname: string;
  keyPoint: string;
  auraDescription: string;
  colorMeanings: ColorMeanings;
}

export interface ColorMeanings {
  primary: string;
  secondary: string;
}
