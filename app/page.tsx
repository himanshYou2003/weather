// app/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import Clock from './components/Clock';
import WeatherDetails from './components/WeatherDetails';
import Forecast from './components/Forecast';
import AdditionalFunctionalityPage from './components/AdditionalFunctionalityPage';

const MapContainer = dynamic(() => import('./components/Map'), { ssr: false });

export default function Page() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default coordinates (London)
  const [error, setError] = useState('');
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  const cloudSoundRef = useRef<HTMLAudioElement>(null);
  const rainSoundRef = useRef<HTMLAudioElement>(null);
  const snowSoundRef = useRef<HTMLAudioElement>(null);
  const sunnySoundRef = useRef<HTMLAudioElement>(null);

  const fetchWeather = async () => {
    try {
      const response = await axios.get('/api/weather', { params: { city } });
      setWeather(response.data);
      setMapCenter([response.data.city.coord.lat, response.data.city.coord.lon]);
      setError('');
    } catch (error) {
      setError('Could not fetch weather data');
    }
  };

  const fetchWeatherByLocation = async (lat: number, lon: number) => {
    try {
      const response = await axios.get('/api/weather', { params: { lat, lon } });
      setWeather(response.data);
      setMapCenter([lat, lon]);
      setError('');
    } catch (error) {
      setError('Could not fetch weather data');
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => fetchWeatherByLocation(position.coords.latitude, position.coords.longitude),
        () => setError('Failed to get your location')
      );
    }
  }, []);

  const stopAllSounds = () => {
    const sounds = [cloudSoundRef, rainSoundRef, snowSoundRef, sunnySoundRef];
    sounds.forEach(ref => {
      if (ref.current && ref.current !== currentlyPlaying) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });
  };

  const toggleSound = (soundRef: React.RefObject<HTMLAudioElement>, soundType: string) => {
    if (currentlyPlaying === soundType) {
      soundRef.current?.pause();
      soundRef.current.currentTime = 0;
      setCurrentlyPlaying(null);
    } else {
      stopAllSounds();
      if (soundRef.current) {
        soundRef.current.play();
        setCurrentlyPlaying(soundType);
      }
    }
  };

  return (
    <div className="w-screen h-screen relative">
      <video className="absolute inset-0 object-cover w-full h-full" src="/bg.mp4" autoPlay loop muted />
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-lg"></div>

      <div className="relative z-10 w-screen h-screen flex flex-col items-center justify-center">
        <div className="absolute top-5 left-5 flex items-center z-20">
          <input
            type="text"
            className="px-4 py-2 border-2 text-yellow-200 uppercase tracking-wide border-white rounded-lg focus:outline-none bg-transparent text-white"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={fetchWeather} className="ml-4 px-4 py-2 bg-blue-400 text-gray-800 text-xl font-semibold rounded-lg hover:bg-blue-200 transition">
            Search
          </button>
          <button
            onClick={() => {
              navigator.geolocation.getCurrentPosition(
                (position) => fetchWeatherByLocation(position.coords.latitude, position.coords.longitude),
                () => setError('Failed to get your location')
              );
            }}
            className="ml-4 px-4 py-2 bg-blue-400 text-gray-800 text-xl font-semibold rounded-lg hover:bg-blue-200 transition"
          >
            Current Location
          </button>
        </div>
        <div className="absolute top-5 right-5 flex items-center z-20">
          <Clock location={weather?.city?.name} />
        </div>

        {weather && (
          <>
            <WeatherDetails 
              weather={weather} 
              handleClick={(type) => {
                if (type === 'Clouds') toggleSound(cloudSoundRef, 'Clouds');
                if (type === 'Rain') toggleSound(rainSoundRef, 'Rain');
                if (type === 'Snow') toggleSound(snowSoundRef, 'Snow');
                if (type === 'Clear') toggleSound(sunnySoundRef, 'Clear');
              }} 
              refs={{ cloudSoundRef, rainSoundRef, snowSoundRef, sunnySoundRef }} 
            />
            <AdditionalFunctionalityPage/>
            <Forecast 
              weather={weather} 
              handleClick={(type) => {
                if (type === 'Clouds') toggleSound(cloudSoundRef, 'Clouds');
                if (type === 'Rain') toggleSound(rainSoundRef, 'Rain');
                if (type === 'Snow') toggleSound(snowSoundRef, 'Snow');
                if (type === 'Clear') toggleSound(sunnySoundRef, 'Clear');
              }} 
              refs={{ cloudSoundRef, rainSoundRef, snowSoundRef, sunnySoundRef }} 
            />
          </>
        )}

        {error && <p className="text-red-500 text-lg font-semibold absolute bottom-5 z-20">{error}</p>}

        <MapContainer mapCenter={mapCenter} />
      </div>

      <audio ref={cloudSoundRef} src="/CloudSound.mp3" preload="auto" />
      <audio ref={rainSoundRef} src="/RainSound.mp3" preload="auto" />
      <audio ref={snowSoundRef} src="/SnowRain.mp3" preload="auto" />
      <audio ref={sunnySoundRef} src="/SummerSound.mp3" preload="auto" />
    </div>
  );
}
