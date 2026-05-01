'use client';

import { WeatherData, WeatherCondition, CrowdLevel } from '@/app/types';

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

// ── Animated weather icons ─────────────────────────────────────────────────

function SunIcon() {
  return (
    <div className="relative w-[60px] h-[60px] flex items-center justify-center">
      <svg viewBox="0 0 60 60" className="w-full h-full animate-sun-spin">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
          <line key={i} x1="30" y1="5" x2="30" y2="15"
            stroke="#FBBF24" strokeWidth="3" strokeLinecap="round"
            transform={`rotate(${a} 30 30)`}
          />
        ))}
        <circle cx="30" cy="30" r="12" fill="#FBBF24" />
        <circle cx="30" cy="30" r="8"  fill="#FDE68A" />
      </svg>
    </div>
  );
}

function HotIcon() {
  return (
    <div className="relative w-[60px] h-[60px] flex items-center justify-center">
      {/* Sun base */}
      <svg viewBox="0 0 60 60" className="absolute inset-0 w-full h-full animate-sun-spin opacity-40">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
          <line key={i} x1="30" y1="5" x2="30" y2="15"
            stroke="#EF4444" strokeWidth="3" strokeLinecap="round"
            transform={`rotate(${a} 30 30)`}
          />
        ))}
        <circle cx="30" cy="30" r="12" fill="#EF4444" />
      </svg>
      {/* Heat Waves */}
      <div className="flex gap-2.5 mt-4">
        {[0, 1, 2].map(i => (
          <svg key={i} viewBox="0 0 10 30" className="w-2.5 h-8 animate-heat-wave" style={{ animationDelay: `${i * 0.4}s` }}>
            <path d="M5 30 Q0 22 5 15 Q10 8 5 0" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        ))}
      </div>
      {/* Warning color circle */}
      <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_#EF4444]" />
    </div>
  );
}

function CloudIcon({ rainy = false, stormy = false }: { rainy?: boolean; stormy?: boolean }) {
  const cloudFill = stormy ? '#94A3B8' : '#CBD5E1';
  const cloudBase = stormy ? '#64748B' : '#E2E8F0';
  return (
    <svg viewBox="0 0 70 65" className="w-[60px] h-[55px]">
      <g className="animate-cloud">
        <ellipse cx="35" cy="24" rx="20" ry="12" fill={cloudFill} />
        <ellipse cx="21" cy="29" rx="11" ry="9"  fill={cloudBase} />
        <ellipse cx="49" cy="29" rx="10" ry="8"  fill={cloudBase} />
        <rect x="11" y="28" width="48" height="10" fill={cloudBase} rx="5" />
      </g>
      {rainy && [0,1,2,3,4].map(i => (
        <line key={i} x1={14+i*10} y1="43" x2={11+i*10} y2="56"
          stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"
          style={{ animation:`rainDrop ${0.7+i*0.14}s ease-in infinite`, animationDelay:`${i*0.11}s` }}
        />
      ))}
      {stormy && (
        <>
          <polyline points="34,41 28,51 33,51 27,62"
            fill="none" stroke="#FBBF24" strokeWidth="3"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ animation:'lightning 2.5s ease-in-out infinite' }}
          />
          {[0,1,2,3].map(i => (
            <line key={i} x1={13+i*13} y1="43" x2={10+i*13} y2="56"
              stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round"
              style={{ animation:`rainDrop ${0.65+i*0.12}s ease-in infinite`, animationDelay:`${i*0.09}s` }}
            />
          ))}
        </>
      )}
    </svg>
  );
}

