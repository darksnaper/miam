import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const NotificationsScreen = ({ onBack }) => {
  const [toggles, setToggles] = useState({
    orders: true,
    reminders: true,
    newVenues: false,
    favorites: true
  });

  const toggle = (key) => setToggles(p => ({ ...p, [key]: !p[key] }));

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
        <button onClick={onBack} style={{ background: 'none', border: 'none', display: 'flex', color: 'var(--text-main)' }}><ArrowLeft size={24} /></button>
        <h2 style={{ flex: 1, textAlign: 'center', fontSize: '18px', fontWeight: 800, marginRight: 24 }}>Уведомления</h2>
      </div>

      <div style={{ padding: '24px 20px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>Мы отправляем только самое важное. Настройте уведомления под себя.</p>
        
        <div style={{ background: 'var(--surface)', borderRadius: '20px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
          <ToggleRow label="Обновления по заказам" desc="Чек, статус выдачи" val={toggles.orders} onToggle={() => toggle('orders')} />
          <div style={{ background: 'var(--border)', height: 1 }} />
          <ToggleRow label="Напоминания" desc="Не забудьте забрать заказ до закрытия!" val={toggles.reminders} onToggle={() => toggle('reminders')} />
          <div style={{ background: 'var(--border)', height: 1 }} />
          <ToggleRow label="Любимые места" desc="Уведомим, если в Избранном появились слоты" val={toggles.favorites} onToggle={() => toggle('favorites')} />
          <div style={{ background: 'var(--border)', height: 1 }} />
          <ToggleRow label="Новые заведения" desc="Когда Miam запускается в вашем районе" val={toggles.newVenues} onToggle={() => toggle('newVenues')} />
        </div>
      </div>
    </motion.div>
  );
};

const ToggleRow = ({ label, desc, val, onToggle }) => (
  <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ flex: 1, paddingRight: 16 }}>
      <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{desc}</div>
    </div>
    <div 
      onClick={onToggle}
      style={{ 
        width: 50, height: 30, borderRadius: 15, background: val ? 'var(--primary)' : 'var(--border)',
        display: 'flex', alignItems: 'center', padding: '0 4px', cursor: 'pointer', transition: 'all 0.2s',
        justifyContent: val ? 'flex-end' : 'flex-start'
      }}
    >
      <motion.div layout style={{ width: 22, height: 22, borderRadius: '50%', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
    </div>
  </div>
);

export default NotificationsScreen;
