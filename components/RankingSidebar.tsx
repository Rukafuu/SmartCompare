
import React from 'react';
import { Smartphone } from '../types';

interface Props {
  phones: Smartphone[];
  lang: 'pt' | 'en' | 'es';
}

const translations = {
  pt: {
    status: "Status",
    waiting: "Aguardando dados...",
    topPerf: "Top Performance",
    king: "Rei do Desempenho",
    autonomy: "Maior Autonomia"
  },
  en: {
    status: "Status",
    waiting: "Awaiting data...",
    topPerf: "Top Performance",
    king: "Performance King",
    autonomy: "Best Battery Life"
  },
  es: {
    status: "Estado",
    waiting: "Esperando datos...",
    topPerf: "Top Rendimiento",
    king: "Rey del Rendimiento",
    autonomy: "Mayor Autonomía"
  }
};

const RankingSidebar: React.FC<Props> = ({ phones, lang }) => {
  const t = translations[lang];

  if (phones.length === 0) return (
    <div className="hyper-card p-8">
      <h3 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-6">{t.status}</h3>
      <div className="flex items-center gap-4 text-[var(--text-secondary)]">
        <div className="w-8 h-8 rounded-full border border-[var(--border-color)] flex items-center justify-center">
          <span className="animate-pulse w-2 h-2 rounded-full bg-[var(--text-secondary)]"></span>
        </div>
        <p className="text-xs uppercase tracking-wide">{t.waiting}</p>
      </div>
    </div>
  );

  const findBest = (criterion: string, type: 'max' | 'min' = 'max') => {
    return phones.reduce((prev, curr) => {
      let pVal = 0;
      let cVal = 0;
      if (criterion === 'ram') {
        pVal = prev.ram.total;
        cVal = curr.ram.total;
      } else {
        pVal = (prev as any)[criterion] || 0;
        cVal = (curr as any)[criterion] || 0;
      }
      if (type === 'max') return cVal > pVal ? curr : prev;
      return cVal < pVal ? curr : prev;
    }, phones[0]);
  };

  const bestAntutu = findBest('antutu');
  const bestBattery = findBest('battery');

  return (
    <div className="flex flex-col gap-6">
      <div className="hyper-card p-8">
        <h3 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-8 text-center">{t.topPerf}</h3>
        <div className="space-y-8">
          <div className="flex items-center gap-5 group">
            <div className="relative w-14 h-14 shrink-0">
               <div className="absolute inset-0 orange-gradient rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
               <div className="relative w-full h-full orange-gradient rounded-2xl flex items-center justify-center text-white border border-[#ffffff]/20">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-1">{t.king}</p>
              <p className="text-sm font-bold text-[var(--text-primary)] truncate uppercase tracking-tight">{bestAntutu.model}</p>
              <p className="text-xs font-bold text-[#FF6900] mt-0.5">{bestAntutu.antutu.toLocaleString('pt-BR')} PTS</p>
            </div>
          </div>
          <div className="w-full h-px bg-[var(--border-color)]"></div>
          <div className="flex items-center gap-5 group">
             <div className="w-14 h-14 shrink-0 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-primary)] group-hover:border-[#FF6900] transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-1">{t.autonomy}</p>
              <p className="text-sm font-bold text-[var(--text-primary)] truncate uppercase tracking-tight">{bestBattery.model}</p>
              <p className="text-xs font-medium text-[var(--text-secondary)] mt-0.5">{bestBattery.battery} mAh</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingSidebar;
