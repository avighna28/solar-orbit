import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shirt, MapPin, Sparkles, Navigation, CloudRain, Sun, Zap, Info } from 'lucide-react';
import './DripAndTrip.css';

export const DripAndTrip = ({ weatherData, location, language }) => {
  const data = useMemo(() => {
    if (!weatherData?.current) return null;
    
    const temp = weatherData.current.temperature_2m;
    const code = weatherData.current.weather_code;
    const isEng = language === 'en';
    
    // 1. DRIP (What to wear)
    let drip = {
      title: isEng ? "Street Style" : "Street Style",
      outfit: isEng ? "Oversized Tee + Cargoes" : "Oversized Tee + Cargoes",
      advice: isEng ? "Keep it light and breathable." : "Halka-phulka pehno, garmi se bacho."
    };

    if (temp < 15) {
      drip = {
        title: isEng ? "Cozy Fleecy" : "Thand Vibes",
        outfit: isEng ? "Hoodie + Puffer Jacket" : "Hoodie + Bhaari Jacket",
        advice: isEng ? "Layer up, it's freezing out there!" : "Full bharkam thand hai, layers pehno!"
      };
    } else if (code >= 51 && code <= 82) {
      drip = {
        title: isEng ? "Storm Shield" : "Rainy Gear",
        outfit: isEng ? "Windbreaker + Waterproof Boots" : "Raincoat + Waterproof Joote",
        advice: isEng ? "Stay dry while flexing the fit." : "Mausam mast hai, par raincoat mat bhoolna."
      };
    }

    // 2. TRIP (Where to go)
    let trip = {
      title: isEng ? "Casual Chill" : "Vibe check",
      place: isEng ? "Local Park or Street Food" : "Pass ka park ya chaat bhandaar",
      vibe: "Cafe & Relax"
    };

    if (temp > 30) {
      trip = {
        title: isEng ? "Heat Escape" : "Garmi se Bacho",
        place: isEng ? "Air-conditioned Mall or Museum" : "AC wala Mall ya naya Museum",
        vibe: "Indoor & AC"
      };
    } else if (code >= 51 && code <= 82) {
      trip = {
        title: isEng ? "Rainy Romance" : "Baarish Moments",
        place: isEng ? "Cozy Rooftop Cafe" : "Mast Rooftop Cafe ya Highway Drive",
        vibe: "Scenic & Moody"
      };
    } else if (temp < 18) {
      trip = {
        title: isEng ? "Outdoor Adventure" : "Ghumna-phirna",
        place: isEng ? "Hilltop or Open Cafe" : "Upar ki hill ya open-air terrace",
        vibe: "Fresh & Breezy"
      };
    }

    return { drip, trip };
  }, [weatherData, language]);

  if (!data) return <div className="loading-state">Vibe scan is in progress...</div>;

  return (
    <div className="drip-trip-container glass">
      <header className="drip-trip-header">
        <Sparkles size={24} color="#a855f7" />
        <h2>DRIP & TRIP</h2>
        <span className="location-info">| {location?.name?.split(',')[0]} EDITION</span>
      </header>

      <div className="dt-grid">
        <motion.div 
          className="dt-card drip-mode glass"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="card-top">
            <Shirt size={20} color="#a855f7" />
            <span className="tag">THE DRIP CHECK</span>
          </div>
          <div className="card-body">
            <h3>{data.drip.title}</h3>
            <div className="outfit-box">
              <span className="outfit-text">{data.drip.outfit}</span>
            </div>
            <p className="advice-text">{data.drip.advice}</p>
          </div>
        </motion.div>

        <motion.div 
          className="dt-card trip-mode glass"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card-top">
            <MapPin size={20} color="#06b6d4" />
            <span className="tag">THE TRIP ADVISOR</span>
          </div>
          <div className="card-body">
            <h3>{data.trip.title}</h3>
            <div className="place-box">
              <span className="place-text">{data.trip.place}</span>
            </div>
            <p className="vibe-text">Vibe: {data.trip.vibe}</p>
          </div>
        </motion.div>
      </div>

      <div className="dt-footer-banner">
        <Info size={16} />
        <span>{language === 'hinglish' ? "Pro Tip: Sunscreen aur shades mat bhoolna, chahe mausam kaisa bhi ho." : "Pro Tip: Never forget your sunscreen and shades, no matter the weather."}</span>
      </div>
    </div>
  );
};
