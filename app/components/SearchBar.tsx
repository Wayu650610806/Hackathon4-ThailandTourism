'use client';

import { useState, useRef, useEffect } from 'react';
import { ALL_77_PROVINCES } from '@/data/thailand-regions';

const C = {
  white:  '#FFFFFF',
  p100:   '#EDE9FE',
  p200:   '#DDD6FE',
  p600:   '#7C3AED',
  p900:   '#1E1B4B',
  sub:    '#6D6A9A',
  muted:  '#A89ED0',
  border: '#E2E8F0', // slate-200
};

const REGION_COLORS: Record<string, string> = {
  'ภาคเหนือ': '#8B5CF6', // Violet
  'ภาคตะวันออกเฉียงเหนือ': '#EF4444', // Red
  'ภาคกลาง': '#3B82F6', // Blue
  'ภาคตะวันออก': '#10B981', // Green
  'ภาคตะวันตก': '#F59E0B', // Amber
  'ภาคใต้': '#EC4899', // Pink
};

const THA_REG_MAP: Record<string, string> = {
  'ภาคเหนือ': 'North',
  'ภาคตะวันออกเฉียงเหนือ': 'Northeast',
  'ภาคกลาง': 'Central',
  'ภาคตะวันออก': 'East',
  'ภาคตะวันตก': 'West',
  'ภาคใต้': 'South'
};

interface Props {
  onSelect: (province: string) => void;
  selectedProvince: string | null;
  lang: 'TH' | 'EN';
}

export default function SearchBar({ onSelect, selectedProvince, lang }: Props) {
  const [query, setQuery]         = useState('');
  const [focused, setFocused]     = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim()
    ? ALL_77_PROVINCES.filter(p =>
        p.name.includes(query) ||
        p.name_en.toLowerCase().includes(query.toLowerCase()) ||
        p.region.includes(query)
      ).slice(0, 8)
    : [];

  const showDropdown = focused && results.length > 0;

  function handleSelect(name: string) {
    onSelect(name);
    setQuery('');
    setFocused(false);
    inputRef.current?.blur();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showDropdown) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted(h => Math.min(h+1, results.length-1)); }
    else if (e.key === 'ArrowUp')  { e.preventDefault(); setHighlighted(h => Math.max(h-1, 0)); }
    else if (e.key === 'Enter' && highlighted >= 0) handleSelect(results[highlighted].name);
    else if (e.key === 'Escape') setFocused(false);
  }

  useEffect(() => { setHighlighted(-1); }, [query]);

  const isFocused = focused;
  const placeholder = lang === 'TH' ? 'ค้นหาจังหวัด… (เช่น เชียงใหม่, Phuket)' : 'Search provinces… (e.g. Bangkok, Phuket)';

  return (
    <div style={{ position:'relative', width:'100%' }}>
      <div style={{
        display:'flex', alignItems:'center', gap:8,
        background: C.white,
        border: `1.5px solid ${isFocused ? C.p600 : C.border}`,
        borderRadius:12,
        padding:'9px 13px',
        transition:'border-color 0.15s, box-shadow 0.15s',
        boxShadow: isFocused ? `0 0 0 3px ${C.p200}` : '0 1px 3px rgba(124,58,237,0.06)',
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke={isFocused ? C.p600 : C.muted} strokeWidth="2.2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{
            flex:1, background:'transparent', border:'none', outline:'none',
            color: C.p900, fontSize:13, fontFamily:'inherit',
          }}
        />
        {query && (
          <button onClick={() => setQuery('')}
            style={{ background:'none', border:'none', cursor:'pointer', color: C.muted, fontSize:13, padding:'0' }}>
            ✕
          </button>
        )}
        {selectedProvince && !query && (
          <div style={{
            padding:'2px 8px', background: C.p100,
            borderRadius:20, fontSize:11, color: C.p600,
            border:`1px solid ${C.p200}`, whiteSpace:'nowrap', fontWeight:600,
          }}>
            {lang === 'TH' ? selectedProvince : ALL_77_PROVINCES.find(p => p.name === selectedProvince)?.name_en || selectedProvince}
          </div>
        )}
      </div>

      {showDropdown && (
        <div style={{
          position:'absolute', top:'100%', left:0, right:0, marginTop:5,
          background: C.white,
          border:`1.5px solid ${C.p200}`,
          borderRadius:12, overflow:'hidden', zIndex:1000,
          boxShadow:'0 8px 24px rgba(124,58,237,0.13)',
        }}>
          {results.map((province, i) => (
            <div
              key={province.name}
              onClick={() => handleSelect(province.name)}
              onMouseEnter={() => setHighlighted(i)}
              style={{
                display:'flex', alignItems:'center', gap:10,
                padding:'10px 13px', cursor:'pointer',
                background: i === highlighted ? C.p100 : C.white,
                borderBottom: i < results.length-1 ? `1px solid ${C.border}` : 'none',
                transition:'background 0.1s',
              }}
            >
              <div style={{
                width:8, height:8, borderRadius:'50%',
                background: REGION_COLORS[province.region] || C.p600, flexShrink:0,
              }} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, color: C.p900, fontWeight:600 }}>{lang === 'TH' ? province.name : province.name_en}</div>
                <div style={{ fontSize:11, color: C.sub }}>
                  {lang === 'TH' ? province.name_en : province.name} · {lang === 'TH' ? province.region : (THA_REG_MAP[province.region] || province.region)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
