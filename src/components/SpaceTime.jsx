import React, { useState, useMemo, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Sparkles, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Clock, Thermometer, Zap, AlertTriangle, ArrowLeft, ArrowRight } from 'lucide-react';
import './SpaceTime.css';

// 3D Earth Component (No Clouds Version)
const SimulatedEarth = ({ year }) => {
  const earthRef = useRef();
  
  // Load premium textures
  const [colorMap, normalMap, specularMap] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
  ]);

  // Determine atmospheric color / health based on year
  const atmosphereColor = useMemo(() => {
    if (year < 1960) return "#0ea5e9"; 
    if (year > 2080) return "#ef4444"; 
    return "#3b82f6"; 
  }, [year]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (earthRef.current) {
      earthRef.current.rotation.y = t * 0.04 + (year - 2026) * 0.001;
    }
  });

  return (
    <group>
      {/* 1. Atmosphere Rim Glow */}
      <mesh>
        <sphereGeometry args={[2.7, 64, 64]} />
        <meshBasicMaterial 
          color={atmosphereColor} 
          transparent 
          opacity={0.1} 
          side={THREE.BackSide} 
        />
      </mesh>
      
      {/* 2. Main Earth Body with Normal & Specular Mapping */}
      <mesh ref={earthRef} castShadow>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial 
          map={colorMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.8, 0.8)}
          roughnessMap={specularMap}
          metalness={0.25}
          roughness={0.5}
          emissive={atmosphereColor}
          emissiveIntensity={year > 2090 ? 0.25 : 0.05}
        />
      </mesh>
    </group>
  );
};

export const SpaceTime = ({ weatherData, location, language }) => {
  const [year, setYear] = useState(2026);
  
  const simulation = useMemo(() => {
    const diff = year - 2026;
    const baseTemp = weatherData?.current?.temperature_2m || 24;
    
    let simTemp = baseTemp + (diff * 0.08); 
    let simAqi = 50;
    
    if (year < 1960) simAqi = 12; 
    else if (year < 2026) simAqi = 12 + (year - 1960) * 1.8;
    else if (year < 2085) simAqi = 85 + (year - 2026) * 2.5;
    else simAqi = 160 - (year - 2085) * 1.5; 

    let event = "Scanning Temporal Data...";
    let hinglishEvent = "Data scan ho raha hai...";

    if (year < 1950) {
      event = "Pristine Era: Earth is at its peak ecosystem health.";
      hinglishEvent = "Pristine Era: Dharti apne sabse shudh roop mein hai.";
    } else if (year > 2115) {
      event = "Post-Climate Era: Atmospheric domes active.";
      hinglishEvent = "Post-Climate Era: Domes ke andar ki duniya.";
    } else if (year > 2075) {
      event = "Thermal Breach: High methane and carbon levels.";
      hinglishEvent = "Garmi ka Keher: Global warming khatre ke nishan par.";
    } else {
      event = "Holocene Transition: Rapid industrial growth.";
      hinglishEvent = "Holocene Transition: Industrial growth ka asar.";
    }

    return { 
      temp: simTemp.toFixed(1), 
      aqi: Math.round(simAqi),
      event,
      hinglishEvent
    };
  }, [year, weatherData]);

  return (
    <div className="spacetime-container glass">
      <div className="timeline-hud-left">
        <div className="hud-title">
          <Clock size={16} color="#0ea5e9" />
          <span>CHRONOS CORE v2.8</span>
        </div>
        
        <div className="year-display">
          <div className="digit-group">
            <span className="year-label">TEMPORAL COORDINATE (EARTH)</span>
            <span className="year-value">{year}</span>
          </div>
          <div className="year-slider-container">
            <input 
              type="range" 
              min="1926" 
              max="2126" 
              value={year} 
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="timeline-slider"
            />
            <div className="slider-labels">
              <span>PRISTINE</span>
              <span>SYNTHETIC</span>
            </div>
          </div>
        </div>

        <div className="simulated-data">
          <div className="sim-card neon-card">
            <Thermometer size={14} color="#f87171" />
            <div className="sim-info">
              <span className="label">GLOBAL TEMP AVG</span>
              <span className="value">{simulation.temp}°C</span>
            </div>
          </div>
          <div className="sim-card neon-card">
            <Zap size={14} color="#38bdf8" />
            <div className="sim-info">
              <span className="label">PARTICLE DENSITY</span>
              <span className="value">{simulation.aqi} AQI</span>
            </div>
          </div>
        </div>
      </div>

      <div className="simulation-canvas">
        <Canvas shadows gl={{ antialias: true }}>
          <PerspectiveCamera makeDefault position={[0, 1, 9]} />
          <Suspense fallback={null}>
            <SimulatedEarth year={year} />
            <Stars radius={120} depth={50} count={year < 1960 ? 10000 : 4000} factor={4} saturation={0} fade speed={1} />
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 5, 10]} intensity={4.5} color="#ffffff" castShadow />
            <pointLight position={[-10, -5, -5]} intensity={1.5} color={year > 2080 ? "#ef4444" : "#0369a1"} />
            <Sparkles count={year > 2085 ? 120 : 60} scale={10} size={1} speed={0.4} opacity={0.3} />
            <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={20} blur={2.5} far={4} />
          </Suspense>
          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            minDistance={4} 
            maxDistance={15} 
            autoRotate 
            autoRotateSpeed={0.3} 
          />
        </Canvas>

        <div className="era-message glass premium-border">
          <AlertTriangle size={18} color="#fbbf24" className="pulse-icon" />
          <div className="message-content">
            <p className="event-main">{language === 'hinglish' ? simulation.hinglishEvent : simulation.event}</p>
            <span className="update-tag">LIVE SIMULATION</span>
          </div>
        </div>
      </div>

      <div className="timeline-footer">
        <div className="location-tag">
          <span className="bracket">[</span>
          <span>{location?.name?.split(',')[0]?.toUpperCase() || 'WORLD'} RECONSTRUCTING TIMELINE</span>
          <span className="bracket">]</span>
        </div>
      </div>
    </div>
  );
};
