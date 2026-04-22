import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

const FavoritesScreen = ({ onBack, onSelectVenue }) => {
  const { venues } = useAppContext();
  const favorites = venues.slice(0, 2); // Имитация списка избранного
  
  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="content"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, background: 'var(--bg)' }}
    >
      <div style={{ background: 'var(--surface)', padding: '20px', display: 'flex', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', display: 'flex' }}><ArrowLeft size={24} /></button>
        <h2 style={{ flex: 1, textAlign: 'center', fontSize: '18px', fontWeight: 800, marginRight: 24 }}>Избранное</h2>
      </div>

      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {favorites.map(venue => (
          <motion.div 
            key={venue.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectVenue(venue)}
            style={{ 
              background: 'var(--surface)', borderRadius: '24px', overflow: 'hidden', 
              boxShadow: 'var(--shadow-sm)', cursor: 'pointer'
            }}
          >
            <div style={{ height: '140px', position: 'relative' }}>
              <img src={venue.image} alt={venue.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--surface)', borderRadius: '50%', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Star size={16} fill="#E91E63" color="#E91E63" />
              </div>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>{venue.name}</h3>
                <span style={{ background: 'var(--accent)', color: 'var(--primary)', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
                  До {venue.closingTime}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {venue.type} • <MapPin size={14} /> {venue.distance}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FavoritesScreen;
