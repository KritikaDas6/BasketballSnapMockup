import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SnapPlusModal } from '@/components/nba/snap-plus-modal';
import { JA_MORANT, Snap } from '@/constants/nba';
import { useChat } from '@/context/chat-context';
import type { ChatMessage } from '@/lib/chatbot';

const SENDER_COLORS: Record<string, string> = {
  'Ja Morant': Snap.blue,
  You: Snap.red,
  Fan: Snap.green,
};

function MessageBubble({ message }: { message: ChatMessage }) {
  const isMe = message.sender === 'You';
  return (
    <View style={[styles.messageRow, isMe && styles.messageRowMe]}>
      {!isMe && (
        <Image source={JA_MORANT.headshot} style={styles.bubbleAvatar} contentFit="cover" />
      )}
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
        {!isMe && (
          <Text style={[styles.bubbleSender, { color: SENDER_COLORS[message.sender] ?? Snap.text }]}>
            {message.sender}
          </Text>
        )}
        <Text style={styles.bubbleText}>{message.text}</Text>
        <Text style={styles.bubbleTimestamp}>{message.timestamp}</Text>
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const { messages, isBotTyping, remainingMessages, isLocked, hasSnapPlus, sendMessage } =
    useChat();
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color={Snap.text} />
        </Pressable>
        <Image source={JA_MORANT.headshot} style={styles.headerAvatar} contentFit="cover" />
        <View style={styles.headerTitleBlock}>
          <Text style={styles.headerTitle}>Group Chat</Text>
          <Text style={styles.headerSubtitle}>Ja Morant &amp; NBA fans</Text>
        </View>
        <Ionicons name="information-circle-outline" size={24} color={Snap.textSecondary} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={8}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />

        {isBotTyping && (
          <View style={styles.typingRow}>
            <Image
              source={JA_MORANT.headshot}
              style={styles.bubbleAvatar}
              contentFit="cover"
            />
            <View style={[styles.bubble, styles.bubbleOther]}>
              <Text style={styles.typingText}>Ja Morant is typing…</Text>
            </View>
          </View>
        )}

        {!hasSnapPlus && (
          <View style={styles.limitBanner}>
            <Ionicons name="chatbubble-ellipses" size={14} color={Snap.yellow} />
            <Text style={styles.limitBannerText}>
              {isLocked
                ? 'No free messages left — upgrade to Snap+ to keep chatting'
                : `${remainingMessages} free message${remainingMessages === 1 ? '' : 's'} remaining`}
            </Text>
          </View>
        )}

        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Send a message…"
            placeholderTextColor={Snap.textSecondary}
            style={styles.input}
            multiline
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <Pressable style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="send" size={18} color={Snap.background} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      <SnapPlusModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Snap.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Snap.border,
  },
  backButton: {
    padding: 4,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Snap.cardElevated,
  },
  headerTitleBlock: {
    flex: 1,
  },
  headerTitle: {
    color: Snap.text,
    fontSize: 15,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: Snap.textSecondary,
    fontSize: 11,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  bubbleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Snap.cardElevated,
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 2,
  },
  bubbleOther: {
    backgroundColor: Snap.bubble,
    borderTopLeftRadius: 4,
  },
  bubbleMe: {
    backgroundColor: Snap.blue,
    borderTopRightRadius: 4,
  },
  bubbleSender: {
    fontSize: 11,
    fontWeight: '700',
  },
  bubbleText: {
    color: Snap.text,
    fontSize: 14,
    lineHeight: 19,
  },
  bubbleTimestamp: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    alignSelf: 'flex-end',
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 6,
  },
  typingText: {
    color: Snap.textSecondary,
    fontSize: 12,
    fontStyle: 'italic',
  },
  limitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    backgroundColor: Snap.card,
  },
  limitBannerText: {
    color: Snap.yellow,
    fontSize: 12,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Snap.border,
  },
  input: {
    flex: 1,
    color: Snap.text,
    backgroundColor: Snap.cardElevated,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Snap.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
