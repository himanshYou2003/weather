"use client"; 
import { getWeatherIcon } from '@/utils/weatherIcons';

interface WeatherDetailsProps {
  weather: any;
  handleClick: (type: string) => void;
  refs: {
    cloudSoundRef: React.RefObject<HTMLAudioElement>;
    rainSoundRef: React.RefObject<HTMLAudioElement>;
    snowSoundRef: React.RefObject<HTMLAudioElement>;
    sunnySoundRef: React.RefObject<HTMLAudioElement>;
  };
}

export default function WeatherDetails({ weather, handleClick }: WeatherDetailsProps) {
  return (
    <div className="text-white text-center z-20">
      <h1 className="text-6xl font-bold text-gray-200 font-General">{weather.city.name}</h1>
      <p className="text-9xl font-light font-Sharpie">{weather.list[0].main.temp}°C</p>
      <p className="text-2xl mb-8 text-gray-200">{weather.list[0].weather[0].description}</p>
      <img
        src={getWeatherIcon(weather.list[0].weather[0].main.toLowerCase())}
        alt={weather.list[0].weather[0].description}
        className="w-28 h-28 cursor-pointer"
        onClick={() => handleClick(weather.list[0].weather[0].main)}
      />
    </div>
  );
}
