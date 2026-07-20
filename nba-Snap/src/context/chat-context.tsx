import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { generateReply, SEED_MESSAGES, type ChatMessage } from '@/lib/chatbot';

const FREE_MESSAGE_LIMIT = 3;

type ChatContextValue = {
  messages: ChatMessage[];
  isBotTyping: boolean;
  remainingMessages: number;
  freeLimit: number;
  isLocked: boolean;
  hasSnapPlus: boolean;
  sendMessage: (text: string) => void;
  showPaywall: boolean;
  dismissPaywall: () => void;
  upgradeToSnapPlus: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>(SEED_MESSAGES);
  const [sentCount, setSentCount] = useState(0);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [hasSnapPlus, setHasSnapPlus] = useState(false);

  const remainingMessages = Math.max(0, FREE_MESSAGE_LIMIT - sentCount);
  const isLocked = !hasSnapPlus && remainingMessages <= 0;

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      if (isLocked) {
        setShowPaywall(true);
        return;
      }

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'You',
        text: trimmed,
        timestamp: 'now',
      };

      // Include the new user turn in the history we send to GPT so it has context.
      const historyWithUser = [...messages, userMessage];
      setMessages(historyWithUser);
      setSentCount((prev) => prev + 1);
      setIsBotTyping(true);

      generateReply(historyWithUser, trimmed)
        .then((replyText) => {
          setMessages((prev) => [
            ...prev,
            {
              id: `bot-${Date.now()}`,
              sender: 'Ja Morant',
              text: replyText,
              timestamp: 'now',
            },
          ]);
        })
        .finally(() => {
          setIsBotTyping(false);
        });
    },
    [isLocked, messages],
  );

  const dismissPaywall = useCallback(() => setShowPaywall(false), []);
  const upgradeToSnapPlus = useCallback(() => {
    setHasSnapPlus(true);
    setShowPaywall(false);
  }, []);

  const value = useMemo(
    () => ({
      messages,
      isBotTyping,
      remainingMessages,
      freeLimit: FREE_MESSAGE_LIMIT,
      isLocked,
      hasSnapPlus,
      sendMessage,
      showPaywall,
      dismissPaywall,
      upgradeToSnapPlus,
    }),
    [
      messages,
      isBotTyping,
      remainingMessages,
      isLocked,
      hasSnapPlus,
      sendMessage,
      showPaywall,
      dismissPaywall,
      upgradeToSnapPlus,
    ],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within a ChatProvider');
  return ctx;
}
