import React from 'react';
import { ShieldAlert, Wind } from 'lucide-react';
import './ToxicZone.css';

export const ToxicZone = ({ data, language, location }) => {
  if (!data || !data.current) return null;

  const { us_aqi: aqi, pm2_5: pm25, pm10 } = data.current;

  let status = '';
  let color = '';
  let msg = '';

  if (aqi <= 50) {
    status = language === 'en' ? 'Clean Air' : 'Saaf Hawa';
    color = '#10b981'; // green
    msg = language === 'en' ? "Breathe easy, the air is clean today. Good vibes only." : "Bhai hawa ekdam saaf hai. Lungs khush hain aaj, mast saans le!";
  } else if (aqi <= 100) {
    status = language === 'en' ? 'Moderate' : 'Thik-Thak';
    color = '#f59e0b'; // yellow
    msg = language === 'en' ? "Air quality is decent. Just standard city vibes, nothing too crazy." : "Hawa thik-thak hai bro. Zyada pollution nahi hai par ekdam fresh bhi nahi hai.";
  } else if (aqi <= 150) {
    status = language === 'en' ? 'Unhealthy for Sensitives' : 'Gandi Hawa';
    color = '#f97316'; // orange
    msg = language === 'en' ? "Getting a bit toxic out there. Sensitive groups should stay alert." : "Boss thoda pollution badh gaya hai. Agar cough/cold hai toh dhyaan rakhna bahar.";
  } else {
    status = language === 'en' ? 'TOXIC ZONE' : 'ZEHER HAI BHAI';
    color = '#ef4444'; // red
    msg = language === 'en' ? "Toxic Zone Alert - Mask On Bro! The air is literally poison today. Avoid outdoor flexing." : "Toxic Zone Alert - Mask On Bro! Hawa mein zeher ghula hai aaj, bina mask ke nikla toh bhand ho jayega!";
  }

  const isToxic = aqi > 150;

  return (
    <div className={`toxic-zone-card glass ${isToxic ? 'toxic-glow' : ''}`}>
       {isToxic && <div className="toxic-smoke"></div>}
       <div className="tz-header">
         <div className="tz-icon" style={{ background: `${color}25`, border: `1px solid ${color}40` }}>
            {isToxic ? <ShieldAlert size={20} color={color} /> : <Wind size={20} color={color} />}
         </div>
         <div className="tz-title">
           <span className="city-label">{location?.name?.substring(0,15)?.toUpperCase() || 'CITY'} AQI</span>
           <span className="aqi-value" style={{ color, textShadow: isToxic ? `0 0 10px ${color}` : 'none' }}>
             {Math.round(aqi)} - {status}
           </span>
         </div>
       </div>

       <div className="tz-details">
          <div className="tz-stat">
            <span className="lbl">PM2.5</span>
            <span className="val">{Math.round(pm25)}</span>
          </div>
          <div className="tz-stat">
            <span className="lbl">PM10</span>
            <span className="val">{Math.round(pm10)}</span>
          </div>
       </div>

       <p className="tz-message" style={{ color: isToxic ? '#fca5a5' : 'rgba(255,255,255,0.7)' }}>
         "{msg}"
       </p>
    </div>
  );
};
