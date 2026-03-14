
import React, { useState, useRef } from 'react';
import { Smartphone } from '../types';

interface Props {
  phones: Smartphone[];
  onSearch: (name: string) => void;
  onRemove: (id: string) => void;
  loading: boolean;
  lang: 'pt' | 'en' | 'es';
}

const translations = {
  pt: {
    title: "Compare os Modelos",
    subtitle: "Laboratório de Análise de Hardware e Sincronização de Especificações",
    activate: "ATIVAR",
    locked: "BLOQUEADO",
    add: "Adicionar",
    placeholder: "Modelo...",
    confirm: "Confirmar",
    officialDL: "OFICIAL BRASIL",
    officialOther: "GARANTIA NACIONAL",
    global: "IMPORTADO / GLOBAL",
    realtime: "TEMPO REAL"
  },
  en: {
    title: "Compare Models",
    subtitle: "Hardware Analysis Lab & Specifications Sync",
    activate: "ACTIVATE",
    locked: "LOCKED",
    add: "Add Device",
    placeholder: "Model...",
    confirm: "Confirm",
    officialDL: "OFFICIAL BRAZIL",
    officialOther: "NATIONAL WARRANTY",
    global: "IMPORTED / GLOBAL",
    realtime: "REAL-TIME"
  },
  es: {
    title: "Comparar Modelos",
    subtitle: "Laboratorio de Análisis de Hardware y Sincronización de Especificaciones",
    activate: "ACTIVAR",
    locked: "BLOQUEADO",
    add: "Añadir",
    placeholder: "Modelo...",
    confirm: "Confirmar",
    officialDL: "OFFICIAL BRAZIL",
    officialOther: "GARANTÍA NACIONAL",
    global: "IMPORTADO / GLOBAL",
    realtime: "TIEMPO REAL"
  }
};

