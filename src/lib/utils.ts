import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRandomObject(arr: string[], count: number) {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function extractJSON(text: string) {
  try {
    const cleanText = text.replace(/```json\s?/, '').replace(/\s?```/, '');
    const jsonData = JSON.parse(cleanText);
    return jsonData;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
}

function extractSpotifyUsername(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');

    if (pathParts[1] === 'user' && pathParts[2]) {
      return pathParts[2];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Invalid URL', error);
    return null;
  }
}

export function getSpotifyUsername(input: string): string {
  // Regular expression to check if the input is a valid Spotify user URL
  const urlPattern = /^https?:\/\/(open\.)?spotify\.com\/user\/[a-zA-Z0-9]+/;

  if (urlPattern.test(input)) {
    const username = extractSpotifyUsername(input);
    if (username) {
      return username;
    } else {
      throw new Error('Invalid Spotify user link format');
    }
  }

  const validUsernamePattern = /^[a-zA-Z0-9]+$/;
  if (validUsernamePattern.test(input)) {
    return input;
  } else {
    throw new Error('Invalid input: not a valid Spotify user link or username');
  }
}
