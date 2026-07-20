import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { CARDS, FRIENDS, RARITY_STYLES, getOwnership, type Friend } from '@/constants/cards';
import { Snap } from '@/constants/nba';
import { CardCarousel } from './card-carousel';
import { FriendTracker } from './friend-tracker';
import { TradeModal } from './trade-modal';

export function CardShowcaseSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  const activeCard = CARDS[activeIndex];
  const rarity = RARITY_STYLES[activeCard.rarity];
  const selectedStatus = selectedFriend ? getOwnership(selectedFriend.id, activeCard.id) : 'none';

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Ionicons name="albums" size={18} color={Snap.yellow} />
          <Text style={styles.title}>NBA Card Collection</Text>
        </View>
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>HOLO</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>Swipe to explore your holographic pulls</Text>

      <CardCarousel cards={CARDS} activeIndex={activeIndex} onActiveIndexChange={setActiveIndex} />

      <View style={styles.rarityPill}>
        <View style={[styles.rarityDot, { backgroundColor: rarity.glow }]} />
        <Text style={[styles.rarityPillText, { color: rarity.glow }]}>{rarity.label}</Text>
        <Text style={styles.rarityPillPlayer} numberOfLines={1}>
          {activeCard.playerName} · {activeCard.team}
        </Text>
      </View>

      <View style={styles.divider} />

      <FriendTracker card={activeCard} friends={FRIENDS} onSelectFriend={setSelectedFriend} />

      <TradeModal
        visible={!!selectedFriend}
        friend={selectedFriend}
        card={activeCard}
        status={selectedStatus}
        onClose={() => setSelectedFriend(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0E0E10',
    borderRadius: 18,
    marginHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
    paddingHorizontal: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: Snap.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: Snap.text,
    fontSize: 16,
    fontWeight: '700',
  },
  newBadge: {
    backgroundColor: Snap.yellow,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  newBadgeText: {
    color: Snap.background,
    fontSize: 10,
    fontWeight: '800',
  },
  subtitle: {
    color: Snap.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  rarityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'center',
    backgroundColor: Snap.cardElevated,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 4,
    maxWidth: '100%',
  },
  rarityDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  rarityPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  rarityPillPlayer: {
    color: Snap.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    flexShrink: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Snap.border,
    marginVertical: 14,
  },
});
