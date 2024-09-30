import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { city, lat, lon } = req.query;
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing API key' });
  }

  const params = {
    appid: apiKey,
    units: 'metric',
  };

  if (lat && lon) {
    params['lat'] = lat;
    params['lon'] = lon;
  } else if (city) {
    params['q'] = city;
  } else {
    return res.status(400).json({ error: 'City or coordinates are required' });
  }

  try {
    const response = await axios.get(WEATHER_API_URL, { params });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching weather data', details: error.message });
  }
}
