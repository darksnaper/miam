import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Clock, MapPin, ChevronRight, ShoppingCart } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const VenueDetail = ({ venue, onBack, onBook }) => {
  const { t } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState(null);

  if (!venue) return null;

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="content"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50, background: 'var(--bg)' }}
    >
      {/* Hero */}
      <div style={{ height: '240px', position: 'relative' }}>
        <img src={venue.image} alt={venue.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <button 
          onClick={onBack}
          style={{ 
            position: 'absolute', top: '20px', left: '20px', 
            background: 'var(--surface)', border: 'none', borderRadius: '16px', padding: '10px', 
            display: 'flex', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', color: 'var(--text-main)' 
          }}
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div style={{ 
        marginTop: '-30px', 
        background: 'var(--bg)', 
        borderRadius: '32px 32px 0 0', 
        padding: '24px', 
        position: 'relative',
        minHeight: '100%'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800 }}>{t(venue.name)}</h1>
          <div style={{ background: 'var(--accent)', padding: '6px 12px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={16} fill="var(--primary)" color="var(--primary)" />
            <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{venue.rating}</span>
          </div>
        </div>
        
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{t(venue.type)} • {t(venue.address)}</p>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          <InfoPill icon={<Clock size={16} />} text={`${t('venue.pickup')} ${venue.pickupWindow || venue.closingTime}`} />
          <InfoPill icon={<MapPin size={16} />} text={venue.distance} />
        </div>

        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>{t('venue.available')}</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {venue.categories.map((cat) => (
            <CategoryCard 
              key={cat.id} 
              cat={cat} 
              selected={selectedCategory?.id === cat.id}
              onClick={() => setSelectedCategory(cat)}
            />
          ))}
        </div>
      </div>

      {/* Sticky Book Button */}
      {selectedCategory && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          style={{ 
            position: 'fixed', 
            bottom: '24px', 
            left: '24px', 
            right: '24px', 
            zIndex: 100,
            maxWidth: '382px' // 430 - 24*2
          }}
        >
          <button 
            className="btn-primary" 
            onClick={() => onBook(selectedCategory)}
            style={{ width: '100%', padding: '18px', fontSize: '18px', boxShadow: '0 10px 30px rgba(76, 175, 80, 0.3)' }}
          >
            {t('venue.add')} {selectedCategory.price}₽
            <ChevronRight size={20} />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

const InfoPill = ({ icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
    <div style={{ color: 'var(--primary)' }}>{icon}</div>
    {text}
  </div>
);

const CategoryCard = ({ cat, selected, onClick }) => {
  const { t } = useAppContext();
  return (
  <motion.div 
    onClick={onClick}
    whileTap={{ scale: 0.98 }}
    style={{
      padding: '16px',
      borderRadius: '24px',
      background: 'var(--surface)',
      border: selected ? '2px solid var(--primary)' : '2px solid transparent',
      boxShadow: 'var(--shadow-sm)',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }}
  >
    <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
      {cat.image && (
        <img src={cat.image} alt={cat.name} style={{ width: 80, height: 80, borderRadius: 16, objectFit: 'cover' }} />
      )}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>{t(cat.name)}</h3>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>{cat.price}₽</span>
          </div>
        </div>
        <div style={{ textAlign: 'right', marginBottom: '4px' }}>
          <span style={{ fontSize: '14px', textDecoration: 'line-through', color: 'var(--text-muted)' }}>{cat.oldPrice}₽</span>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{t(cat.description)}</p>
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '8px', background: cat.slots < 3 ? '#FFF3E0' : 'var(--accent)', color: cat.slots < 3 ? '#E65100' : 'var(--primary)' }}>
        {t('home.portions')}: {cat.slots}
      </div>
      {selected && <div style={{ color: 'var(--primary)' }}><ShoppingCart size={20} fill="var(--primary)" /></div>}
    </div>
  </motion.div>
  );
};

export default VenueDetail;
