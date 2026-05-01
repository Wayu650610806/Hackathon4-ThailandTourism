'use client';

import { WeatherData, WeatherCondition } from '@/app/types';

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
      <svg viewBox="0 0 60 60" className="w-full h-full animate-sun-spin">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => (
          <line key={i} x1="30" y1="2" x2="30" y2="12"
            stroke="#EF4444" strokeWidth="3" strokeLinecap="round"
            transform={`rotate(${a} 30 30)`}
            className="animate-pulse"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
        <circle cx="30" cy="30" r="14" fill="#EF4444" />
        <circle cx="30" cy="30" r="9"  fill="#FCA5A5" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-full border-4 border-red-500/20 rounded-full animate-ping" />
      </div>
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
      <svg viewBox="0 0 24 24" className="w-12 h-12 text-blue-400 animate-spin-slow drop-shadow-[0_0_10px_rgba(147,197,253,0.8)]">
        <path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6zm1 12l-2-2 2-2 2 2-2 2zm-12-12l2-2 2 2-2 2-2-2zm24 0l-2-2-2 2 2 2 2-2zM12 1l2 2-2 2-2-2 2-2zM4.34 4.34l1.42 1.42 1.41-1.42-1.41-1.41-1.42 1.41zm15.32 15.32l1.42 1.42 1.41-1.42-1.41-1.41-1.42 1.41zM4.34 19.66l1.41-1.41-1.41-1.42-1.42 1.42 1.42 1.41zm15.32-15.32l1.41-1.41-1.41-1.42-1.42 1.42 1.42 1.41z" />
      </svg>
      {/* Small sparkling dots */}
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="absolute w-1 h-1 bg-blue-200 rounded-full animate-pulse" 
          style={{ 
            top: `${10 + (i % 2) * 30}%`, 
            left: `${15 + Math.floor(i / 2) * 60}%`,
            animationDelay: `${i * 0.5}s`
          }} 
        />
      ))}
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
        </div>
        <WeatherIcon condition={
          data.forecast?.mode === 'rain' ? 'stormy' :
          data.forecast?.mode === 'cold' ? 'cool' :
          data.forecast?.mode === 'hot' ? 'hot' :
          data.weather.condition
        } />
      </div>

      {/* Temperature */}
      <div style={{ display:'flex', alignItems:'flex-end', gap:6, marginBottom:8 }}>
        <span style={{ fontSize:52, fontWeight:900, color: '#1e293b', lineHeight:1 }}>
          {data.weather.temperature}
        </span>
        <span style={{ fontSize:24, color: '#64748b', marginBottom:6, fontWeight: 700 }}>°C</span>
      </div>

      <div style={{ fontSize:15, color: '#1e293b', marginBottom:18, fontWeight:700 }}>
        {lang === 'TH' ? data.weather.description : data.weather.description_en}
      </div>

      {data.forecast && (
        <div style={{ marginTop: 20 }}>
          <div style={{ height: 1, background: '#f1f5f9', margin: '16px 0' }} />
          <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, marginBottom: 12 }}>
            {lang === 'TH' ? 'สถิติพยากรณ์รายเดือน' : 'Monthly Forecast Statistics'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            <div style={{ background: 'rgba(255,255,255,0.5)', padding: '8px', borderRadius: 12, border: '1px solid rgba(226,232,240,0.5)' }}>
              <div style={{ fontSize: 8, color: '#64748b', fontWeight: 800, marginBottom: 2, textTransform: 'uppercase' }}>
                 {lang === 'TH' ? 'อุณหภูมิ' : 'Avg Temp'}
              </div>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#1e293b' }}>
                {data.forecast.temp_min_avg_c}°-{data.forecast.temp_max_avg_c}°C
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.5)', padding: '8px', borderRadius: 12, border: '1px solid rgba(226,232,240,0.5)' }}>
              <div style={{ fontSize: 8, color: '#64748b', fontWeight: 800, marginBottom: 2, textTransform: 'uppercase' }}>
                 {lang === 'TH' ? 'ปริมาณฝน' : 'Precip'}
              </div>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#1e293b' }}>
                {data.forecast.precipitation_total_mm}mm
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.5)', padding: '8px', borderRadius: 12, border: '1px solid rgba(226,232,240,0.5)' }}>
              <div style={{ fontSize: 8, color: '#64748b', fontWeight: 800, marginBottom: 2, textTransform: 'uppercase' }}>
                 {lang === 'TH' ? 'ฝนตก' : 'Rainy'}
              </div>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#1e293b' }}>
                {data.forecast.rainy_days}{lang === 'TH' ? 'วัน' : 'd'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
