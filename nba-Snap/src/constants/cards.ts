/**
 * Data + design tokens for the "NBA Card Collection Showcase" feature.
 */
import type { ImageSource } from 'expo-image';

import { PLAYERS } from '@/constants/nba';

export type Rarity = 'legendary' | 'epic' | 'rare';

export const RARITY_STYLES: Record<
  Rarity,
  { label: string; glow: string; gradient: readonly [string, string, string, string] }
> = {
  legendary: {
    label: 'Legendary',
    glow: '#FFD700',
    gradient: ['#FFE9A8', '#FFD700', '#FF9F1C', '#FFE9A8'],
  },
  epic: {
    label: 'Epic',
    glow: '#B14EFF',
    gradient: ['#E7C6FF', '#B14EFF', '#6A00F4', '#E7C6FF'],
  },
  rare: {
    label: 'Rare',
    glow: '#43D9FF',
    gradient: ['#B8F1FF', '#43D9FF', '#2E6BFF', '#B8F1FF'],
  },
};

export type NbaCard = {
  id: string;
  playerId: string;
  playerName: string;
  team: string;
  image: ImageSource;
  rarity: Rarity;
  stats: { label: string; value: string }[];
};

const findPlayer = (id: string) => PLAYERS.find((p) => p.id === id)!;

export const CARDS: NbaCard[] = [
  {
    id: 'card-curry',
    playerId: 'curry',
    playerName: findPlayer('curry').name,
    team: findPlayer('curry').team,
    image: require('@/assets/images/players/curry-card.png'),
    rarity: 'legendary',
    stats: [
      { label: 'PPG', value: '26.4' },
      { label: '3PM', value: '4.8' },
      { label: 'AST', value: '5.1' },
    ],
  },
  {
    id: 'card-lebron',
    playerId: 'lebron',
    playerName: findPlayer('lebron').name,
    team: findPlayer('lebron').team,
    image: require('@/assets/images/players/lebron-card.png'),
    rarity: 'epic',
    stats: [
      { label: 'PPG', value: '25.2' },
      { label: 'AST', value: '8.1' },
      { label: 'REB', value: '7.5' },
    ],
  },
  {
    id: 'card-morant',
    playerId: 'morant',
    playerName: findPlayer('morant').name,
    team: findPlayer('morant').team,
    image: require('@/assets/images/players/morant-card.png'),
    rarity: 'rare',
    stats: [
      { label: 'PPG', value: '25.1' },
      { label: 'AST', value: '8.2' },
      { label: 'STL', value: '1.1' },
    ],
  },
  {
    id: 'card-tatum',
    playerId: 'tatum',
    playerName: findPlayer('tatum').name,
    team: findPlayer('tatum').team,
    image: require('@/assets/images/players/tatum-card.png'),
    rarity: 'epic',
    stats: [
      { label: 'PPG', value: '27.0' },
      { label: 'REB', value: '8.1' },
      { label: '3PM', value: '3.1' },
    ],
  },
];

export type Friend = {
  id: string;
  name: string;
  avatar: ImageSource;
};

export const FRIENDS: Friend[] = [
  { id: 'michael', name: 'Shawn', avatar: require('@/assets/images/friends/michael.png') },
  { id: 'sarah', name: 'Von', avatar: require('@/assets/images/friends/sarah.png') },
  { id: 'jaiden', name: 'Ben', avatar: require('@/assets/images/friends/jaiden.png') },
  { id: 'chloe', name: 'KD', avatar: require('@/assets/images/friends/chloe.png') },
];

export type OwnershipStatus = 'none' | 'owns' | 'duplicate';

/** friendId -> cardId -> ownership status */
export const CARD_OWNERSHIP: Record<string, Record<string, OwnershipStatus>> = {
  michael: {
    'card-curry': 'duplicate',
    'card-lebron': 'none',
    'card-morant': 'owns',
    'card-tatum': 'none',
  },
  sarah: {
    'card-curry': 'owns',
    'card-lebron': 'owns',
    'card-morant': 'none',
    'card-tatum': 'duplicate',
  },
  jaiden: {
    'card-curry': 'none',
    'card-lebron': 'owns',
    'card-morant': 'duplicate',
    'card-tatum': 'none',
  },
  chloe: {
    'card-curry': 'duplicate',
    'card-lebron': 'none',
    'card-morant': 'none',
    'card-tatum': 'owns',
  },
};

export function getOwnership(friendId: string, cardId: string): OwnershipStatus {
  return CARD_OWNERSHIP[friendId]?.[cardId] ?? 'none';
}
