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
    <div className="relative h-screen w-screen bg-[#f1f5f9] overflow-hidden font-[family-name:var(--font-geist-sans)]">

      {/* ── Background Fullscreen Map ── */}
      <div className="absolute inset-0 z-0">
        <ThailandMap onProvinceSelect={handleProvinceSelect} selectedProvince={selectedProvince} lang={lang} />
      </div>

      {/* ── Floating Header Card ── */}
      <header className="absolute top-4 left-4 right-4 md:top-6 md:left-6 md:right-6 bg-white/90 backdrop-blur-md rounded-[20px] border border-white/50 shadow-lg px-4 md:px-7 flex flex-col md:flex-row items-center gap-4 md:gap-6 py-4 md:py-0 md:h-20 z-[100]">
        {/* Logo and Mobile Header Row */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl flex items-center justify-center text-xl md:text-2xl shadow-blue-500/30 shadow-lg">🗺️</div>
            <div>
              <div className="gradient-text text-lg md:text-xl font-black leading-tight tracking-tight">
                {T.title}
              </div>
              <div className="text-[9px] md:text-[10px] color-[#64748b] tracking-widest font-bold uppercase">
                {T.subtitle}
              </div>
            </div>
          </div>
          
          {/* Mobile Language Toggle */}
          <div className="flex md:hidden bg-[#f1f5f9] p-1 rounded-xl gap-0.5">
            {['TH','EN'].map(l => (
              <button
                key={l}
                onClick={() => setLang(l as 'TH' | 'EN')}
                className={`px-3 py-1.5 rounded-lg border-none text-[11px] font-extrabold cursor-pointer transition-all ${
                  lang === l ? 'bg-white text-[#1e293b] shadow-sm' : 'bg-transparent text-[#64748b]'
                }`}
              >{l}</button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="w-full md:flex-1 md:max-w-[450px]">
          <SearchBar onSelect={handleProvinceSelect} selectedProvince={selectedProvince} lang={lang} />
        </div>

        {/* Desktop Controls (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-6 flex-shrink-0">
          {/* Date picker */}
          <div className="w-[220px]">
            <DatePicker value={selectedDate} onChange={setSelectedDate} lang={lang} />
          </div>

          {/* Language Toggle */}
          <div className="flex bg-[#f1f5f9] p-1 rounded-xl gap-0.5">
            {['TH','EN'].map(l => (
              <button
                key={l}
                onClick={() => setLang(l as 'TH' | 'EN')}
                className={`px-3 py-1.5 rounded-lg border-none text-xs font-extrabold cursor-pointer transition-all ${
                  lang === l ? 'bg-white text-[#1e293b] shadow-sm' : 'bg-transparent text-[#64748b]'
                }`}
              >{l}</button>
            ))}
          </div>

          {/* Stats Pills (Hidden on Tablets, shown on Large Desktop) */}
          <div className="hidden lg:flex gap-2">
            {[
              { num:'77', label: T.provinces, color: '#8B5CF6' },
              { num:'6',  label: 'Regions', color:'#3B82F6' },
            ].map(({ num, label, color }) => (
              <div key={label} className="flex flex-col items-center px-4 py-2 bg-white rounded-2xl border border-[#f1f5f9] shadow-sm">
                <span className="text-lg font-black leading-tight" style={{ color }}>{num}</span>
                <span className="text-[9px] text-[#94a3b8] font-bold uppercase">{label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile Date Row (Visible only on Mobile) */}
        <div className="flex md:hidden w-full items-center gap-3">
           <div className="flex-1">
             <DatePicker value={selectedDate} onChange={setSelectedDate} lang={lang} />
           </div>
        </div>
      </header>

      {/* ── Floating Left Sidebar (Region Filter - Hidden on Tablets, shown on Large Desktop) ── */}
      <div className="hidden lg:flex absolute top-[128px] left-6 bottom-10 w-[220px] rounded-[24px] bg-white/85 backdrop-blur-md border border-white/50 shadow-lg p-6 flex-col gap-[10px] overflow-y-auto z-50">
        <div className="text-[11px] text-[#64748b] uppercase tracking-[0.12em] font-extrabold mb-1.5 pl-2">
          {T.regions}
        </div>

        {regionStats.map(({ region, color, count, name_en }) => (
          <div key={region} className="flex items-center gap-[10px] p-[10px_14px] bg-white rounded-2xl border-[1.5px] border-[#f1f5f9] shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-all cursor-default">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color, boxShadow: `0 0 8px ${color}40` }} />
            <div className="flex-1 min-w-0 text-[13px] text-[#1e293b] font-bold leading-[1.3]">
              {lang === 'TH' ? region.replace('ภาค','') : name_en}
            </div>
            <div className="text-[11px] font-extrabold px-2 py-0.5 rounded-[10px]" style={{ color, background: `${color}15` }}>
              {count}
            </div>
          </div>
        ))}

        {/* Legend / Tip */}
        <div className="mt-auto p-4 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] rounded-[20px] border border-[#e2e8f0]">
          <div className="text-xs text-[#475569] font-semibold leading-relaxed">
            {T.tip}
          </div>
        </div>
      </div>

      {/* ── Floating Sidebar (Province Detail) ── */}
      <div 
        className={`fixed md:absolute z-[1000] md:z-[100] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) overflow-hidden
          ${sidebarVisible 
            ? 'opacity-100 translate-y-0 md:translate-x-0' 
            : 'opacity-0 translate-y-full md:translate-y-0 md:translate-x-[40px] pointer-events-none'}
          inset-4 md:inset-auto md:top-[128px] md:right-6 md:bottom-10 md:w-[360px] lg:w-[440px]
          bg-white/95 backdrop-blur-xl rounded-[28px] border border-white/50 shadow-2xl`}
      >
        {sidebarVisible && (
          <div className="w-full h-full overflow-y-auto">
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

      {/* ── Tooltip (Hidden on Tablets, shown on Large Desktop) ── */}
      {!sidebarVisible && (
        <div className="hidden lg:flex absolute top-[128px] right-6 w-16 h-16 rounded-full bg-white/90 backdrop-blur-md items-center justify-center text-3xl shadow-lg cursor-pointer animate-float z-50 border border-white/50">
          📍
        </div>
      )}

      {/* ── Bottom Status Bar (Hidden on Tablets, shown on Large Desktop) ── */}
      <div className="hidden lg:flex absolute bottom-0 left-0 right-0 h-8 bg-white/60 backdrop-blur-[4px] border-t border-black/5 items-center px-6 gap-6 text-[11px] text-[#64748b] font-semibold z-[5]">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shadow-[0_0_6px_#22c55e]" />
          <span>{T.connected}</span>
        </div>
        <span>{lang === 'TH' ? `ข้อมูล: ${provinces.length} / 77 จังหวัด` : `Data: ${provinces.length} / 77 Provinces`}</span>
        <span className="ml-auto">
          {new Date(selectedDate + 'T00:00:00').toLocaleDateString(lang === 'TH' ? 'th-TH' : 'en-US', { day:'numeric', month:'long', year: lang === 'TH' ? 'numeric' : 'numeric' })}
        </span>
        <span className="opacity-50">|</span>
        <span>{T.madeFor}</span>
      </div>
    </div>
  );
}
