import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Navigation, ChevronRight, Info } from 'lucide-react';
import { YMaps, Map, Placemark, Polygon } from '@pbe/react-yandex-maps';
import { Geolocation } from '@capacitor/geolocation';

const DistrictPicker = ({ isOpen, onClose, districts, onSelect, userLocation, selectedDistrictId }) => {
  const [mapCenter, setMapCenter] = useState([59.9386, 30.3141]); // Central SPB
  const [localSelectedId, setLocalSelectedId] = useState(selectedDistrictId);

  useEffect(() => {
    if (isOpen) {
      if (userLocation) {
        setMapCenter(userLocation);
      } else if (selectedDistrictId) {
        const selected = districts.find(d => d.id === selectedDistrictId);
        if (selected) setMapCenter(selected.center);
      }
      setLocalSelectedId(selectedDistrictId);
    }
  }, [isOpen, userLocation, selectedDistrictId, districts]);
  const [isLocating, setIsLocating] = useState(false);

  const handleLocateMe = async () => {
    setIsLocating(true);
    try {
      await Geolocation.requestPermissions();
      const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 5000 });
      
      const coords = [position.coords.latitude, position.coords.longitude];
      setMapCenter(coords);
      
      const found = districts.find(d => 
        coords[0] >= d.bounds.lat[0] && coords[0] <= d.bounds.lat[1] &&
        coords[1] >= d.bounds.lng[0] && coords[1] <= d.bounds.lng[1]
      );

      if (found) {
        setLocalSelectedId(found.id);
        onSelect(found);
      }
      setIsLocating(false);
    } catch (e) {
      setIsLocating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          style={{ 
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2000,
            background: 'var(--bg)', display: 'flex', flexDirection: 'column'
          }}
        >
          {/* Header */}
          <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>Выбор района</h2>
            <button 
              onClick={onClose}
              style={{ padding: '8px', borderRadius: '12px', border: 'none', background: 'var(--bg)', cursor: 'pointer', color: 'var(--text-main)' }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ flex: 1, position: 'relative' }}>
            <YMaps query={{ lang: 'ru_RU' }}>
              <Map 
                state={{ center: mapCenter, zoom: 11 }}
                style={{ width: '100%', height: '100%' }}
                options={{
                  suppressMapOpenBlock: true,
                  yandexMapDisablePoiInteractivity: true,
                }}
              >
                {districts.map(district => {
                  const isPolygon = !!district.polygon;
                  return (
                    <React.Fragment key={district.id}>
                      {isPolygon ? (
                        <Polygon
                          geometry={district.polygon}
                          onClick={() => setLocalSelectedId(district.id)}
                          options={{
                            fillColor: district.id === localSelectedId ? district.color + 'AA' : district.color + '55', // highlight selected
                            strokeColor: district.color,
                            strokeWidth: district.id === localSelectedId ? 4 : 2,
                            cursor: 'pointer'
                          }}
                          properties={{
                            hintContent: district.name,
                            balloonContent: `<strong>${district.name}</strong>`
                          }}
                        />
                      ) : (
                        <Placemark 
                          geometry={district.center}
                          onClick={() => setLocalSelectedId(district.id)}
                          options={{
                            preset: 'islands#greenHomeCircleIcon',
                            iconColor: district.color || 'var(--primary)',
                            hideIconOnBalloonOpen: false
                          }}
                          properties={{
                            hintContent: district.name,
                            balloonContent: `<strong>${district.name}</strong>`
                          }}
                        />
                      )}
                    </React.Fragment>
                  );
                })}

                {/* User current location */}
                {userLocation && (
                  <Placemark 
                    geometry={userLocation}
                    options={{
                      preset: 'islands#blueCircleDotIcon',
                      iconColor: '#2196F3'
                    }}
                  />
                )}
              </Map>
            </YMaps>

            {/* Locate Me Button on Map */}
            <button 
              onClick={handleLocateMe}
              className="glass"
              style={{
                position: 'absolute', bottom: '240px', right: '20px',
                width: '50px', height: '50px', borderRadius: '15px',
                border: 'none', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--shadow-md)', cursor: 'pointer', zIndex: 20,
                transition: 'transform 0.2s active'
              }}
            >
              <Navigation 
                size={22} 
                color={isLocating ? 'var(--primary)' : 'var(--text-main)'} 
                style={{ transition: 'all 0.3s ease' }}
              />
            </button>

            {/* Bottom Sheet Prompt */}
            <div style={{
              position: 'absolute', bottom: '20px', left: '20px', right: '20px',
              padding: '20px', background: 'var(--surface)', borderRadius: '24px',
              boxShadow: 'var(--shadow-lg)', zIndex: 10
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#E8F5E9', padding: '10px', borderRadius: '14px' }}>
                  <MapPin size={24} color="var(--primary)" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '2px' }}>Выбранный район</p>
                  <p style={{ fontWeight: 800, fontSize: '16px', color: 'var(--text-main)' }}>
                    {localSelectedId ? (districts.find(d => d.id === localSelectedId)?.name || 'Неизвестный район') : 'Выберите на карте'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const selected = districts.find(d => d.id === localSelectedId);
                    if (selected) onSelect(selected);
                  }}
                  style={{
                    padding: '12px 24px', borderRadius: '14px', border: 'none',
                    background: 'var(--primary)', color: 'white', fontWeight: 700,
                    cursor: 'pointer', fontSize: '15px'
                  }}
                >
                  Готово
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DistrictPicker;