function CoolIcon() {
  return (
    <div className="relative w-[60px] h-[60px] flex items-center justify-center">
      {/* Wind lines */}
      <div className="absolute inset-0 flex flex-col justify-center gap-3 overflow-hidden">
        {[0, 1].map(i => (
          <div key={i} className="animate-wind" style={{ animationDelay: `${i * 1.5}s` }}>
            <svg viewBox="0 0 40 10" className="w-10 h-2 opacity-60">
              <path d="M0 5 Q10 0 20 5 Q30 10 40 5" fill="none" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        ))}
      </div>
      {/* Snowflakes */}
      {[0, 1, 2].map(i => (
        <div key={i} className="absolute animate-snow" style={{ 
          left: `${15 + i * 15}px`, 
          top: '-5px',
          animationDelay: `${i * 0.8}s` 
        }}>
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-300">
            <path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6zm1 12l-2-2 2-2 2 2-2 2zm-12-12l2-2 2 2-2 2-2-2zm24 0l-2-2-2 2 2 2 2-2zM12 1l2 2-2 2-2-2 2-2z" />
          </svg>
        </div>
      ))}
      {/* Core cool shape */}
      <svg viewBox="0 0 40 40" className="w-8 h-8 opacity-80 z-10">
        <circle cx="20" cy="20" r="12" fill="none" stroke="#60A5FA" strokeWidth="2" strokeDasharray="4 4" className="animate-spin-slow" />
        <path d="M20 10 L20 30 M10 20 L30 20" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function WeatherIcon({ condition }: { condition: WeatherCondition }) {
  switch (condition) {
    case 'sunny':  return <SunIcon />;
    case 'hot':    return <HotIcon />;
    case 'rainy':  return <CloudIcon rainy />;
    case 'stormy': return <CloudIcon stormy rainy />;
    case 'cloudy': return <CloudIcon />;
    case 'cool':   return <CoolIcon />;
    default:       return <SunIcon />;
  }
}

function CrowdBar({ level, score, lang }: { level: CrowdLevel; score: number; lang: 'TH' | 'EN' }) {
  const colors: Record<CrowdLevel, string> = {
    low:    '#22C55E',
    medium: '#F59E0B',
    high:   '#EF4444',
  };
  const labels: Record<string, Record<CrowdLevel, string>> = {
    TH: { low: 'น้อย', medium: 'ปานกลาง', high: 'หนาแน่น' },
    EN: { low: 'Low', medium: 'Medium', high: 'High' }
  };
  
  const titleLabels = {
    TH: 'ความหนาแน่นนักท่องเที่ยว',
    EN: 'Tourist Crowd Density'
  };

  const color = colors[level];
  const peopleFilled = level === 'low' ? 1 : level === 'medium' ? 3 : 5;

  return (
    <div style={{ marginTop:8 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
        <span style={{ fontSize:12, color: '#64748b', fontWeight: 600 }}>{titleLabels[lang]}</span>
        <span style={{ fontSize:12, fontWeight:800, color }}>{labels[lang][level]} ({score}%)</span>
      </div>
      <div style={{ height:8, background: '#f1f5f9', borderRadius:4, overflow:'hidden' }}>
        <div style={{
          height:'100%', width:`${score}%`,
          background: `linear-gradient(90deg,${color}88,${color})`,
          borderRadius:4, transition:'width 1s ease',
        }} />
      </div>
      <div style={{ display:'flex', gap:4, marginTop:10 }}>
        {Array.from({ length:5 }).map((_, i) => (
          <svg key={i} viewBox="0 0 20 30" style={{ width:14, height:21 }}>
            <circle cx="10" cy="6" r="5" fill={i < peopleFilled ? color : '#e2e8f0'} />
            <path d="M4 30 Q4 16 10 16 Q16 16 16 30" fill={i < peopleFilled ? color : '#e2e8f0'} />
          </svg>
        ))}
      </div>
    </div>
  );
}

const WEATHER_BG: Record<WeatherCondition, string> = {
  sunny:  'linear-gradient(135deg,rgba(251,191,36,0.12),rgba(245,158,11,0.04))',
  hot:    'linear-gradient(135deg,rgba(239,68,68,0.10),rgba(249,115,22,0.04))',
  cloudy: 'linear-gradient(135deg,rgba(148,163,184,0.10),rgba(100,116,139,0.04))',
  rainy:  'linear-gradient(135deg,rgba(96,165,250,0.12),rgba(6,182,212,0.04))',
  stormy: 'linear-gradient(135deg,rgba(100,116,139,0.14),rgba(239,68,68,0.06))',
  cool:   'linear-gradient(135deg,rgba(147,197,253,0.14),rgba(6,182,212,0.04))',
};

interface Props {
  data: WeatherData | null;
  loading: boolean;
  lang: 'TH' | 'EN';
}

export default function WeatherWidget({ data, loading, lang }: Props) {
  if (loading) {
    return (
      <div style={{ padding:20, background: '#fff', borderRadius:16, border:`1px solid ${C.border}` }}>
        {[20,50,16].map((h, i) => (
          <div key={i} className="shimmer" style={{ height:h, borderRadius:8, marginBottom:i<2?10:0 }} />
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{
        padding:24, background: '#fff', borderRadius:16,
        border:`1px solid ${C.border}`,
        textAlign:'center', color: '#94a3b8', fontSize:13, fontWeight: 600
      }}>
        {lang === 'TH' ? 'เลือกจังหวัดเพื่อดูข้อมูลสภาพอากาศ' : 'Select a province to view weather data'}
      </div>
    );
  }

  const bg = WEATHER_BG[data.weather.condition] || WEATHER_BG.sunny;
  const humidityLabel = lang === 'TH' ? 'ความชื้น' : 'Humidity';

  return (
    <div style={{
      padding:20,
      background: `${bg}, ${C.white}`,
      borderRadius:18,
      border:`1px solid ${C.border}`,
      boxShadow:'0 4px 12px rgba(0,0,0,0.03)',
    }}>
      {/* Top row */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div>
          <div style={{ fontSize:10, color: '#94a3b8', textTransform:'uppercase', letterSpacing:'0.08em', fontWeight: 800 }}>
            AI {lang === 'TH' ? 'พยากรณ์อากาศ' : 'Weather Forecast'}
          </div>
          <div style={{ fontSize:12, color: '#64748b', marginTop:2, fontWeight: 600 }}>
            {new Date(data.date).toLocaleDateString(lang === 'TH' ? 'th-TH' : 'en-US', { day:'numeric', month:'long', year:'numeric' })}
          </div>
        </div>
        <WeatherIcon condition={data.weather.condition} />
      </div>

      {/* Temperature */}
      <div style={{ display:'flex', alignItems:'flex-end', gap:6, marginBottom:8 }}>
        <span style={{ fontSize:52, fontWeight:900, color: '#1e293b', lineHeight:1 }}>
          {data.weather.temperature}
        </span>
        <span style={{ fontSize:24, color: '#64748b', marginBottom:6, fontWeight: 700 }}>°C</span>
      </div>

      <div style={{ fontSize:15, color: '#1e293b', marginBottom:4, fontWeight:700 }}>
        {lang === 'TH' ? data.weather.description : data.weather.description_en}
      </div>
      <div style={{ fontSize:13, color: '#64748b', marginBottom:18, fontWeight: 500 }}>
        {humidityLabel}: {data.weather.humidity}%
      </div>

      <div style={{ height:1, background: '#f1f5f9', margin:'12px 0' }} />

      <CrowdBar level={data.crowd.level} score={data.crowd.score} lang={lang} />

      <div style={{ fontSize:13, color: '#475569', marginTop:12, fontWeight: 500, lineHeight: 1.5 }}>
        {lang === 'TH' ? data.crowd.description : data.crowd.description_en}
      </div>
    </div>
  );
}
