import { useState, useRef, useCallback, useEffect } from 'react';
import { useStore } from '../store';
import { Message } from '../types';
import ChatMessage from './ChatMessage';
import DebugInfo from './DebugInfo';

function ChatInterface() {
  const store = useStore();
  const currentSessionId = store.currentSessionId;
  const sessions = store.sessions;
  const isDebugMode = store.isDebugMode;
  const isLoading = store.isLoading;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    // Speak the last message if it's from the assistant
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant' && !isLoading) {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(lastMessage.content);
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [messages, isLoading]);

  return (
    <div className="space-y-4">
      {messages.map((message: Message) => (
        <div key={message.id} className="flex flex-col">
          <ChatMessage message={message} />
          {isDebugMode && message.debugInfo && (
            <DebugInfo debugInfo={message.debugInfo} />
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatInterface;
