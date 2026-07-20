import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { RARITY_STYLES, type Friend, type NbaCard, type OwnershipStatus } from '@/constants/cards';
import { Snap } from '@/constants/nba';

type Props = {
  visible: boolean;
  friend: Friend | null;
  card: NbaCard | null;
  status: OwnershipStatus;
  onClose: () => void;
};

export function TradeModal({ visible, friend, card, status, onClose }: Props) {
  const [sent, setSent] = useState(false);

  if (!friend || !card) return null;
  const rarity = RARITY_STYLES[card.rarity];
  const isDuplicate = status === 'duplicate';

  const handleClose = () => {
    setSent(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Pressable style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={20} color={Snap.textSecondary} />
          </Pressable>

          <View style={styles.avatarsRow}>
            <Image source={friend.avatar} style={styles.friendAvatar} contentFit="cover" />
            <View style={[styles.linkIcon, { backgroundColor: rarity.glow }]}>
              <Ionicons name="swap-horizontal" size={16} color={Snap.background} />
            </View>
            <Image source={card.image} style={styles.cardAvatar} contentFit="cover" />
          </View>

          {sent ? (
            <>
              <Text style={styles.title}>Trade offer sent! 🤝</Text>
              <Text style={styles.body}>
                {friend.name} will get a notification about your offer for the{' '}
                <Text style={{ color: rarity.glow, fontWeight: '800' }}>{card.playerName}</Text> card.
              </Text>
              <Pressable style={[styles.primaryButton, { backgroundColor: rarity.glow }]} onPress={handleClose}>
                <Text style={styles.primaryButtonText}>Done</Text>
              </Pressable>
            </>
          ) : isDuplicate ? (
            <>
              <Text style={styles.title}>Trade with {friend.name}</Text>
              <Text style={styles.body}>
                Offer to swap for {friend.name}&apos;s duplicate{' '}
                <Text style={{ color: rarity.glow, fontWeight: '800' }}>{card.playerName}</Text> card!
              </Text>
              <Pressable
                style={[styles.primaryButton, { backgroundColor: rarity.glow }]}
                onPress={() => setSent(true)}>
                <Ionicons name="swap-horizontal" size={16} color={Snap.background} />
                <Text style={styles.primaryButtonText}>Send Trade Offer</Text>
              </Pressable>
              <Pressable onPress={handleClose}>
                <Text style={styles.secondaryText}>Not now</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={styles.title}>{friend.name} owns this card</Text>
              <Text style={styles.body}>
                {friend.name} has only one copy of the {card.playerName} card right now — no
                duplicates available to trade yet. Check back later!
              </Text>
              <Pressable style={styles.primaryButtonGhost} onPress={handleClose}>
                <Text style={styles.secondaryText}>Got it</Text>
              </Pressable>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Snap.cardElevated,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    gap: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    padding: 4,
  },
  avatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  friendAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Snap.card,
  },
  cardAvatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: Snap.card,
  },
  linkIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Snap.text,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  body: {
    color: Snap.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 8,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'stretch',
    borderRadius: 24,
    paddingVertical: 13,
    justifyContent: 'center',
  },
  primaryButtonGhost: {
    alignSelf: 'stretch',
    borderRadius: 24,
    paddingVertical: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Snap.border,
  },
  primaryButtonText: {
    color: Snap.background,
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryText: {
    color: Snap.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
});
