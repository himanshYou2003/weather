"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function AdditionalFunctionalityPage() {
  const [weather, setWeather] = useState<any>(null); // Adjust the type according to your weather data structure
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.505, -0.09]); // Default coordinates (London)
  const [error, setError] = useState("");

  const fetchWeatherByLocation = async (lat: number, lon: number) => {
    try {
      const response = await axios.get("/api/weather", {
        params: { lat, lon },
      });
      setWeather(response.data);
      setMapCenter([lat, lon]);
      setError("");
    } catch (error) {
      setError("Could not fetch weather data");
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          fetchWeatherByLocation(
            position.coords.latitude,
            position.coords.longitude
          ),
        () => setError("Failed to get your location")
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div className="flex space-x-4 overflow-x-auto">
      <div className="grid grid-cols-5 gap-4 w-full mt-8">
        {weather && (
          <>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center w-[9vw]">
              <h3 className="font-semibold text-2xl text-gray-700 mb-7">
                Wind Speed
              </h3>
              <p className="text-2xl">{weather.list[0].wind.speed} m/s</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-2xl text-gray-700 mb-7">
                Humidity
              </h3>
              <p className="text-2xl">{weather.list[0].main.humidity}%</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-2xl text-gray-700 mb-7">
                Pressure
              </h3>
              <p className="text-2xl">{weather.list[0].main.pressure} hPa</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-2xl text-gray-700 mb-7">
                Visibility
              </h3>
              <p className="text-2xl">{weather.list[0].visibility / 1000} km</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center">
              <h3 className="font-semibold text-2xl text-gray-700 mb-7">
                Cloud Cover
              </h3>
              <p className="text-2xl">{weather.list[0].clouds.all}%</p>
            </div>
          </>
        )}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}
