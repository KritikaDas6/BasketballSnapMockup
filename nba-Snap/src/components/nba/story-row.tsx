import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PLAYERS, Snap } from '@/constants/nba';

export function StoryRow() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {PLAYERS.map((player) => (
        <Pressable
          key={player.id}
          style={styles.item}
          onPress={() => router.push(`/story/${player.id}`)}>
          <View style={styles.avatarRing}>
            <Image source={player.headshot} style={styles.avatar} contentFit="cover" />
            <View style={styles.playBadge}>
              <Ionicons name="play" size={9} color={Snap.background} />
            </View>
          </View>
          <Text style={styles.name} numberOfLines={2}>
            {player.name}
          </Text>
        </Pressable>
      ))}

      <Pressable style={styles.item} onPress={() => router.push('/story/nba')}>
        <View style={styles.avatarRing}>
          <View style={styles.logoAvatar}>
            <Ionicons name="basketball" size={28} color={Snap.text} />
          </View>
          <View style={styles.playBadge}>
            <Ionicons name="play" size={9} color={Snap.background} />
          </View>
        </View>
        <Text style={styles.name}>NBA</Text>
      </Pressable>
    </ScrollView>
  );
}

const AVATAR_SIZE = 60;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 14,
    paddingBottom: 8,
  },
  item: {
    alignItems: 'center',
    width: AVATAR_SIZE + 24,
  },
  avatarRing: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    borderColor: Snap.yellow,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: Snap.cardElevated,
  },
  logoAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: Snap.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Snap.yellow,
    borderWidth: 2,
    borderColor: Snap.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    color: Snap.text,
    fontSize: 10.5,
    lineHeight: 13,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
});
