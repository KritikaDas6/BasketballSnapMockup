import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PLAYERS, Snap } from '@/constants/nba';
import { getStoryVideo, STORY_DURATION_MS } from '@/constants/stories';

export default function StoryScreen() {
  const { playerId } = useLocalSearchParams<{ playerId: string }>();
  const player = PLAYERS.find((p) => p.id === playerId);
  const displayName = player?.name ?? 'NBA';
  const avatar = player?.headshot;

  const videoSource = getStoryVideo(playerId ?? '');
  const videoPlayer = useVideoPlayer(videoSource, (p) => {
    // Loop so the clip fills the full story duration below even if the
    // source video is shorter than STORY_DURATION_MS.
    p.loop = true;
    // Start muted so autoplay is never blocked by the browser/OS; the user
    // can tap the speaker icon to turn sound on.
    p.muted = true;
  });

  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const closedRef = useRef(false);

  // On web the underlying <video> element mounts after this component's
  // first render, so play() has to be triggered from an effect rather than
  // the useVideoPlayer setup callback for autoplay to actually start.
  useEffect(() => {
    videoPlayer.play();
  }, [videoPlayer]);

  const toggleMute = () => {
    // expo-video's player is a native SharedObject, not plain React state, so
    // mutating its properties directly is the documented way to control it.
    // eslint-disable-next-line react-hooks/immutability
    videoPlayer.muted = !videoPlayer.muted;
    setIsMuted(videoPlayer.muted);
  };

  const close = () => {
    if (closedRef.current) return;
    closedRef.current = true;
    router.back();
  };

  useEffect(() => {
    const startedAt = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const pct = Math.min(1, elapsed / STORY_DURATION_MS);
      setProgress(pct);
      if (pct >= 1) {
        clearInterval(interval);
        close();
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <VideoView
        player={videoPlayer}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />

      <SafeAreaView style={styles.overlay} edges={['top']}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>

        <View style={styles.headerRow}>
          {avatar ? (
            <Image source={avatar} style={styles.avatar} contentFit="cover" />
          ) : (
            <View style={[styles.avatar, styles.logoAvatar]}>
              <Ionicons name="basketball" size={18} color={Snap.text} />
            </View>
          )}
          <Text style={styles.name} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={styles.time}>now</Text>
          <Pressable onPress={toggleMute} style={styles.closeButton} hitSlop={12}>
            <Ionicons
              name={isMuted ? 'volume-mute' : 'volume-high'}
              size={22}
              color={Snap.text}
            />
          </Pressable>
          <Pressable onPress={close} style={styles.closeButton} hitSlop={12}>
            <Ionicons name="close" size={26} color={Snap.text} />
          </Pressable>
        </View>
      </SafeAreaView>

      <Pressable style={styles.tapCatcher} onPress={close} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Snap.background,
  },
  video: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginHorizontal: 10,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Snap.text,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Snap.cardElevated,
  },
  logoAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    color: Snap.text,
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  time: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  closeButton: {
    padding: 2,
  },
  tapCatcher: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
});
