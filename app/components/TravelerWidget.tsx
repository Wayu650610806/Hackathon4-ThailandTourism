'use client';

import { TravelerPrediction, TravelerLevel, CrowdLevel } from '@/app/types';

interface Props {
  data: TravelerPrediction | undefined;
  crowd: {
    level: CrowdLevel;
    description: string;
    description_en: string;
  } | undefined;
  lang: 'TH' | 'EN';
}

const C = {
  border: '#E2E8F0',
  thai: '#3B82F6', // Blue
  foreign: '#EF4444', // Red
  low: '#22C55E',
  medium: '#F59E0B',
  high: '#F97316',
  max: '#B91C1C', // Darker red for max
};

const CROWD_COLORS: Record<CrowdLevel, string> = {
  low:    '#22C55E',
  medium: '#F59E0B',
  high:   '#EF4444',
};

export default function TravelerWidget({ data, crowd, lang }: Props) {
  if (!data) return null;

  const thaiPct = data.total_visitors > 0 ? (data.thai_visitors / data.total_visitors) * 100 : 0;
  const foreignPct = data.total_visitors > 0 ? (data.foreign_visitors / data.total_visitors) * 100 : 0;

  const levelLabels: Record<TravelerLevel, { th: string, en: string }> = {
    low: { th: 'น้อย', en: 'Low' },
    medium: { th: 'ปานกลาง', en: 'Medium' },
    high: { th: 'หนาแน่น', en: 'High' },
    max: { th: 'สูงสุด', en: 'Max' },
  };

  const crowdLabels: Record<CrowdLevel, { th: string; en: string }> = {
    low: { th: 'น้อย', en: 'Low' },
    medium: { th: 'ปานกลาง', en: 'Medium' },
    high: { th: 'หนาแน่น', en: 'High' }
  };

  const levelColor = C[data.level];

  return (
    <div style={{
      padding: 20,
      background: '#fff',
      borderRadius: 18,
      border: `1px solid ${C.border}`,
      boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
      marginTop: 16
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
           AI {lang === 'TH' ? 'พยากรณ์จำนวนนักท่องเที่ยว' : 'Traveler Prediction'}
        </div>
        <div style={{
          padding: '2px 8px',
          borderRadius: 6,
          background: `${levelColor}15`,
          color: levelColor,
          fontSize: 11,
          fontWeight: 900,
          textTransform: 'uppercase'
        }}>
          {lang === 'TH' ? levelLabels[data.level].th : levelLabels[data.level].en}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#1e293b', lineHeight: 1 }}>
          {data.total_visitors.toLocaleString()}
          <span style={{ fontSize: 13, color: '#64748b', marginLeft: 5, fontWeight: 700 }}>
            {lang === 'TH' ? 'คน' : 'visitors'}
          </span>
        </div>
      </div>

      {/* HP Bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6, fontWeight: 800 }}>
          <span style={{ color: C.thai }}>{lang === 'TH' ? 'ชาวไทย' : 'Thai'} {thaiPct.toFixed(0)}%</span>
          <span style={{ color: C.foreign }}>{lang === 'TH' ? 'ต่างชาติ' : 'Foreign'} {foreignPct.toFixed(0)}%</span>
        </div>
        <div style={{ height: 10, background: '#f1f5f9', borderRadius: 5, overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${thaiPct}%`, background: C.thai, transition: 'width 1s ease' }} />
          <div style={{ width: `${foreignPct}%`, background: C.foreign, transition: 'width 1s ease' }} />
        </div>
      </div>

      {crowd && (
        <div style={{ marginBottom: 16, padding: '12px', background: '#f8fafc', borderRadius: 12, border: '1px solid #f1f5f9' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
             <span style={{ fontSize: 11, color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>
               {lang === 'TH' ? 'ความหนาแน่น' : 'Crowd Density'}
             </span>
             <span style={{ fontSize: 11, fontWeight: 800, color: CROWD_COLORS[crowd.level] }}>
               {lang === 'TH' ? crowdLabels[crowd.level].th : crowdLabels[crowd.level].en}
             </span>
           </div>
           <div style={{ fontSize: 12, color: '#475569', fontWeight: 500, lineHeight: 1.4 }}>
             {lang === 'TH' ? crowd.description : crowd.description_en}
           </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, borderTop: '1px solid #f1f5f9', paddingTop: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: 2 }}>
            {lang === 'TH' ? 'ไทย' : 'Thai'}
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#334155' }}>
            {data.thai_visitors.toLocaleString()}
          </div>
        </div>
        <div style={{ width: 1, background: '#f1f5f9' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: 2 }}>
            {lang === 'TH' ? 'ต่างชาติ' : 'Foreign'}
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#334155' }}>
            {data.foreign_visitors.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
