import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capawesome-team/capacitor-file-opener';
import { App as CapApp } from '@capacitor/app';
import { LocalNotifications } from '@capacitor/local-notifications';
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

const APP_VERSION = 22;

const scheduleOrderNotifications = async (order, venue) => {
  try {
    const perm = await LocalNotifications.requestPermissions();
    if (perm.display !== 'granted') return;

    const window = venue.pickupWindow || "19:00 - 20:00";
    const [start] = window.split(' - ');
    const [hours, minutes] = start.split(':').map(Number);

    const pickupDate = new Date();
    pickupDate.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const notifications = [];
    
    const config = [
      { offset: 120, msg: `Через 2 часа пора забирать заказ в ${venue.name}!` },
      { offset: 60, msg: `Через час ждем вас в ${venue.name} за заказом.` },
      { offset: 30, msg: `Осталось 30 минут до начала выдачи в ${venue.name}.` },
      { offset: 0, msg: `Время забирать заказ в ${venue.name}! Ваш код: ${order.code}` }
    ];

    config.forEach((item, idx) => {
      const scheduleTime = new Date(pickupDate.getTime() - item.offset * 60000);
      if (scheduleTime > now) {
        notifications.push({
          title: 'Miam: Пора за едой!',
          body: item.msg,
          id: Math.floor(Math.random() * 1000000),
          schedule: { at: scheduleTime },
          sound: 'default'
        });
      }
    });

    if (notifications.length > 0) {
      await LocalNotifications.schedule({ notifications });
    }
  } catch (e) {
    console.error('Failed to schedule notifications', e);
  }
};

function AppContent() {
  const [currentView, setCurrentView] = useState('onboarding');
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [venueSource, setVenueSource] = useState('home');
  const { user, setUser, logout, orders, setOrders, venues, setVenues, refreshVenues, API_BASE } = useAppContext();
  const [updateLink, setUpdateLink] = useState(null);

  useEffect(() => {
    if (['home', 'map', 'detail'].includes(currentView)) {
      refreshVenues();
    }
  }, [currentView]);

  const role = user?.role || 'user'; // user | merchant | admin

  useEffect(() => {
    fetch(`${API_BASE}/version`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.latest > APP_VERSION) {
          setUpdateLink(data.link);
        }
      })
      .catch(err => console.error("Version check failed", err));
  }, [API_BASE]);

  useEffect(() => {
    if (user && !updateLink) {
      setCurrentView(prev => {
        if (prev === 'onboarding' || prev === 'auth') {
          return user.role === 'user' ? 'home' : user.role;
        }
        return prev;
      });
    }
  }, [user, updateLink]);

  useEffect(() => {
    const setupBackListener = async () => {
      const backListener = await CapApp.addListener('backButton', () => {
        if (currentView === 'home' || currentView === 'auth' || currentView === 'onboarding') {
          CapApp.exitApp();
        } else if (currentView === 'detail') {
          setCurrentView(venueSource);
        } else if (currentView === 'payment') {
          setCurrentView('detail');
        } else if (currentView === 'checkout') {
          const target = selectedOrder ? 'orders' : 'home';
          setSelectedOrder(null);
          setCurrentView(target);
        } else if (['settings', 'favorites', 'notifications', 'support'].includes(currentView)) {
          setCurrentView('profile');
        } else if (['map', 'orders', 'profile'].includes(currentView)) {
          setCurrentView('home');
        } else {
          setCurrentView('home');
        }
      });
      return backListener;
    };

    const listenerPromise = setupBackListener();
    return () => {
      listenerPromise.then(l => l.remove());
    };
  }, [currentView]);



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

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create order');
      }

      const createdOrder = await res.json();
      setOrders([createdOrder, ...orders]);

      // Запланировать уведомления для самовывоза
      scheduleOrderNotifications(createdOrder, selectedVenue);

      if (setVenues) {
        setVenues(prev => prev.map(v => {
          if (v.id !== selectedVenue.id) return v;
          return {
            ...v,
            categories: v.categories.map(cat =>
              cat.id === selectedCategory.id ? { ...cat, slots: Math.max(0, cat.slots - 1) } : cat
            )
          };
        }));
      }

      setCurrentView('checkout');
    } catch (error) {
      alert('Ошибка при создании заказа: ' + error.message);
    }
  };

  return (
    <div className="app-container">
      {updateLink ? (
        <UpdateScreen link={updateLink} />
      ) : (
        <>
          <AnimatePresence mode="wait">
            {currentView === 'onboarding' && <Onboarding key="onboarding" onDone={() => setCurrentView('auth')} />}
            {currentView === 'auth' && <AuthScreen key="auth" onLogin={(u) => { setUser(u); setCurrentView(u.role === 'user' ? 'home' : u.role); }} />}

            {currentView === 'home' && (
              <HomeScreen
                key="home"
                onSelectVenue={(v) => {
                  if (v === 'map') {
                    setCurrentView('map');
                  } else {
                    setSelectedVenue(v);
                    setVenueSource('home');
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
                  setVenueSource('map');
                  setCurrentView('detail');
                }}
              />
            )}

            {currentView === 'orders' && (
              <OrdersList
                key="orders"
                orders={orders}
                onSelectOrder={(order) => {
                  setSelectedOrder(order);
                  setCurrentView('checkout');
                }}
              />
            )}

            {currentView === 'profile' && (
              <ProfileScreen
                key="profile"
                user={user}
                orders={orders}
                onLogout={() => { logout(); setCurrentView('auth'); }}
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
                  setVenueSource('favorites');
                  setCurrentView('detail');
                }}
              />
            )}

            {currentView === 'notifications' && <NotificationsScreen key="notifications" onBack={() => setCurrentView('profile')} />}
            {currentView === 'support' && <SupportScreen key="support" onBack={() => setCurrentView('profile')} />}

            {currentView === 'detail' && (
              <VenueDetail
                key="detail"
                venue={venues.find(v => v.id === selectedVenue?.id) || selectedVenue}
                onBack={() => setCurrentView(venueSource)}
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
                order={selectedOrder || orders[0]}
                onBack={() => {
                  const target = selectedOrder ? 'orders' : 'home';
                  setSelectedOrder(null);
                  setCurrentView(target);
                }}
                onDone={() => {
                  setSelectedOrder(null);
                  setCurrentView('home');
                }}
              />
            )}

            {currentView === 'merchant' && (
              <AdminDashboard key="admin" user={user} onLogout={() => { logout(); setCurrentView('auth'); }} />
            )}
          </AnimatePresence>

          {currentView !== 'onboarding' && currentView !== 'auth' && role === 'user' && !['detail', 'payment', 'checkout', 'map', 'settings', 'favorites', 'notifications', 'support'].includes(currentView) && (
            <BottomNav current={currentView} setView={setCurrentView} />
          )}
        </>
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
        background: '#ffffff', // Идеально белый фон для слияния с квадратным логотипом
        color: '#1A3636',
        padding: '40px 20px',
        textAlign: 'center',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999
      }}
    >
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          style={{ width: '100%', maxWidth: '300px' }}
        >
          <img
            src="/logo.png"
            alt="Miam Logo"
            style={{ width: '100%', height: 'auto', display: 'block', margin: '0 auto' }}
          />
        </motion.div>
      </div>

      <motion.button
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        whileTap={{ scale: 0.95 }}
        onClick={onDone}
        style={{
          background: '#FF9F00', // Оранжевый цвет прямо из логотипа сумки
          color: 'white',
          border: 'none',
          padding: '20px 40px',
          borderRadius: '24px',
          fontSize: '18px',
          fontWeight: 800,
          width: '100%',
          maxWidth: '350px',
          boxShadow: '0 8px 25px rgba(255, 159, 0, 0.35)',
          marginBottom: 'env(safe-area-inset-bottom, 20px)' // Отступ снизу для айфонов
        }}
      >
        {t('onboarding.button') || 'Начать выгодно!'}
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
      <NavItem icon={<div style={{ position: 'relative' }}><ShoppingBag size={24} /><div style={{ position: 'absolute', top: -4, right: -4, background: 'var(--primary)', width: 10, height: 10, borderRadius: '50%' }} /></div>} label="Заказы" active={current === 'orders'} onClick={() => setView('orders')} />
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

