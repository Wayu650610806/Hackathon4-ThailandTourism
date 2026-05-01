export interface Attraction {
  id: string;
  name: string;
  category: 'Culture' | 'Food' | 'Temple' | 'Adventure' | 'Must Go';
  district: string;
  tambon: string;
  lat: number;
  long: number;
  image_path: string;
  event_date: string;
  description?: string;
}

export interface Province {
  province: string;
  province_en: string;
  region: string;
  region_en: string;
  total_attractions: number;
  description?: string;
  attractions: Attraction[];
}

export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'hot' | 'cool';
export type CrowdLevel = 'low' | 'medium' | 'high';

export interface WeatherData {
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

export interface ThaiRegion {
  id: string;
  name: string;
  name_en: string;
  color: string;
  provinces: string[];
}
