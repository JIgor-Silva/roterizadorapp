interface WeatherData {
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    precip_mm: number; 
  };
  location: {
    name: string;
    localtime_epoch: number;
  };
  forecast: {
    forecastday: Array<{
      day: {
        daily_chance_of_rain: number;
      };
    }>;
  };
}

export interface WeatherDisplayProps {
  clientLocation?: { latitude: number; longitude: number };
  clientOrderId?: number;
  clientName?: string;
}

export type WeatherDataType = WeatherData;
