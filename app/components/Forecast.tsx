"use client";
import { getFiveDayForecast, formatDate } from '@/utils/helpers';
import { getWeatherIcon } from '@/utils/weatherIcons';

interface ForecastProps {
  weather: any;
  handleClick: (type: string) => void;
  refs: {
    cloudSoundRef: React.RefObject<HTMLAudioElement>;
    rainSoundRef: React.RefObject<HTMLAudioElement>;
    snowSoundRef: React.RefObject<HTMLAudioElement>;
    sunnySoundRef: React.RefObject<HTMLAudioElement>;
  };
}

export default function Forecast({ weather, handleClick }: ForecastProps) {
  return (
    <div className="mt-8">
      <div className="flex space-x-4 overflow-x-auto">
        {getFiveDayForecast(weather.list).map((day) => (
          <div key={day.dt} className="bg-white bg-opacity-20 p-4 rounded-lg text-center h-[13vw] w-[9vw]">
            <h3 className="font-semibold text-2xl text-gray-700 mb-7">{formatDate(day.dt)}</h3>
            <p className="text-4xl font-bold mb-6">{day.main.temp}°C</p>
            <p className="text-xl mb-3 text-gray-200">{day.weather[0].description}</p>
            <img
              src={getWeatherIcon(day.weather[0].main.toLowerCase())}
              alt={day.weather[0].description}
              className="w-16 h-16 mb-2 m-auto cursor-pointer"
              onClick={() => handleClick(day.weather[0].main)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
