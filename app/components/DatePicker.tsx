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
const DAYS_TH = ['อา','จ','อ','พ','พฤ','ศ','ส'];
const DAYS_EN = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function formatThai(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getDate()} ${MONTHS_TH[d.getMonth()]} ${d.getFullYear() + 543}`;
}

function formatEng(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${MONTHS_EN[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

interface Props {
  value: string;
  onChange: (date: string) => void;
  lang: 'TH' | 'EN';
}

export default function DatePicker({ value, onChange, lang }: Props) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    const d = value ? new Date(value + 'T00:00:00') : new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function isDisabled(day: number) {
    return new Date(viewDate.year, viewDate.month, day) < today;
  }
  function isSelected(day: number) {
    if (!value) return false;
    const d = new Date(value + 'T00:00:00');
    return d.getFullYear() === viewDate.year && d.getMonth() === viewDate.month && d.getDate() === day;
  }
  function isToday(day: number) {
    return today.getFullYear() === viewDate.year && today.getMonth() === viewDate.month && today.getDate() === day;
  }

  function handleSelect(day: number) {
    if (isDisabled(day)) return;
    onChange(new Date(viewDate.year, viewDate.month, day).toISOString().split('T')[0]);
    setOpen(false);
  }
  function prevMonth() {
    setViewDate(v => v.month === 0 ? { year:v.year-1, month:11 } : { ...v, month:v.month-1 });
  }
  function nextMonth() {
    setViewDate(v => v.month === 11 ? { year:v.year+1, month:0 } : { ...v, month:v.month+1 });
  }

  const T = {
    TH: {
      placeholder: 'เลือกวันที่เดินทาง',
      today: 'วันนี้',
    },
    EN: {
      placeholder: 'Select Travel Date',
      today: 'Today',
    }
  }[lang];

  const daysInMonth = new Date(viewDate.year, viewDate.month+1, 0).getDate();
  const firstDay    = new Date(viewDate.year, viewDate.month, 1).getDay();

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
        <span style={{ flex:1 }}>
          {value ? (lang === 'TH' ? formatThai(value) : formatEng(value)) : T.placeholder}
        </span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke={C.muted} strokeWidth="2.2"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Calendar popup */}
      {open && (
        <div style={{
          position:'absolute', top:'100%', left:0, marginTop:5,
          background: C.white,
          border:`1.5px solid ${C.p200}`,
          borderRadius:16, padding:16, zIndex:1001,
          boxShadow:'0 8px 28px rgba(124,58,237,0.14)',
          minWidth:278,
        }}>
          {/* Month navigation */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <button onClick={prevMonth} style={{
              background: C.p100, border:`1px solid ${C.p200}`,
              borderRadius:8, width:28, height:28,
              cursor:'pointer', color: C.p600, fontSize:16,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>‹</button>
            <div style={{ fontSize:14, fontWeight:700, color: C.p900 }}>
              {lang === 'TH' ? MONTHS_TH[viewDate.month] : MONTHS_EN[viewDate.month]} {lang === 'TH' ? viewDate.year + 543 : viewDate.year}
            </div>
            <button onClick={nextMonth} style={{
              background: C.p100, border:`1px solid ${C.p200}`,
              borderRadius:8, width:28, height:28,
              cursor:'pointer', color: C.p600, fontSize:16,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>›</button>
          </div>

          {/* Day headers */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2, marginBottom:4 }}>
            {(lang === 'TH' ? DAYS_TH : DAYS_EN).map(d => (
              <div key={d} style={{ textAlign:'center', fontSize:11, color: C.muted, padding:'3px 0' }}>{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2 }}>
            {Array.from({ length:firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length:daysInMonth }).map((_, i) => {
              const day = i + 1;
              const disabled = isDisabled(day);
              const selected = isSelected(day);
              const tod      = isToday(day);

              return (
                <button
                  key={day}
                  onClick={() => handleSelect(day)}
                  style={{
                    padding:'5px 2px', borderRadius:8, fontFamily:'inherit',
                    fontSize:13, textAlign:'center', cursor: disabled ? 'not-allowed' : 'pointer',
                    border: tod && !selected ? `1.5px solid ${C.p200}` : '1.5px solid transparent',
                    background: selected ? `linear-gradient(135deg,${C.p600},#8B5CF6)` : 'transparent',
                    color: disabled ? C.muted : selected ? '#fff' : C.p900,
                    opacity: disabled ? 0.4 : 1,
                    transition:'background 0.13s',
                  }}
                  onMouseEnter={e => { if (!disabled && !selected) (e.currentTarget as HTMLButtonElement).style.background = C.p100; }}
                  onMouseLeave={e => { if (!disabled && !selected) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Quick select */}
          <div style={{ marginTop:10, paddingTop:10, borderTop:`1px solid ${C.border}` }}>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
              {[
                { label: T.today, days:0 },
                { label:'+7', days:7 },
                { label:'+30', days:30 },
                { label:'+90', days:90 },
              ].map(({ label, days }) => (
                <button
                  key={label}
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() + days);
                    onChange(d.toISOString().split('T')[0]);
                    setViewDate({ year:d.getFullYear(), month:d.getMonth() });
                    setOpen(false);
                  }}
                  style={{
                    padding:'3px 10px',
                    background: C.p100, border:`1px solid ${C.p200}`,
                    borderRadius:20, color: C.p600,
                    cursor:'pointer', fontSize:11, fontFamily:'inherit', fontWeight:600,
                  }}
                >{label}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
