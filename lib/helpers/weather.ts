import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Cloudy,
  Sun,
} from "lucide-react";

export function getWeatherInfo(code: number, isDay = 1) {
  if (code === 0) {
    return {
      label: "Clear Sky",
      icon: isDay ? Sun : Cloud,
    };
  }

  if (code === 1 || code === 2) {
    return {
      label: "Partly Cloudy",
      icon: CloudSun,
    };
  }

  if (code === 3) {
    return {
      label: "Overcast",
      icon: Cloud,
    };
  }

  if ([45, 48].includes(code)) {
    return {
      label: "Foggy",
      icon: CloudFog,
    };
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return {
      label: "Drizzle",
      icon: CloudDrizzle,
    };
  }

  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return {
      label: "Rainy",
      icon: CloudRain,
    };
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return {
      label: "Snowfall",
      icon: CloudSnow,
    };
  }

  if ([95, 96, 99].includes(code)) {
    return {
      label: "Thunderstorm",
      icon: CloudLightning,
    };
  }

  return {
    label: "Cloudy",
    icon: Cloudy,
  };
}
