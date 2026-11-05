'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, X, Send, RotateCcw, ShoppingBag, Eye, Bot } from 'lucide-react';
import { Product, ColorOption } from '../lib/types';
import { formatNaira } from '../lib/utils';

interface AiChatbotProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, color: ColorOption, size: string) => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  matchedProducts?: Product[];
}

const INITIAL_PROMPTS = [
  'Recommend a look for an evening gala in Lagos',
  'How should I style the Champagne Silk Dress?',
  'Build a 3-piece quiet luxury capsule',
  'Care guide for 100% Mulberry Silk',
];

let messageCounter = 0;
function nextMessageId(prefix: string): string {
  return `${prefix}-${++messageCounter}`;
}

export const AiChatbot: React.FC<AiChatbotProps> = ({
  products,
  onQuickView,
  onAddToCart,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        'Bonjour. I am Élise, your personal atelier stylist at LUMIÈRE. Whether you are curating a capsule for private travel, seeking the perfect evening silhouette, or exploring our noble silk and virgin wool fabrics, I am here to assist you.',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Helper to find products mentioned in text
  const extractMatchingProducts = (text: string): Product[] => {
    const lower = text.toLowerCase();
    const found: Product[] = [];
    for (const p of products) {
      if (
        lower.includes(p.title.toLowerCase()) ||
        (lower.includes('silk') && lower.includes('dress') && p.category === 'Dresses') ||
        (lower.includes('trench') && p.category === 'Outerwear') ||
        (lower.includes('cashmere') && p.category === 'Tops') ||
        (lower.includes('bag') && p.category === 'Accessories')
      ) {
        if (!found.some((item) => item.id === p.id)) {
          found.push(p);
        }
      }
    }
    return found.slice(0, 2);
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: Message = {
      id: nextMessageId('user'),
      role: 'user',
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          userMessage: textToSend,
          currentCatalog: products,
        }),
      });

      const data = await response.json();
      const replyContent = data.reply || "Bonjour. How else may I assist your wardrobe today?";
      const matched = extractMatchingProducts(replyContent + ' ' + textToSend);

      const assistantMsg: Message = {
        id: nextMessageId('assistant'),
        role: 'assistant',
        content: replyContent,
        matchedProducts: matched.length > 0 ? matched : undefined,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackMsg: Message = {
        id: nextMessageId('assistant'),
        role: 'assistant',
        content:
          'Bonjour. I recommend exploring our Champagne Silk Bias Slip Dress (₦380,000) paired with our Architectural Camel Wool Trench (₦690,000) for a timeless, effortless look.',
        matchedProducts: products.slice(0, 2),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: nextMessageId('welcome'),
        role: 'assistant',
        content:
          'Bonjour. Conversation refreshed. What event or silhouette can I curate for you today?',
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3 bg-[#18181B] text-[#FAF9F6] border border-[#2B2B2F] shadow-xl hover:bg-[#27272A] transition-all duration-300"
            aria-label="Open AI Fashion Stylist"
          >
            <div className="w-6 h-6 rounded-full bg-[#C8A27C]/20 text-[#C8A27C] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <span className="block text-[11px] font-semibold tracking-[0.15em] uppercase text-white">
                Élise · AI Stylist
              </span>
              <span className="block text-[9px] text-[#A1A1AA] tracking-wider">
                Atelier Concierge
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 left-4 sm:left-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[640px] h-[82vh] bg-[#FAF9F6] border border-[#ECE6DB] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="p-4 bg-white border-b border-[#ECE6DB] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#18181B] text-[#C8A27C] flex items-center justify-center font-serif text-lg font-light border border-[#C8A27C]/40">
                É
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-base text-[#18181B] font-medium leading-none">
                    Élise
                  </h3>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[#F3EFE7] border border-[#E5DFD3] text-[#8C6D4C] uppercase tracking-wider font-semibold">
                    AI Concierge
                  </span>
                </div>
                <span className="text-[11px] text-[#71717A] tracking-wider uppercase block mt-0.5">
                  LUMIÈRE Haute Stylist · Prices in ₦
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                className="p-1.5 text-[#71717A] hover:text-[#18181B] transition-colors"
                title="Reset styling conversation"
                aria-label="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#71717A] hover:text-[#18181B] transition-colors"
                aria-label="Close stylist assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#18181B] text-white rounded-sm font-normal'
                      : 'bg-white text-[#27272A] border border-[#ECE6DB] shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>

                {/* Render Interactive Matched Product Cards if present */}
                {msg.matchedProducts && msg.matchedProducts.length > 0 && (
                  <div className="mt-2.5 w-full max-w-[95%] space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[#8C6D4C] font-semibold block">
                      Recommended Silhouettes:
                    </span>
                    {msg.matchedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="p-2.5 bg-white border border-[#E5DFD3] flex items-center justify-between gap-3 hover:border-[#18181B] transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-10 h-12 bg-[#F2EFE9] border border-[#E8E2D6] overflow-hidden shrink-0">
                            <img
                              src={p.image}
                              alt={p.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-medium text-[#18181B] truncate">
                              {p.title}
                            </h5>
                            <span className="text-xs font-semibold text-[#8C6D4C] tabular-nums block">
                              {formatNaira(p.price)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => onQuickView(p)}
                            className="p-1.5 bg-[#FAF9F6] border border-[#D4CEBF] hover:bg-white text-[#52525B] hover:text-[#18181B]"
                            title="Inspect garment"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onAddToCart(p, p.colors[0], p.sizes[0] || 'M')}
                            className="px-2.5 py-1.5 bg-[#18181B] hover:bg-[#27272A] text-white text-[10px] font-medium tracking-wider uppercase flex items-center gap-1"
                          >
                            <ShoppingBag className="w-3 h-3 text-[#C8A27C]" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[#71717A] bg-white border border-[#ECE6DB] p-3 max-w-[70%]">
                <div className="w-2 h-2 rounded-full bg-[#C8A27C] animate-pulse" />
                <span className="font-serif italic">Élise is curating your recommendation...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompts */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t border-[#ECE6DB] bg-[#F7F4EE] flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              {INITIAL_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="px-2.5 py-1 bg-white border border-[#E5DFD3] text-[10px] text-[#52525B] whitespace-nowrap hover:border-[#18181B] hover:text-[#18181B] transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <div className="p-3 bg-white border-t border-[#ECE6DB] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask Élise for styling advice, pairings, sizing..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-3 py-2 text-xs bg-[#FAF9F6] border border-[#D4CEBF] focus:outline-hidden focus:border-[#18181B] placeholder-[#A1A1AA]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 bg-[#18181B] text-[#FAF9F6] hover:bg-[#27272A] disabled:opacity-40 transition-colors"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5 text-[#C8A27C]" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
