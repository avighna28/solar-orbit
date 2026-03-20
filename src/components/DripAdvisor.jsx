import React from 'react';
import { Sparkles, Shirt, Umbrella, ThermometerSun, Snowflake } from 'lucide-react';
import './DripAdvisor.css';

export const DripAdvisor = ({ data, language = 'hinglish' }) => {
  if (!data || !data.current) return null;

  const getDripAdvice = () => {
    const { temperature_2m: temp, relative_humidity_2m: humidity, weather_code: code } = data.current;

    const isEng = language === 'en';

    // Rain conditions (51-67, 80-82)
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
      return {
        icon: <Umbrella size={24} color="#60a5fa" />,
        title: isEng ? "Rain Alert 🌧️" : "Rain Alert 🌧️",
        advice: isEng 
          ? "High chance of rain! Forget the suede shoes, grab a waterproof jacket and dark pants to avoid mud stains. Stay drippy!" 
          : "Bhai baarish ke full chances hain. Suede ke joote bhool ja aaj, waterproof jacket aur dark pants pahen le taki keechad na lage. Stay drippy!",
        color: "#60a5fa"
      };
    }
    
    // Snow conditions (71-77, 85-86)
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
      return {
        icon: <Snowflake size={24} color="#e2e8f0" />,
        title: isEng ? "Cold AF ❄️" : "Cold AF ❄️",
        advice: isEng 
          ? "It's freezing outside! Pull out the puffer jacket and definitely wear a beanie. Layering is key today bro."
          : "Bahar full snow scene hai. Puffer jacket nikal le aur beanie zaroor pahenna. Crazy layering is the key today bro.",
        color: "#e2e8f0"
      };
    }

    // High Heat + Humid
    if (temp > 30 && humidity > 60) {
      return {
        icon: <ThermometerSun size={24} color="#f59e0b" />,
        title: isEng ? "Sticky Vibes 🥵" : "Sticky Vibes 🥵",
        advice: isEng 
          ? "It's super hot and humid today. Skip the sneakers, wear slides or crocs and a breathable oversized tee. Deodorant is a must!"
          : "Bhai aaj humidity aur garmi dono full on hain. Sneakers mat pahen, slides ya crocs daal le aur ek breathable oversized t-shirt best rahegi. Deo must hai!",
        color: "#f59e0b"
      };
    }

    // High Heat + Dry
    if (temp > 34) {
      return {
        icon: <ThermometerSun size={24} color="#ef4444" />,
        title: isEng ? "It's Burning 🔥" : "Aag Baras Rahi Hai 🔥",
        advice: isEng
          ? "It's literally burning outside. Linen shirt, sunglasses, and a cap are mandatory. Don't step out without sunscreen."
          : "Bahar aag baras rahi hai bro. Full linen shirt, sunglasses aur cap must hai. Sunscreen laga kar hi nikalna bahar.",
        color: "#ef4444"
      };
    }

    // Cold
    if (temp < 15) {
      return {
        icon: <Shirt size={24} color="#818cf8" />,
        title: isEng ? "Chilly Vibes 🥶" : "Chilly Vibes 🥶",
        advice: isEng 
          ? "It's getting chilly! A good hoodie or a denim jacket will do. Time to flex those cargo pants and chunky sneakers."
          : "Thand kaafi badh gayi hai. Ek badhiya hoodie ya denim jacket chalegi aaj. Cargo pants aur chunky sneakers flex karne ka time hai.",
        color: "#818cf8"
      };
    }

    // Default / Perfect weather
    return {
      icon: <Sparkles size={24} color="#a855f7" />,
      title: isEng ? "Perfect Drip ✨" : "Perfect Drip ✨",
      advice: isEng 
        ? "The weather is absolute perfection today! Pull out your best streetwear, flex those favorite sneakers. No weather tension today."
        : "Aaj ka mausam ekdam perfect hai bro! Apna best streetwear nikal, favorite sneakers flex kar. No weather tension today.",
      color: "#a855f7"
    };
  };

  const advice = getDripAdvice();

  return (
    <div className="drip-advisor-card glass">
      <div className="drip-header">
        <div className="icon-wrapper" style={{ background: `${advice.color}20` }}>
          {advice.icon}
        </div>
        <div className="drip-title-wrapper">
          <h3>GEN-Z DRIP ADVISOR</h3>
          <span className="drip-status" style={{ color: advice.color }}>{advice.title}</span>
        </div>
      </div>
      <p className="drip-text">
        "{advice.advice}"
      </p>
    </div>
  );
};

