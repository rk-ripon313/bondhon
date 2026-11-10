export interface WeatherLocation {
  name: string;
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  precipitation: number;
  weather_code: number;
  wind_speed_10m: number;
  is_day: number;
  time: string;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  precipitation_probability: number[];
  weather_code: number[];
}

export interface WeatherResponse {
  location: WeatherLocation;
  current: CurrentWeather;
  hourly: HourlyWeather;
}

export interface WeatherApiError {
  message: string;
}
