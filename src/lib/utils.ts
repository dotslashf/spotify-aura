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
};