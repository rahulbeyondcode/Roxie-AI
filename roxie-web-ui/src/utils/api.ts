import { Message } from '../types';

interface ChatRequest {
  messages: Message[];
  stream?: boolean;
}

interface ChatResponse {
  id: string;
  content: string;
  role: 'assistant';
  timestamp: string;
  debugInfo?: {
    latency: number;
    jsonResponse: any;
  };
}

export const API_URL = 'http://localhost:3001/api/ask';

export async function sendMessage(messages: Message[], stream = false): Promise<ChatResponse> {
  const startTime = performance.now();
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages, stream }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  const data = await response.json();
  const latency = performance.now() - startTime;

  return {
    ...data,
    debugInfo: {
      latency,
      jsonResponse: data,
    },
  };
}

export async function* streamMessage(messages: Message[]): AsyncGenerator<ChatResponse> {
  const startTime = performance.now();
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
    },
    body: JSON.stringify({ messages, stream: true }),
  });

  if (!response.ok) {
    throw new Error('Failed to stream message');
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Failed to get reader');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    buffer += chunk;

    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.trim() === 'data: [DONE]') break;

      const data = line.replace('data: ', '');
      if (data.trim()) {
        const message = JSON.parse(data);
        const latency = performance.now() - startTime;
        yield {
          ...message,
          debugInfo: {
            latency,
            jsonResponse: message,
          },
        };
      }
    }
  }
}
