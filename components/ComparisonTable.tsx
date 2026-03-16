
import React from 'react';
import { Smartphone } from '../types';

interface Props {
  phones: Smartphone[];
  onRemove: (id: string) => void;
  onUpdatePhone?: (phone: Smartphone) => void;
  onAddClick: () => void;
  lang: 'pt' | 'en' | 'es';
}

const translations = {
  pt: {
    empty: "Nenhum dispositivo selecionado",
    start: "Iniciar Comparação",
    labelMain: "Modelo",
    processor: "Processador",
    display: "Display",
    resistance: "Resistência",
    refresh: "Taxa Atualiz.",
    ram: "Memória RAM",
    storage: "Armazenam.",
    battery: "Bateria",
    rearCam: "Câmera Traseira",
    conn5g: "Conexão 5G",
    nfc: "Tecnologia NFC",
    warranty: "Garantia",
    officialDL: "OFICIAL BR",
    officialOther: "NACIONAL",
    global: "IMPORTADO",
    homologated: "SELO ANATEL",
    selectVersion: "Alterar Versão"
  },
  en: {
    empty: "No device selected",
    start: "Start Comparison",
    labelMain: "Model",
    processor: "Processor",
    display: "Display",
    resistance: "Protection",
    refresh: "Refresh Rate",
    ram: "RAM Memory",
    storage: "Storage",
    battery: "Battery",
    rearCam: "Rear Camera",
    conn5g: "5G Connection",
    nfc: "NFC Tech",
    warranty: "Warranty",
    officialDL: "OFFICIAL BR",
    officialOther: "NATIONAL",
    global: "IMPORTED",
    homologated: "ANATEL SEAL",
    selectVersion: "Change Version"
  },
  es: {
    empty: "Ningún dispositivo seleccionado",
    start: "Iniciar Comparación",
    labelMain: "Modelo",
    processor: "Procesador",
    display: "Pantalla",
    resistance: "Resistencia",
    refresh: "Refresco",
    ram: "Memoria RAM",
    storage: "Almacen.",
    battery: "Batería",
    rearCam: "Cámara Trasera",
    conn5g: "Conexión 5G",
    nfc: "Tecnología NFC",
    warranty: "Garantía",
    officialDL: "OFICIAL BR",
    officialOther: "NACIONAL",
    global: "IMPORTADO",
    homologated: "SELLO ANATEL",
    selectVersion: "Cambiar Versión"
  }
};

