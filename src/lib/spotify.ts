import { Playlists } from '@/interface';
import dotenv from 'dotenv';

dotenv.config();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

export const BASIC_AUTH = Buffer.from(`${client_id}:${client_secret}`).toString(
  'base64'
);
export const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';

export const getUserProfile = async (
  accessToken: string,
  spotifyUserId?: string | null
) => {
  if (!spotifyUserId) {
    throw new Error('spotifyUserId is required');
  }
  const url = `${SPOTIFY_API_BASE_URL}/users/${spotifyUserId}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const getUserPlaylists = async (
  accessToken: string,
  spotifyUserId: string
) => {
  const url = `${SPOTIFY_API_BASE_URL}/users/${spotifyUserId}/playlists`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Not found");
    }

    return (await response.json()) as Playlists;
  } catch (error) {
    console.error(error);
  }
};

export const getUserPlaylistDetail = async (
  accessToken: string,
  playlistId: string
) => {
  const url = `${SPOTIFY_API_BASE_URL}/playlists/${playlistId}/tracks?fields=${encodeURIComponent(
    'items(track(artists(id)))'
  )}&limit=30`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error
  }
};

export const getArtistsGenres = async (
  accessToken: string,
  artistIds: string[]
) => {
  const url = `${SPOTIFY_API_BASE_URL}/artists?ids=${artistIds}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const getRefreshToken = async () => {
  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${BASIC_AUTH}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      cache: 'no-cache',
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token!,
      }),
    });

    return response.json();
  } catch (error) {
    console.log("Error refresh token", error);
    throw new Error("Token is expired")
  }
};
