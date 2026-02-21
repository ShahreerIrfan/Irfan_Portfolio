'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  'What are Shahreer\'s skills?',
  'Tell me about his projects',
  'How can I contact him?',
  'What\'s his experience?',
];

export default function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi there! 👋 I'm Shahreer's AI assistant. Ask me anything about his skills, projects, experience, or how to get in touch!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const sendMessage = useCallback(
    async (text?: string) => {
      const msgText = (text || input).trim();
      if (!msgText || isLoading) return;

      const userMsg: Message = { role: 'user', content: msgText };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);

      try {
        // Build history for OpenAI (exclude the initial greeting)
        const history = messages.slice(1).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: msgText, history }),
        });

        const data = await res.json();

        if (res.ok) {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: data.reply },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: data.error || 'Sorry, something went wrong. Please try again.',
            },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'Network error. Please check your connection and try again.',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="ai-chat-toggle"
        aria-label={isOpen ? 'Close AI Chat' : 'Open AI Chat'}
        title="Chat with AI Assistant"
      >
        <span className="ai-chat-toggle-icon">
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <Bot className="w-6 h-6" />
              <span className="ai-chat-badge">
                <Sparkles className="w-3 h-3" />
              </span>
            </>
          )}
        </span>
      </button>

      {/* Chat Window */}
      <div
        ref={chatRef}
        className={`ai-chat-window ${isOpen ? 'ai-chat-window-open' : 'ai-chat-window-closed'}`}
      >
        {/* Header */}
        <div className="ai-chat-header">
          <div className="flex items-center gap-2">
            <div className="ai-chat-avatar">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">AI Assistant</h3>
              <p className="text-[10px] text-blue-100 opacity-80">
                Ask about Shahreer
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="ai-chat-messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`ai-chat-msg ${
                msg.role === 'user' ? 'ai-chat-msg-user' : 'ai-chat-msg-bot'
              }`}
            >
              <div
                className={`ai-chat-msg-icon ${
                  msg.role === 'user' ? 'ai-chat-msg-icon-user' : 'ai-chat-msg-icon-bot'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="w-3.5 h-3.5" />
                ) : (
                  <Bot className="w-3.5 h-3.5" />
                )}
              </div>
              <div
                className={`ai-chat-bubble ${
                  msg.role === 'user' ? 'ai-chat-bubble-user' : 'ai-chat-bubble-bot'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="ai-chat-msg ai-chat-msg-bot">
              <div className="ai-chat-msg-icon ai-chat-msg-icon-bot">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="ai-chat-bubble ai-chat-bubble-bot">
                <div className="ai-chat-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions (only show when few messages) */}
        {messages.length <= 1 && (
          <div className="ai-chat-suggestions">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="ai-chat-suggestion-btn"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="ai-chat-input-area">
          <div className="ai-chat-input-wrap">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="ai-chat-input"
              disabled={isLoading}
              maxLength={500}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="ai-chat-send-btn"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-center mt-1.5 opacity-40 dark:text-dark-text-secondary text-ms-text-secondary">
            Powered by AI · Responses may vary
          </p>
        </div>
      </div>
    </>
  );
}
