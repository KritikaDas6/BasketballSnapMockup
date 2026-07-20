import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  REWARDS,
  Snap,
  formatPoints,
  type RewardItem,
} from '@/constants/nba';
import { getDefaultReceiptEmail, sendRewardReceipt } from '@/lib/send-reward-receipt';

export function RewardsCard() {
  const [points, setPoints] = useState<number>(REWARDS.startingPoints);
  const [receiptEmail, setReceiptEmail] = useState(getDefaultReceiptEmail());
  const [emailDraft, setEmailDraft] = useState(receiptEmail);
  const [pendingItem, setPendingItem] = useState<RewardItem | null>(null);
  const [emailModalVisible, setEmailModalVisible] = useState(false);

  const runRedeem = async (item: RewardItem, email: string) => {
    if (points < item.costPoints) {
      Alert.alert(
        'Not enough points',
        `You need ${formatPoints(item.costPoints)} points to redeem ${item.title}. You have ${formatPoints(points)}.`,
      );
      return;
    }

    const balanceBefore = points;
    const balanceAfter = points - item.costPoints;
    setPoints(balanceAfter);

    try {
      await sendRewardReceipt(
        {
          item,
          pointsSpent: item.costPoints,
          balanceBefore,
          balanceAfter,
          redeemedAt: new Date(),
        },
        email,
      );
      Alert.alert(
        'Redeemed!',
        `${formatPoints(item.costPoints)} points deducted. Check your mail app for the receipt.`,
      );
    } catch (error) {
      // Points already deducted — still confirm, and note the email failure.
      console.warn('Receipt email failed:', error);
      Alert.alert(
        'Redeemed',
        `${formatPoints(item.costPoints)} points deducted, but we couldn't open your mail app. Receipt was for ${email}.`,
      );
    }
  };

  const onPressRedeem = (item: RewardItem) => {
    if (points < item.costPoints) {
      Alert.alert(
        'Not enough points',
        `You need ${formatPoints(item.costPoints)} points to redeem ${item.title}. You have ${formatPoints(points)}.`,
      );
      return;
    }

    if (receiptEmail) {
      void runRedeem(item, receiptEmail);
      return;
    }

    setPendingItem(item);
    setEmailDraft('');
    setEmailModalVisible(true);
  };

  const confirmEmailAndRedeem = () => {
    const email = emailDraft.trim();
    if (!email.includes('@')) {
      Alert.alert('Invalid email', 'Enter a valid email for your receipt.');
      return;
    }
    setReceiptEmail(email);
    setEmailModalVisible(false);
    if (pendingItem) {
      void runRedeem(pendingItem, email);
      setPendingItem(null);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Ionicons name="basketball" size={18} color={Snap.yellow} />
        <Text style={styles.title}>Snap Rewards</Text>
      </View>

      <View style={styles.pointsRow}>
        <View style={styles.pointsLeft}>
          <View style={styles.pointsValueRow}>
            <Ionicons name="star" size={20} color={Snap.yellow} />
            <Text style={styles.pointsValue}>{formatPoints(points)}</Text>
          </View>
          <Text style={styles.pointsLabel}>Snap Points</Text>
        </View>
        <View style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View My Rewards</Text>
          <Ionicons name="chevron-forward" size={14} color={Snap.background} />
        </View>
      </View>

      <View style={styles.itemsRow}>
        {REWARDS.items.map((item) => {
          const canAfford = points >= item.costPoints;
          return (
            <View key={item.id} style={styles.item}>
              <Image source={{ uri: item.image }} style={styles.itemImage} contentFit="cover" />
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
              <View style={styles.itemCostRow}>
                <Ionicons name="star" size={12} color={Snap.yellow} />
                <Text style={styles.itemCost}>{formatPoints(item.costPoints)}</Text>
              </View>
              <Pressable
                style={[styles.redeemButton, !canAfford && styles.redeemButtonDisabled]}
                onPress={() => onPressRedeem(item)}>
                <Text style={styles.redeemButtonText}>Redeem</Text>
              </Pressable>
            </View>
          );
        })}
      </View>

      <Pressable style={styles.moreRow}>
        <Text style={styles.moreText}>More rewards coming soon 🔥</Text>
        <Ionicons name="chevron-forward" size={16} color={Snap.textSecondary} />
      </Pressable>

      <Modal
        visible={emailModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEmailModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setEmailModalVisible(false)}>
          <Pressable style={styles.modalSheet} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>Send receipt</Text>
            <Text style={styles.modalBody}>
              Enter the email where we should send your redemption receipt.
            </Text>
            <TextInput
              value={emailDraft}
              onChangeText={setEmailDraft}
              placeholder="you@email.com"
              placeholderTextColor={Snap.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.emailInput}
            />
            <Pressable style={styles.modalPrimary} onPress={confirmEmailAndRedeem}>
              <Text style={styles.modalPrimaryText}>Redeem &amp; email receipt</Text>
            </Pressable>
            <Pressable
              style={styles.modalCancel}
              onPress={() => {
                setEmailModalVisible(false);
                setPendingItem(null);
              }}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Snap.card,
    borderRadius: 18,
    marginHorizontal: 16,
    padding: 16,
    gap: 14,
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
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pointsLeft: {
    gap: 2,
  },
  pointsValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pointsValue: {
    color: Snap.text,
    fontSize: 24,
    fontWeight: '800',
  },
  pointsLabel: {
    color: Snap.textSecondary,
    fontSize: 12,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Snap.yellow,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  viewButtonText: {
    color: Snap.background,
    fontSize: 13,
    fontWeight: '700',
  },
  itemsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  item: {
    flex: 1,
    backgroundColor: Snap.cardElevated,
    borderRadius: 14,
    padding: 10,
    gap: 4,
  },
  itemImage: {
    width: '100%',
    height: 70,
    borderRadius: 10,
    backgroundColor: Snap.bubble,
    marginBottom: 4,
  },
  itemTitle: {
    color: Snap.text,
    fontSize: 13,
    fontWeight: '700',
  },
  itemSubtitle: {
    color: Snap.textSecondary,
    fontSize: 11,
  },
  itemCostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  itemCost: {
    color: Snap.text,
    fontSize: 11,
    fontWeight: '600',
  },
  redeemButton: {
    marginTop: 8,
    backgroundColor: Snap.yellow,
    borderRadius: 14,
    paddingVertical: 8,
    alignItems: 'center',
  },
  redeemButtonDisabled: {
    opacity: 0.4,
  },
  redeemButtonText: {
    color: Snap.background,
    fontSize: 12,
    fontWeight: '800',
  },
  moreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  moreText: {
    color: Snap.textSecondary,
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalSheet: {
    backgroundColor: Snap.cardElevated,
    borderRadius: 18,
    padding: 20,
    gap: 12,
  },
  modalTitle: {
    color: Snap.text,
    fontSize: 18,
    fontWeight: '800',
  },
  modalBody: {
    color: Snap.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  emailInput: {
    backgroundColor: Snap.bubble,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Snap.text,
    fontSize: 15,
  },
  modalPrimary: {
    backgroundColor: Snap.yellow,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalPrimaryText: {
    color: Snap.background,
    fontSize: 14,
    fontWeight: '800',
  },
  modalCancel: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  modalCancelText: {
    color: Snap.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
});
