import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, CreditCard, Apple, Plus, Moon, Globe, Trash2, ChevronRight } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

const SettingsScreen = ({ user, onBack }) => {
  const { theme, setTheme, lang, setLang, t } = useAppContext();

  const cycleTheme = () => {
    const list = ['system', 'light', 'dark'];
    setTheme(list[(list.indexOf(theme) + 1) % list.length]);
  };

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
        <button onClick={onBack} style={{ background: 'none', border: 'none', display: 'flex' }}><ArrowLeft size={24} color="var(--text-main)" /></button>
        <h2 style={{ flex: 1, textAlign: 'center', fontSize: '18px', fontWeight: 800, marginRight: 24 }}>{t('settings.title')}</h2>
      </div>

      <div style={{ padding: '24px 20px', overflowY: 'auto', paddingBottom: '80px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', color: 'var(--text-muted)' }}>{t('settings.general')}</h3>
        <div style={{ background: 'var(--surface)', borderRadius: '20px', padding: '16px 20px', marginBottom: '32px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ClickableRow icon={<Moon size={20} />} label={t('settings.theme')} value={t(`settings.theme.${theme}`)} onClick={cycleTheme} />
          <div style={{ background: 'var(--border)', height: 1 }} />
          <ClickableRow icon={<Globe size={20} />} label={t('settings.lang')} value={lang.toUpperCase()} onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')} />
          <div style={{ background: 'var(--border)', height: 1 }} />
          <ClickableRow icon={<Trash2 size={20} color="#F44336" />} label={t('settings.cache')} value="54 MB" color="#F44336" onClick={() => {}} hideArrow />
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', color: 'var(--text-muted)' }}>{t('settings.personal')}</h3>
        <div style={{ background: 'var(--surface)', borderRadius: '20px', padding: '20px', marginBottom: '32px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <InputRow label={t('settings.name')} value={user?.name || "Александр"} />
          <div style={{ background: 'var(--border)', height: 1 }} />
          <InputRow label={t('settings.phone')} value={user?.phone || "+7 (999) 123-45-67"} />
          <div style={{ background: 'var(--border)', height: 1 }} />
          <InputRow label="Email" value={user?.email || "alex@example.com"} />
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', color: 'var(--text-muted)' }}>{t('settings.payment')}</h3>
        <div style={{ background: 'var(--surface)', borderRadius: '20px', padding: '12px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px' }}>
            <div style={{ background: 'linear-gradient(45deg, #1f42a5, #dd0031, #009e3a)', width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: '12px', letterSpacing: '0.5px' }}>СБП</span>
            </div>
            <span style={{ fontWeight: 700, flex: 1 }}>Привязан счет (СБП)</span>
            <Check size={20} color="var(--primary)" />
          </div>
          <div style={{ background: 'var(--border)', height: 1, margin: '0 12px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px' }}>
            <div style={{ background: '#F5F5F5', width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <CreditCard size={20} />
            </div>
            <span style={{ fontWeight: 700, flex: 1 }}>•••• 4581</span>
          </div>
          <button style={{ border: 'none', background: 'var(--accent)', color: 'var(--primary)', padding: '16px', borderRadius: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
             <Plus size={20} /> {t('settings.add_card')}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const InputRow = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
    <span style={{ fontWeight: 700 }}>{value}</span>
  </div>
);

const ClickableRow = ({ icon, label, value, color = 'var(--text-main)', hideArrow, onClick }) => (
  <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
    <div style={{ color }}>{icon}</div>
    <span style={{ fontWeight: 600, color, flex: 1 }}>{label}</span>
    <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '14px' }}>{value}</span>
    {!hideArrow && <ChevronRight size={16} color="var(--text-muted)" />}
  </div>
);

export default SettingsScreen;
