import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RARITY_STYLES, getOwnership, type Friend, type NbaCard } from '@/constants/cards';
import { Snap } from '@/constants/nba';

type Props = {
  card: NbaCard;
  friends: Friend[];
  onSelectFriend: (friend: Friend) => void;
};

export function FriendTracker({ card, friends, onSelectFriend }: Props) {
  const rarity = RARITY_STYLES[card.rarity];

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Ionicons name="people-circle" size={18} color={Snap.yellow} />
        <Text style={styles.title}>Friends&apos; Collection Hub</Text>
      </View>
      <Text style={styles.subtitle} numberOfLines={1}>
        Who has the {card.playerName} card?
      </Text>

      <View style={styles.avatarRow}>
        {friends.map((friend) => {
          const status = getOwnership(friend.id, card.id);
          const owns = status !== 'none';
          const ringColor = status === 'none' ? 'transparent' : rarity.glow;

          return (
            <Pressable
              key={friend.id}
              style={styles.avatarItem}
              disabled={!owns}
              onPress={() => onSelectFriend(friend)}>
              <View
                style={[
                  styles.avatarRing,
                  { borderColor: ringColor },
                  status === 'none' && styles.avatarRingMuted,
                ]}>
                <Image
                  source={friend.avatar}
                  style={[styles.avatar, !owns && styles.avatarDimmed]}
                  contentFit="cover"
                />
                {status === 'duplicate' && (
                  <View style={[styles.dupeBadge, { backgroundColor: Snap.yellow }]}>
                    <Text style={styles.dupeBadgeText}>x2</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.friendName, owns && { color: Snap.text }]} numberOfLines={1}>
                {friend.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const AVATAR_SIZE = 52;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingTop: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: Snap.text,
    fontSize: 15,
    fontWeight: '800',
  },
  subtitle: {
    color: Snap.textSecondary,
    fontSize: 12,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  avatarItem: {
    alignItems: 'center',
    gap: 6,
    width: 68,
  },
  avatarRing: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRingMuted: {
    borderWidth: 1,
    borderColor: Snap.border,
  },
  avatar: {
    width: AVATAR_SIZE - 6,
    height: AVATAR_SIZE - 6,
    borderRadius: (AVATAR_SIZE - 6) / 2,
    backgroundColor: Snap.cardElevated,
  },
  avatarDimmed: {
    opacity: 0.5,
  },
  dupeBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderWidth: 1.5,
    borderColor: Snap.background,
  },
  dupeBadgeText: {
    color: Snap.background,
    fontSize: 9,
    fontWeight: '800',
  },
  friendName: {
    color: Snap.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
});
