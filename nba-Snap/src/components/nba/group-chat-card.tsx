import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { JA_MORANT, Snap } from '@/constants/nba';
import { useChat } from '@/context/chat-context';

const SENDER_COLORS: Record<string, string> = {
  'Ja Morant': Snap.blue,
  You: Snap.red,
  Fan: Snap.green,
};

export function GroupChatCard() {
  const { messages, remainingMessages, isLocked } = useChat();
  const preview = messages.slice(0, 3);

  return (
    <Pressable style={styles.card} onPress={() => router.push('/chat')}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Group Chat</Text>
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        </View>
        <Ionicons name="ellipsis-horizontal" size={20} color={Snap.textSecondary} />
      </View>
      <Text style={styles.subtitle}>Chat with Ja Morant and other NBA fans</Text>

      <View style={styles.previewRow}>
        <Image source={JA_MORANT.headshot} style={styles.avatar} contentFit="cover" />
        <View style={styles.bubbles}>
          {preview.map((message) => (
            <View key={message.id} style={styles.bubbleLine}>
              <Text style={[styles.sender, { color: SENDER_COLORS[message.sender] ?? Snap.text }]}>
                {message.sender}
              </Text>
              <Text style={styles.bubbleText} numberOfLines={1}>
                {message.text}
              </Text>
              <Text style={styles.timestamp}>{message.timestamp}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.memberRow}>
        <View style={styles.memberNameRow}>
          <Text style={styles.memberName}>Ja Morant</Text>
          <Ionicons name="checkmark-circle" size={14} color={Snap.yellow} />
        </View>
        <Text style={styles.memberTeam}>{JA_MORANT.team}</Text>
      </View>

      <View style={styles.limitPill}>
        <Ionicons name="chatbubble-ellipses" size={16} color={Snap.yellow} />
        <Text style={styles.limitText} numberOfLines={1}>
          {isLocked
            ? 'Free messages used — upgrade to Snap+'
            : `${remainingMessages} message${remainingMessages === 1 ? '' : 's'} remaining — upgrade to Snap+`}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={Snap.yellow} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Snap.card,
    borderRadius: 18,
    marginHorizontal: 16,
    padding: 16,
    gap: 12,
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
    fontSize: 17,
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
    fontSize: 13,
  },
  previewRow: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Snap.cardElevated,
  },
  bubbles: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  bubbleLine: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    flexWrap: 'nowrap',
  },
  sender: {
    fontSize: 12,
    fontWeight: '700',
  },
  bubbleText: {
    color: Snap.text,
    fontSize: 12,
    flexShrink: 1,
  },
  timestamp: {
    color: Snap.textSecondary,
    fontSize: 10,
    marginLeft: 'auto',
  },
  memberRow: {
    gap: 2,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  memberName: {
    color: Snap.text,
    fontSize: 14,
    fontWeight: '700',
  },
  memberTeam: {
    color: Snap.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  limitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: Snap.yellow,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  limitText: {
    flex: 1,
    color: Snap.yellow,
    fontSize: 12,
    fontWeight: '700',
  },
});