const ComparisonHero: React.FC<Props> = ({ phones, onSearch, onRemove, loading, lang }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !loading && phones.length < 3) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  return (
    <section className="w-full py-10 md:py-16 flex flex-col items-center relative overflow-hidden">
      {/* Background Gradient Fix */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-[radial-gradient(circle_at_top,_var(--accent-glow),_transparent)] pointer-events-none -z-10 opacity-30"></div>

      <div className="text-center mb-10 md:mb-14 animate-fade-in-up px-4">
        <h1 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] tracking-tighter uppercase mb-3 leading-none italic">
          {t.title.split(' ')[0]} <span className="text-[#FF6900]">{t.title.split(' ').slice(1).join(' ')}</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-[10px] md:text-sm font-bold max-w-md mx-auto text-balance opacity-60 uppercase tracking-[0.3em]">
          {t.subtitle}
        </p>
      </div>

      <div className="flex flex-row items-end justify-start md:justify-center gap-6 md:gap-12 w-full px-6 overflow-x-auto no-scrollbar pb-12 snap-x snap-mandatory">
        {[0, 1, 2].map((index) => {
          const phone = phones[index];
          const isNextSlot = index === phones.length;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center group/item transition-all duration-700 shrink-0 snap-center">
                <div className={`mb-4 md:mb-6 text-[8px] md:text-[9px] font-black uppercase tracking-[0.5em] transition-all duration-500 ${isNextSlot ? 'text-[#FF6900] opacity-100' : 'text-[var(--text-secondary)] opacity-40'}`}>
                  {phone ? `DISPOSITIVO 0${index + 1}` : isNextSlot ? t.activate : t.locked}
                </div>

                <div 
                  className={`
                    relative 
                    w-[160px] h-[320px] md:w-[200px] md:h-[400px] xl:w-[240px] xl:h-[500px]
                    flex flex-col items-center transition-all duration-700
                    ${phone 
                      ? 'scale-100 md:scale-105 z-10' 
                      : isNextSlot 
                        ? 'bg-white/50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-[var(--border-color)] shadow-inner' 
                        : 'bg-[var(--bg-surface)]/10 border-2 border-dashed border-[var(--border-color)] rounded-[2.5rem] opacity-50'
                    }
                  `}
                >
                  {phone ? (
                    <div className="relative w-full h-full flex flex-col animate-fade-in group/phone">
                      <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md px-2 py-1 rounded-full border border-[var(--border-color)] shadow-sm z-20">
                         <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                         <span className="text-[6px] md:text-[7px] font-black text-blue-500 tracking-wider uppercase">{t.realtime}</span>
                      </div>

                      <button 
                        onClick={() => onRemove(phone.id)}
                        className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-7 h-7 md:w-10 md:h-10 bg-[#ff1a1a] text-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(255,26,26,0.5)] hover:bg-[#e60000] hover:scale-110 active:scale-95 transition-all z-50 border-2 border-white"
                        title="Remover"
                      >
                        <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      
                      <div className="flex-1 w-full flex items-center justify-center p-4 md:p-6 relative">
                         <div className="w-full h-full rounded-[2rem] bg-gradient-to-b from-white/10 to-zinc-500/5 border border-white/20 backdrop-blur-3xl flex flex-col items-center justify-center shadow-2xl relative overflow-hidden transition-all duration-500 group-hover/phone:-translate-y-2 group-hover/phone:rotate-1">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6900]/5 to-white/10 opacity-50 group-hover/phone:opacity-100 transition-opacity"></div>
                            
                            <div className="relative z-10 flex flex-col items-center text-center px-4">
                               <div className="w-12 h-12 md:w-20 md:h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 md:mb-6 border border-white/10 shadow-inner group-hover/phone:scale-110 transition-transform">
                                  <span className="text-2xl md:text-4xl font-black text-[#FF6900] opacity-80 italic">{phone.brand.charAt(0)}</span>
                               </div>
                               <span className="text-[7px] md:text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em] opacity-40">{phone.brand}</span>
                               <div className="mt-4 md:mt-8 w-10 md:w-12 h-1 bg-[#FF6900]/20 rounded-full"></div>
                            </div>
                         </div>
                      </div>
                      
                      <div className="mt-2 text-center pb-6 md:pb-8 px-4">
                        <h4 className="text-[10px] md:text-sm font-black text-[var(--text-primary)] uppercase leading-tight tracking-tighter mb-2 line-clamp-1 italic">
                          {phone.model}
                        </h4>
                        <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2">
                          {phone.isAnatelCertified ? (
                             <span className="px-1.5 py-0.5 bg-[#FF6900] text-white text-[5px] md:text-[7px] font-black rounded-sm uppercase tracking-widest shadow-md border border-white/10">{t.officialDL}</span>
                          ) : (
                             <span className="px-1.5 py-0.5 bg-zinc-500/10 text-zinc-500/60 text-[5px] md:text-[7px] font-black rounded-sm uppercase tracking-widest">{t.global}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : isNextSlot ? (
                    <div className="flex-1 w-full flex flex-col items-center justify-center p-4 md:p-6 text-center">
                       <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-[#FF6900]/10 flex items-center justify-center mb-6 md:mb-8 animate-pulse">
                          <svg className="w-5 h-5 md:w-8 md:h-8 text-[#FF6900]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                          </svg>
                       </div>
                       <form onSubmit={handleSubmit} className="w-full space-y-3 md:space-y-4">
                          <input
                            ref={inputRef}
                            type="text"
                            placeholder={t.placeholder}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            disabled={loading}
                            className="w-full py-3 md:py-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl md:rounded-2xl text-center outline-none text-[10px] md:text-xs font-bold text-[var(--text-primary)] placeholder:opacity-30 focus:border-[#FF6900] transition-all shadow-inner"
                          />
                          <button 
                            type="submit"
                            className="w-full bg-[#FF6900] text-white py-3 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-[#FF6900]/30"
                          >
                            {t.confirm}
                          </button>
                       </form>
                    </div>
                  ) : (
                    <div className="flex-1 w-full flex flex-col items-center justify-center opacity-30 p-4">
                      <div className="w-8 h-8 md:w-14 md:h-14 rounded-full border-2 border-dashed border-[var(--text-secondary)] flex items-center justify-center">
                        <svg className="w-4 h-4 md:w-7 md:h-7 text-[var(--text-secondary)]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"/>
                        </svg>
                      </div>
                      <span className="mt-3 md:mt-4 text-[6px] md:text-[8px] font-black text-[var(--text-secondary)] uppercase tracking-[0.4em]">{t.locked}</span>
                    </div>
                  )}
                </div>
              </div>

              {index < 2 && (
                <div className="pb-40 md:pb-60 flex flex-col items-center justify-center px-1 shrink-0">
                  <div className="text-[#FF6900] font-black text-lg md:text-2xl select-none italic opacity-20 tracking-tighter">
                    VS
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
        {/* Final spacer for mobile scroll */}
        <div className="w-6 shrink-0 md:hidden"></div>
      </div>
    </section>
  );
};

export default ComparisonHero;
