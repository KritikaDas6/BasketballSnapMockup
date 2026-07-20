/**
 * Ja Morant group-chat bot — OpenAI-backed, short + on-topic replies.
 * UI / Snap+ limits stay in chat-context; this module only generates text.
 */

import { getChat } from '@/lib/get-chat-gpt';

export type ChatMessage = {
  id: string;
  sender: 'Ja Morant' | 'You' | 'Fan';
  text: string;
  timestamp: string;
};

export const SEED_MESSAGES: ChatMessage[] = [
  { id: 'seed-1', sender: 'Ja Morant', text: "What's up Snap fam! 👋", timestamp: '2m' },
  { id: 'seed-2', sender: 'You', text: "Big fan! How's the grind going? 💪", timestamp: '1m' },
  { id: 'seed-3', sender: 'Fan', text: "Let's get this W tomorrow! 🙌", timestamp: 'now' },
];

const JA_SYSTEM_PROMPT = [
  {
    role: 'system' as const,
    content: [
      'You are Ja Morant, NBA point guard for the Memphis Grizzlies, chatting with fans in a Snapchat group chat.',
      'Stay fully in character: warm, energetic, humble-hustle vibe, Memphis / Grit & Grind energy.',
      'Talk like a short text message — 1 to 2 sentences max, casual slang is fine, light emoji ok.',
      'Stay on topic: basketball, Grizzlies, training, life as a player, Snapchat/NBA Hub, or the fan conversation in this chat.',
      'If someone goes off-topic, briefly steer back to hoop / Memphis / the chat without being rude.',
      'Never break character. Never mention that you are an AI, GPT, or a chatbot.',
      'Do not invent private personal details or real-time game scores you cannot know; keep replies general and fun.',
    ].join(' '),
  },
];

const FALLBACK_REPLIES = [
  "Appreciate y'all pulling up — keep that energy! 🔥",
  'Memphis locked in. We got next 🐻',
  "That's what I'm talkin' about fam 💯",
];

function pickFallback() {
  return FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
}

function toOpenAIHistory(history: ChatMessage[]) {
  return history
    .filter((msg) => msg.sender === 'You' || msg.sender === 'Ja Morant')
    .map((msg) => ({
      role: (msg.sender === 'You' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: msg.text,
    }));
}

/**
 * Generate Ja's reply from full chat history (already including the latest user message).
 */
export async function generateReply(history: ChatMessage[], _userMessage: string): Promise<string> {
  const apiPayload = [...JA_SYSTEM_PROMPT, ...toOpenAIHistory(history)];

  try {
    const response = await getChat(apiPayload);

    if (response.error) {
      console.warn('Ja chat GPT error:', response.error.message ?? response.error);
      return pickFallback();
    }

    const content = response.choices?.[0]?.message?.content?.trim();
    if (!content) return pickFallback();
    return content;
  } catch (error) {
    console.warn('Ja chat request failed:', error);
    return pickFallback();
  }
}
