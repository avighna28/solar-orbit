import React from 'react';
import { Cloud, Sun, CloudRain, Snowflake } from 'lucide-react';
import './ForecastRow.css';

const getWeatherIcon = (code, size = 24) => {
  if (code === 0) return <Sun size={size} color="#FFD700" />;
  if (code <= 3) return <Cloud size={size} color="#CBD5E1" />;
  if (code >= 51 && code <= 67) return <CloudRain size={size} color="#60A5FA" />;
  if (code >= 71 && code <= 77) return <Snowflake size={size} color="#E2E8F0" />;
  return <Cloud size={size} color="#94A3B8" />;
};

const getDayName = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export const ForecastRow = ({ daily }) => {
  // Combine daily data points into array of objects
  const days = daily.time.map((time, i) => ({
    time,
    weather_code: daily.weather_code[i],
    max_temp: Math.round(daily.temperature_2m_max[i]),
    min_temp: Math.round(daily.temperature_2m_min[i]),
  })).slice(1, 8); // Next 7 days

  return (
    <div className="forecast-container glass">
      <h3>7-Day Forecast</h3>
      <div className="forecast-list">
        {days.map((day, idx) => (
          <div key={idx} className="forecast-item">
            <span className="forecast-day">{getDayName(day.time)}</span>
            <div className="forecast-icon">
              {getWeatherIcon(day.weather_code, 32)}
            </div>
            <div className="forecast-temps">
              <span className="temp-max">{day.max_temp}°</span>
              <span className="temp-min">{day.min_temp}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
