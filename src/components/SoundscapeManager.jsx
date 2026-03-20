import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import './Soundscape.css';

export const SoundscapeManager = ({ view, weatherCode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  
  // Track mapping based on view and weather
  const getTrack = () => {
    // Due to Google Actions Sounds shutting down causing 404s, 
    // we use a highly reliable 24/7 Lo-Fi developer radio stream for all modes.
    const reliableStreamUrl = 'https://coderadio-admin.freecodecamp.org/radio/8000/radio.mp3';

    if (view === 'astro') {
      return { 
        src: reliableStreamUrl, 
        name: 'Space Lo-Fi Beats 🚀' 
      };
    }
    
    // Check if raining
    const isRaining = (weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82);
    if (isRaining) {
      return { 
        src: reliableStreamUrl, 
        name: 'Rainy Day Lo-Fi 🌧️' 
      };
    }
    
    // Clear/Sunny
    return { 
      src: reliableStreamUrl, 
      name: 'Sunny Vibe Lo-Fi ✨' 
    };
  };

  const currentTrack = getTrack();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
    }
  }, []);

  // Handle auto-play when track source changes
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(e => {
        console.error('Audio playback failed (Autoplay blocked):', e);
        setIsPlaying(false);
      });
    }
  }, [currentTrack.src]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => {
        console.error('Playback error:', e);
      });
    }
  };

  return (
    <>
      <audio ref={audioRef} src={currentTrack.src} loop crossOrigin="anonymous" />
      <button className={`soundscape-widget glass ${isPlaying ? 'playing' : ''}`} onClick={togglePlay}>
        <div className="icon-pulse">
          {isPlaying ? <Volume2 size={18} color="#a855f7" /> : <VolumeX size={18} color="rgba(255,255,255,0.4)" />}
        </div>
        
        <div className="track-details">
          <span className="track-label">ATMOSPHERE SOUNDSCAPES</span>
          <span className="track-name" style={{ color: isPlaying ? 'white' : 'rgba(255,255,255,0.4)' }}>
            {currentTrack.name}
          </span>
        </div>

        <div className="music-bars">
          <span className={`bar ${isPlaying ? 'animate' : ''}`}></span>
          <span className={`bar ${isPlaying ? 'animate' : ''}`} style={{ animationDelay: '0.2s' }}></span>
          <span className={`bar ${isPlaying ? 'animate' : ''}`} style={{ animationDelay: '0.4s' }}></span>
        </div>
      </button>
    </>
  );
};

