import React from 'react';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Droplets, Thermometer, Eye } from 'lucide-react';
import './WeatherCard.css';

const getWeatherIcon = (code, size = 64) => {
  if (code === 0) return <Sun size={size} color="#FFD700" />;
  if (code <= 3) return <Cloud size={size} color="#CBD5E1" />;
  if (code >= 51 && code <= 67) return <CloudRain size={size} color="#60A5FA" />;
  if (code >= 71 && code <= 77) return <Snowflake size={size} color="#E2E8F0" />;
  return <Cloud size={size} color="#94A3B8" />;
};

const getWeatherLabel = (code) => {
  if (code === 0) return 'Clear Sky';
  if (code === 1 || code === 2 || code === 3) return 'Partly Cloudy';
  if (code >= 51 && code <= 67) return 'Rainy';
  if (code >= 71 && code <= 77) return 'Snowy';
  return 'Cloudy';
};

export const WeatherCard = ({ data, location }) => {
  const { current } = data;
  
  return (
    <div className="weather-card glass">
      <div className="city-info">
        <h2>{location.name}</h2>
        <p className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>
      
      <div className="main-stats">
        {getWeatherIcon(current.weather_code, 96)}
        <div className="temp-wrapper">
          <span className="temperature">{Math.round(current.temperature_2m)}°</span>
          <span className="condition">{getWeatherLabel(current.weather_code)}</span>
          <span className="feels-like">Feels like {Math.round(current.apparent_temperature)}°</span>
        </div>
      </div>

      <div className="details-grid">
        <div className="detail-item">
          <Wind className="detail-icon" size={22} />
          <div>
            <p className="detail-label">Wind</p>
            <p className="detail-value">{current.wind_speed_10m} km/h</p>
          </div>
        </div>
        <div className="detail-item">
          <Droplets className="detail-icon" size={22} />
          <div>
            <p className="detail-label">Humidity</p>
            <p className="detail-value">{current.relative_humidity_2m}%</p>
          </div>
        </div>
        <div className="detail-item">
          <Eye className="detail-icon" size={22} />
          <div>
            <p className="detail-label">Cloud Cover</p>
            <p className="detail-value">{current.cloud_cover}%</p>
          </div>
        </div>
        <div className="detail-item">
          <Thermometer className="detail-icon" size={22} />
          <div>
            <p className="detail-label">Pressure</p>
            <p className="detail-value">{Math.round(current.pressure_msl)} hPa</p>
          </div>
        </div>
      </div>
    </div>
  );
};

