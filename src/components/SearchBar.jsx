import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import './SearchBar.css';

export const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
        const response = await fetch(url);
        const data = await response.json();
        setSuggestions(data.results || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setQuery('');
      setShowDropdown(false);
    }
  };

  const handleSelect = (city) => {
    const fullName = `${city.name}${city.admin1 ? ', ' + city.admin1 : ''}, ${city.country}`;
    onSearch(fullName, city.latitude, city.longitude);
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div className="search-container" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search for a city..."
            className="search-input"
          />
          <Search className="search-icon" size={20} />
          {loading && <Loader2 className="search-loader" size={18} />}
        </div>
      </form>

      {showDropdown && suggestions.length > 0 && (
        <div className="suggestions-dropdown glass">
          {suggestions.map((city) => (
            <div
              key={city.id}
              className="suggestion-item"
              onClick={() => handleSelect(city)}
            >
              <MapPin size={16} className="suggestion-icon" />
              <div className="suggestion-text">
                <span className="city-name">{city.name}</span>
                <span className="region-name">
                  {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


