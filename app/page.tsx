'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import ProvincePanel from './components/ProvincePanel';
import SearchBar from './components/SearchBar';
import DatePicker from './components/DatePicker';
import { Province, WeatherData } from './types';
import { ALL_77_PROVINCES } from '@/data/thailand-regions';

const ThailandMap = dynamic(() => import('./components/ThailandMap'), { ssr: false });

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

export default function Home() {
  const todayIso = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayIso);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [provinceData, setProvinceData] = useState<Province | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [lang, setLang] = useState<'TH' | 'EN'>('TH');

  useEffect(() => {
    import('@/data/provinces.json').then(mod => setProvinces(mod.default as Province[]));
  }, []);

  const fetchWeather = useCallback(async (provinceName: string, date: string, region: string) => {
    setWeatherLoading(true);
    try {
      const res = await fetch(
        `/api/weather?location=${encodeURIComponent(provinceName)}&date=${date}&region=${encodeURIComponent(region)}`
      );
      setWeatherData(await res.json());
    } catch {
      setWeatherData(null);
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  const handleProvinceSelect = useCallback((provinceName: string) => {
    setSelectedProvince(provinceName);
    setSidebarVisible(true);
    const found = provinces.find(p => p.province === provinceName);
    const info  = ALL_77_PROVINCES.find(p => p.name === provinceName);
    const region = info?.region || 'ภาคกลาง';
    
    const placeholderDesc = lang === 'TH' 
      ? 'ข้อมูลสถานที่ท่องเที่ยวในจังหวัดนี้กำลังอัปเดต กรุณาติดตามในเร็วๆ นี้' 
      : 'Tourist attraction information is being updated. Please stay tuned.';

    setProvinceData(found ?? {
      province: provinceName,
      province_en: info?.name_en || provinceName,
      region, region_en: THA_REG_MAP[region] || region,
      total_attractions: 0,
      description: placeholderDesc,
      attractions: [],
    });
    fetchWeather(provinceName, selectedDate, region);
  }, [provinces, selectedDate, fetchWeather, lang]);

  // Update description when language toggles for placeholder data
  useEffect(() => {
    if (selectedProvince && provinceData && provinceData.total_attractions === 0) {
      setProvinceData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          description: lang === 'TH' 
            ? 'ข้อมูลสถานที่ท่องเที่ยวในจังหวัดนี้กำลังอัปเดต กรุณาติดตามในเร็วๆ นี้' 
            : 'Tourist attraction information is being updated. Please stay tuned.',
        };
      });
    }
  }, [lang, selectedProvince]); // Dependency on lang is key here

  useEffect(() => {
    if (selectedProvince) {
      const region = ALL_77_PROVINCES.find(p => p.name === selectedProvince)?.region || 'ภาคกลาง';
      fetchWeather(selectedProvince, selectedDate, region);
    }
  }, [selectedDate, selectedProvince, fetchWeather]);

  function handleClose() {
    setSidebarVisible(false);
    setSelectedProvince(null);
    setProvinceData(null);
    setWeatherData(null);
  }

  const regionStats = Object.entries(REGION_COLORS).map(([region, color]) => ({
    region, color,
    count: ALL_77_PROVINCES.filter(p => p.region === region).length,
    name_en: THA_REG_MAP[region] || region
  }));

  const T = {
    TH: {
      title: 'Thailand Tourism',
      subtitle: 'พยากรณ์อากาศท่องเที่ยว 77 จังหวัด',
      regions: 'สำรวจภูมิภาค',
      provinces: 'จังหวัด',
      forecast: 'พยากรณ์',
      tip: '💡 เคล็ดลับ: คลิกจังหวัดบนแผนที่เพื่อดูสถานที่ท่องเที่ยวและพยากรณ์อากาศ AI',
      connected: 'เชื่อมต่อระบบ AI แล้ว',
      madeFor: 'สำหรับ Thailand Hackathon 4'
    },
    EN: {
      title: 'Thailand Tourism',
      subtitle: 'AI Weather Forecast · 77 Provinces',
      regions: 'Region Explorer',
      provinces: 'Provinces',
      forecast: 'Forecast',
      tip: '💡 Smart Tip: Click any province on the map to see local attractions & AI weather forecast.',
      connected: 'AI Cloud Engine Connected',
      madeFor: 'Made for Thailand Hackathon 4'
    }
  }[lang];

  return (
    <div style={{ position:'relative', height:'100vh', width:'100vw', background: '#f1f5f9', overflow:'hidden', fontFamily: 'var(--font-geist-sans)' }}>

      {/* ── Background Fullscreen Map ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <ThailandMap onProvinceSelect={handleProvinceSelect} selectedProvince={selectedProvince} lang={lang} />
      </div>

      {/* ── Floating Header Card ── */}
      <header style={{
        position: 'absolute',
        top: 24, left: 24, right: 24,
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        padding: '0 28px',
        display: 'flex', alignItems: 'center', gap: 24,
        height: 80, zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
          <div style={{
            width: 46, height: 46,
            background: 'linear-gradient(135deg,#3B82F6,#2563EB)',
            borderRadius: 14,
            display: 'flex', alignItems:'center', justifyContent:'center',
            fontSize: 24,
            boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
          }}>🗺️</div>
          <div>
            <div className="gradient-text" style={{ fontSize:20, fontWeight:900, lineHeight:1.1, letterSpacing: '-0.02em' }}>
              {T.title}
            </div>
            <div style={{ fontSize:10, color: '#64748b', letterSpacing:'0.1em', fontWeight:700, textTransform: 'uppercase' }}>
              {T.subtitle}
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{ flex:1, maxWidth:450 }}>
          <SearchBar onSelect={handleProvinceSelect} selectedProvince={selectedProvince} lang={lang} />
        </div>

        {/* Date picker */}
        <div style={{ width:220, flexShrink:0 }}>
          <DatePicker value={selectedDate} onChange={setSelectedDate} lang={lang} />
        </div>

        {/* Language Toggle */}
        <div style={{ display:'flex', background:'#f1f5f9', padding:4, borderRadius:12, gap:2 }}>
          {['TH','EN'].map(l => (
            <button
              key={l}
              onClick={() => setLang(l as 'TH' | 'EN')}
              style={{
                padding:'6px 12px', borderRadius:8, border:'none',
                fontSize:12, fontWeight:800, cursor:'pointer',
                background: lang === l ? '#fff' : 'transparent',
                color: lang === l ? '#1e293b' : '#64748b',
                boxShadow: lang === l ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s'
              }}
            >{l}</button>
          ))}
        </div>

        {/* Stats Pills */}
        <div style={{ display:'flex', gap:8, flexShrink:0 }}>
          {[
            { num:'77', label: T.provinces, color: '#8B5CF6' },
            { num:'6',  label: 'Regions', color:'#3B82F6' },
          ].map(({ num, label, color }) => (
            <div key={label} style={{
              display:'flex', flexDirection:'column', alignItems:'center',
              padding: '8px 16px',
              background: '#fff',
              borderRadius: '14px',
              border: '1px solid #f1f5f9',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <span style={{ fontSize:18, fontWeight:900, color, lineHeight:1.1 }}>{num}</span>
              <span style={{ fontSize:9, color: '#94a3b8', fontWeight:700, textTransform:'uppercase' }}>{label}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ── Floating Left Sidebar (Region Filter) ── */}
      <div style={{
        position: 'absolute',
        top: 128, left: 24, bottom: 40,
        width: 220,
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        padding: '24px 16px',
        display: 'flex', flexDirection:'column', gap:10,
        overflowY: 'auto',
        zIndex: 50,
      }}>
        <div style={{ fontSize:11, color: '#64748b', textTransform:'uppercase', letterSpacing:'0.12em', fontWeight:800, marginBottom:6, paddingLeft:8 }}>
          {T.regions}
        </div>

        {regionStats.map(({ region, color, count, name_en }) => (
          <div key={region} style={{
            display:'flex', alignItems:'center', gap:10,
            padding: '10px 14px',
            background: '#fff',
            borderRadius: 16,
            border: `1.5px solid #f1f5f9`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            transition: 'all 0.2s ease',
            cursor: 'default'
          }}>
            <div style={{ width:12, height:12, borderRadius:'50%', background: color, flexShrink:0, boxShadow: `0 0 8px ${color}40` }} />
            <div style={{ flex:1, minWidth:0, fontSize:13, color: '#1e293b', fontWeight:700, lineHeight:1.3 }}>
              {lang === 'TH' ? region.replace('ภาค','') : name_en}
            </div>
            <div style={{
              fontSize:11, fontWeight:800, color,
              background: `${color}15`,
              padding:'2px 8px', borderRadius:10,
            }}>{count}</div>
          </div>
        ))}

        {/* Legend / Tip */}
        <div style={{ marginTop:'auto', padding:'16px', background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', borderRadius:20, border:'1px solid #e2e8f0' }}>
          <div style={{ fontSize:12, color: '#475569', lineHeight:1.6, fontWeight:600 }}>
            {T.tip}
          </div>
        </div>
      </div>

      {/* ── Floating Right Sidebar (Province Detail) ── */}
      <div style={{
        position: 'absolute',
        top: 128, right: 24, bottom: 40,
        width: sidebarVisible ? 440 : 0,
        borderRadius: '28px',
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(16px)',
        border: sidebarVisible ? '1px solid rgba(255, 255, 255, 0.5)' : 'none',
        boxShadow: sidebarVisible ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: sidebarVisible ? 'translateX(0)' : 'translateX(40px)',
        opacity: sidebarVisible ? 1 : 0,
        zIndex: 100,
      }}>
        {sidebarVisible && (
          <div style={{ width:440, height:'100%', overflowY:'auto' }}>
            <ProvincePanel
              province={provinceData}
              weatherData={weatherData}
              weatherLoading={weatherLoading}
              onClose={handleClose}
              lang={lang}
            />
          </div>
        )}
      </div>

      {/* ── Fullscreen Interactive Tooltip (Floating) ── */}
      {!sidebarVisible && (
        <div style={{
          position: 'absolute',
          top: 128, right: 24,
          width: 64, height: 64,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          animation: 'float 3s ease-in-out infinite',
          zIndex: 50,
          border: '1px solid rgba(255,255,255,0.5)'
        }}>
          📍
        </div>
      )}

      {/* ── Minimal Bottom Status Bar ── */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: 32,
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(4px)',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        display: 'flex', alignItems: 'center',
        padding: '0 24px', gap: 24,
        fontSize: 11, color: '#64748b', fontWeight: 600,
        zIndex: 5,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 6px #22c55e' }} />
          <span>{T.connected}</span>
        </div>
        <span>{lang === 'TH' ? `ข้อมูล: ${provinces.length} / 77 จังหวัด` : `Data: ${provinces.length} / 77 Provinces`}</span>
        <span style={{ marginLeft: 'auto' }}>
          {new Date(selectedDate + 'T00:00:00').toLocaleDateString(lang === 'TH' ? 'th-TH' : 'en-US', { day:'numeric', month:'long', year: lang === 'TH' ? 'numeric' : 'numeric' })}
        </span>
        <span style={{ opacity: 0.5 }}>|</span>
        <span>{T.madeFor}</span>
      </div>
    </div>
  );
}