function UpdateScreen({ link }) {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressListener;
    Filesystem.addListener('progress', (state) => {
      if (state.bytes && state.contentLength) {
        setProgress(Math.round((state.bytes / state.contentLength) * 100));
      }
    }).then(listener => {
      progressListener = listener;
    });

    return () => {
      if (progressListener) progressListener.remove();
    };
  }, []);

  const startDownloadAndInstall = async () => {
    try {
      setDownloading(true);
      setProgress(0);

      const fileName = 'miam-update.apk';

      // Clean up old file to prevent caching issues or conflicts
      try {
        await Filesystem.deleteFile({ path: fileName, directory: Directory.Cache });
      } catch (e) {
        // file doesn't exist, ignore
      }

      const downloadResult = await Filesystem.downloadFile({
        url: link,
        path: fileName,
        directory: Directory.Cache,
        progress: true, // Enables firing the 'progress' listener
      });

      // Wait for it to become physically available
      setProgress(100);

      try {
        await FileOpener.openFile({
          path: downloadResult.path,
          mimeType: 'application/vnd.android.package-archive'
        });
      } catch (openErr) {
        console.error("Open Error fallback", openErr);
        // Fallback: If FileProvider isn't perfect, use default intent
        await FileOpener.openFile({ path: fileName });
      }

    } catch (e) {
      console.error('Download failed', e);
      alert('Ошибка скачивания обновления (возможно нет интернета или прав). Резервный канал...');
      window.open(link, '_system');
    } finally {
      setTimeout(() => setDownloading(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="content"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--bg) 0%, var(--surface) 100%)',
        padding: '40px 20px',
        textAlign: 'center',
        zIndex: 9999,
        height: '100vh'
      }}
    >
      <div style={{ padding: '24px', background: 'rgba(76, 175, 80, 0.1)', borderRadius: '32px', marginBottom: '32px', color: 'var(--primary)' }}>
        <ChefHat size={64} />
      </div>
      <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px' }}>Доступно обновление</h1>
      <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: downloading ? '24px' : '40px', lineHeight: 1.5 }}>
        {downloading
          ? "Скачиваем новую версию. Пожалуйста, подождите..."
          : "Обязательно обновите приложение, чтобы продолжить получать лучшие предложения со скидкой!"}
      </p>

      {downloading ? (
        <div style={{ width: '100%', maxWidth: '300px', background: 'var(--surface)', borderRadius: '12px', overflow: 'hidden', height: '16px', border: '1px solid var(--border)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'tween' }}
            style={{ height: '100%', background: 'var(--primary)' }}
          />
        </div>
      ) : (
        <button
          onClick={startDownloadAndInstall}
          style={{
            background: 'var(--primary)', color: 'white', border: 'none', padding: '16px',
            borderRadius: '16px', fontSize: '18px', fontWeight: 800, width: '100%',
            boxShadow: '0 10px 20px rgba(76, 175, 80, 0.3)'
          }}
        >
          Скачать обновление
        </button>
      )}
    </motion.div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
