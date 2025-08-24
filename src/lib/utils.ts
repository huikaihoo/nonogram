import { type ClassValue, clsx } from 'clsx';
import prand from 'pure-rand';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function padZero(n: number | string, maxlength: number) {
  return n.toString().padStart(maxlength, '0');
}

export function generateRandomString(length: number, chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'): string {
  if (length <= 0) return '';

  const seed = Date.now() ^ (Math.random() * 0x100000000);
  let rng = prand.xoroshiro128plus(seed);
  let result = '';

  for (let i = 0; i < length; i++) {
    const maxIndex = chars.length - 1;
    const [randIndex, nextRng] = prand.uniformIntDistribution(0, maxIndex, rng);
    result += chars[randIndex];
    rng = nextRng;
  }

  return result;
}
