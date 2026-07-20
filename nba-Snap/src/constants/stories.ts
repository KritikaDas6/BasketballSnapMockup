/**
 * Story video sources, keyed by player id (see PLAYERS in nba.ts).
 *
 * To use your own clips, drop video files into `assets/videos/` and map them
 * here with require(), e.g.:
 *
 *   export const STORY_VIDEOS: Record<string, VideoSource> = {
 *     morant: require('@/assets/videos/morant.mp4'),
 *     curry: require('@/assets/videos/curry.mp4'),
 *   };
 *
 * Any player without an entry falls back to FALLBACK_STORY_VIDEO.
 * Every story plays for a maximum of 10 seconds.
 */
import type { VideoSource } from 'expo-video';

export const STORY_VIDEOS: Record<string, VideoSource> = {};

export const FALLBACK_STORY_VIDEO: VideoSource =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

export const STORY_DURATION_MS = 10_000;

export function getStoryVideo(playerId: string): VideoSource {
  return STORY_VIDEOS[playerId] ?? FALLBACK_STORY_VIDEO;
}
