/**
 * Design tokens + static data for the NBA Hub mockup.
 */
import type { ImageSource } from 'expo-image';

export const Snap = {
  yellow: '#FFFC00',
  background: '#000000',
  card: '#141414',
  cardElevated: '#1C1C1E',
  bubble: '#232325',
  border: '#2A2A2C',
  text: '#FFFFFF',
  textSecondary: '#9A9A9E',
  blue: '#4AA8FF',
  red: '#FF5A5F',
  green: '#3DDC84',
} as const;

export type Player = {
  id: string;
  name: string;
  team: string;
  /** Circular Bitmoji-style icon used in stories, chat, etc. */
  headshot: ImageSource;
};

export const PLAYERS: Player[] = [
  {
    id: 'curry',
    name: 'Stephen Curry',
    team: 'GOLDEN STATE WARRIORS',
    headshot: require('@/assets/images/players/curry-icon.png'),
  },
  {
    id: 'lebron',
    name: 'LeBron James',
    team: 'LOS ANGELES LAKERS',
    headshot: require('@/assets/images/players/lebron-icon.png'),
  },
  {
    id: 'morant',
    name: 'Ja Morant',
    team: 'MEMPHIS GRIZZLIES',
    headshot: require('@/assets/images/players/morant-icon.png'),
  },
  {
    id: 'tatum',
    name: 'Jayson Tatum',
    team: 'BOSTON CELTICS',
    headshot: require('@/assets/images/players/tatum-icon.png'),
  },
];

export const JA_MORANT = PLAYERS.find((p) => p.id === 'morant')!;

export type RewardItem = {
  id: string;
  title: string;
  subtitle: string;
  /** Snap Points deducted on redeem */
  costPoints: number;
  image: string;
};

export const REWARDS = {
  startingPoints: 12560,
  items: [
    {
      id: 'merch',
      title: 'NBA Merch',
      subtitle: 'Exclusive drops',
      costPoints: 5000,
      image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=500&q=80',
    },
    {
      id: 'tickets',
      title: 'NBA Tickets',
      subtitle: 'Exclusive access',
      costPoints: 10000,
      image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=500&q=80',
    },
  ] satisfies RewardItem[],
} as const;

export function formatPoints(points: number) {
  return points.toLocaleString('en-US');
}
