import React, { useState, useEffect } from 'react';
import { Camera, Radio, VideoOff, Terminal, Eye, Crosshair } from 'lucide-react';
import './SurveillanceMode.css';

const CAMERAS = [
  // Using 4K persistent city videos instead of Live streams which constantly expire/block localhost
  { id: 'nyc', name: 'New York', label: 'CAM-01: NEW YORK (STREET)', videoId: 'F8MN0o6RS9o' },
  { id: 'tyo', name: 'Tokyo', label: 'CAM-02: TOKYO (SHIBUYA)', videoId: '0nTOJHQHJUc' },
  { id: 'lon', name: 'London', label: 'CAM-03: LONDON LIVE', videoId: 'K27OALaX4_E' },
  { id: 'ven', name: 'Venice', label: 'CAM-04: VENICE CANALS', videoId: 'o1X3T_G2tng' },
  { id: 'amu', name: 'Amsterdam', label: 'CAM-05: AMSTERDAM', videoId: 'xRkK5EaX-XQ' },
  { id: 'iss', name: 'Space', label: 'CAM-00: ISS ORBIT VIEW', videoId: '86YLFOog4GM' },
];

export const SurveillanceMode = ({ location }) => {
  const [activeCam, setActiveCam] = useState(null);
  const [glitchText, setGlitchText] = useState('INTERCEPTING SIGNAL...');
  
  // Terminal time
  const [time, setTime] = useState('');
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toISOString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setActiveCam(null);
    setGlitchText(`SCANNING FREQUENCIES IN [ ${location?.name?.toUpperCase() || 'UNKNOWN'} ]...`);
    
    const timer = setTimeout(() => {
      let found = null;
      if (location && location.name) {
        const locName = location.name.toLowerCase();
        found = CAMERAS.find(c => locName.includes(c.name.toLowerCase()));
      }
      
      if (!found) {
        setGlitchText('ERROR: NO CAMERA FOUND. REROUTING TO ISS...');
        setTimeout(() => {
          setActiveCam(CAMERAS.find(c => c.id === 'iss'));
        }, 1500);
      } else {
        setActiveCam(found);
      }
    }, 2000); // 2 second fake hacking delay
    
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="surveillance-wrapper glass">
      <div className="surveillance-sidebar">
        <div className="sidebar-title">
          <Terminal size={18} color="#10b981" />
          <span>SYS_MONITOR v2.1</span>
        </div>
        
        <div className="cam-list">
          <span className="section-title">GLOBAL NETWORK</span>
          {CAMERAS.map(cam => (
            <button 
              key={cam.id}
              className={`cam-btn ${activeCam?.id === cam.id ? 'active' : ''}`}
              onClick={() => setActiveCam(cam)}
            >
              <Camera size={14} className="cam-icon" />
              <span>{cam.name.toUpperCase()}</span>
              {activeCam?.id === cam.id && <div className="live-dot" />}
            </button>
          ))}
        </div>

        <div className="terminal-log">
          <span className="section-title">TERMINAL LOG</span>
          <div className="log-entries">
            <p>&#62; Auth accepted</p>
            <p className="highlight">&#62; Connecting proxy...</p>
            <p>&#62; Uplink established</p>
            {activeCam && <p className="success">&#62; {activeCam.label} LIVE</p>}
          </div>
        </div>
      </div>

      <div className="cctv-monitor">
        {!activeCam ? (
          <div className="static-screen">
             <VideoOff size={64} className="error-icon" />
             <p className="glitch">{glitchText}</p>
          </div>
        ) : (
          <div className="iframe-wrapper" style={{ filter: 'contrast(1.1) brightness(0.9) grayscale(0.2)' }}>
            <iframe 
              key={activeCam.id}
              src={`https://www.youtube.com/embed/${activeCam.videoId}?autoplay=1&mute=1&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0&origin=${window.location.origin}`}
              allow="autoplay; encrypted-media; picture-in-picture" 
              allowFullScreen={false}
              frameBorder="0"
              title="CCTV Feed"
              style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
            ></iframe>
          </div>
        )}

        {/* Cyberpunk Camera Overlay */}
        <div className="scanlines"></div>
        <div className="vignette"></div>
        
        {/* HUD Elements */}
        {activeCam && (
          <>
            <div className="hud top-left">
              <span className="blink-rec">● REC</span>
              <span>{activeCam.label}</span>
            </div>
            <div className="hud top-right pointer">
              <Radio size={16} /> <span>LIVE</span>
            </div>
            <div className="hud bottom-left">
              <span>SYS_TEMP: OPTIMAL</span>
              <span>LAT_LONG_OVR</span>
            </div>
            <div className="hud bottom-right">
              <span>{time}</span>
              <Crosshair size={28} className="hud-target" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
