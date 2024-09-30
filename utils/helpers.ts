export function formatDate(timestamp: number) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  }
  
  export function getFiveDayForecast(list: any[]) {
    const forecast = [];
    let currentDay = new Date().toISOString().split('T')[0];
    for (let i = 0; i < list.length; i++) {
      const forecastDate = new Date(list[i].dt * 1000).toISOString().split('T')[0];
      if (forecastDate !== currentDay) {
        forecast.push(list[i]);
        currentDay = forecastDate;
        if (forecast.length === 5) break;
      }
    }
    return forecast;
  }
  