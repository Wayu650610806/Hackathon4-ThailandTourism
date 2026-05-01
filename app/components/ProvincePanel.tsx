'use client';

import { Province, Attraction, WeatherData } from '@/app/types';
import WeatherWidget from './WeatherWidget';
import { useState } from 'react';

const C = {
  white:  '#FFFFFF',
  page:   '#F8FAFC', // slate-50
  p100:   '#EDE9FE',
  p200:   '#DDD6FE',
  p600:   '#7C3AED',
  p800:   '#5B21B6',
  p900:   '#1E1B4B',
  sub:    '#6D6A9A',
  muted:  '#A89ED0',
  border: '#E2E8F0', // slate-200
};

const CATEGORY_STYLES: Record<string, { bg: string; label: string; label_en: string; icon: string }> = {
  Culture:    { bg: 'linear-gradient(135deg,#8B5CF6,#A78BFA)', label:'วัฒนธรรม', label_en:'Culture', icon:'🎭' },
  Food:       { bg: 'linear-gradient(135deg,#EF4444,#F97316)', label:'อาหาร',    label_en:'Food', icon:'🍜' },
  Temple:     { bg: 'linear-gradient(135deg,#F59E0B,#FBBF24)', label:'วัด',       label_en:'Temple', icon:'⛩️' },
  Adventure:  { bg: 'linear-gradient(135deg,#10B981,#34D399)', label:'ผจญภัย',   label_en:'Adventure', icon:'🏔️' },
  'Must Go':  { bg: 'linear-gradient(135deg,#3B82F6,#60A5FA)', label:'ต้องไป',   label_en:'Must Go', icon:'⭐' },
};

const REGION_COLORS: Record<string, string> = {
  'ภาคเหนือ': '#8B5CF6', // Violet
  'ภาคตะวันออกเฉียงเหนือ': '#EF4444', // Red
  'ภาคกลาง': '#3B82F6', // Blue
  'ภาคตะวันออก': '#10B981', // Green
  'ภาคตะวันตก': '#F59E0B', // Amber
  'ภาคใต้': '#EC4899', // Pink
};

