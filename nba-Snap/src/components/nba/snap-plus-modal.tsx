import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Snap } from '@/constants/nba';
import { useChat } from '@/context/chat-context';

const PERKS = [
  'Unlimited chats with NBA players',
  'Exclusive Snap Rewards multipliers',
  'Early access to NBA Hub drops',
];

export function SnapPlusModal() {
  const { showPaywall, dismissPaywall, upgradeToSnapPlus } = useChat();

  return (
    <Modal visible={showPaywall} transparent animationType="slide" onRequestClose={dismissPaywall}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Pressable style={styles.closeButton} onPress={dismissPaywall}>
            <Ionicons name="close" size={22} color={Snap.textSecondary} />
          </Pressable>

          <View style={styles.badge}>
            <Ionicons name="star" size={28} color={Snap.background} />
          </View>

          <Text style={styles.title}>You&apos;re out of free messages</Text>
          <Text style={styles.subtitle}>
            Upgrade to Snap+ for unlimited chats with Ja Morant and the rest of the NBA Hub.
          </Text>

          <View style={styles.perks}>
            {PERKS.map((perk) => (
              <View key={perk} style={styles.perkRow}>
                <Ionicons name="checkmark-circle" size={18} color={Snap.yellow} />
                <Text style={styles.perkText}>{perk}</Text>
              </View>
            ))}
          </View>

          <Pressable style={styles.upgradeButton} onPress={upgradeToSnapPlus}>
            <Text style={styles.upgradeButtonText}>Upgrade to Snap+</Text>
          </Pressable>
          <Pressable onPress={dismissPaywall}>
            <Text style={styles.notNowText}>Not now</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Snap.cardElevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Snap.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  title: {
    color: Snap.text,
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: Snap.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  perks: {
    alignSelf: 'stretch',
    gap: 10,
    marginBottom: 16,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  perkText: {
    color: Snap.text,
    fontSize: 13,
    flex: 1,
  },
  upgradeButton: {
    alignSelf: 'stretch',
    backgroundColor: Snap.yellow,
    borderRadius: 26,
    paddingVertical: 14,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: Snap.background,
    fontSize: 15,
    fontWeight: '800',
  },
  notNowText: {
    color: Snap.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
  },
});
