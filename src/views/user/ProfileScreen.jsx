import React from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Bell, Shield, Heart, HelpCircle, LogOut, Leaf, Wallet, ShoppingBag, ChevronRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const ProfileScreen = ({ user, orders, onLogout, onNavigate }) => {
  const { t } = useAppContext();
  const totalSaved = orders.reduce((acc, o) => acc + (Number(o.savings) || 0), 0) + 12400; 
  const itemsRescued = orders.length + 15; 
  const nextGoal = 15000;
  const progress = (totalSaved / nextGoal) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="content"
      style={{ padding: '24px 20px 120px 20px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800 }}>{t('profile.title')}</h1>
        <button onClick={() => onNavigate('settings')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <Settings size={28} />
        </button>
      </div>

      {/* User info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
        <div style={{ 
          width: '80px', height: '80px', borderRadius: '30px', background: 'var(--accent)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)'
        }}>
          <User size={40} />
        </div>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800 }}>{user?.name || 'Александр'}</h2>
          <p style={{ color: 'var(--text-muted)' }}>{user?.email || '+7 (999) 123-45-67'}</p>
        </div>
      </div>

      {/* Impact Stats - Focus on Savings */}
      <div style={{ 
        background: 'var(--surface)', borderRadius: '32px', padding: '24px', marginBottom: '32px',
        boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: '#FFF3E0', padding: '16px', borderRadius: '20px', color: '#FF9800' }}>
            <Wallet size={32} />
          </div>
          <div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{t('profile.saved')}</p>
            <p style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>{totalSaved}₽</p>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', fontWeight: 700 }}>
            <span>{t('profile.goal')}</span>
            <span style={{ color: 'var(--primary)' }}>{nextGoal - totalSaved}₽</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'var(--accent)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
          <ImpactItem icon={<ShoppingBag size={20} />} label={t('profile.orders')} value={`${itemsRescued}`} color="var(--text-main)" />
          <ImpactItem icon={<Heart size={20} />} label={t('profile.favorites')} value="5" color="#E91E63" />
        </div>
      </div>

      {/* Profile Menu */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
        <MenuItem icon={<Heart size={20} />} label={t('profile.menu.favorites')} onClick={() => onNavigate('favorites')} />
        <MenuItem icon={<Bell size={20} />} label={t('profile.menu.notifications')} onClick={() => onNavigate('notifications')} />
        <MenuItem icon={<Shield size={20} />} label={t('profile.menu.settings')} onClick={() => onNavigate('settings')} />
        <MenuItem icon={<HelpCircle size={20} />} label={t('profile.menu.support')} onClick={() => onNavigate('support')} />
        <div style={{ height: '1px', background: 'var(--border)', margin: '12px 0' }} />
        <MenuItem icon={<LogOut size={20} />} label={t('profile.menu.logout')} color="#F44336" onClick={onLogout} />
      </div>

      {/* Gamification Area */}
      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>Твой рейтинг: Эко-герой 🍃</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>Здесь твои заработанные статусы и награды</p>

        {/* Badges */}
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '8px', scrollbarWidth: 'none' }}>
          <Badge icon="🤑" label="Разумная трата" active />
          <Badge icon="🥐" label="Гурман" active />
          <Badge icon="🔥" label="Легенда скидок" />
        </div>

        {/* Perks Box */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(46, 125, 50, 0.15) 100%)', 
          borderRadius: '24px', padding: '20px', border: '1px solid rgba(76, 175, 80, 0.2)'
        }}>
          <p style={{ fontSize: '14px', fontWeight: 800, marginBottom: '12px', color: 'var(--text-main)' }}>🎁 Доступно на этом уровне:</p>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: 1.6, fontWeight: 500, color: 'var(--text-muted)' }}>
            <li><strong style={{ color: 'var(--text-main)' }}>Увеличенный кэшбек (5%)</strong> баллами Miam</li>
            <li><strong style={{ color: 'var(--text-main)' }}>Ранний доступ:</strong> видишь новые наборы на 5 минут раньше других</li>
            <li><strong style={{ color: 'var(--text-main)' }}>Секретная рамка профиля</strong> (видят другие пользователи)</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

const ImpactItem = ({ icon, label, value, color }) => (
  <div style={{ textAlign: 'center', background: 'var(--bg)', padding: '12px', borderRadius: '16px' }}>
    <div style={{ color: color, marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>{icon}</div>
    <p style={{ fontSize: '18px', fontWeight: 800, marginBottom: '2px', lineHeight: 1 }}>{value}</p>
    <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
  </div>
);

const MenuItem = ({ icon, label, color = 'var(--text-main)', onClick }) => (
  <div 
    onClick={onClick}
    style={{ 
      display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', background: 'var(--surface)', 
      borderRadius: '20px', cursor: 'pointer'
    }}
  >
    <div style={{ color: color }}>{icon}</div>
    <span style={{ fontWeight: 600, color: color, flex: 1 }}>{label}</span>
    <ChevronRight size={20} color="var(--text-muted)" />
  </div>
);

const Badge = ({ icon, label, active }) => (
  <div style={{ 
    minWidth: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
    opacity: active ? 1 : 0.3
  }}>
    <div style={{ 
      width: '64px', height: '64px', borderRadius: '24px', background: 'var(--surface)', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px',
      boxShadow: 'var(--shadow-sm)'
    }} >
      {icon}
    </div>
    <span style={{ fontSize: '10px', fontWeight: 700, textAlign: 'center', color: 'var(--text-main)' }}>{label}</span>
  </div>
);

export default ProfileScreen;
