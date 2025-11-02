export enum MessageRole {
  USER = 'user',
  BOT = 'bot',
  SYSTEM = 'system',
}

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export type Language = 'en' | 'es';
