"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { getWeatherInfo } from "@/lib/helpers/weather";
import type { WeatherApiError, WeatherResponse } from "@/types/weather.type";

import {
  CloudSun,
  Droplets,
  MapPin,
  RefreshCw,
  Thermometer,
  Wind,
} from "lucide-react";

interface WeatherCoordinates {
  lat: string;
  lng: string;
}

export default function WeatherButton() {
  const [open, setOpen] = useState(false);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [coordinates, setCoordinates] = useState<WeatherCoordinates | null>(
    null,
  );

  // Listen for coordinates from LocationInitializer.
  useEffect(() => {
    const handleLocationUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<WeatherCoordinates>;

      if (customEvent.detail?.lat && customEvent.detail?.lng) {
        setCoordinates(customEvent.detail);
      }
    };

    window.addEventListener("bondhon:location-updated", handleLocationUpdate);

    return () => {
      window.removeEventListener(
        "bondhon:location-updated",
        handleLocationUpdate,
      );
    };
  }, []);

  // Fetch weather automatically and whenever location changes.
  useEffect(() => {
    const controller = new AbortController();

    async function fetchWeather() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams(window.location.search);

        const lat = coordinates?.lat || params.get("lat");
        const lng = coordinates?.lng || params.get("lng");

        if (lat && lng) {
          params.set("lat", lat);
          params.set("lng", lng);
        }

        const query =
          params.has("lat") && params.has("lng")
            ? `?lat=${encodeURIComponent(params.get("lat")!)}&lng=${encodeURIComponent(params.get("lng")!)}`
            : "";

        const response = await fetch(`/api/weather${query}`, {
          signal: controller.signal,
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            (data as WeatherApiError).message || "Unable to load weather.",
          );
        }

        setWeather(data as WeatherResponse);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setError(
          error instanceof Error ? error.message : "Unable to load weather.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchWeather();

    return () => controller.abort();
  }, [coordinates, retry]);

  const handleRefresh = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const lat = params.get("lat");
    const lng = params.get("lng");

    if (lat && lng) {
      setCoordinates({ lat, lng });
    }

    setRetry((prev) => prev + 1);
  }, []);

  const current = weather?.current;
  const hourly = weather?.hourly;

  const weatherInfo = current
    ? getWeatherInfo(current.weather_code, current.is_day)
    : null;

  const WeatherIcon = weatherInfo?.icon || CloudSun;

  const startIndex = hourly
    ? Math.max(
        0,
        hourly.time.findIndex((time) => time >= (current?.time || "")),
      )
    : 0;

  const hourlyForecast = hourly
    ? hourly.time.slice(startIndex, startIndex + 4).map((time, index) => {
        const actualIndex = startIndex + index;

        return {
          time,
          temperature: hourly.temperature_2m[actualIndex],
          rain: hourly.precipitation_probability[actualIndex],
          code: hourly.weather_code[actualIndex],
        };
      })
    : [];

  const locationName = weather?.location.name || "Your local area";

  const weatherContent = (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Local Weather</h3>
          <p className="text-xs text-muted-foreground">
            Current weather conditions
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="size-8 cursor-pointer rounded-lg p-0 text-muted-foreground hover:text-foreground focus:ring-0"
          disabled={loading}
          onClick={handleRefresh}
          aria-label="Refresh weather"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Loading */}
      {loading && !weather && (
        <div className="flex flex-col items-center gap-3 py-8">
          <CloudSun className="size-10 animate-pulse text-amber-500" />
          <p className="text-sm ">Loading local weather...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && !weather && (
        <div className="space-y-3 py-4 text-center">
          <CloudSun className="mx-auto size-9 text-muted-foreground" />

          <p className="text-sm text-muted-foreground">{error}</p>

          <Button size="sm" variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 size-3.5" />
            Try again
          </Button>
        </div>
      )}

      {/* Weather */}
      {weather && current && (
        <>
          {error && (
            <p className="text-xs text-amber-600 dark:text-amber-500">
              Refresh failed. Showing previous weather data.
            </p>
          )}

          <div className="flex items-center gap-3">
            <WeatherIcon className="size-14 shrink-0 text-amber-500" />

            <div>
              <p className="text-3xl font-semibold tracking-tight tabular-nums">
                {Math.round(current.temperature_2m)}°
              </p>

              <p className="text-sm text-muted-foreground">
                {weatherInfo?.label}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{locationName}</span>
          </div>

          {/* Weather details */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-app-background p-3">
              <div className="mb-2 flex items-center gap-2 text-app-muted-foreground">
                <Thermometer className="size-4" />
                <span className="text-xs">Feels like</span>
              </div>

              <p className="text-sm font-semibold">
                {Math.round(current.apparent_temperature)}°C
              </p>
            </div>

            <div className="rounded-lg bg-app-background p-3">
              <div className="mb-2 flex items-center gap-2 text-app-muted-foreground">
                <Droplets className="size-4" />
                <span className="text-xs">Humidity</span>
              </div>

              <p className="text-sm font-semibold">
                {current.relative_humidity_2m}%
              </p>
            </div>

            <div className="rounded-lg bg-app-background  p-3">
              <div className="mb-2 flex items-center gap-2 text-app-muted-foreground">
                <Wind className="size-4" />
                <span className="text-xs">Wind speed</span>
              </div>

              <p className="text-sm font-semibold">
                {current.wind_speed_10m} km/h
              </p>
            </div>

            <div className="rounded-lg bg-app-background  p-3">
              <div className="mb-2 flex items-center gap-2 text-app-muted-foreground">
                <Droplets className="size-4" />
                <span className="text-xs">Precipitation</span>
              </div>

              <p className="text-sm font-semibold">
                {current.precipitation} mm
              </p>
            </div>
          </div>

          {/* Hourly forecast */}
          {hourlyForecast.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Upcoming Hours</h4>

              <div className="grid grid-cols-4 gap-1">
                {hourlyForecast.map((item) => {
                  const info = getWeatherInfo(item.code);
                  const Icon = info.icon;

                  return (
                    <div
                      key={item.time}
                      className="flex min-w-0 flex-col items-center gap-2 rounded-lg bg-app-background px-1 py-2"
                    >
                      <span className="text-[11px] text-app-muted-foreground">
                        {item.time.slice(11, 16)}
                      </span>

                      <Icon className="size-5 text-amber-500" />

                      <span className="text-sm font-semibold">
                        {Math.round(item.temperature)}°
                      </span>

                      <span className="text-[10px] text-app-muted-foreground">
                        {item.rain}% rain
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* <p className="text-center text-[10px] text-muted-foreground">
            Weather data by Open-Meteo
          </p> */}

          <p className="border-t border-border/60 pt-3 text-center text-[10px] text-muted-foreground">
            Location data ©{" "}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              OpenStreetMap contributors
            </a>
          </p>
        </>
      )}
    </div>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-label="View local weather"
          className="h-8 max-w-[58px] shrink-0 cursor-pointer gap-1 rounded-lg px-1 sm:h-9 sm:max-w-none sm:gap-1.5 sm:rounded-xl sm:px-2 lg:h-10 lg:gap-2 lg:px-3"
        >
          <WeatherIcon className="size-5 shrink-0 text-amber-500" />

          <span className="text-xs font-medium tabular-nums sm:text-sm">
            {current ? `${Math.round(current.temperature_2m)}°` : "--°"}
          </span>

          <span className="hidden max-w-24 truncate text-xs text-muted-foreground sm:inline">
            {loading ? "Loading..." : locationName}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={8}
        className="z-[100] max-h-[min(85vh,680px)] w-[min(360px,calc(100vw-2rem))] overflow-y-auto custom-scrollbar rounded-xl border-border/70 bg-app-card p-4 shadow-lg"
      >
        {weatherContent}
      </PopoverContent>
    </Popover>
  );
}
