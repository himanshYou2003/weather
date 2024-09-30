export const weatherIcons = {
    clear: '/icons/sunny.svg',
    rain: '/icons/rainy.svg',
    snow: '/icons/snowy.svg',
    clouds: '/icons/cloudy.svg',
    default: '/icons/default.svg',
  };
  
  export function getWeatherIcon(condition: string) {
    return weatherIcons[condition] || weatherIcons['default'];
  }
  