const ComparisonTable: React.FC<Props> = ({ phones, onRemove, onUpdatePhone, onAddClick, lang }) => {
  const t = translations[lang];

  const handleVariantChange = (phone: Smartphone, variant: { ram: number; storage: number }) => {
    if (onUpdatePhone) {
      onUpdatePhone({
        ...phone,
        ram: {
          ...phone.ram,
          physical: variant.ram,
          total: variant.ram + phone.ram.virtual
        },
        storage: variant.storage
      });
    }
  };
  
  if (phones.length === 0) {
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center p-8 md:p-12 text-center">
        <p className="text-sm font-medium text-(--text-secondary) mb-4">{t.empty}</p>
        <button 
          onClick={onAddClick}
          className="text-xs font-bold text-[#FF6900] uppercase tracking-[0.2em] hover:opacity-80 transition-opacity"
        >
          {t.start}
        </button>
      </div>
    );
  }

  const BooleanIcon = ({ value }: { value: boolean }) => (
    <div className="flex justify-center">
      {value ? (
        <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </div>
      ) : (
        <div className="w-5 h-5 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
      )}
    </div>
  );

  const specRows = [
    { label: 'AnTuTu v10', key: 'antutu', suffix: ' pts', highlight: true },
    { label: t.processor, key: 'processor' },
    { label: t.display, accessor: (p: Smartphone) => p.screenSize ? `${p.screenSize}" ${p.screenType || ''}` : 'Não inf.' },
    { label: t.refresh, key: 'refreshRate' },
    { label: t.ram, accessor: (p: Smartphone) => {
      const hasVariants = p.variants && p.variants.length > 1;
      return (
        <div className="flex flex-col items-center gap-1">
          <span>{(p.ram.physical > 0) ? `${p.ram.physical}GB + ${p.ram.virtual}GB` : 'N/A'}</span>
          {hasVariants && (
             <select 
                className="bg-(--bg-main) border border-(--border-color) rounded px-1 py-0.5 text-[8px] outline-none cursor-pointer hover:border-[#FF6900]/50"
                onChange={(e) => {
                  const [ram, storage] = e.target.value.split('-').map(Number);
                  handleVariantChange(p, { ram, storage });
                }}
                value={`${p.ram.physical}-${p.storage}`}
             >
               {p.variants?.map((v, i) => (
                 <option key={i} value={`${v.ram}-${v.storage}`}>
                   {v.ram}GB / {v.storage}GB
                 </option>
               ))}
             </select>
          )}
        </div>
      );
    }},
    { label: t.storage, key: 'storage', suffix: ' GB' },
    { label: t.battery, key: 'battery', suffix: ' mAh' },
    { label: t.rearCam, key: 'rearCamera' },
    { label: t.conn5g, accessor: (p: Smartphone) => <BooleanIcon value={p.is5G} /> },
    { label: t.nfc, accessor: (p: Smartphone) => <BooleanIcon value={p.nfc} /> },
    { label: t.warranty, accessor: (p: Smartphone) => {
      const isXiaomi = p.brand.toLowerCase() === 'xiaomi';
      const isOfficial = p.isAnatelCertified;
      
      return (
        <div className="flex flex-col items-center py-4 gap-1.5">
          <span className={`text-[10px] md:text-[12px] leading-none font-black uppercase tracking-tight text-center ${isOfficial ? 'text-[#FF6900]' : 'text-zinc-400 opacity-60'}`}>
            {isOfficial ? (isXiaomi ? t.officialDL : t.officialOther) : t.global}
          </span>
          {isOfficial && (
            <div className="flex flex-col items-center">
               <span className="text-[10px] md:text-[12px] font-black uppercase tracking-tight text-[#FF6900]">
                {t.homologated}
              </span>
              {p.anatelCertificate && (
                <span className="text-[7px] md:text-[8px] font-mono text-zinc-400 font-bold uppercase tracking-tight mt-0.5">
                  {p.anatelCertificate}
                </span>
              )}
            </div>
          )}
        </div>
      );
    }},
  ];

  return (
    <div className="w-full">
      <table className="w-full border-separate border-spacing-0 table-fixed min-w-[360px]">
        <thead>
          <tr>
            <th className="p-3 md:p-4 text-left border-b border-(--border-color) bg-(--bg-glass) backdrop-blur-md w-[85px] md:w-[110px] sticky left-0 z-20">
              <span className="text-[8px] md:text-[9px] font-black text-(--text-secondary) uppercase tracking-widest md:tracking-[0.2em]">{t.labelMain}</span>
            </th>
            {phones.map((phone) => (
              <th 
                key={phone.id} 
                className="p-3 md:p-4 border-b border-l border-(--border-color) min-w-[120px] md:min-w-[140px] relative bg-(--bg-glass) backdrop-blur-md"
              >
                <button 
                  onClick={() => onRemove(phone.id)}
                  className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all z-30"
                >
                  &times;
                </button>
                <div className="flex flex-col items-center gap-2 md:gap-3">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center text-xs md:text-base font-black shadow-lg ${
                    phone.isAnatelCertified 
                    ? 'bg-[#FF6900] text-white' 
                    : 'bg-zinc-200 dark:bg-zinc-800 text-(--text-primary)'
                  }`}>
                    {phone.model.charAt(0)}
                  </div>
                  <h3 className="text-[9px] md:text-[10px] font-black text-(--text-primary) uppercase tracking-tighter line-clamp-2 leading-[1.1] text-center">
                    {phone.model}
                  </h3>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {specRows.map((row, idx) => (
            <tr key={idx} className="group hover:bg-(--border-color)/30 transition-colors">
              <td className="p-2 md:p-3 font-black text-[8px] md:text-[9px] text-(--text-secondary) uppercase tracking-wider border-b border-(--border-color) sticky left-0 z-10 bg-(--bg-surface)/95 backdrop-blur-sm group-hover:bg-(--bg-surface)">
                {row.label}
              </td>
              {phones.map((phone) => {
                 const isWarrantyRow = row.label === t.warranty;
                 const isOfficial = phone.isAnatelCertified;

                 return (
                  <td key={phone.id} className={`p-2 md:p-3 text-center text-[10px] md:text-[11px] font-semibold border-b border-l border-(--border-color) transition-all duration-300 ${
                    isWarrantyRow && isOfficial 
                    ? 'bg-[#FF6900]/5' 
                    : ''
                  }`}>
                    <div className={`${row.highlight ? 'text-[#FF6900] font-black' : 'text-(--text-primary)'} leading-tight`}>
                      {row.accessor ? row.accessor(phone) : (() => {
                        const val = (phone as any)[row.key!];
                        if (val === undefined || val === null || val === '') return 'Não informado';
                        if (typeof val === 'number' && val === 0) return 'Buscando...';
                        return val.toLocaleString('pt-BR');
                      })()}{row.suffix}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;
