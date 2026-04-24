import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, QrCode, Clock, MapPin, ArrowLeft, Share2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Checkout = ({ venue, order, onBack, onDone }) => {
  const { t } = useAppContext();
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="content"
      style={{ 
        background: 'var(--primary)', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column',
        padding: '24px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <button 
          onClick={onBack}
          style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '12px', padding: '8px', color: 'white' }}
        >
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ fontSize: '18px', fontWeight: 700 }}>{t('checkout.title')}</h2>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <CheckCircle size={80} strokeWidth={1.5} style={{ marginBottom: '16px' }} />
        </motion.div>
        <h1 style={{ fontSize: '32px', fontWeight: 800 }}>{t('checkout.success')}</h1>
        <p style={{ opacity: 0.8 }}>{t('checkout.subtitle')}</p>
      </div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="glass"
        style={{ 
          background: 'var(--surface)', 
          borderRadius: '32px', 
          padding: '32px', 
          color: 'var(--text-main)',
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ 
          width: '200px', 
          height: '200px', 
          background: 'var(--bg)', 
          borderRadius: '24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: '24px',
          padding: '20px'
        }}>
          <QrCode size={140} color="var(--text-main)" strokeWidth={1} />
        </div>

        <div style={{ width: '100%', textAlign: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '4px' }}>{t(venue?.name || order?.venue?.name || order?.venue)}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>{t('checkout.order')} {order?.id?.split('-')[0] || '#MIAM-8842'}</p>
          
          <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '20px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t('checkout.time')}</span>
              <span style={{ fontWeight: 700 }}>{order?.time || venue?.pickupWindow || venue?.closingTime || order?.venue?.closingTime || ''}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t('checkout.status')}</span>
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{t('checkout.ready')}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
        <button 
          onClick={onDone}
          className="glass" 
          style={{ 
            flex: 1, 
            padding: '16px', 
            borderRadius: '20px', 
            border: 'none', 
            fontWeight: 700, 
            background: 'var(--surface)', 
            color: 'var(--primary)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {t('checkout.done')}
        </button>
        <button 
          className="glass" 
          style={{ 
            padding: '16px', 
            borderRadius: '20px', 
            border: 'none', 
            color: 'white',
            background: 'rgba(255,255,255,0.2)'
          }}
        >
          <Share2 size={24} />
        </button>
      </div>
    </motion.div>
  );
};

export default Checkout;
