import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, MessageRole, Language } from '../types';
import { BotIcon, UserIcon, SendIcon } from './icons';
import { t } from '../i18n';

interface ChatbotProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  language: Language;
}

export const Chatbot: React.FC<ChatbotProps> = ({ messages, onSendMessage, isLoading, language }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.role === MessageRole.USER;
    const isBot = message.role === MessageRole.BOT;
    const isSystem = message.role === MessageRole.SYSTEM;

    if (isSystem) {
      return (
        <div className="text-center my-4">
          <p className="text-sm text-brand-text-light bg-brand-gray px-3 py-1 rounded-full inline-block">{message.content}</p>
        </div>
      );
    }
    
    return (
        <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : ''}`}>
        {!isUser && <div className="flex-shrink-0 w-8 h-8 bg-brand-green rounded-full flex items-center justify-center text-white"><BotIcon className="w-5 h-5"/></div>}
        <div className={`p-3 rounded-xl max-w-sm md:max-w-md ${isUser ? 'bg-brand-green text-white rounded-br-none' : 'bg-brand-gray text-brand-text rounded-bl-none'}`}>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        {isUser && <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"><UserIcon className="w-5 h-5"/></div>}
        </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto pr-2 -mr-2 mb-4 h-[400px]">
        {messages.map((msg, index) => <ChatBubble key={index} message={msg} />)}
        {isLoading && (
          <div className="flex items-start gap-3 my-4">
            <div className="flex-shrink-0 w-8 h-8 bg-brand-green rounded-full flex items-center justify-center text-white"><BotIcon className="w-5 h-5"/></div>
            <div className="p-3 rounded-lg bg-brand-gray">
              <div className="flex items-center justify-center space-x-1">
                <span className="sr-only">Loading...</span>
                <div className="h-2 w-2 bg-brand-green rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-brand-green rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-brand-green rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex-shrink-0 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('askFollowUp', language)}
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-green"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-brand-green text-white rounded-full p-3 disabled:bg-gray-300 hover:bg-brand-green-dark transition-colors"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
