
import React, { useState, useEffect } from 'react';
import { Smartphone } from './types';
import { fetchSmartphoneSpecs } from './services/geminiService';
import ComparisonTable from './components/ComparisonTable';
import RankingSidebar from './components/RankingSidebar';
import ComparisonHero from './components/ComparisonHero';
import LiraAssistant from './components/LiraAssistant';

type Language = 'pt' | 'en' | 'es';

const translations = {

  pt: {
    officialStore: "Loja Oficial",
    labDirective: "Protocolo de Hardware",
    reportTitle: "Analytics SmartCompare",
    reportSub: "Análise de Fluxo Térmico e Ciclos | Estável 2026",
    newScan: "Redefinir Scan",
    footerMadeBy: "desenvolvido com ☕ e ❤️ por",
    engine: "Neural Core",
    neuralArch: "Arquitetura Neural | Real-Time Search Grounding | Stable 03.26",
    limitReached: "Capacidade máxima de 3 dispositivos atingida.",
    alreadyExists: "Este modelo já se encontra na lista de comparação.",
    searchError: "Dados técnicos não localizados para",
    connError: "Falha de conexão com a base neural de especificações.",
    heroTitle: "Compare os Modelos",
    heroSub: "Laboratório de Análise Térmica e Sincronização de Especificações"
  },
  en: {
    officialStore: "Official Store",
    labDirective: "Hardware Protocol",
    reportTitle: "SmartCompare Analytics",
    reportSub: "Thermal Flow and Cycle Analysis | Stable 2026",
    newScan: "Reset Scan",
    footerMadeBy: "developed with ☕ and ❤️ by",
    engine: "Neural Core",
    neuralArch: "Neural Architecture | Real-Time Search Grounding | Stable 03.26",
    limitReached: "Maximum capacity of 3 devices reached.",
    alreadyExists: "This model is already in the comparison list.",
    searchError: "Technical data not found for",
    connError: "Connection failure with the neural specifications base.",
    heroTitle: "Compare Models",
    heroSub: "Thermal Analysis Lab & Specifications Synchronization"
  },
  es: {
    officialStore: "Tienda Oficial",
    labDirective: "Protocolo de Hardware",
    reportTitle: "Analytics SmartCompare",
    reportSub: "Análisis de Ciclos y Flujo Térmico | Estable 2026",
    newScan: "Reiniciar Escaneo",
    footerMadeBy: "desarrollado con ☕ y ❤️ por",
    engine: "Neural Core",
    neuralArch: "Arquitectura Neural | Real-Time Search Grounding | Estable 03.26",
    limitReached: "Capacidad máxima de 3 dispositivos alcanzada.",
    alreadyExists: "Este modelo ya está en la lista de comparación.",
    searchError: "No se encontraron datos técnicos para",
    connError: "Error de conexión con la base neuronal de especificaciones.",
    heroTitle: "Comparar Modelos",
    heroSub: "Laboratorio de Análisis Térmico y Sincronización de Especificaciones"
  }
};

const FlagBR = () => (
  <svg viewBox="0 0 512 512" className="w-6 h-6 rounded-full shadow-sm">
    <path fill="#43a047" d="M0 0h512v512H0z"/><path fill="#ffeb3b" d="M256 55.7l200.3 200.3-200.3 200.3L55.7 256z"/><circle fill="#3949ab" cx="256" cy="256" r="105.9"/><path fill="#fff" d="M152.4 239s33.7-14.8 103.6-14.8c69.8 0 103.6 14.8 103.6 14.8v10.1s-33.7-14.8-103.6-14.8c-69.8 0-103.6 14.8-103.6 14.8v-10.1z"/>
  </svg>
);

