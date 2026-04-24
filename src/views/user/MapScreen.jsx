import React from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Star } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const MapScreen = ({ onBack, onSelectVenue }) => {
  const { venues } = useAppContext();
  const defaultState = {
    center: [59.9575, 30.3081], // Петроградский район
    zoom: 14,
    controls: [],
  };

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="content"
      style={{ 
        height: '100vh', 
        zIndex: 1000, 
        background: 'white',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <YMaps query={{ lang: 'ru_RU' }}>
        <Map 
          defaultState={defaultState} 
          style={{ width: '100%', height: '100%' }}
          options={{
            suppressMapOpenBlock: true,
            yandexMapDisablePoiInteractivity: true,
          }}
        >
          {venues.map(venue => {
            const categories = venue.categories || [];
            const totalSlots = categories.reduce((acc, cat) => acc + (cat.slots || 0), 0);
            const isSoldOut = totalSlots === 0;

            return (
            <Placemark
              key={venue.id}
              geometry={venue.coords}
              properties={{
                balloonContentHeader: venue.name,
                balloonContentBody: `
                  <div style="font-family: inherit; font-size: 14px;">
                    <div style="color: #4CAF50; font-weight: 700;">★ ${venue.rating} • ${venue.distance}</div>
                    <div style="color: #666; margin-top: 4px;">${venue.address}</div>
                    ${isSoldOut ? `<div style="margin-top: 10px; color: #E65100; font-weight: 700; text-align: center; padding: 8px; background: #FFF3E0; border-radius: 8px;">Распродано</div>` : `<button id="venue-${venue.id}" style="
                      margin-top: 10px; 
                      width: 100%; 
                      padding: 8px; 
                      background: #4CAF50; 
                      color: white; 
                      border: none; 
                      border-radius: 8px; 
                      font-weight: 700;
                      cursor: pointer;
                    ">Перейти к заказу</button>`}
                  </div>
                `,
              }}
              options={{
                preset: isSoldOut ? 'islands#grayFoodIcon' : 'islands#greenFoodIcon',
                iconColor: isSoldOut ? '#9e9e9e' : (venue.id === 1 ? '#FF9800' : '#4CAF50'),
              }}
              modules={['geoObject.addon.balloon']}
              onBalloonOpen={() => {
                setTimeout(() => {
                  const btn = document.getElementById(`venue-${venue.id}`);
                  if (btn) {
                    btn.onclick = () => onSelectVenue(venue);
                  }
                }, 100);
              }}
            />
            );
          })}
        </Map>
      </YMaps>

      {/* Header with Back Button */}
      <div style={{ 
        position: 'absolute', top: '20px', left: '20px', right: '20px', 
        display: 'flex', alignItems: 'center', gap: '12px', zIndex: 10
      }}>
        <button 
          onClick={onBack}
          className="glass"
          style={{ 
            width: '48px', height: '48px', borderRadius: '16px', border: 'none', 
            background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <ArrowLeft size={24} color="var(--text-main)" />
        </button>
        <div className="glass" style={{ 
          flex: 1, padding: '12px 20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', 
          background: 'var(--surface)', boxShadow: 'var(--shadow-md)', color: 'var(--text-main)'
        }}>
          <MapPin size={18} color="var(--primary)" fill="var(--primary)" />
          <span style={{ fontWeight: 800 }}>Петроградка • {venues.length} заведения</span>
        </div>
      </div>

      {/* Quick Tips */}
      <div style={{
        position: 'absolute', bottom: '40px', left: '20px', right: '20px',
        background: 'var(--text-main)', color: 'var(--surface)', padding: '16px 20px', borderRadius: '24px',
        display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        zIndex: 10
      }}>
        <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '12px' }}>
          <Star size={20} fill="white" />
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: '14px' }}>Экономь до 70% на Петроградке</p>
          <p style={{ fontSize: '12px', opacity: 0.7 }}>Выбирай заведение прямо на карте</p>
        </div>
      </div>
    </motion.div>
  );
};

export default MapScreen;