function AttractionCard({ attraction, lang }: { attraction: Attraction; lang: 'TH' | 'EN' }) {
  const style = CATEGORY_STYLES[attraction.category] || CATEGORY_STYLES.Culture;
  const [imgError, setImgError] = useState(false);

  return (
    <div
      style={{
        background: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
    >
      {/* Thumbnail */}
      <div style={{
        height: 120,
        background: C.p100,
        position: 'relative',
        display: 'flex', alignItems:'center', justifyContent:'center',
        overflow: 'hidden',
      }}>
        {!imgError ? (
          <img
            src={attraction.image_path}
            alt={attraction.name}
            style={{ width:'100%', height:'100%', objectFit:'cover' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div style={{ fontSize:40, opacity:0.5 }}>{style.icon}</div>
        )}
        <div style={{
          position:'absolute', top:8, left:8,
          background: style.bg,
          borderRadius: 20,
          padding: '3px 10px',
          fontSize: 10, fontWeight:800, color:'#fff',
          textTransform: 'uppercase'
        }}>
          {style.icon} {lang === 'TH' ? style.label : style.label_en}
        </div>
      </div>

      {/* Text */}
      <div style={{ padding:'12px 14px' }}>
        <div style={{ fontSize:14, fontWeight:800, color: C.p900, marginBottom:4, lineHeight:1.3 }}>
          {attraction.name}
        </div>
        <div style={{ fontSize:11, color: C.sub, marginBottom:3, fontWeight: 600 }}>
          📍 {attraction.district}
        </div>
        <div style={{ fontSize:11, color: C.p600, fontWeight:700 }}>
          🕐 {attraction.event_date}
        </div>
      </div>
    </div>
  );
}

function ComingSoon({ lang }: { lang: 'TH' | 'EN' }) {
  return (
    <div style={{
      background: '#f8fafc',
      border: `1.5px dashed #e2e8f0`,
      borderRadius: 14,
      padding: '24px 16px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize:30, marginBottom:8, opacity:0.5 }}>🗺️</div>
      <div style={{ fontSize:14, color: '#64748b', fontWeight:700 }}>{lang === 'TH' ? 'เร็วๆ นี้' : 'Coming Soon'}</div>
      <div style={{ fontSize:12, color: '#94a3b8', marginTop:4 }}>{lang === 'TH' ? 'ข้อมูลกำลังอัปเดต' : 'Updating information'}</div>
    </div>
  );
}

interface Props {
  province: Province | null;
  weatherData: WeatherData | null;
  weatherLoading: boolean;
  onClose: () => void;
  lang: 'TH' | 'EN';
}

export default function ProvincePanel({ province, weatherData, weatherLoading, onClose, lang }: Props) {
  const regionColor = province ? (REGION_COLORS[province.region] || C.p600) : C.p600;

  if (!province) return null; // Should be handled by parent for fullscreen layout

  const hasData = province.attractions?.length > 0;
  const T = {
    TH: {
      weather: 'สภาพอากาศ & ความหนาแน่น',
      attractions: 'สถานที่ท่องเที่ยว',
      places: 'แห่ง',
      popular: 'จังหวัดยอดนิยม'
    },
    EN: {
      weather: 'Weather & Crowd Status',
      attractions: 'Attractions',
      places: 'Places',
      popular: 'Popular Provinces'
    }
  }[lang];

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background: '#fff' }}>
      {/* Header */}
      <div style={{
        padding:'24px 24px 18px',
        borderBottom:`1px solid ${C.border}`,
        flexShrink:0,
        background: '#fff',
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
              <div style={{ width:10, height:10, borderRadius:'50%', background: regionColor, boxShadow: `0 0 8px ${regionColor}40` }} />
              <span style={{ fontSize:12, color: regionColor, fontWeight:800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {lang === 'TH' ? province.region : province.region_en}
              </span>
            </div>
            <h2 style={{ fontSize:26, fontWeight:900, color: '#1e293b', margin:0, lineHeight:1.1, letterSpacing: '-0.02em' }}>
              {lang === 'TH' ? province.province : province.province_en}
            </h2>
            <div style={{ fontSize:14, color: '#64748b', marginTop:4, fontWeight: 500 }}>
              {lang === 'TH' ? province.province_en : province.province}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width:36, height:36, borderRadius:'12px',
              background: '#f1f5f9', border:'none',
              color: '#64748b', cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:18, flexShrink:0, transition: 'all 0.2s'
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#e2e8f0')}
            onMouseLeave={e => (e.currentTarget.style.background = '#f1f5f9')}
          >✕</button>
        </div>
        {province.description && (
          <p style={{ fontSize:13, color: '#475569', marginTop:14, lineHeight:1.6, margin:'14px 0 0', fontWeight: 500 }}>
            {province.description}
          </p>
        )}
      </div>

      {/* Body */}
      <div style={{ flex:1, overflowY:'auto', padding:'24px', background: '#f8fafc' }}>

        {/* Weather */}
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, color: '#64748b', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:12, fontWeight: 800 }}>
            {T.weather}
          </div>
          <WeatherWidget data={weatherData} loading={weatherLoading} lang={lang} />
        </div>

        {/* Attractions */}
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ fontSize:11, color: '#64748b', textTransform:'uppercase', letterSpacing:'0.1em', fontWeight: 800 }}>
              {T.attractions}
            </div>
            {hasData && (
              <span style={{
                padding:'3px 12px', background: '#fff',
                borderRadius:20, fontSize:11,
                color: '#1e293b', border:`1px solid #e2e8f0`,
                fontWeight:800,
              }}>{province.total_attractions} {T.places}</span>
            )}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {hasData
              ? province.attractions.map(a => <AttractionCard key={a.id} attraction={a} lang={lang} />)
              : [0,1].map(i => <ComingSoon key={i} lang={lang} />)
            }
          </div>
        </div>
      </div>
    </div>
  );
}