const FlagUS = () => (
  <svg viewBox="0 0 512 512" className="w-6 h-6 rounded-full shadow-sm">
    <path fill="#eee" d="M0 0h512v512H0z"/><path fill="#d32f2f" d="M0 39.4h512v39.4H0zm0 118.2h512v39.4H0zm0 78.8h512v39.4H0zm0 78.8h512v39.4H0zm0 78.8h512v39.4H0zm0 78.8h512v39.4H0z"/><path fill="#303f9f" d="M0 0h280.1v275.7H0z"/><path fill="#eee" d="M37.8 28l11.5 35.3h37.1l-30 21.8 11.5 35.3-30-21.8-30 21.8 11.5-35.3-30-21.8h37.1zm84.4 0l11.5 35.3h37.1l-30 21.8 11.5 35.3-30-21.8-30 21.8 11.5-35.3-30-21.8h37.1zm84.4 0l11.5 35.3h37.1l-30 21.8 11.5 35.3-30-21.8-30 21.8 11.5-35.3-30-21.8h37.1zm-126.6 84.4l11.5 35.3h37.1l-30 21.8 11.5 35.3-30-21.8-30 21.8 11.5-35.3-30-21.8h37.1zm84.4 0l11.5 35.3h37.1l-30 21.8 11.5 35.3-30-21.8-30 21.8 11.5-35.3-30-21.8h37.1zm-42.2 84.4l11.5 35.3h37.1l-30 21.8 11.5 35.3-30-21.8-30 21.8 11.5-35.3-30-21.8h37.1z"/>
  </svg>
);

const FlagES = () => (
  <svg viewBox="0 0 512 512" className="w-6 h-6 rounded-full shadow-sm">
    <path fill="#ffeb3b" d="M0 128h512v256H0z"/><path fill="#d32f2f" d="M0 0h512v128H0zm0 384h512v128H0z"/><path fill="#d32f2f" d="M125.1 198.3l11.5 11.5-11.5 11.5-11.5-11.5z"/><path fill="#303f9f" d="M110.1 200.3h30v111.4h-30z"/>
  </svg>
);

const CompareLogoIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
    <circle cx="50" cy="50" r="48" fill="white" />
    <path d="M25 40 L12 40 L25 27 M12 40 L25 53" stroke="#FF6900" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 40 H45 C58 40 58 68 45 68 H18" stroke="#FF6900" strokeWidth="8" strokeLinecap="round" />
    <path d="M75 60 L88 60 L75 73 M88 60 L75 47" stroke="#333" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M88 60 H55 C42 60 42 32 55 32 H82" stroke="#333" strokeWidth="8" strokeLinecap="round" />
  </svg>
);

