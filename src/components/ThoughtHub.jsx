import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Sparkles, Zap, Coffee, CloudRain, Wind } from 'lucide-react';
import './ThoughtHub.css';

const COSMIC_THOUGHTS = [
  {
    en: "The universe is under no obligation to make sense to you.",
    hinglish: "Brahmand thoda confusing ho sakta hai, par hai sabse bada sach.",
    author: "Neil deGrasse Tyson"
  },
  {
    en: "For small creatures such as we the vastness is bearable only through love.",
    hinglish: "Hum itne chhote hain, is duniya ka darr sirf pyar se hi khatam hota hai.",
    author: "Carl Sagan"
  },
  {
    en: "Somewhere, something incredible is waiting to be known.",
    hinglish: "Kahin na kahin, kuch bahut hi gazab hone wala hai.",
    author: "Carl Sagan"
  },
  {
    en: "We are all made of starstuff.",
    hinglish: "Ham sab taaron ki dhool se bane hain, isliye glow karna toh banta hai.",
    author: "Carl Sagan"
  },
  {
    en: "Look at the stars instead of your feet.",
    hinglish: "Apne joote mat dekho, upar taaron ki chamak dekho.",
    author: "Stephen Hawking"
  }
];

export const ThoughtHub = ({ language, weatherData, aqiData }) => {
  const thought = useMemo(() => {
    const day = new Date().getDate();
    return COSMIC_THOUGHTS[day % COSMIC_THOUGHTS.length];
  }, []);

  const vibe = useMemo(() => {
    if (!weatherData) return { chill: 50, chaotic: 50, msg: "Scanning the vibe..." };
    
    let chill = 50;
    const temp = weatherData.current.temperature_2m;
    const wind = weatherData.current.wind_speed_10m;
    const clouds = weatherData.current.cloud_cover;
    const aqi = aqiData?.current?.us_aqi || 50;

    // Chill factor (20-26C is ideal chill)
    if (temp >= 20 && temp <= 26) chill += 15;
    else if (temp < 15 || temp > 32) chill -= 15;

    // Wind (low wind is chill)
    if (wind < 15) chill += 10;
    else if (wind > 30) chill -= 20;

    // Clouds (cloudy/rainy = cozy/chill)
    if (clouds > 70) chill += 10;

    // AQI (bad air is chaotic)
    if (aqi > 100) chill -= 20;

    chill = Math.min(95, Math.max(5, chill));
    const chaotic = 100 - chill;

    let msg = "";
    let hinglishMsg = "";

    if (chill > 75) {
      msg = "Total chill mode. Perfect for deep thoughts and coffee.";
      hinglishMsg = "Saba chill vibe hai. Coffee uthao aur relax karo!";
    } else if (chaotic > 60) {
      msg = "Chaotic energy outside. Stay focused and keep your cool.";
      hinglishMsg = "Bahar thoda chaos hai. Mind shaant rakho aur focus karo.";
    } else {
      msg = "Balanced energy. A good day to make progress.";
      hinglishMsg = "Ekdum balanced vibe. Kaam khatam karne ka sahi time hai.";
    }

    return { chill, chaotic, msg, hinglishMsg };
  }, [weatherData, aqiData]);

  return (
    <div className="thought-hub-container glass">
      <div className="vibe-section">
        <motion.div 
          className="vibe-card glass"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="vibe-header">
            <Zap size={16} color="#a855f7" />
            <span>AI VIBE ANALYZER</span>
          </div>

          <div className="vibe-stats">
            <div className="vibe-circle">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path className="circle-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <motion.path className="circle"
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${vibe.chill}, 100` }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  stroke="#a855f7"
                />
              </svg>
              <div className="vibe-value">
                <span className="percent">{vibe.chill}%</span>
                <span className="label">CHILL</span>
              </div>
            </div>

            <div className="vibe-info">
              <h3>{language === 'hinglish' ? "Aaj Ki Vibe Check" : "Today's energy"}</h3>
              <p className="vibe-msg">
                {language === 'hinglish' ? vibe.hinglishMsg : vibe.msg}
              </p>
              <div className="vibe-indicators">
                <div className="indicator">
                  <div className="dot chill"></div>
                  <span>{vibe.chill}% Chill</span>
                </div>
                <div className="indicator">
                  <div className="dot chaos"></div>
                  <span>{vibe.chaotic}% Chaos</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="thought-content"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="thought-badge">
          <Sparkles size={16} color="#fcd34d" />
          <span>COSMIC WISDOM</span>
        </div>
        
        <Quote className="quote-icon" size={64} color="rgba(168, 85, 247, 0.2)" />
        
        <h2 className="thought-title">
          {language === 'hinglish' ? "Aaj Ka Vichaar" : "Thought of the Day"}
        </h2>
        
        <p className="main-thought">
          "{language === 'hinglish' ? thought.hinglish : thought.en}"
        </p>
        
        <div className="author-tag">
          <div className="line"></div>
          <span>{thought.author}</span>
          <div className="line"></div>
        </div>
      </motion.div>

      <div className="cosmic-decoration">
        <motion.div className="planet p1" animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }} />
        <motion.div className="planet p2" animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} />
      </div>
    </div>
  );
};
