// /app/components/Clock.tsx

"use client"; // Add this line at the top of the file

import { useState, useEffect } from 'react';

interface ClockProps {
  location?: string;
}

export default function Clock({ location }: ClockProps) {
  const [time, setTime] = useState(new Date());
  const [timezone, setTimezone] = useState('local');
  const [isClient, setIsClient] = useState(false);

  // Function to fetch the timezone based on the location
  const fetchTimezone = async (location: string) => {
    try {
      const response = await fetch(
        `https://api.api-ninjas.com/v1/worldtime?city=${location}`, 
        {
          headers: { 'X-Api-Key': process.env.NINJAS_API_KEY || '' }
        }
      );
      const data = await response.json();
      setTimezone(data.timezone);
    } catch (error) {
      console.error('Error fetching time zone:', error);
      setTimezone('local');
    }
  };

  useEffect(() => {
    setIsClient(true); // Ensure this is only set client-side
  }, []);

  useEffect(() => {
    if (location && isClient) {
      fetchTimezone(location);
    }
  }, [location, isClient]);

  useEffect(() => {
    if (isClient) {
      const interval = setInterval(() => {
        setTime(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isClient]);

  // Get time in specific timezone if provided
  const getTimeString = () => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone !== 'local' ? timezone : undefined,
    };
    return time.toLocaleTimeString([], options);
  };

  return (
    <div className="text-white text-xl font-semibold">
      {isClient ? getTimeString() : 'Loading...'}
    </div>
  );
}
