import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Navigation, Shield, Wind, Radio } from 'lucide-react';
import './FlightMap.css';

export const FlightMap = () => {
  const [activeFlights, setActiveFlights] = useState([]);

  useEffect(() => {
    // Generate some mock flight data
    const flights = [
      { id: 'EK202', from: 'DXB', to: 'JFK', progress: 65, status: 'On Time', lat: 40, lon: 30 },
      { id: 'QR741', from: 'DOH', to: 'LHR', progress: 40, status: 'Delayed', lat: 25, lon: 15 },
      { id: 'AI101', from: 'BOM', to: 'EWR', progress: 85, status: 'On Time', lat: 50, lon: 70 },
      { id: 'AF012', from: 'CDG', to: 'HND', progress: 20, status: 'On Time', lat: 35, lon: 120 },
    ];
    setActiveFlights(flights);
  }, []);

  return (
    <div className="flight-map-container glass">
      <div className="map-header">
        <div className="header-left">
          <Radio className="pulse-icon" size={20} color="#a855f7" />
          <h3>LIVE AIR TRAFFIC</h3>
        </div>
        <div className="map-stats">
          <span>Active: 1,429</span>
          <span className="divider">|</span>
          <span>Region: Global</span>
        </div>
      </div>

      <div className="map-viewport">
        {/* Mock SVG World Map with Glow */}
        <svg viewBox="0 0 800 400" className="world-map">
          <path 
            className="land" 
            d="M150,150 L200,120 L250,150 L300,130 L350,160 L400,140 L450,170 L500,150 L550,180 L600,160 L650,190 L700,170 L750,200 L750,300 L150,300 Z" 
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(255,255,255,0.1)"
          />
          
          {activeFlights.map((flight) => (
            <motion.g 
              key={flight.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <circle 
                cx={flight.lon * 5} 
                cy={flight.lat * 2} 
                r="3" 
                fill="#a855f7" 
                className="flight-dot"
              />
              <motion.path
                d={`M${flight.lon * 5 - 50},${flight.lat * 2 + 20} Q${flight.lon * 5},${flight.lat * 2 - 20} ${flight.lon * 5},${flight.lat * 2}`}
                stroke="url(#pathGradient)"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.g>
          ))}
          
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>

        <div className="flight-overlay">
          <AnimatePresence>
            {activeFlights.map((flight) => (
              <motion.div 
                key={flight.id}
                className="flight-card-mini glass"
                whileHover={{ scale: 1.05, borderColor: '#a855f7' }}
              >
                <div className="flight-id-row">
                  <Plane size={14} className="plane-icon" />
                  <span className="flight-id">{flight.id}</span>
                  <span className={`status-tag ${flight.status.toLowerCase().replace(' ', '-')}`}>
                    {flight.status}
                  </span>
                </div>
                <div className="route-info">
                  <span className="airport">{flight.from}</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${flight.progress}%` }}></div>
                  </div>
                  <span className="airport">{flight.to}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="map-footer">
        <div className="stat-item">
          <Navigation size={16} />
          <span>RNAV ACTIVE</span>
        </div>
        <div className="stat-item">
          <Shield size={16} />
          <span>SECURED</span>
        </div>
        <div className="stat-item">
          <Wind size={16} />
          <span>NW 12KT</span>
        </div>
      </div>
    </div>
  );
};
