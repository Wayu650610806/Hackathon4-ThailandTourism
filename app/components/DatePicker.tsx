'use client';

import { useState } from 'react';

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

const MONTHS_TH = [
  'มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
  'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม',
];
const MONTHS_EN = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

interface Props {
  value: { month: number; year: number };
  onChange: (value: { month: number; year: number }) => void;
  lang: 'TH' | 'EN';
}

export default function DatePicker({ value, onChange, lang }: Props) {
  const [open, setOpen] = useState(false);

  const T = {
    TH: {
      placeholder: 'เลือกเดือนและปี',
    },
    EN: {
      placeholder: 'Select Month & Year',
    }
  }[lang];

  const handleMonthSelect = (month: number) => {
    onChange({ ...value, month });
    setOpen(false);
  };

  const changeYear = (delta: number) => {
    onChange({ ...value, year: value.year + delta });
  };

  return (
    <div style={{ position:'relative', width:'100%' }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width:'100%', display:'flex', alignItems:'center', gap:8,
          background: C.white,
          border:`1.5px solid ${open ? C.p600 : C.border}`,
          borderRadius:12, padding:'9px 13px',
          cursor:'pointer', color: C.p900, fontFamily:'inherit', fontSize:13,
          textAlign:'left', transition:'border-color 0.15s',
          boxShadow: open ? `0 0 0 3px ${C.p200}` : '0 1px 3px rgba(124,58,237,0.06)',
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke={open ? C.p600 : C.muted} strokeWidth="2.2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span style={{ flex:1, fontWeight: 700 }}>
          {lang === 'TH' ? MONTHS_TH[value.month-1] : MONTHS_EN[value.month-1]} {lang === 'TH' ? value.year + 543 : value.year}
        </span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke={C.muted} strokeWidth="2.2"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Month selection popup */}
      {open && (
        <div style={{
          position:'absolute', top:'100%', left:0, marginTop:5,
          background: C.white,
          border:`1.5px solid ${C.p200}`,
          borderRadius:16, padding:16, zIndex:1001,
          boxShadow:'0 8px 28px rgba(124,58,237,0.14)',
          minWidth:250,
        }}>
          {/* Year navigation */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <button onClick={() => changeYear(-1)} style={{
              background: C.p100, border:`1px solid ${C.p200}`,
              borderRadius:8, width:28, height:28,
              cursor:'pointer', color: C.p600, fontSize:16,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>‹</button>
            <div style={{ fontSize:15, fontWeight:800, color: C.p900 }}>
              {lang === 'TH' ? value.year + 543 : value.year}
            </div>
            <button onClick={() => changeYear(1)} style={{
              background: C.p100, border:`1px solid ${C.p200}`,
              borderRadius:8, width:28, height:28,
              cursor:'pointer', color: C.p600, fontSize:16,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>›</button>
          </div>

          {/* Month grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
            {(lang === 'TH' ? MONTHS_TH : MONTHS_EN).map((m, i) => {
              const monthNum = i + 1;
              const selected = value.month === monthNum;
              return (
                <button
                  key={m}
                  onClick={() => handleMonthSelect(monthNum)}
                  style={{
                    padding:'8px 4px', borderRadius:10, fontFamily:'inherit',
                    fontSize:12, textAlign:'center', cursor:'pointer',
                    background: selected ? `linear-gradient(135deg,${C.p600},#8B5CF6)` : 'transparent',
                    color: selected ? '#fff' : C.p900,
                    fontWeight: selected ? 800 : 600,
                    border:'none',
                    transition:'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLButtonElement).style.background = C.p100; }}
                  onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  {lang === 'TH' ? m.substring(0, 3) : m.substring(0, 3)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
