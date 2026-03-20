import React from 'react';
import './WeatherBackground.css';

export const WeatherBackground = ({ code, isDay }) => {
  const getAtmosphere = () => {
    if (code === 0) return isDay ? 'sunny' : 'starry';
    if (code <= 3) return 'cloudy';
    if (code >= 51 && code <= 67) return 'rainy';
    if (code >= 71 && code <= 77) return 'snowy';
    return isDay ? 'sunny' : 'starry';
  };

  const atmosphere = getAtmosphere();

  return (
    <div className={`weather-bg-container ${atmosphere}`}>
      <div className="gradient-overlay"></div>
      
      {atmosphere === 'starry' && (
        <div className="stars">
          {[...Array(25)].map((_, i) => (
            <div key={i} className="star"></div>
          ))}
        </div>
      )}

      {atmosphere === 'sunny' && (
        <div className="sun-effect">
          <div className="sun-core"></div>
          <div className="sun-rays"></div>
        </div>
      )}

      {atmosphere === 'rainy' && (
        <div className="rain">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="drop"></div>
          ))}
        </div>
      )}

      {atmosphere === 'snowy' && (
        <div className="snow">
          {[...Array(25)].map((_, i) => (
            <div key={i} className="snowflake"></div>
          ))}
        </div>
      )}

      {atmosphere === 'cloudy' && (
        <div className="clouds">
          <div className="cloud c1"></div>
          <div className="cloud c2"></div>
          <div className="cloud c3"></div>
        </div>
      )}
    </div>
  );
};
