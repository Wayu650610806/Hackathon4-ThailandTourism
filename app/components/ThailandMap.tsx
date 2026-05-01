'use client';

import { useState, useCallback, memo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { ALL_77_PROVINCES } from '@/data/thailand-regions';

// Thailand province GeoJSON
const GEO_URL =
  'https://raw.githubusercontent.com/apisit/thailand.json/master/thailand.json';

// Map every English name variant found in apisit GeoJSON → Thai name
const EN_TO_TH: Record<string, string> = {
  'Amnat Charoen': 'อำนาจเจริญ',
  'Ang Thong': 'อ่างทอง',
  'Bangkok': 'กรุงเทพมหานคร',
  'Bangkok Metropolis': 'กรุงเทพมหานคร',
  'Krung Thep Maha Nakhon': 'กรุงเทพมหานคร',
  'Bueng Kan': 'บึงกาฬ',
  'Bung Kan': 'บึงกาฬ',
  'Buriram': 'บุรีรัมย์',
  'Buri Ram': 'บุรีรัมย์',
  'Chachoengsao': 'ฉะเชิงเทรา',
  'Chaiyaphum': 'ชัยภูมิ',
  'Chainat': 'ชัยนาท',
  'Chai Nat': 'ชัยนาท',
  'Chanthaburi': 'จันทบุรี',
  'Chiang Mai': 'เชียงใหม่',
  'Chiang Rai': 'เชียงราย',
  'Chon Buri': 'ชลบุรี',
  'Chonburi': 'ชลบุรี',
  'Chumphon': 'ชุมพร',
  'Kalasin': 'กาฬสินธุ์',
  'Kamphaeng Phet': 'กำแพงเพชร',
  'Kanchanaburi': 'กาญจนบุรี',
  'Khon Kaen': 'ขอนแก่น',
  'Krabi': 'กระบี่',
  'Lampang': 'ลำปาง',
  'Lamphun': 'ลำพูน',
  'Loei': 'เลย',
  'Lop Buri': 'ลพบุรี',
  'Lopburi': 'ลพบุรี',
  'Mae Hong Son': 'แม่ฮ่องสอน',
  'Maha Sarakham': 'มหาสารคาม',
  'Mukdahan': 'มุกดาหาร',
  'Nakhon Nayok': 'นครนายก',
  'Nakhon Pathom': 'นครปฐม',
  'Nakhon Phanom': 'นครพนม',
  'Nakhon Ratchasima': 'นครราชสีมา',
  'Nakhon Sawan': 'นครสวรรค์',
  'Nakhon Si Thammarat': 'นครศรีธรรมราช',
  'Nan': 'น่าน',
  'Narathiwat': 'นราธิวาส',
  'Nong Bua Lam Phu': 'หนองบัวลำภู',
  'Nong Bua Lamphu': 'หนองบัวลำภู',
  'Nong Khai': 'หนองคาย',
  'Nonthaburi': 'นนทบุรี',
  'Pathum Thani': 'ปทุมธานี',
  'Pattani': 'ปัตตานี',
  'Phang Nga': 'พังงา',
  'Phangnga': 'พังงา',
  'Phatthalung': 'พัทลุง',
  'Phayao': 'พะเยา',
  'Phetchabun': 'เพชรบูรณ์',
  'Phetchaburi': 'เพชรบุรี',
  'Phichit': 'พิจิตร',
  'Phitsanulok': 'พิษณุโลก',
  'Phrae': 'แพร่',
  'Phra Nakhon Si Ayutthaya': 'พระนครศรีอยุธยา',
  'Ayutthaya': 'พระนครศรีอยุธยา',
  'Phuket': 'ภูเก็ต',
  'Prachin Buri': 'ปราจีนบุรี',
  'Prachinburi': 'ปราจีนบุรี',
  'Prachuap Khiri Khan': 'ประจวบคีรีขันธ์',
  'Ranong': 'ระนอง',
  'Ratchaburi': 'ราชบุรี',
  'Rayong': 'ระยอง',
  'Roi Et': 'ร้อยเอ็ด',
  'Sa Kaeo': 'สระแก้ว',
  'Sakon Nakhon': 'สกลนคร',
  'Samut Prakan': 'สมุทรปราการ',
  'Samut Sakhon': 'สมุทรสาคร',
  'Samut Songkhram': 'สมุทรสงคราม',
  'Saraburi': 'สระบุรี',
  'Satun': 'สตูล',
  'Sing Buri': 'สิงห์บุรี',
  'Singburi': 'สิงห์บุรี',
  'Si Sa Ket': 'ศรีสะเกษ',
  'Sisaket': 'ศรีสะเกษ',
  'Songkhla': 'สงขลา',
  'Sukhothai': 'สุโขทัย',
  'Suphan Buri': 'สุพรรณบุรี',
  'Suphanburi': 'สุพรรณบุรี',
  'Surat Thani': 'สุราษฎร์ธานี',
  'Surin': 'สุรินทร์',
  'Tak': 'ตาก',
  'Trang': 'ตรัง',
  'Trat': 'ตราด',
  'Ubon Ratchathani': 'อุบลราชธานี',
  'Udon Thani': 'อุดรธานี',
  'Uthai Thani': 'อุทัยธานี',
  'Uttaradit': 'อุตรดิตถ์',
  'Yala': 'ยะลา',
  'Yasothon': 'ยโสธร',
};

// Vibrant, diverse fills for each region
const REGION_FILLS: Record<string, string> = {
  'ภาคเหนือ': '#8B5CF6', // Violet
  'ภาคตะวันออกเฉียงเหนือ': '#EF4444', // Red
  'ภาคกลาง': '#3B82F6', // Blue
  'ภาคตะวันออก': '#10B981', // Green
  'ภาคตะวันตก': '#F59E0B', // Amber
  'ภาคใต้': '#EC4899', // Pink
};

// Accent color shown in the hover-info bar
const REGION_ACCENT: Record<string, string> = {
  'ภาคเหนือ': '#7C3AED',
  'ภาคตะวันออกเฉียงเหนือ': '#DC2626',
  'ภาคกลาง': '#2563EB',
  'ภาคตะวันออก': '#059669',
  'ภาคตะวันตก': '#D97706',
  'ภาคใต้': '#BE185D',
};

const THA_REG_MAP: Record<string, string> = {
  'ภาคเหนือ': 'North',
  'ภาคตะวันออกเฉียงเหนือ': 'Northeast',
  'ภาคกลาง': 'Central',
  'ภาคตะวันออก': 'East',
  'ภาคตะวันตก': 'West',
  'ภาคใต้': 'South'
};

function resolveThaiName(props: Record<string, unknown>): string {
  const engName =
    (props.CHA_NE as string) ||
    (props.NAME_1 as string) ||
    (props.name as string) ||
    '';
  return EN_TO_TH[engName] || engName;
}

interface Props {
  onProvinceSelect: (province: string) => void;
  selectedProvince: string | null;
  lang: 'TH' | 'EN';
  selectedRegion: string | null;
}

// Memoised so parent re-renders don't rebuild the whole map
const GeoLayer = memo(function GeoLayer({
  selectedProvince,
  selectedRegion,
  onEnter,
  onLeave,
  onSelect,
}: {
  selectedProvince: string | null;
  selectedRegion: string | null;
  onEnter: (name: string, region: string) => void;
  onLeave: () => void;
  onSelect: (name: string) => void;
}) {
  return (
    <Geographies geography={GEO_URL}>
      {({ geographies }: { geographies: Array<{ properties: Record<string, unknown>; rsmKey: string }> }) =>
        geographies.map((geo) => {
          const thaiName = resolveThaiName(geo.properties);
          const info = ALL_77_PROVINCES.find((p) => p.name === thaiName);
          const region = info?.region || '';
          const isSelected = selectedProvince === thaiName;
          const isRegionSelected = selectedRegion === region;
          const hasRegionFilter = selectedRegion !== null;

          const baseFill = REGION_FILLS[region] || '#8B5CF6';
          const defaultFill = isSelected ? '#5B21B6' : baseFill;
          
          // Apply region filter effects
          let opacity = 1;
          if (hasRegionFilter && !isRegionSelected) {
            opacity = 0.15;
          }

          return (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              style={{
                default: {
                  fill: defaultFill,
                  stroke: isSelected ? '#fff' : 'rgba(255,255,255,0.4)',
                  strokeWidth: isSelected ? 1.5 : 0.4,
                  outline: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  filter: hasRegionFilter && !isRegionSelected ? 'none' : 'drop-shadow(0px 3px 4px rgba(0,0,0,0.15))',
                  opacity,
                },
                hover: {
                  fill: '#7C3AED',
                  stroke: '#fff',
                  strokeWidth: 1.2,
                  outline: 'none',
                  cursor: 'pointer',
                  filter: 'drop-shadow(0px 4px 8px rgba(124,58,237,0.3))',
                  transition: 'all 0.2s ease',
                  zIndex: 10,
                  opacity: 1,
                },
                pressed: {
                  fill: '#4C1D95',
                  stroke: '#fff',
                  strokeWidth: 1.5,
                  outline: 'none',
                },
              }}
              onMouseEnter={() => onEnter(thaiName, region)}
              onMouseLeave={onLeave}
              onClick={() => thaiName && onSelect(thaiName)}
            />
          );
        })
      }
    </Geographies>
  );
});

export default function ThailandMap({ onProvinceSelect, selectedProvince, lang, selectedRegion }: Props) {
  const [hoverInfo, setHoverInfo] = useState<{ name: string; name_en: string; region: string; region_en: string } | null>(null);

  const handleEnter = useCallback((name: string, region: string) => {
    if (name) {
      const info = ALL_77_PROVINCES.find(p => p.name === name);
      setHoverInfo({ 
        name, 
        name_en: info?.name_en || name,
        region, 
        region_en: THA_REG_MAP[region] || region 
      });
    }
  }, []);

  const handleLeave = useCallback(() => setHoverInfo(null), []);

  const handleSelect = useCallback(
    (name: string) => {
      if (name) onProvinceSelect(name);
    },
    [onProvinceSelect]
  );

  const accentColor = hoverInfo ? (REGION_ACCENT[hoverInfo.region] || '#7C3AED') : '#7C3AED';
  const selectedInfo = selectedProvince
    ? ALL_77_PROVINCES.find((p) => p.name === selectedProvince)
    : null;

  const T = {
    TH: {
      hint: '🖱️ เลื่อนเพื่อซูม | 🤚 ลากเพื่อเลื่อน',
      explore: 'สำรวจประเทศไทยด้วย AI · คลิกจังหวัดบนแผนที่',
      viewing: 'กำลังแสดงข้อมูล',
      clickDetail: 'คลิกเพื่อดูรายละเอียด'
    },
    EN: {
      hint: '🖱️ Scroll to zoom | 🤚 Drag to pan',
      explore: 'Explore Thailand with AI · Click a province',
      viewing: 'Viewing details',
      clickDetail: 'Click for details'
    }
  }[lang];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#cbd5e1' }}>
      {/* Fullscreen Map Background */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ 
            center: [100.5, 13.5], 
            scale: 1800 
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup 
            center={[100.5, 13.5]} 
            zoom={1}
            minZoom={0.5}
            maxZoom={12}
          >
            <GeoLayer
              selectedProvince={selectedProvince}
              selectedRegion={selectedRegion}
              onEnter={handleEnter}
              onLeave={handleLeave}
              onSelect={handleSelect}
            />
          </ZoomableGroup>
        </ComposableMap>
      </div>
      
      {/* Zoom Hint Floating */}
      <div className="absolute bottom-[80px] right-4 md:right-10 bg-white/90 backdrop-blur-md px-3 md:px-5 py-2 md:py-2.5 rounded-2xl md:rounded-[20px] text-[10px] md:text-xs text-[#1e293b] shadow-lg pointer-events-none border border-white/50 flex items-center gap-2 font-semibold z-10 text-center leading-tight">
        <span>{T.hint}</span>
      </div>

      {/* Hover info bar — Fixed at bottom, floating above map */}
      <div className="absolute bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 min-h-[48px] lg:h-14 w-[90%] lg:w-auto flex flex-wrap lg:flex-nowrap items-center justify-center px-4 lg:px-7 gap-2 lg:gap-4 rounded-[24px] lg:rounded-[28px] bg-white/95 backdrop-blur-md shadow-xl border border-white/50 z-20 transition-all duration-300 py-2 lg:py-0">
        {hoverInfo ? (
          <>
            <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full flex-shrink-0" style={{
              background: accentColor,
              boxShadow: `0 0 12px ${accentColor}80`,
            }} />
            <span className="font-black text-sm lg:text-[17px] text-[#1e293b]">
              {lang === 'TH' ? hoverInfo.name : hoverInfo.name_en}
            </span>
            <span className="text-[10px] lg:text-xs text-white rounded-xl lg:rounded-[20px] px-2.5 lg:px-3 py-0.5 lg:py-1 font-bold uppercase tracking-wider flex-shrink-0" style={{ background: accentColor }}>
              {lang === 'TH' ? hoverInfo.region : hoverInfo.region_en}
            </span>
            <span className="text-[11px] lg:text-sm text-[#64748b] font-medium text-center">
              {T.clickDetail}
            </span>
          </>
        ) : selectedInfo ? (
          <>
            <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-[#1e293b] shadow-lg flex-shrink-0" />
            <span className="font-black text-sm lg:text-[17px] text-[#1e293b]">
              📍 {lang === 'TH' ? selectedProvince : selectedInfo.name_en}
            </span>
            <span className="text-[11px] lg:text-sm text-[#64748b] font-medium">
              {T.viewing}
            </span>
          </>
        ) : (
          <span className="text-[11px] lg:text-sm text-[#64748b] font-bold tracking-tight lg:tracking-normal text-center leading-tight">
            {T.explore}
          </span>
        )}
      </div>
    </div>
  );
}
