import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Navigation, Compass, ShoppingBag, User } from 'lucide-react';
import { AppProvider, useAppContext } from './context/AppContext';
import AuthScreen from './views/auth/AuthScreen';
import HomeScreen from './views/user/HomeScreen';
import MapScreen from './views/user/MapScreen';
import VenueDetail from './views/user/VenueDetail';
import Checkout from './views/user/Checkout';
import PaymentScreen from './views/user/PaymentScreen';
import OrdersList from './views/user/OrdersList';
import ProfileScreen from './views/user/ProfileScreen';
import SettingsScreen from './views/user/subscreens/SettingsScreen';
import FavoritesScreen from './views/user/subscreens/FavoritesScreen';
import NotificationsScreen from './views/user/subscreens/NotificationsScreen';
import SupportScreen from './views/user/subscreens/SupportScreen';
import MerchantDashboard from './views/merchant/MerchantDashboard';
import AdminDashboard from './views/admin/AdminDashboard';
import './index.css';

function AppContent() {
  const [currentView, setCurrentView] = useState('onboarding');
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [user, setUser] = useState(null);
  const { orders, setOrders, API_BASE } = useAppContext();

  const role = user?.role || 'user'; // user | merchant | admin

  useEffect(() => {
    const savedUser = localStorage.getItem('miam_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      // If we restore session, skip onboarding
      setCurrentView(parsedUser.role === 'user' ? 'home' : parsedUser.role);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('miam_user', JSON.stringify(userData));
    setCurrentView(userData.role === 'user' ? 'home' : userData.role);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('miam_user');
    setCurrentView('auth');
  };

  const handleBook = (venue, category) => {
    setSelectedVenue(venue);
    setSelectedCategory(category);
    setCurrentView('payment');
  };

  const completePayment = async () => {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          venueId: selectedVenue.id,
          itemId: selectedCategory.id,
          savings: selectedCategory.oldPrice - selectedCategory.price,
          code: Math.floor(1000 + Math.random() * 9000).toString()
        })
      });

      if (!res.ok) throw new Error('Failed to create order');

      const createdOrder = await res.json();
      setOrders([createdOrder, ...orders]);
      setCurrentView('checkout');
    } catch (error) {
      alert('Ошибка при создании заказа: ' + error.message);
    }
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {currentView === 'onboarding' && <Onboarding key="onboarding" onDone={() => setCurrentView('auth')} />}
        {currentView === 'auth' && <AuthScreen key="auth" onLogin={handleLogin} />}

        {currentView === 'home' && (
          <HomeScreen 
            key="home" 
            onSelectVenue={(v) => {
              if (v === 'map') {
                setCurrentView('map');
              } else {
                setSelectedVenue(v);
                setCurrentView('detail');
              }
            }} 
          />
        )}

        {currentView === 'map' && (
          <MapScreen 
            key="map"
            onBack={() => setCurrentView('home')}
            onSelectVenue={(v) => {
              setSelectedVenue(v);
              setCurrentView('detail');
            }}
          />
        )}

        {currentView === 'orders' && (
          <OrdersList 
            key="orders"
            orders={orders}
            onSelectOrder={(order) => {
              setCurrentView('checkout');
            }}
          />
        )}

        {currentView === 'profile' && (
          <ProfileScreen 
            key="profile"
            user={user}
            orders={orders}
            onLogout={handleLogout}
            onNavigate={(screen) => setCurrentView(screen)}
          />
        )}

        {currentView === 'settings' && <SettingsScreen key="settings" user={user} onBack={() => setCurrentView('profile')} />}
        
        {currentView === 'favorites' && (
          <FavoritesScreen 
            key="favorites" 
            onBack={() => setCurrentView('profile')} 
            onSelectVenue={(v) => {
              setSelectedVenue(v);
              setCurrentView('detail');
            }} 
          />
        )}

        {currentView === 'notifications' && <NotificationsScreen key="notifications" onBack={() => setCurrentView('profile')} />}
        {currentView === 'support' && <SupportScreen key="support" onBack={() => setCurrentView('profile')} />}

        {currentView === 'detail' && (
          <VenueDetail 
            key="detail" 
            venue={selectedVenue} 
            onBack={() => setCurrentView('home')} 
            onBook={(cat) => handleBook(selectedVenue, cat)}
          />
        )}

        {currentView === 'payment' && (
          <PaymentScreen 
            key="payment" 
            venue={selectedVenue} 
            category={selectedCategory}
            onBack={() => setCurrentView('detail')} 
            onComplete={completePayment} 
          />
        )}

        {currentView === 'checkout' && (
          <Checkout 
            key="checkout" 
            venue={selectedVenue} 
            order={orders[0]} // Pass the newly created order
            onBack={() => setCurrentView('home')} 
            onDone={() => setCurrentView('home')} 
          />
        )}

        {currentView === 'merchant' && (
          <MerchantDashboard key="merchant" user={user} onLogout={handleLogout} />
        )}

        {currentView === 'admin' && (
          <AdminDashboard key="admin" user={user} onLogout={handleLogout} />
        )}
      </AnimatePresence>

      {currentView !== 'onboarding' && currentView !== 'auth' && role === 'user' && !['detail', 'payment', 'checkout', 'map', 'settings', 'favorites', 'notifications', 'support'].includes(currentView) && (
        <BottomNav current={currentView} setView={setCurrentView} />
      )}
    </div>
  );
}

function Onboarding({ onDone }) {
  const { t } = useAppContext();
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="content"
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--primary) 0%, #2E7D32 100%)',
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center'
      }}
    >
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ width: 120, height: 120, background: 'rgba(255,255,255,0.2)', borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}
      >
        <ChefHat size={64} fill="white" />
      </motion.div>
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ fontSize: '36px', fontWeight: 900, marginBottom: '16px' }}
      >
        {t('onboarding.title')}
      </motion.h1>
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ fontSize: '18px', opacity: 0.9, marginBottom: '48px', lineHeight: 1.5, maxWidth: '300px' }}
      >
        {t('onboarding.subtitle')}
      </motion.p>

      <motion.button 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        whileTap={{ scale: 0.95 }}
        onClick={onDone}
        style={{ 
          background: 'white', 
          color: 'var(--primary)', 
          border: 'none', 
          padding: '20px 40px', 
          borderRadius: '30px', 
          fontSize: '18px', 
          fontWeight: 800,
          width: '100%',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        }}
      >
        {t('onboarding.button')}
      </motion.button>
    </motion.div>
  );
}

const BottomNav = ({ current, setView }) => {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'color-mix(in srgb, var(--surface) 80%, transparent)', 
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      padding: '16px 20px',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',

      paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
      zIndex: 100
    }}>
      <NavItem icon={<Compass size={24} />} label="Обзор" active={current === 'home'} onClick={() => setView('home')} />
      <NavItem icon={<div style={{position: 'relative'}}><ShoppingBag size={24} /><div style={{position:'absolute', top:-4, right:-4, background:'var(--primary)', width:10, height:10, borderRadius:'50%'}}/></div>} label="Заказы" active={current === 'orders'} onClick={() => setView('orders')} />
      <NavItem icon={<User size={24} />} label="Профиль" active={current === 'profile'} onClick={() => setView('profile')} />
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', opacity: active ? 1 : 0.4 }}>
    <div style={{ color: active ? 'var(--primary)' : 'var(--text-main)' }}>{icon}</div>
    <span style={{ fontSize: '10px', fontWeight: 700, color: active ? 'var(--primary)' : 'var(--text-main)' }}>{label}</span>
  </div>
);

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
