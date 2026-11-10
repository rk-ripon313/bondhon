import { getCurrentUser } from "@/database/queries/user.query";
import type { WeatherLocation, WeatherResponse } from "@/types/weather.type";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function isValidCoordinates(lat: number, lng: number) {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180
  );
}

async function getCoordinates(
  area?: string,
  district?: string,
): Promise<WeatherLocation | null> {
  const searches = [
    [area, district, "Bangladesh"].filter(Boolean).join(", "),
    [district, "Bangladesh"].filter(Boolean).join(", "),
  ].filter((value, index, array) => value && array.indexOf(value) === index);

  for (const search of searches) {
    const params = new URLSearchParams({
      name: search,
      count: "1",
      language: "en",
      format: "json",
    });

    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?${params}`,
      { next: { revalidate: 86400 } },
    );

    if (!response.ok) continue;

    const data = await response.json();
    const result = data.results?.[0];

    if (result) {
      return {
        name: [area, district].filter(Boolean).join(", "),
        latitude: result.latitude,
        longitude: result.longitude,
      };
    }
  }

  return null;
}

async function getReverseLocationName(
  lat: number,
  lng: number,
): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      lat: lat.toFixed(3),
      lon: lng.toFixed(3),
      format: "jsonv2",
      zoom: "14",
      addressdetails: "1",
      "accept-language": "en",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params}`,
      {
        headers: {
          "User-Agent": "BondhOn/1.0 (weather location lookup)",
        },
        next: { revalidate: 86400 },
      },
    );

    if (!response.ok) return null;

    const data = await response.json();
    const address = data.address;

    if (!address) return null;

    const area =
      address.neighbourhood ||
      address.suburb ||
      address.quarter ||
      address.village ||
      address.town ||
      address.city ||
      address.municipality;

    const district = address.state_district || address.county;

    const locationParts = [area, district]
      .filter(Boolean)
      .filter(
        (value, index, array) =>
          array.findIndex(
            (item) => item.toLowerCase() === value.toLowerCase(),
          ) === index,
      );

    return locationParts.join(", ") || null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");

    const lat = latParam === null ? NaN : Number(latParam);
    const lng = lngParam === null ? NaN : Number(lngParam);

    const hasUrlCoordinates = isValidCoordinates(lat, lng);

    let location: WeatherLocation | null = null;

    //  URL coordinates have the highest priority.
    if (hasUrlCoordinates) {
      location = {
        name: "Nearby location",
        latitude: lat,
        longitude: lng,
      };
    } else {
      //  Fall back to authenticated user's saved location.
      const user = await getCurrentUser();

      if (!user) {
        return NextResponse.json(
          {
            message: "Location is unavailable. Please set your location first.",
          },
          { status: 404 },
        );
      }

      const savedCoordinates = user.location?.coordinates?.coordinates;

      if (
        savedCoordinates?.length === 2 &&
        isValidCoordinates(savedCoordinates[1], savedCoordinates[0])
      ) {
        const [longitude, latitude] = savedCoordinates;

        location = {
          name:
            [user.location?.area, user.location?.district]
              .filter(Boolean)
              .join(", ") || "Your location",
          latitude,
          longitude,
        };
      }

      //  Fall back to area and district geocoding.
      if (!location) {
        location = await getCoordinates(
          user.location?.area,
          user.location?.district,
        );
      }
    }

    if (!location) {
      return NextResponse.json(
        {
          message: "Location not found. Please update your profile location.",
        },
        { status: 404 },
      );
    }

    // Fetch actual location name for URL coordinates.
    const isNearbyLocation = hasUrlCoordinates;

    const [locationName, weatherResponse] = await Promise.all([
      isNearbyLocation
        ? getReverseLocationName(lat, lng)
        : Promise.resolve(null),

      // Fetch weather.
      (async () => {
        const params = new URLSearchParams({
          latitude: String(location!.latitude),
          longitude: String(location!.longitude),

          current: [
            "temperature_2m",
            "apparent_temperature",
            "relative_humidity_2m",
            "precipitation",
            "weather_code",
            "wind_speed_10m",
            "is_day",
          ].join(","),

          hourly: [
            "temperature_2m",
            "precipitation_probability",
            "weather_code",
          ].join(","),

          forecast_days: "2",
          timezone: "auto",
        });

        return fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
          next: { revalidate: 1800 },
        });
      })(),
    ]);

    if (!weatherResponse.ok) {
      throw new Error("Weather service is unavailable.");
    }

    const data = await weatherResponse.json();

    const result: WeatherResponse = {
      location: {
        ...location,
        name: locationName || location.name,
      },
      current: data.current,
      hourly: data.hourly,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Weather API Error:", error);

    return NextResponse.json(
      { message: "Unable to load weather information." },
      { status: 500 },
    );
  }
}
