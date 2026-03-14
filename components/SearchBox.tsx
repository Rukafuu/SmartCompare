
import React, { useState } from 'react';

interface Props {
  onSearch: (name: string) => void;
  disabled: boolean;
}

const SearchBox: React.FC<Props> = ({ onSearch, disabled }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex w-full">
      <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
        <svg className="h-4 w-4 text-[#444444]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Pesquisar modelo (ex: Redmi Note 13)..."
        className="w-full pl-14 pr-32 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#FF6900]/10 focus:bg-white focus:border-[#FF6900]/20 transition-all duration-500 text-sm font-bold text-[#444444] placeholder:text-[#444444]/20"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled || !query.trim()}
        className="absolute right-2 top-2 bottom-2 bg-[#444444] text-white px-7 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#FF6900] active:scale-95 transition-all duration-300 disabled:opacity-20 disabled:pointer-events-none shadow-lg shadow-[#444444]/10"
      >
        Buscar
      </button>
    </form>
  );
};

export default SearchBox;