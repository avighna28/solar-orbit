import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Plane, Navigation, Shield, Wind, Radio, Loader2, Info } from 'lucide-react';
import './FlightMapLeaflet.css';

// Enhanced Plane Icon with dynamic coloring
const createPlaneIcon = (rotation, altitude) => {
  // Color mapping based on altitude (FL)
  let color = '#a855f7'; // Purple default
  if (altitude > 35000) color = '#ec4899'; // Pink for high FL
  if (altitude < 10000) color = '#06b6d4'; // Cyan for low FL
  
  return L.divIcon({
    className: 'custom-plane-icon',
    html: `<div style="transform: rotate(${rotation}deg); color: ${color};">
             <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
               <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
             </svg>
           </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

export const FlightMapLeaflet = () => {
  const [flights, setFlights] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState({}); // Tracking history for trails

  const fetchLiveFlights = async () => {
    try {
      const response = await fetch('https://opensky-network.org/api/states/all');
      if (!response.ok) throw new Error('API Rate limit reached');
      const data = await response.json();
      
      const mappedFlights = data.states
        .filter(s => s[5] && s[6] && s[1])
        .slice(0, 100)
        .map(s => ({
          tag: s[0],
          id: s[1].trim() || 'N/A',
          country: s[2],
          lon: s[5],
          lat: s[6],
          alt: Math.round(s[7] * 3.28084 || 0),
          speed: Math.round(s[9] * 3.6 || 0),
          heading: s[10] || 0,
        }));
      
      setFlights(mappedFlights);
      
      // Update history for trails
      setHistory(prev => {
        const newHistory = { ...prev };
        mappedFlights.forEach(f => {
          if (!newHistory[f.tag]) newHistory[f.tag] = [];
          newHistory[f.tag] = [...newHistory[f.tag].slice(-10), [f.lat, f.lon]];
        });
        return newHistory;
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching OpenSky data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveFlights();
    const interval = setInterval(fetchLiveFlights, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredFlights = flights.filter(f => 
    f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.country?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flight-radar-container glass">
      <div className="radar-sidebar">
        <div className="sidebar-header">
          <Radio className="pulse-icon" size={18} />
          <span>RADAR FEED {loading && '(LIVE)'}</span>
        </div>
        
        <div className="flight-search-box">
          <input 
            type="text" 
            placeholder="Search Flight / Call-sign..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mini-search"
          />
        </div>

        <div className="flight-list scroll-area">
          {loading && flights.length === 0 ? (
            <div className="loading-flights">
              <Loader2 className="spinner" size={24} />
              <span>Scanning Skies...</span>
            </div>
          ) : filteredFlights.length > 0 ? (
            filteredFlights.map(flight => (
              <div 
                key={flight.tag} 
                className={`flight-item-mini ${selectedFlight?.tag === flight.tag ? 'active' : ''}`}
                onClick={() => setSelectedFlight(flight)}
              >
                <div className="id-badge">{flight.id}</div>
                <div className="route">{flight.country}</div>
                <div className="alt" style={{ color: flight.alt > 30000 ? '#ec4899' : '#06b6d4' }}>
                  {flight.alt.toLocaleString()} FT
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">No active flights matching search</div>
          )}
        </div>
      </div>

      <div className="map-view-container">
        <MapContainer 
          center={[30, 0]} 
          zoom={3} 
          scrollWheelZoom={true} 
          className="radar-map"
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap &copy; CARTO'
          />
          {flights.map(flight => (
            <React.Fragment key={flight.tag}>
              {selectedFlight?.tag === flight.tag && history[flight.tag] && (
                <Polyline 
                  positions={history[flight.tag]} 
                  color="#a855f7" 
                  weight={2} 
                  opacity={0.6}
                  dashArray="5, 10"
                />
              )}
              <Marker 
                position={[flight.lat, flight.lon]} 
                icon={createPlaneIcon(flight.heading - 45, flight.alt)}
                eventHandlers={{
                  click: () => setSelectedFlight(flight)
                }}
              >
                <Tooltip direction="bottom" offset={[0, 10]} opacity={0.8} permanent={false}>
                  <span className="map-tooltip">{flight.id}</span>
                </Tooltip>
                <Popup className="flight-popup">
                  <div className="popup-content">
                    <h4>{flight.id} <span className="icao">{flight.tag.toUpperCase()}</span></h4>
                    <p>Origin Country: {flight.country}</p>
                    <div className="popup-stats">
                      <span>ALT: {flight.alt.toLocaleString()} FT</span>
                      <span>SPD: {flight.speed} KM/H</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}
        </MapContainer>

        {selectedFlight && (
          <div className="flight-infobar glass">
            <div className="infobar-header">
              <Plane size={20} color="#a855f7" />
              <h2>{selectedFlight.id} Live Status</h2>
              <button className="close-btn" onClick={() => setSelectedFlight(null)}>×</button>
            </div>
            <div className="infobar-details">
              <div className="detail-box">
                <span className="label">CALLSIGN</span>
                <span className="value">{selectedFlight.id}</span>
              </div>
              <div className="detail-box">
                <span className="label">ICAO24</span>
                <span className="value">{selectedFlight.tag.toUpperCase()}</span>
              </div>
              <div className="detail-box">
                <span className="label">HEADING</span>
                <span className="value">{selectedFlight.heading}°</span>
              </div>
              <div className="detail-box">
                <span className="label">LAST POS</span>
                <span className="value">{selectedFlight.lat.toFixed(3)}, {selectedFlight.lon.toFixed(3)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
