import { Linking } from 'react-native';

import type { RewardItem } from '@/constants/nba';
import { formatPoints } from '@/constants/nba';

export type RewardReceipt = {
  item: RewardItem;
  pointsSpent: number;
  balanceBefore: number;
  balanceAfter: number;
  redeemedAt: Date;
};

/**
 * Opens the device mail app with a pre-filled redemption receipt.
 * Uses EXPO_PUBLIC_RECEIPT_EMAIL when set; otherwise `toEmail` from the UI.
 */
export async function sendRewardReceipt(receipt: RewardReceipt, toEmail: string) {
  const when = receipt.redeemedAt.toLocaleString();
  const subject = `Snap Rewards receipt — ${receipt.item.title}`;
  const body = [
    'Snap Rewards — Redemption Receipt',
    '',
    `Item: ${receipt.item.title}`,
    `Details: ${receipt.item.subtitle}`,
    `Points spent: ${formatPoints(receipt.pointsSpent)}`,
    `Balance before: ${formatPoints(receipt.balanceBefore)}`,
    `Balance after: ${formatPoints(receipt.balanceAfter)}`,
    `Redeemed at: ${when}`,
    '',
    'Thanks for redeeming with NBA x Snap!',
  ].join('\n');

  const mailto =
    `mailto:${encodeURIComponent(toEmail.trim())}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  const canOpen = await Linking.canOpenURL(mailto);
  if (!canOpen) {
    throw new Error('No mail app available on this device.');
  }
  await Linking.openURL(mailto);
}

export function getDefaultReceiptEmail() {
  return (process.env.EXPO_PUBLIC_RECEIPT_EMAIL ?? '').trim();
}
