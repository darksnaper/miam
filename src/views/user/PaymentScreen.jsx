import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, CheckCircle, ChevronRight, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const PaymentScreen = ({ venue, category, onBack, onComplete }) => {
  const { t } = useAppContext();
  const [method, setMethod] = useState('sbp');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onComplete();
    }, 1500); // Simulate network
  };

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="content"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, background: 'var(--bg)' }}
    >
      {/* Header */}
      <div style={{ background: 'var(--surface)', padding: '20px', display: 'flex', alignItems: 'center', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
        <button 
          onClick={onBack}
          disabled={isProcessing}
          style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', opacity: isProcessing ? 0.5 : 1 }}
        >
          <ArrowLeft size={24} color="var(--text-main)" />
        </button>
        <h2 style={{ flex: 1, textAlign: 'center', fontSize: '18px', fontWeight: 800, marginRight: 24 }}>{t('payment.title')}</h2>
      </div>

      <div style={{ padding: '24px 20px' }}>
        {/* Order Summary */}
        <div style={{ background: 'var(--surface)', borderRadius: '24px', padding: '20px', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('payment.your_order')}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            {category?.image ? (
                <img src={category.image} style={{ width: 60, height: 60, borderRadius: 12, objectFit: 'cover' }} alt="cat" />
            ) : (
                <div style={{ width: 60, height: 60, borderRadius: 12, background: 'var(--accent)' }} />
            )}
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '16px', fontWeight: 700 }}>{t(category.name)}</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t(venue.name)}</p>
            </div>
            <div style={{ fontWeight: 800, fontSize: '18px' }}>{category.price}₽</div>
          </div>
          <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{t('payment.net_profit')}</span>
            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>+{category.oldPrice - category.price}₽</span>
          </div>
        </div>

        {/* Payment Methods */}
        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>{t('payment.method')}</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {[
            { id: 'sbp', title: 'СБП', bg: 'linear-gradient(45deg, #1f42a5, #dd0031, #009e3a)', icon: <span style={{ color: '#fff', fontWeight: 900, fontSize: '12px', letterSpacing: '0.5px' }}>СБП</span> },
            { id: 'tpay', title: 'T-Pay', bg: '#FFDD2D', icon: <span style={{ color: '#000', fontWeight: 900, fontSize: '20px' }}>T</span> },
            { id: 'sber', title: 'SberPay', bg: '#21A038', icon: <span style={{ color: '#fff', fontWeight: 900, fontSize: '18px' }}>S</span> },
            { id: 'card', title: t('payment.card'), subtitle: '•• 4581', bg: 'var(--bg)', icon: <CreditCard size={20} color="var(--text-muted)" /> }
          ].map(opt => (
            <div 
              key={opt.id}
              onClick={() => !isProcessing && setMethod(opt.id)}
              style={{ 
                background: 'var(--surface)', padding: '16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '16px', 
                border: method === opt.id ? '2px solid var(--primary)' : '2px solid transparent',
                boxShadow: 'var(--shadow-sm)', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <div style={{ background: opt.bg, width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {opt.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: 700 }}>{opt.title}</h4>
                {opt.subtitle && <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{opt.subtitle}</p>}
              </div>
              <div style={{ width: 24, height: 24, borderRadius: '50%', border: method === opt.id ? '7px solid var(--primary)' : '2px solid var(--border)' }} />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '12px', marginBottom: '24px' }}>
          <ShieldCheck size={16} color="var(--primary)" />
          {t('payment.secure')}
        </div>

      </div>

      {/* Fixed Pay Button */}
      <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
        <button 
          onClick={handlePay}
          disabled={isProcessing}
          className="btn-primary" 
          style={{ width: '100%', padding: '18px', fontSize: '18px', boxShadow: '0 10px 30px rgba(76, 175, 80, 0.3)' }}
        >
          {isProcessing ? (
             <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: 'linear', duration: 1 }}>
                 <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }} />
               </motion.div>
               {t('payment.processing')}
             </span>
          ) : (
            `${t('payment.pay')} ${category.price}₽`
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default PaymentScreen;
