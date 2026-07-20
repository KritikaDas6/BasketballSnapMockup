/**
 * OpenAI chat completions helper (adapted from the course getChatGPT util).
 * API key comes from EXPO_PUBLIC_OPENAI_API_KEY — never hardcode secrets in source.
 */

type OpenAIMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type OpenAIChoice = {
  message?: { role?: string; content?: string };
};

type OpenAIResponse = {
  choices?: OpenAIChoice[];
  error?: { message?: string };
};

export async function getChat(messages: OpenAIMessage[]): Promise<OpenAIResponse> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  if (!apiKey) {
    return {
      error: {
        message:
          'Missing EXPO_PUBLIC_OPENAI_API_KEY. Copy .env.example to .env and add your key.',
      },
    };
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1-nano',
      messages,
      temperature: 0.85,
      top_p: 1,
      n: 1,
      stream: false,
      max_tokens: 120,
      presence_penalty: 0,
      frequency_penalty: 0.2,
    }),
  });

  return (await response.json()) as OpenAIResponse;
}