const App: React.FC = () => {
  const [phones, setPhones] = useState<Smartphone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<Language>('pt');

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleReset = () => {
    setPhones([]);
    setError(null);
    setLoading(false);
  };

  const handleAddPhone = async (name: string) => {
    if (phones.length >= 3) {
      setError(t.limitReached);
      return;
    }
    
    const nameLower = name.toLowerCase().trim();
    if (phones.some(p => p.model.toLowerCase().includes(nameLower) || nameLower.includes(p.model.toLowerCase()))) {
      setError(t.alreadyExists);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const newPhone = await fetchSmartphoneSpecs(name);
      if (newPhone) {
        setPhones(prev => [...prev, newPhone]);
      } else {
        setError(`${t.searchError} "${name}".`);
      }
    } catch (e) {
      setError(t.connError);
    } finally {
      setLoading(false);
    }
  };

  const removePhone = (id: string) => {
    setPhones(prev => prev.filter(p => p.id !== id));
  };

  const focusSearch = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-700">
      {/* Header Premium - Responsivo */}
      <nav className="sticky top-0 z-100 backdrop-blur-3xl bg-(--bg-glass) border-b border-(--border-color)">
        <div className="max-w-[1536px] mx-auto px-4 md:px-16 h-20 md:h-28 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-6 cursor-pointer hyper-button group" onClick={handleReset}>
            <div className="w-10 h-10 md:w-16 md:h-16 orange-gradient rounded-xl md:rounded-3xl flex items-center justify-center p-1.5 shadow-2xl group-hover:scale-105 transition-all">
              <CompareLogoIcon />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl font-black tracking-tighter text-(--text-primary) leading-none uppercase italic">
                SmartCompare
              </span>
              <span className="text-[8px] md:text-[12px] font-black text-[#FF6900] tracking-[0.5em] mt-1 md:mt-2 opacity-90 uppercase">
                Technical Lab
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <div className="flex items-center bg-(--bg-main)/50 rounded-2xl p-1 border border-(--border-color)">
              <button 
                onClick={() => setLang('pt')} 
                className={`w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl flex items-center justify-center transition-all ${lang === 'pt' ? 'bg-[#FF6900] shadow-lg scale-105' : 'hover:bg-(--border-color) opacity-50 hover:opacity-100'}`}
              >
                <FlagBR />
              </button>
              <button 
                onClick={() => setLang('en')} 
                className={`w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl flex items-center justify-center transition-all ${lang === 'en' ? 'bg-[#FF6900] shadow-lg scale-105' : 'hover:bg-(--border-color) opacity-50 hover:opacity-100'}`}
              >
                <FlagUS />
              </button>
              <button 
                onClick={() => setLang('es')} 
                className={`w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl flex items-center justify-center transition-all ${lang === 'es' ? 'bg-[#FF6900] shadow-lg scale-105' : 'hover:bg-(--border-color) opacity-50 hover:opacity-100'}`}
              >
                <FlagES />
              </button>
            </div>

            <button 
              onClick={toggleTheme}
              className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center border border-(--border-color) text-(--text-primary) hover:bg-(--accent-glow) transition-all shadow-sm"
            >
              {theme === 'dark' ? (
                 <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      <ComparisonHero 
        phones={phones} 
        onSearch={handleAddPhone} 
        onRemove={removePhone}
        loading={loading}
        lang={lang}
      />

      <main className="flex-1 max-w-[1536px] mx-auto w-full px-4 md:px-16 py-8 md:py-32 space-y-16 md:space-y-32">
        {loading && (
          <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-3xl z-200 flex items-center justify-center p-8">
            <div className="flex flex-col items-center gap-10">
              <div className="relative w-32 h-32 md:w-40 md:h-40">
                <div className="absolute inset-0 border-8 md:border-12 border-white/5 rounded-full"></div>
                <div className="absolute inset-0 border-8 md:border-12 border-[#FF6900] border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-[#FF6900] font-black text-3xl md:text-5xl tracking-tighter uppercase italic animate-pulse">Neural Extraction</p>
                <p className="text-white/40 text-[8px] md:text-[10px] font-black uppercase tracking-[0.8em]">Sincronizando...</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-4xl mx-auto p-6 md:p-8 bg-red-500/10 text-red-500 rounded-2xl md:rounded-[2.5rem] border border-red-500/20 flex items-center justify-between backdrop-blur-2xl animate-fade-in-up">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-red-500 rounded-xl flex items-center justify-center text-white">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Error</span>
                <span className="text-sm md:text-base font-bold uppercase tracking-widest leading-tight">{error}</span>
              </div>
            </div>
            <button onClick={() => setError(null)} className="w-10 h-10 flex items-center justify-center hover:bg-red-500/20 rounded-full transition-colors text-2xl font-bold">&times;</button>
          </div>
        )}

        <div id="comparison-results" className="flex flex-col xl:flex-row gap-12 md:gap-40 items-start scroll-mt-32">
          <div className="flex-1 min-w-0 w-full overflow-hidden">
            <div className="hyper-card overflow-hidden">
              <div className="p-6 md:p-20 border-b border-(--border-color) flex flex-col md:flex-row md:items-center justify-between gap-8 bg-(--bg-glass)">
                <div className="space-y-2 md:space-y-4">
                  <h2 className="text-3xl md:text-6xl font-black text-(--text-primary) tracking-tighter uppercase leading-none italic">{t.reportTitle}</h2>
                  <p className="text-[10px] md:text-[11px] text-[#FF6900] font-black tracking-[0.4em] md:tracking-[0.6em] uppercase opacity-90">{t.reportSub}</p>
                </div>
                {phones.length > 0 && (
                  <button 
                    onClick={focusSearch}
                    className="px-8 md:px-10 py-4 md:py-5 bg-zinc-950 text-white rounded-3xl md:rounded-4xl text-[10px] md:text-xs font-black uppercase tracking-[0.3em] hover:bg-[#FF6900] transition-all shadow-2xl"
                  >
                    {t.newScan}
                  </button>
                )}
              </div>
              <div className="overflow-x-auto custom-scrollbar-h">
                <ComparisonTable 
                  phones={phones} 
                  onRemove={removePhone} 
                  onAddClick={focusSearch}
                  lang={lang}
                />
              </div>
            </div>
          </div>

          <aside className="w-full xl:w-[480px] space-y-12 md:space-y-16 shrink-0">
            <RankingSidebar phones={phones} lang={lang} />
            
            <div className="hyper-card p-8 md:p-14 bg-(--bg-surface) border-(--border-color) text-(--text-primary) relative overflow-hidden group shadow-3xl rounded-4xl md:rounded-[3rem]">
               <div className="absolute -top-10 -right-10 w-80 h-80 bg-[#FF6900] rounded-full blur-[140px] opacity-10 group-hover:opacity-20 transition-all duration-1000"></div>
               <div className="relative z-10">
                <div className="flex items-center gap-3 md:gap-5 mb-6 md:mb-10">
                  <div className="w-2 md:w-3 h-8 md:h-10 bg-[#FF6900] rounded-full"></div>
                  <h4 className="text-[#FF6900] text-[10px] md:text-xs font-black uppercase tracking-[0.4em] md:tracking-[0.6em]">{t.labDirective}</h4>
                </div>
                <p className="text-lg md:text-2xl text-(--text-primary) leading-relaxed font-bold italic opacity-90 group-hover:opacity-100 transition-opacity">
                  {lang === 'pt' ? '"O benchmark de 2026 prioriza a estabilidade do FPS sustentado sobre o pico de performance de 5 segundos."' : 
                   lang === 'en' ? '"The 2026 benchmark prioritizes sustained FPS stability over the 5-second peak performance."' :
                   '"El benchmark de 2026 prioriza la estabilidad del FPS sostenido sobre el pico de rendimiento de 5 segundos."'}
                </p>
               </div>
            </div>
          </aside>
        </div>
      </main>

      <LiraAssistant onAddPhone={handleAddPhone} lang={lang} />

      <footer className="py-20 md:py-32 border-t border-(--border-color) bg-(--bg-surface) mt-20 md:mt-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <div className="flex flex-col items-center mb-12 md:mb-20 gap-8">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="h-px w-12 md:w-20 bg-zinc-200 dark:bg-zinc-800"></div>
              <h3 className="text-xl md:text-2xl font-black text-(--text-primary) tracking-tighter uppercase italic">
                {t.engine} <span className="text-[#FF6900]">Core V3 Engine</span>
              </h3>
              <div className="h-px w-12 md:w-20 bg-zinc-200 dark:bg-zinc-800"></div>
            </div>
            <div className="inline-flex items-center gap-3 md:gap-5 px-6 md:px-12 py-3 md:py-5 bg-[--bg-main] rounded-full shadow-inner border border-[--border-color]">
               <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-green-500 animate-pulse"></div>
               <p className="text-[10px] md:text-sm font-black text-[--text-secondary] uppercase tracking-[0.2em]">
                 {t.neuralArch}
               </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2 text-[10px] md:text-[12px] font-black text-[--text-secondary] uppercase tracking-[0.2em]">
            <span className="opacity-60 whitespace-nowrap">
              © 2026 SmartCompare | {t.footerMadeBy}
            </span>
            <a 
              href="https://github.com/Rukafuu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-(--text-primary) hover:text-[#FF6900] transition-all duration-300 ease-in-out transform hover:scale-105 group tracking-normal normal-case"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
              </svg>
              <span className="text-[16px] font-black tracking-tighter border-b-2 border-transparent group-hover:border-[#FF6900] transition-all">Lucas Frischeisen</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
