import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, QrCode, TrendingUp, ShoppingBag, Clock, LogOut, Home as HomeIcon, Package, ClipboardList, User, Settings, ShieldCheck, ChevronRight, X, Moon, Globe } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const MerchantDashboard = ({ user, onLogout }) => {
  const { venues, updateVenueSlots, addVenueCategory, orders } = useAppContext();
  const [currentView, setCurrentView] = useState('home');
  const [showScanner, setShowScanner] = useState(false);

  // Find merchant's venue match
  const venue = venues.find(v => v.name === user?.name) || venues[0]; 
  
  if (!venue) return null;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative' }}>
      <AnimatePresence mode="wait">
        {currentView === 'home' && <MerchantHome key="home" venue={venue} />}
        {currentView === 'inventory' && <MerchantInventory key="inventory" venue={venue} updateSlots={(catId, delta) => updateVenueSlots(venue.id, catId, delta)} addCategory={(cat) => addVenueCategory(venue.id, cat)} />}
        {currentView === 'orders' && <MerchantOrders key="orders" orders={orders} venue={venue} onScan={() => setShowScanner(true)} />}
        {currentView === 'profile' && <MerchantProfile key="profile" venue={venue} onLogout={onLogout} />}
      </AnimatePresence>
      <MerchantBottomNav current={currentView} setView={setCurrentView} />

      {/* Scanner Modal Overlay */}
      <AnimatePresence>
        {showScanner && (
          <MerchantScanner onClose={() => setShowScanner(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

const MerchantHome = ({ venue }) => {
  const { t } = useAppContext();
  const activeCategories = venue.categories.filter(cat => cat.slots > 0);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
      className="content" style={{ paddingBottom: '100px' }}
    >
      <div style={{ background: 'var(--surface)', padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>{t(venue.name)}</h1>
          <div style={{ background: 'var(--accent)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '12px', fontSize: '14px', fontWeight: 700 }}>
             {t('merchant.online')}
          </div>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Панель управления</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '20px' }}>
        <StatCard icon={<TrendingUp size={20} />} label={t('merchant.stats.revenue')} value="12,400₽" color="var(--primary)" />
        <StatCard icon={<Package size={20} />} label="Спасено порций" value="85 шт" color="var(--secondary)" />
        <div style={{ gridColumn: 'span 2' }}>
          <StatCard icon={<Clock size={20} />} label="Ожидают выдачи сегодня" value="3 заказа" color="#FF9800" />
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
         <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Активные наборы</h2>
         {activeCategories.length === 0 ? (
           <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>Нет активных наборов</p>
         ) : (
           activeCategories.map(cat => (
             <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'var(--surface)', borderRadius: '16px', marginBottom: '8px', boxShadow: 'var(--shadow-sm)' }}>
               <span style={{ fontWeight: 600 }}>{t(cat.name)}</span>
               <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{cat.slots} {t('home.portions')}</span>
             </div>
           ))
         )}
      </div>
    </motion.div>
  );
};

const MerchantInventory = ({ venue, updateSlots, addCategory }) => {
  const { t } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const handleAdd = () => {
    if (!newName || !newPrice) return;
    const newCat = {
      id: Date.now().toString(),
      name: newName,
      price: parseInt(newPrice) || 0,
      slots: 5 // Default slots for newly added item
    };
    addCategory(newCat);
    setIsAdding(false);
    setNewName('');
    setNewPrice('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
      className="content" style={{ padding: '24px 20px', paddingBottom: '100px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Clock size={24} color="var(--primary)" /> {t('merchant.inventory.title')}
        </h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
        >
          <Plus size={16} /> {t('merchant.add_set')}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ background: 'var(--surface)', padding: '16px', borderRadius: '16px', marginBottom: '16px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--primary)', overflow: 'hidden' }}
          >
            <input 
              placeholder={t('merchant.add_set.name')} value={newName} onChange={e => setNewName(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '8px', background: 'var(--bg)', color: 'var(--text-main)', fontSize: '14px', boxSizing: 'border-box' }}
            />
            <input 
              placeholder={t('merchant.add_set.price')} type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '12px', background: 'var(--bg)', color: 'var(--text-main)', fontSize: '14px', boxSizing: 'border-box' }}
            />
            <button 
              onClick={handleAdd}
              style={{ width: '100%', background: 'var(--primary)', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
            >
              {t('merchant.add_set.save')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {venue.categories.map((cat) => (
          <div key={cat.id} style={{ 
            background: 'var(--surface)', borderRadius: '24px', padding: '20px', 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)'
          }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '16px' }}>{t(cat.name)}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{cat.price}₽ {t('merchant.inventory.per_slot')}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                onClick={() => updateSlots(cat.id, -1)}
                style={{ width: '40px', height: '40px', borderRadius: '12px', border: 'none', background: 'var(--bg)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <Minus size={20} />
              </button>
              <span style={{ fontSize: '20px', fontWeight: 800, minWidth: '30px', textAlign: 'center' }}>{cat.slots}</span>
              <button 
                onClick={() => updateSlots(cat.id, 1)}
                style={{ width: '40px', height: '40px', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const MerchantOrders = ({ orders, venue, onScan }) => {
  const { t } = useAppContext();
  const venueOrders = orders.filter(o => o.venue === venue.name);
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
      className="content" style={{ padding: '24px 20px', paddingBottom: '100px', position: 'relative' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800 }}>{t('merchant.orders.recent')}</h2>
        <button style={{ fontSize: '14px', color: 'var(--primary)', border: 'none', background: 'none', fontWeight: 600 }}>{t('merchant.orders.all')}</button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {venueOrders.length === 0 && (
           <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>Пока заказов нет</p>
        )}
        {venueOrders.map((order, idx) => (
          <div key={idx} style={{ background: 'var(--surface)', borderRadius: '24px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--primary)', boxShadow: 'var(--shadow-sm)' }}>
             <div style={{ background: 'var(--accent)', padding: '12px', borderRadius: '16px' }}>
               <QrCode size={24} color="var(--primary)" />
             </div>
             <div style={{ flex: 1 }}>
               <p style={{ fontWeight: 700 }}>{t('checkout.order')} {order.id}</p>
               <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t(order.item)} • {order.price}₽</p>
             </div>
             <button style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', padding: '8px 16px', fontWeight: 700, cursor: 'pointer' }}>
               {t('merchant.orders.issue')}
             </button>
          </div>
        ))}
      </div>

      {/* Floating Scanner Button */}
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={onScan}
        style={{
          position: 'fixed', bottom: '100px', right: '24px', width: '64px', height: '64px', borderRadius: '32px',
          background: 'var(--primary)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 10px 25px rgba(76, 175, 80, 0.4)', cursor: 'pointer', zIndex: 50
        }}
      >
        <QrCode size={32} />
      </motion.button>
    </motion.div>
  );
};

const MerchantScanner = ({ onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{ 
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, 
        background: 'var(--surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' 
      }}
    >
      <button 
        onClick={onClose}
        style={{ position: 'absolute', top: '32px', right: '20px', background: 'var(--bg)', border: 'none', width: '48px', height: '48px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
      >
        <X size={24} color="var(--text-main)" />
      </button>

      <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '40px' }}>Сканирование QR</h2>
      
      <div style={{ 
        width: '280px', height: '280px', border: '4px dashed var(--primary)', borderRadius: '32px', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <motion.div 
          animate={{ y: [-130, 130, -130] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          style={{ position: 'absolute', width: '100%', height: '2px', background: 'var(--primary)', boxShadow: '0 0 20px var(--primary)', zIndex: 10 }}
        />
        <QrCode size={64} color="var(--text-muted)" opacity={0.3} />
      </div>

      <p style={{ marginTop: '40px', color: 'var(--text-muted)', textAlign: 'center', padding: '0 40px' }}>
        Наведите камеру на QR-код покупателя, чтобы выдать заказ.
      </p>
    </motion.div>
  );
};

const MerchantProfile = ({ venue, onLogout }) => {
  const { t, theme, setTheme, lang, setLang } = useAppContext();
  const [timeRange, setTimeRange] = useState('week'); // week, month, year, all
  const [activeColumn, setActiveColumn] = useState(null);

  // Mock data for income chart
  const getChartData = () => {
    switch(timeRange) {
      case 'week': return { data: [1200, 1500, 900, 2100, 1800, 3200, 2500], labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] };
      case 'month': return { data: [12000, 15000, 18000, 22000], labels: ['Нед 1', 'Нед 2', 'Нед 3', 'Нед 4'] };
      case 'year': return { data: [120, 150, 130, 180, 220, 250, 210, 300, 280, 350, 320, 400], labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'] };
      case 'all': return { data: [500, 1200, 3500], labels: ['2024', '2025', '2026'] };
      default: return { data: [], labels: [] };
    }
  };

  const { data: chartData, labels } = getChartData();
  const maxIncome = Math.max(...chartData, 1);

  const ranges = [
    { id: 'week', label: 'Неделя' },
    { id: 'month', label: 'Месяц' },
    { id: 'year', label: 'Год' },
    { id: 'all', label: 'Всё время' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
      className="content" style={{ padding: '24px 20px', paddingBottom: '100px', overflowY: 'auto' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800 }}>{t('merchant.profile')}</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ background: 'var(--surface)', border: 'none', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
             <Moon size={20} />
          </button>
          <button onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')} style={{ background: 'var(--surface)', border: 'none', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', cursor: 'pointer', boxShadow: 'var(--shadow-sm)', fontWeight: 800, fontSize: '14px' }}>
             {lang.toUpperCase()}
          </button>
        </div>
      </div>

      {/* Income Chart */}
      <div style={{ background: 'var(--surface)', borderRadius: '24px', padding: '24px', marginBottom: '24px', boxShadow: 'var(--shadow-md)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '24px' }}>{t(`merchant.profile.income.${timeRange}`)}</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', height: '140px', gap: '8px' }}>
          {chartData.map((amount, i) => {
            const height = (amount / maxIncome) * 100;
            return (
              <div 
                key={`${timeRange}-${i}`} 
                onClick={() => setActiveColumn(i)}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', cursor: 'pointer', position: 'relative' }}
              >
                <AnimatePresence>
                  {activeColumn === i && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 5, scale: 0.8 }}
                      style={{ 
                        position: 'absolute', top: '-28px', background: 'var(--text-main)', color: 'var(--surface)', 
                        padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, 
                        whiteSpace: 'nowrap', zIndex: 10, pointerEvents: 'none',
                        boxShadow: 'var(--shadow-md)'
                      }}
                    >
                      {amount}₽
                    </motion.div>
                  )}
                </AnimatePresence>
                <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'flex-end', background: 'var(--bg)', borderRadius: '8px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.5, delay: i * 0.05 }}
                    style={{ width: '100%', height: `${height}%`, background: activeColumn === i ? 'var(--secondary)' : 'var(--primary)', borderRadius: '8px', transformOrigin: 'bottom', transition: 'background 0.2s' }}
                  />
                </div>
                <span style={{ fontSize: '10px', color: activeColumn === i ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: 600, transition: 'color 0.2s' }}>
                  {labels[i]}
                </span>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '24px', flexWrap: 'wrap' }}>
          {ranges.map(range => (
            <button 
              key={range.id} onClick={() => setTimeRange(range.id)}
              style={{ padding: '6px 12px', borderRadius: '14px', border: 'none', fontSize: '12px', fontWeight: 700, background: timeRange === range.id ? 'var(--primary)' : 'var(--bg)', color: timeRange === range.id ? 'white' : 'var(--text-main)', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
        <MerchantStatCard label={t('merchant.profile.total_orders')} value="142" suffix="шт" />
        <MerchantStatCard label={t('merchant.profile.cancellations')} value="2.4" suffix="%" />
        <MerchantStatCard label={t('merchant.profile.arpu')} value="385" suffix="₽" fullWidth />
      </div>

      {/* Settings Menu */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>{t('merchant.profile.settings')}</h3>
        <MenuRow icon={<User size={20} />} label="Управление профилем" />
        <MenuRow icon={<Settings size={20} />} label="Режим работы" />
        <MenuRow icon={<ShieldCheck size={20} />} label="Юридическая инфо" />
        <MenuRow icon={<LogOut size={20} color="#F44336" />} label="Выйти из аккаунта" color="#F44336" onClick={onLogout} />
      </div>
    </motion.div>
  );
};

const MerchantStatCard = ({ label, value, suffix, fullWidth }) => (
  <div style={{ background: 'var(--surface)', borderRadius: '20px', padding: '16px', boxShadow: 'var(--shadow-sm)', gridColumn: fullWidth ? 'span 2' : 'span 1' }}>
    <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px' }}>{label}</p>
    <p style={{ fontSize: '24px', fontWeight: 800 }}>{value} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{suffix}</span></p>
  </div>
);

const MenuRow = ({ icon, label, color = 'var(--text-main)', onClick }) => (
  <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--surface)', borderRadius: '20px', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
    <div style={{ color: color }}>{icon}</div>
    <span style={{ fontWeight: 600, color: color, flex: 1 }}>{label}</span>
    <ChevronRight size={20} color="var(--text-muted)" />
  </div>
);

const MerchantBottomNav = ({ current, setView }) => {
  const { t } = useAppContext();
  return (
    <div className="glass" style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 'calc(var(--nav-height) + var(--safe-area-bottom))',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 'var(--safe-area-bottom)',
      borderTop: '1px solid var(--border)', zIndex: 100, background: 'var(--surface)'
    }}>
      <NavButton icon={<HomeIcon size={24} />} label={t('merchant.home')} active={current === 'home'} onClick={() => setView('home')} />
      <NavButton icon={<Package size={24} />} label={t('merchant.inventory')} active={current === 'inventory'} onClick={() => setView('inventory')} />
      <NavButton icon={<ClipboardList size={24} />} label={t('merchant.orders')} active={current === 'orders'} onClick={() => setView('orders')} />
      <NavButton icon={<User size={24} />} label={t('merchant.profile')} active={current === 'profile'} onClick={() => setView('profile')} />
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} style={{
    background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
    color: active ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s ease'
  }}>
    <motion.div animate={{ scale: active ? 1.1 : 1 }} transition={{ type: 'spring', stiffness: 300 }}>
      {icon}
    </motion.div>
    <span style={{ fontSize: '10px', fontWeight: 600 }}>{label}</span>
  </button>
);

const StatCard = ({ icon, label, value, color }) => (
  <div style={{ background: 'var(--surface)', borderRadius: '24px', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
    <div style={{ color: color, marginBottom: '8px' }}>{icon}</div>
    <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</p>
    <p style={{ fontSize: '18px', fontWeight: 800 }}>{value}</p>
  </div>
);

export default MerchantDashboard;
