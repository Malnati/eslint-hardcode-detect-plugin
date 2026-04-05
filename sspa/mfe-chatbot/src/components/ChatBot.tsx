// sspa/mfe-chatbot/frontend/src/components/ChatBot.tsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../styles/chatbot.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface QuickOption {
  label: string;
  value: string;
}

interface BffConfig {
  greeting: string;
  quickOptions: QuickOption[];
}

const FALLBACK_GREETING = 'Olá! Como posso ajudar?';
const FALLBACK_OPTIONS: QuickOption[] = [];

const API_BASE_URL =
  typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).__CLI_PROXY_URL__
    ? String((window as unknown as Record<string, unknown>).__CLI_PROXY_URL__)
    : '';

export function ChatBot() {
  const [config, setConfig] = useState<BffConfig | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuickOptions, setShowQuickOptions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const greeting = config?.greeting || FALLBACK_GREETING;
  const quickOptions = config?.quickOptions || FALLBACK_OPTIONS;

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/config`);
        if (res.ok) {
          const data: BffConfig = await res.json();
          setConfig(data);
          setMessages([{ role: 'assistant', content: data.greeting }]);
        } else {
          setMessages([{ role: 'assistant', content: FALLBACK_GREETING }]);
        }
      } catch {
        setMessages([{ role: 'assistant', content: FALLBACK_GREETING }]);
      }
    };
    loadConfig();
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim()) return;

      const newUserMessage: Message = { role: 'user', content: userMessage.trim() };
      const updatedMessages = [...messages, newUserMessage];
      setMessages(updatedMessages);
      setInput('');
      setShowQuickOptions(false);
      setLoading(true);

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        if (apiKey.trim()) {
          headers['x-api-key'] = apiKey.trim();
        }

        const response = await fetch(`${API_BASE_URL}/v1/chat/completions`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: 'openai/gpt-4o-mini',
            messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
            temperature: 0.3,
            max_tokens: 1024,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const assistantContent =
          data?.choices?.[0]?.message?.content ||
          'Desculpe, não consegui processar sua mensagem. Tente novamente.';

        setMessages((prev) => [...prev, { role: 'assistant', content: assistantContent }]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Desculpe, ocorreu um erro de conexão. Tente novamente.',
          },
        ]);
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [apiKey, messages],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(input);
    },
    [input, sendMessage],
  );

  const handleQuickOption = useCallback(
    (value: string) => {
      sendMessage(value);
    },
    [sendMessage],
  );

  const handleNewConversation = useCallback(() => {
    setMessages([{ role: 'assistant', content: greeting }]);
    setShowQuickOptions(true);
    setInput('');
  }, [greeting]);

  return (
    <div className="chatbot-chatbot">
      <div className="chatbot-chatbot__header">
        <div className="chatbot-chatbot__header-title">
          <div className="chatbot-chatbot__logo">Chatbot</div>
          <div className="chatbot-chatbot__subtitle">Assistente Virtual</div>
        </div>
        <div className="chatbot-chatbot__header-actions">
          <button
            className="chatbot-chatbot__btn-new"
            onClick={handleNewConversation}
            title="Nova conversa"
          >
            Nova conversa
          </button>
        </div>
      </div>

      <div className="chatbot-chatbot__messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chatbot-chatbot__message chatbot-chatbot__message--${msg.role}`}
          >
            <div className="chatbot-chatbot__message-content">
              {msg.content.split('\n').map((line, lineIdx) => (
                <React.Fragment key={lineIdx}>
                  {line}
                  {lineIdx < msg.content.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chatbot-chatbot__message chatbot-chatbot__message--assistant">
            <div className="chatbot-chatbot__message-content chatbot-chatbot__typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {showQuickOptions && quickOptions.length > 0 && (
        <div className="chatbot-chatbot__quick-options">
          {quickOptions.map((opt) => (
            <button
              key={opt.value}
              className="chatbot-chatbot__quick-btn"
              onClick={() => handleQuickOption(opt.value)}
              disabled={loading}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      <form className="chatbot-chatbot__input-area" onSubmit={handleSubmit}>
        <input
          className="chatbot-chatbot__api-key-input"
          type="password"
          placeholder="API Key (x-api-key)"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          disabled={loading}
        />
        <input
          ref={inputRef}
          className="chatbot-chatbot__input"
          type="text"
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          className="chatbot-chatbot__send-btn"
          type="submit"
          disabled={loading || !input.trim()}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
