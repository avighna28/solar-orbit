import React, { useRef, Suspense, useState, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Float, Sparkles, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Moon, Star, Calendar, Zap, Sun, Compass } from 'lucide-react';
import './AstroMode.css';

// Real-time Moon Phase Calculation
const getMoonPhase = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const lp = 2551443;
  const now = new Date(year, month - 1, day, 20, 35, 0);
  const newMoon = new Date(1970, 0, 7, 20, 35, 0);
  const phase = ((now.getTime() - newMoon.getTime()) / 1000) % lp;
  const phaseDays = Math.floor(phase / (24 * 3600)) + 1;
  const cyclePercent = (phase / lp);

  let name = "New Moon";
  if (cyclePercent > 0.03) name = "Waxing Crescent";
  if (cyclePercent > 0.22) name = "First Quarter";
  if (cyclePercent > 0.28) name = "Waxing Gibbous";
  if (cyclePercent > 0.47) name = "Full Moon";
  if (cyclePercent > 0.53) name = "Waning Gibbous";
  if (cyclePercent > 0.72) name = "Last Quarter";
  if (cyclePercent > 0.78) name = "Waning Crescent";
  if (cyclePercent > 0.97) name = "New Moon";

  return { name, cyclePercent };
};

// 3D Moon Component
const DetailedMoon = () => {
  const moonRef = useRef();
  
  // Load textures
  const [colorMap] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg'
  ]);

  useFrame(({ clock }) => {
    if (moonRef.current) {
      moonRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group>
      {/* Neon Glow Aura */}
      <mesh>
        <sphereGeometry args={[2.58, 64, 64]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
      
      {/* Main Moon */}
      <mesh ref={moonRef} castShadow receiveShadow>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial 
          map={colorMap} 
          bumpMap={colorMap}
          bumpScale={0.05}
          roughness={0.9}
          metalness={0.2}
          emissive="#1e1b4b"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
};

// Scene Lighting tailored to Moon Phase
const PhaseLight = ({ cyclePercent }) => {
  // Rotate the "Sun" (light) around the moon based on the phase
  const angle = (cyclePercent * Math.PI * 2) + Math.PI;
  const x = Math.sin(angle) * 12;
  const z = Math.cos(angle) * 12;

  return (
    <>
      <pointLight position={[x, 2, z]} intensity={3.5} color="#ffffff" castShadow />
      
      {/* Deep Space Background / Ambient Light to prevent pitch blackness */}
      <ambientLight intensity={0.15} color="#c084fc" />
      
      {/* Purple/Cyan Rim Lighting for Premium Gen Z Look */}
      <spotLight position={[-10, 10, -10]} angle={0.5} penumbra={1} intensity={150} color="#06b6d4" />
      <spotLight position={[10, -10, -10]} angle={0.5} penumbra={1} intensity={150} color="#ec4899" />
    </>
  );
};

// Constellation Lines Component
const ConstellationLines = () => {
  const points = useMemo(() => {
    return Array.from({ length: 20 }, () => [
      new THREE.Vector3().setFromSphericalCoords(10, Math.random() * Math.PI, Math.random() * Math.PI * 2),
      new THREE.Vector3().setFromSphericalCoords(10, Math.random() * Math.PI, Math.random() * Math.PI * 2)
    ]);
  }, []);

  return (
    <group>
      {points.map((p, i) => (
        <line key={i}>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array([...p[0].toArray(), ...p[1].toArray()])}
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial attach="material" color="#a855f7" transparent opacity={0.1} />
        </line>
      ))}
    </group>
  );
};

export const AstroMode = ({ weatherData, location }) => {
  const [activeConstellation, setActiveConstellation] = useState('Orion');
  const moonInfo = useMemo(() => getMoonPhase(), []);

  // Compute real data if available
  const cloudCover = weatherData?.current?.cloud_cover || 0;
  const clarityPercent = Math.max(0, 100 - cloudCover);
  const clarityStatus = clarityPercent > 80 ? 'OPTIMAL' : clarityPercent > 40 ? 'MODERATE' : 'POOR';
  
  const getEventTime = (isoString) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const sunrise = weatherData?.daily?.sunrise?.[0];
  const sunset = weatherData?.daily?.sunset?.[0];

  return (
    <div className="astro-container glass">
      <div className="astro-sidebar">
        <div className="sidebar-header">
          <Moon className="pulse-icon" size={18} />
          <span>CELESTIAL HUB (LIVE)</span>
        </div>

        <div className="astro-stats">
          <div className="astro-card">
            <span className="label">SKY CLARITY ({clarityPercent}%)</span>
            <span className="value" style={{ color: clarityPercent > 80 ? '#10b981' : clarityPercent > 40 ? '#f59e0b' : '#ef4444' }}>
              {clarityStatus}
            </span>
            <div className="clarity-bar"><div className="fill" style={{ width: `${clarityPercent}%` }}></div></div>
          </div>
          
          <div className="constellation-selector">
            <span className="label">ACTIVE REGION</span>
            {['Orion', 'Leo', 'Cygnus', 'Aquila'].map(c => (
              <button 
                key={c} 
                className={`const-btn ${activeConstellation === c ? 'active' : ''}`}
                onClick={() => setActiveConstellation(c)}
              >
                {c} Region
              </button>
            ))}
          </div>
        </div>

        <div className="upcoming-events">
          <span className="label">LIVE TELEMETRY</span>
          <div className="event-item">
            <Calendar size={14} color="#a855f7" />
            <div className="event-info">
              <span className="event-name">Current Phase</span>
              <span className="event-date">{moonInfo.name}</span>
            </div>
          </div>
          <div className="event-item">
            <Sun size={14} color="#f59e0b" />
            <div className="event-info">
              <span className="event-name">Solar Events</span>
              <span className="event-date">
                ↑ {getEventTime(sunrise)} | ↓ {getEventTime(sunset)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="canvas-container">
        <Canvas shadows className="astro-canvas">
          <PerspectiveCamera makeDefault position={[0, 0, 8]} />
          
          <Suspense fallback={<Text color="white" fontSize={0.5}>CALCULATING ORBITS...</Text>}>
            <DetailedMoon />
            <PhaseLight cyclePercent={moonInfo.cyclePercent} />
            <Sparkles count={50} scale={10} size={1} speed={0.2} opacity={0.3} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
            <ConstellationLines />
          </Suspense>

          <OrbitControls 
            enablePan={false} 
            enableZoom={true} 
            minDistance={4} 
            maxDistance={12}
            autoRotateSpeed={0.5}
          />
        </Canvas>
        
        <div className="canvas-overlay">
          <div className="hud-corner top-right">
            <Compass size={18} />
            <span>{location?.name?.substring(0, 15)?.toUpperCase() || 'UNKNOWN'} | HDG: 182.4°</span>
          </div>
          <div className="hud-corner bottom-left">
            <span>REAL-TIME PHASE: {moonInfo.name} ({Math.floor(moonInfo.cyclePercent * 100)}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

