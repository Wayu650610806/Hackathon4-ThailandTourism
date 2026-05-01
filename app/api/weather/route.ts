import { NextRequest, NextResponse } from 'next/server';

type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'hot' | 'cool';
type CrowdLevel = 'low' | 'medium' | 'high';

interface WeatherResponse {
  location: string;
  date: string;
  weather: {
    condition: WeatherCondition;
    temperature: number;
    humidity: number;
    description: string;
    description_en: string;
  };
  crowd: {
    level: CrowdLevel;
    score: number;
    description: string;
    description_en: string;
  };
}

const weatherPatterns: Record<string, { conditions: WeatherCondition[]; tempRange: [number, number] }> = {
  ภาคเหนือ: { conditions: ['sunny', 'cool', 'cloudy'], tempRange: [18, 35] },
  ภาคกลาง: { conditions: ['hot', 'sunny', 'rainy'], tempRange: [25, 40] },
  ภาคใต้: { conditions: ['rainy', 'cloudy', 'sunny'], tempRange: [24, 35] },
  ภาคตะวันออกเฉียงเหนือ: { conditions: ['hot', 'sunny', 'rainy'], tempRange: [20, 42] },
  ภาคตะวันออก: { conditions: ['sunny', 'rainy', 'cloudy'], tempRange: [24, 38] },
  ภาคตะวันตก: { conditions: ['sunny', 'rainy', 'stormy'], tempRange: [22, 38] },
};

const weatherDescriptions: Record<WeatherCondition, { th: string; en: string }> = {
  sunny: { th: 'แดดจัด ท้องฟ้าแจ่มใส', en: 'Sunny and clear skies' },
  cloudy: { th: 'มีเมฆบางส่วน', en: 'Partly cloudy' },
  rainy: { th: 'มีฝนตกบางช่วง', en: 'Occasional rain showers' },
  stormy: { th: 'พายุฝนฟ้าคะนอง', en: 'Thunderstorms expected' },
  hot: { th: 'อากาศร้อนจัด', en: 'Very hot and humid' },
  cool: { th: 'อากาศเย็นสบาย', en: 'Cool and pleasant' },
};

const crowdDescriptions: Record<CrowdLevel, { th: string; en: string }> = {
  low: { th: 'นักท่องเที่ยวน้อย เหมาะสำหรับการพักผ่อน', en: 'Low crowds, great for relaxation' },
  medium: { th: 'นักท่องเที่ยวปานกลาง', en: 'Moderate visitor traffic' },
  high: { th: 'นักท่องเที่ยวหนาแน่น ควรจองล่วงหน้า', en: 'High crowds, book in advance' },
};

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateMockData(location: string, date: string, region: string): WeatherResponse {
  const dateObj = new Date(date);
  const month = dateObj.getMonth() + 1;
  const seed = location.charCodeAt(0) + month * 31 + dateObj.getDate();

  const pattern = weatherPatterns[region] || weatherPatterns['ภาคกลาง'];
  const conditionIdx = Math.floor(seededRandom(seed) * pattern.conditions.length);
  const condition = pattern.conditions[conditionIdx];

  const [minTemp, maxTemp] = pattern.tempRange;
  const temp = Math.round(minTemp + seededRandom(seed + 1) * (maxTemp - minTemp));
  const humidity = Math.round(40 + seededRandom(seed + 2) * 50);

  // Crowd peaks in Nov-Jan and Apr-May
  const isPeakSeason = [11, 12, 1, 4, 5].includes(month);
  const crowdSeed = seededRandom(seed + 3);
  let crowdLevel: CrowdLevel;
  if (isPeakSeason) {
    crowdLevel = crowdSeed < 0.3 ? 'medium' : 'high';
  } else {
    crowdLevel = crowdSeed < 0.4 ? 'low' : crowdSeed < 0.7 ? 'medium' : 'high';
  }
  const crowdScore = Math.round(
    crowdLevel === 'low' ? 10 + crowdSeed * 30 :
    crowdLevel === 'medium' ? 40 + crowdSeed * 30 :
    70 + crowdSeed * 30
  );

  return {
    location,
    date,
    weather: {
      condition,
      temperature: temp,
      humidity,
      description: weatherDescriptions[condition].th,
      description_en: weatherDescriptions[condition].en,
    },
    crowd: {
      level: crowdLevel,
      score: crowdScore,
      description: crowdDescriptions[crowdLevel].th,
      description_en: crowdDescriptions[crowdLevel].en,
    },
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location') || 'Unknown';
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const region = searchParams.get('region') || 'ภาคกลาง';

  await new Promise(resolve => setTimeout(resolve, 300));

  const data = generateMockData(location, date, region);
  return NextResponse.json(data);
}
