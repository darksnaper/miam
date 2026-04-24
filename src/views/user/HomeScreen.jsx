import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Clock, ChevronRight, Navigation } from 'lucide-react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { CATEGORIES } from '../../data/mockData';
import DistrictPicker from './DistrictPicker';
import { useAppContext } from '../../context/AppContext';
import { Geolocation } from '@capacitor/geolocation';

const HomeScreen = ({ onSelectVenue }) => {
  const { t, venues = [], districts: AVAILABLE_DISTRICTS = [], isLoading } = useAppContext();
  const initialDistrictId = sessionStorage.getItem('saved_district') || 'petrogradsky';
  const initialDistrict = (AVAILABLE_DISTRICTS || []).find(d => d.id === initialDistrictId) || (AVAILABLE_DISTRICTS || [])[0] || { center: [59.9575, 30.3081], id: 'petrogradsky', name: 'Петроградский' };

  const [activeCategory, setActiveCategory] = useState("Все");
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState([59.9575, 30.3081]); 
  const [mapCenter, setMapCenter] = useState(initialDistrict.center);
  const [selectedDistrictId, setSelectedDistrictId] = useState(initialDistrictId);
  const [isLocating, setIsLocating] = useState(false);
  const [isUserOutside, setIsUserOutside] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);

  const locationFetched = React.useRef(false);

  useEffect(() => {
    if (AVAILABLE_DISTRICTS.length === 0) return;
    if (locationFetched.current) return;
    
    locationFetched.current = true;

    const locateUser = async () => {
      const needsDistrict = !sessionStorage.getItem('saved_district');
      
      if (needsDistrict) {
        setIsLocating(true);
      }
      
      const safetyTimeout = setTimeout(() => {
        if (needsDistrict) {
          setIsLocating(false);
          if (!sessionStorage.getItem('saved_district')) {
            setIsUserOutside(true);
            setSelectedDistrictId('petrogradsky');
            setMapCenter(AVAILABLE_DISTRICTS[0]?.center || [59.9575, 30.3081]);
            sessionStorage.setItem('saved_district', 'petrogradsky');
          }
        }
      }, 6000);

      try {
        await Geolocation.requestPermissions();
        const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 5000 });
        
        clearTimeout(safetyTimeout);
        const coords = [position.coords.latitude, position.coords.longitude];
        setUserLocation(coords);
        setHasLocation(true);
        
        if (needsDistrict && !sessionStorage.getItem('saved_district')) {
          const district = AVAILABLE_DISTRICTS.find(d => 
            coords[0] >= d.bounds.lat[0] && coords[0] <= d.bounds.lat[1] &&
            coords[1] >= d.bounds.lng[0] && coords[1] <= d.bounds.lng[1]
          );

          if (district) {
            setSelectedDistrictId(district.id);
            sessionStorage.setItem('saved_district', district.id);
            setMapCenter(coords);
            setIsUserOutside(false);
          } else {
            setIsUserOutside(true);
            setSelectedDistrictId('petrogradsky');
            setMapCenter(AVAILABLE_DISTRICTS[0]?.center || [59.9575, 30.3081]);
            sessionStorage.setItem('saved_district', 'petrogradsky');
          }
          setIsLocating(false);
          setShowSelector(false);
        }
      } catch (e) {
        clearTimeout(safetyTimeout);
        if (needsDistrict) {
          setIsLocating(false);
          if (!sessionStorage.getItem('saved_district')) {
            setIsUserOutside(true);
            setSelectedDistrictId('petrogradsky');
            setMapCenter(AVAILABLE_DISTRICTS[0]?.center || [59.9575, 30.3081]);
            sessionStorage.setItem('saved_district', 'petrogradsky');
          }
          setShowSelector(false);
        }
      }
    };

    locateUser();
  }, [AVAILABLE_DISTRICTS]);

  const handleSelectDistrict = (district) => {
    setSelectedDistrictId(district.id);
    sessionStorage.setItem('saved_district', district.id);
    setMapCenter(district.center);
    setShowSelector(false);
  };

  const currentDistrict = AVAILABLE_DISTRICTS.find(d => d.id === selectedDistrictId);

  const filteredVenues = venues.filter(v => {
    const matchesCategory = activeCategory === "Все" || v.tags?.includes(activeCategory);
    const matchesSearch = (v.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.type?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="content"
    >
      {/* Header */}
      <div style={{ padding: '24px 20px 12px 20px', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Твой район</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={16} color="var(--primary)" fill="var(--primary)" />
                <p style={{ fontWeight: 700, fontSize: '18px' }}>
                  {isLocating ? 'Определяем...' : currentDistrict?.name}
                </p>
              </div>
              {!isLocating && (
                <button 
                  onClick={() => setShowSelector(true)}
                  style={{ 
                    background: 'var(--bg)', border: 'none', padding: '4px 12px', borderRadius: '10px', 
                    fontSize: '13px', fontWeight: 700, color: 'var(--primary)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '4px'
                  }}
                >
                  Сменить
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg)', padding: '12px 16px', borderRadius: '16px' 
        }}>
          <Search size={20} color="var(--text-muted)" />
          <input 
            placeholder="Искать еду..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: 'none', border: 'none', outline: 'none', width: '100%', fontSize: '16px', fontFamily: 'inherit' }} 
          />
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '16px 0 8px 0', scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 16px', borderRadius: '12px', border: 'none', whiteSpace: 'nowrap', fontWeight: 600, fontSize: '14px',
                background: activeCategory === cat ? 'var(--primary)' : 'var(--bg)',
                color: activeCategory === cat ? 'white' : 'var(--text-main)',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* District Picker Overlay */}
      <DistrictPicker 
        isOpen={showSelector}
        onClose={() => setShowSelector(false)}
        districts={AVAILABLE_DISTRICTS}
        onSelect={handleSelectDistrict}
        userLocation={userLocation}
        selectedDistrictId={selectedDistrictId}
      />

      {/* Map Preview (Active) */}
      <div 
        onClick={() => onSelectVenue('map')} 
        style={{ 
          height: '200px', 
          margin: !isUserOutside ? '20px' : '0 20px 20px 20px', 
          borderRadius: '24px', 
          overflow: 'hidden',
          position: 'relative',
          boxShadow: 'var(--shadow-md)',
          cursor: 'pointer',
          background: '#EEE'
        }}
      >
        <YMaps query={{ lang: 'ru_RU' }}>
          <Map 
            state={{ center: mapCenter, zoom: 14 }}
            style={{ width: '100%', height: '100%' }}
            options={{
              suppressMapOpenBlock: true,
              yandexMapDisablePoiInteractivity: true,
              maxAnimationZoomDifference: 0
            }}
          >
            {filteredVenues.map(venue => (
              <Placemark 
                key={venue.id}
                geometry={venue.coords}
                options={{
                  preset: 'islands#greenFoodCircleIcon',
                  iconColor: 'var(--primary)'
                }}
              />
            ))}
            {/* User real location marker */}
            <Placemark 
              geometry={userLocation}
              options={{
                preset: 'islands#blueCircleDotIcon',
                iconColor: '#2196F3'
              }}
            />
          </Map>
        </YMaps>

        {selectedDistrictId === 'petrogradsky' && (
          <div style={{ 
            position: 'absolute', 
            bottom: '16px', 
            left: '50%', 
            transform: 'translateX(-50%)',
            background: 'var(--surface)',
            color: 'var(--text-main)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontWeight: 700,
            fontSize: '11px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            whiteSpace: 'nowrap',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />
            {filteredVenues.length} заведения в районе {currentDistrict?.name}
          </div>
        )}
      </div>

      {/* Venues List or Empty State */}
      <div style={{ padding: '0 20px', paddingBottom: '30px' }}>
        {selectedDistrictId !== 'petrogradsky' ? (
          <div style={{ 
            background: 'var(--surface)', padding: '30px 24px', borderRadius: '24px', 
            textAlign: 'center', boxShadow: 'var(--shadow-sm)', marginTop: '8px' 
          }}>
            <div style={{ background: '#FFF3E0', width: 64, height: 64, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <MapPin size={32} color="#FF9800" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>Тут пока нет заведений-партнеров</h3>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.5 }}>
              Мы находимся в стадии тестирования и прямо сейчас спасаем вкусную еду со скидкой только в ресторанах <strong>Петроградского района</strong>.
            </p>
            <button
               onClick={() => {
                 setSelectedDistrictId('petrogradsky');
                 sessionStorage.setItem('saved_district', 'petrogradsky');
                 setMapCenter(AVAILABLE_DISTRICTS.find(d => d.id === 'petrogradsky').center);
               }}
               style={{ 
                 background: 'var(--primary)', color: 'white', border: 'none', 
                 padding: '16px', borderRadius: '16px', fontWeight: 700,
                 fontSize: '16px', width: '100%', cursor: 'pointer'
               }}
            >
              Перейти к Петроградке
            </button>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>
              {!isUserOutside ? t('home.nearby') : `${t('home.available')} ${currentDistrict?.name}`}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredVenues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} onClick={() => onSelectVenue(venue)} hasLocation={hasLocation} />
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

const VenueCard = ({ venue, onClick, hasLocation }) => {
  const { t } = useAppContext();
  const categories = venue.categories || [];
  const totalSlots = categories.reduce((acc, cat) => acc + (cat.slots || 0), 0);
  const isSoldOut = totalSlots === 0;

  return (
    <motion.div 
      whileTap={!isSoldOut ? { scale: 0.98 } : {}}
      onClick={!isSoldOut ? onClick : undefined}
      style={{
        background: 'var(--surface)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        cursor: isSoldOut ? 'default' : 'pointer',
        opacity: isSoldOut ? 0.6 : 1,
        filter: isSoldOut ? 'grayscale(100%)' : 'none'
      }}
    >
      <div style={{ height: '140px', position: 'relative' }}>
        <img src={venue.image} alt={venue.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ 
          position: 'absolute', 
          bottom: '12px', 
          left: '12px',
          background: 'var(--surface)',
          padding: '4px 10px',
          borderRadius: '10px',
          fontSize: '12px',
          fontWeight: 700,
          color: 'var(--text-main)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Star size={12} fill="var(--secondary)" color="var(--secondary)" />
          {venue.rating}
        </div>
        {isSoldOut ? (
           <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '6px 12px', borderRadius: '12px', fontSize: '14px', fontWeight: 800 }}>
             {t('home.sold_out')}
           </div>
        ) : (
           <div className="badge-discount" style={{ position: 'absolute', top: '12px', right: '12px' }}>
             –{categories[0] ? Math.round((1 - categories[0].price / (categories[0].oldPrice || 1)) * 100) : 0}%
           </div>
        )}
      </div>
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '4px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '2px' }}>{t(venue.name || '')}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {t(venue.type || '')} • {t(venue.address || '')}{hasLocation ? ` • ${venue.distance}` : ''}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
             <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)' }}>{t('home.until')} {venue.closingTime}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomeScreen;
