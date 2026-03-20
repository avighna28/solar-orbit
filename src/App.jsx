import React, { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { WeatherCard } from './components/WeatherCard';
import { ForecastRow } from './components/ForecastRow';
import { WeatherBackground } from './components/WeatherBackground';
import { AstroMode } from './components/AstroMode';
import { DripAdvisor } from './components/DripAdvisor';
import { ToxicZone } from './components/ToxicZone';
import { TransitionEffect } from './components/TransitionEffect';
import { ThoughtHub } from './components/ThoughtHub';
import { SpaceTime } from './components/SpaceTime';
import { DripAndTrip } from './components/DripAndTrip';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, RefreshCw, Cloud, Moon, Sparkles, Timer, Compass, Github } from 'lucide-react';
import './App.css';

const DEFAULT_LOCATION = { name: 'Mumbai', lat: 19.07, lon: 72.87 };

function App() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [weatherData, setWeatherData] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('weather');
  const [nextView, setNextView] = useState('weather');
  const [showTransition, setShowTransition] = useState(false);
  const [language, setLanguage] = useState('hinglish');

  const switchView = (view) => {
    if (view === currentView) return;
    setNextView(view);
    setShowTransition(true);
    setTimeout(() => {
      setCurrentView(view);
    }, 750); // Mid-transition
    setTimeout(() => {
      setShowTransition(false);
    }, 1500); // End transition
  };

  const fetchWeather = async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`;
      const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5`;
      
      const [weatherRes, aqiRes] = await Promise.all([fetch(url), fetch(aqiUrl)]);
      if (!weatherRes.ok || !aqiRes.ok) throw new Error('Failed to fetch weather or AQI data');
      
      const [weatherData, aqiData] = await Promise.all([weatherRes.json(), aqiRes.json()]);
      setWeatherData(weatherData);
      setAqiData(aqiData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const searchCity = async (name, lat = null, lon = null) => {
    if (lat !== null && lon !== null) {
      setLocation({ name, lat, lon });
      fetchWeather(lat, lon);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Search failed');
      const result = await response.json();
      
      if (result.results && result.results.length > 0) {
        const firstMatch = result.results[0];
        const newLocation = { 
          name: `${firstMatch.name}${firstMatch.admin1 ? ', ' + firstMatch.admin1 : ''}`, 
          lat: firstMatch.latitude, 
          lon: firstMatch.longitude 
        };
        setLocation(newLocation);
        fetchWeather(newLocation.lat, newLocation.lon);
      } else {
        throw new Error('City not found');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setLocation({ name: 'Current Location', lat, lon });
          fetchWeather(lat, lon);
        },
        () => {
          fetchWeather(location.lat, location.lon);
        }
      );
    } else {
      fetchWeather(location.lat, location.lon);
    }
  }, []);

  return (
    <div className="app-container">
      {currentView === 'weather' && weatherData && (
        <WeatherBackground 
          code={weatherData.current.weather_code} 
          isDay={weatherData.current.is_day} 
        />
      )}
      
      <TransitionEffect isVisible={showTransition} viewType={nextView} />

      <main className="main-content">
        <nav className="nav-tabs glass">
          <button 
            className={`tab ${currentView === 'weather' ? 'active' : ''}`}
            onClick={() => switchView('weather')}
          >
            <Cloud size={18} />
            Atmosphere
          </button>
          <button 
            className={`tab ${currentView === 'astro' ? 'active' : ''}`}
            onClick={() => switchView('astro')}
          >
            <Moon size={18} />
            Observatory
          </button>
          <button 
            className={`tab ${currentView === 'thought' ? 'active' : ''}`}
            onClick={() => switchView('thought')}
          >
            <Sparkles size={18} />
            Wisdom
          </button>
          <button 
            className={`tab ${currentView === 'timeline' ? 'active' : ''}`}
            onClick={() => switchView('timeline')}
          >
            <Timer size={18} />
            Timeline
          </button>
          <button 
            className={`tab ${currentView === 'drip' ? 'active' : ''}`}
            onClick={() => switchView('drip')}
          >
            <Compass size={18} />
            Drip & Trip
          </button>
          <div style={{ flex: 1 }}></div>
          <button 
            className="tab"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={() => setLanguage(l => l === 'en' ? 'hinglish' : 'en')}
          >
            {language === 'en' ? 'ENG' : 'HIN'}
          </button>
        </nav>

        <header className="app-header">
          <h1 className="brand">SKY<span>CAST</span></h1>
          {currentView === 'weather' && <SearchBar onSearch={searchCity} />}
        </header>

        <AnimatePresence mode="wait">
          {currentView === 'weather' ? (
            loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="loading-state"
              >
                <Loader2 className="spinner" size={48} color="#a855f7" />
                <p>Scanning the atmosphere...</p>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.9, opacity: 0 }}
                className="error-state glass"
              >
                <AlertCircle size={48} color="#ef4444" />
                <h2>Signal Lost</h2>
                <p>{error}</p>
                <button 
                  className="retry-btn" 
                  onClick={() => searchCity(location.name)}
                >
                  <RefreshCw size={18} />
                  Try Reconnect
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="weather"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, type: "spring", damping: 12 }}
                className="weather-layout"
              >
                <div className="left-col">
                  <WeatherCard data={weatherData} location={location} />
                  <DripAdvisor data={weatherData} language={language} />
                </div>
                <div className="right-col">
                  <ToxicZone data={aqiData} language={language} location={location} />
                  <ForecastRow daily={weatherData.daily} />
                </div>
              </motion.div>
            )
          ) : currentView === 'astro' ? (
            <motion.div
              key="astro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <AstroMode weatherData={weatherData} location={location} />
            </motion.div>
          ) : currentView === 'thought' ? (
            <motion.div
              key="thought"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <ThoughtHub language={language} weatherData={weatherData} aqiData={aqiData} />
            </motion.div>
          ) : currentView === 'timeline' ? (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <SpaceTime weatherData={weatherData} location={location} language={language} />
            </motion.div>
          ) : (
            <motion.div
              key="drip"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <DripAndTrip weatherData={weatherData} aqiData={aqiData} language={language} location={location} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="footer-credits">
        <div className="footer-content">
          <span>SKYCAST | GEN-Z EDITION</span>
          <div className="footer-line"></div>
          <a href="https://github.com/avighna28" target="_blank" rel="noreferrer" className="github-link">
            <Github size={14} />
            <span>BY AVIGHNA</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
