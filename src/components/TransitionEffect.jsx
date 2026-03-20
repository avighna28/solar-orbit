import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Moon, Sparkles } from 'lucide-react';
import './TransitionEffect.css';

export const TransitionEffect = ({ isVisible, viewType }) => {
  const getTransitionAsset = () => {
    switch (viewType) {
      case 'weather':
        return { icon: <Cloud size={80} />, color: '#06b6d4', label: 'ATMOSPHERE' };
      case 'astro':
        return { icon: <Moon size={80} />, color: '#a855f7', label: 'OBSERVATORY' };
      case 'thought':
        return { icon: <Sparkles size={80} />, color: '#fcd34d', label: 'WISDOM' };
      default:
        return { icon: <Cloud size={80} />, color: '#a855f7', label: 'SKYCAST' };
    }
  };

  const asset = getTransitionAsset();

  return (
    <div className={`transition-container ${isVisible ? 'visible' : ''}`} style={{ '--accent-color': asset.color }}>
      <AnimatePresence>
        {isVisible && (
          <motion.div 
            className="flight-path"
            initial={{ x: '-100vw', opacity: 0 }}
            animate={{ x: '100vw', opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] }}
          >
            <div className="trail"></div>
            <div className="asset-group">
              <div className="icon-wrapper">
                {asset.icon}
              </div>
              <span className="transition-label">{asset.label}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
