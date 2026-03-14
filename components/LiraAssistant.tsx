
import React, { useState, useEffect, useRef } from 'react';
import { createLiraChat, identifySmartphone } from '../services/geminiService';
import { Chat, GenerateContentResponse } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  onAddPhone: (name: string) => void;
  lang: 'pt' | 'en' | 'es';
}

interface Message {
  role: 'user' | 'model';
  text: string;
  image?: string;
}

const translations = {
  pt: {
    welcome: 'Olá! Sou **Lira**, sua consultora técnica. Como consultora oficial, todos os dados que forneço seguem padrões de homologação.\n\nComo posso te chamar?',
    active: "Consultoria Ativa",
    photoTip: "Identificar por foto",
    placeholder: "Responda a Lira...",
    processing: "Processando...",
    compare: "+ Comparar"
  },
  en: {
    welcome: 'Hello! I am **Lira**, your technical consultant. As an official consultant, all data I provide follows homologation standards.\n\nHow can I call you?',
    active: "Active Consulting",
    photoTip: "Identify by photo",
    placeholder: "Reply to Lira...",
    processing: "Processing...",
    compare: "+ Compare"
  },
  es: {
    welcome: '¡Hola! Soy **Lira**, tu consultora técnica. Como consultora oficial, todos los datos que proporciono siguen estándares de homologación.\n\n¿Cómo puedo llamarte?',
    active: "Consultoría Activa",
    photoTip: "Identificar por foto",
    placeholder: "Responde a Lira...",
    processing: "Processing...",
    compare: "+ Compare"
  }
};

const LiraAssistant: React.FC<Props> = ({ onAddPhone, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[lang];

  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: t.welcome }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatInstance, setChatInstance] = useState<Chat | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ data: string; mime: string } | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !chatInstance) {
      setChatInstance(createLiraChat());
    }
  }, [isOpen, chatInstance]);

  useEffect(() => {
    if (scrollRef.current && messages.length > 1) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'model') {
      setMessages([{ role: 'model', text: t.welcome }]);
    }
  }, [lang]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setSelectedImage({
        data: base64String,
        mime: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!input.trim() && !selectedImage) || loading || !chatInstance) return;

    const userText = input.trim();
    const imageToProcess = selectedImage;
    
    setInput('');
    setSelectedImage(null);
    setMessages(prev => [...prev, { 
      role: 'user', 
      text: userText || (lang === 'pt' ? "Análise técnica deste dispositivo." : "Technical analysis."),
      image: imageToProcess ? `data:${imageToProcess.mime};base64,${imageToProcess.data}` : undefined
    }]);
    setLoading(true);

    try {
      let finalPrompt = userText;
      if (imageToProcess) {
        const identifiedModel = await identifySmartphone(imageToProcess.data, imageToProcess.mime);
        finalPrompt = `O usuário enviou uma imagem. O modelo identificado é [[${identifiedModel}]]. Comentário adicional: ${userText || 'Nenhum'}. Responda em Markdown. Use negrito para termos técnicos e listas para especificações. Responda em ${lang === 'pt' ? 'Português' : 'Inglês'}.`;
      } else {
        finalPrompt = userText;
      }

      const response: GenerateContentResponse = await chatInstance.sendMessage({ message: finalPrompt });
      setMessages(prev => [...prev, { role: 'model', text: response.text || "..." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'Ocorreu um erro na conexão.' }]);
    } finally {
      setLoading(false);
    }
  };

  const extractRecommendations = (text: string) => {
    const regex = /\[\[(.*?)\]\]/g;
    const matches = [...text.matchAll(regex)];
    return Array.from(new Set(matches.map(m => m[1])));
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[1000] flex flex-col items-end pointer-events-none">
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] md:w-[420px] h-auto max-h-[calc(100vh-140px)] md:h-[600px] mb-4 hyper-card flex flex-col shadow-2xl animate-fade-in-up border-[#FF6900]/20 pointer-events-auto overflow-hidden">
          {/* Header - Mais robusto */}
          <div className="shrink-0 p-4 md:p-5 orange-gradient flex items-center justify-between shadow-lg z-20 relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </div>
              <div className="flex flex-col">
                <h4 className="text-white font-bold text-sm md:text-base tracking-tight leading-none">Lira</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">{t.active}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Chat Area - Aumentado pt-10 para evitar corte da primeira bolha */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto bg-[var(--bg-main)]/30 custom-scrollbar relative">
            <div className="p-4 pt-10 pb-8 space-y-8">
              {messages.map((msg, i) => {
                const recs = msg.role === 'model' ? extractRecommendations(msg.text) : [];
                const cleanText = msg.text.replace(/\[\[(.*?)\]\]/g, '**$1**');

                return (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}>
                    {msg.image && (
                      <div className="mb-2 max-w-[70%] rounded-xl overflow-hidden shadow-md border-2 border-white">
                        <img src={msg.image} alt="Upload" className="w-full h-auto" />
                      </div>
                    )}
                    <div className={`max-w-[92%] p-4 rounded-2xl text-xs md:text-[13px] leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                      ? 'bg-[#FF6900] text-white rounded-tr-none font-medium' 
                      : 'bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-tl-none border border-[var(--border-color)]'
                    }`}>
                      {msg.role === 'model' ? (
                        <div className="markdown-content">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanText}</ReactMarkdown>
                        </div>
                      ) : (
                        msg.text
                      )}
                    </div>
                    {recs.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {recs.map((rec, j) => (
                          <button
                            key={j}
                            onClick={() => onAddPhone(rec)}
                            className="px-4 py-2.5 bg-white border border-[#FF6900] text-[#FF6900] rounded-xl text-[10px] font-black uppercase tracking-tight hover:bg-[#FF6900] hover:text-white transition-all shadow-lg active:scale-95"
                          >
                            {t.compare} {rec}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {loading && (
                <div className="flex items-start">
                  <div className="bg-[var(--bg-surface)] p-3 rounded-2xl rounded-tl-none border border-[var(--border-color)]">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-[#FF6900] rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-[#FF6900] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-[#FF6900] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="shrink-0 p-4 bg-[var(--bg-surface)] border-t border-[var(--border-color)] shadow-inner">
            {selectedImage && (
              <div className="mb-3 relative inline-block group">
                <img src={`data:${selectedImage.mime};base64,${selectedImage.data}`} className="w-16 h-16 object-cover rounded-lg border-2 border-[#FF6900] shadow-lg" alt="Preview" />
                <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            )}
            <form onSubmit={handleSend} className="relative flex items-center gap-2">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-zinc-400 hover:text-[#FF6900] bg-zinc-50 dark:bg-zinc-900 rounded-xl transition-all border border-transparent hover:border-[#FF6900]/20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.placeholder}
                  className="w-full h-12 pl-4 pr-12 hyper-input rounded-xl text-sm font-medium focus:ring-1 focus:ring-[#FF6900]/30"
                  disabled={loading}
                />
                <button type="submit" disabled={loading || (!input.trim() && !selectedImage)} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#FF6900] disabled:opacity-30 p-2 hover:bg-[#FF6900]/10 rounded-lg transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 md:w-16 md:h-16 orange-gradient rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-90 relative pointer-events-auto ${isOpen ? 'rotate-90' : ''}`}
      >
        {isOpen ? (
          <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <div className="relative">
            <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-[#FF6900] rounded-full shadow-lg animate-pulse"></span>
          </div>
        )}
      </button>
    </div>
  );
};

export default LiraAssistant;
