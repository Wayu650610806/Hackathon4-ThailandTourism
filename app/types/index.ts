export interface Attraction {
  id: string;
  name: string;
  category: 'Culture' | 'Food' | 'Temple' | 'Adventure' | 'Must Go';
  district?: string;
  tambon?: string;
  lat: number;
  long: number;
  image_path?: string;
  event_date?: string;
  open_time?: string;
  close_time?: string;
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
export type WeatherForecastMode = 'normal' | 'rain' | 'cold' | 'hot';
export type TravelerLevel = 'low' | 'medium' | 'high' | 'max';

export interface WeatherForecast {
  temp_max_avg_c: number;
  temp_min_avg_c: number;
  precipitation_total_mm: number;
  rainy_days: number;
  mode: WeatherForecastMode;
}

export interface TravelerPrediction {
  total_visitors: number;
  thai_visitors: number;
  foreign_visitors: number;
  level: TravelerLevel;
}

export interface WeatherData {
  location: string;
  date: string;
  weather: {
    condition: WeatherCondition;
    temperature: number;
    description: string;
    description_en: string;
  };
  crowd: {
    level: CrowdLevel;
    description: string;
    description_en: string;
  };
  forecast?: WeatherForecast;
  travelers?: TravelerPrediction;
}

export interface ThaiRegion {
  id: string;
  name: string;
  name_en: string;
  color: string;
  provinces: string[];
}
