import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, MessageCircle } from 'lucide-react';

const SupportScreen = ({ onBack }) => {
  const faqs = [
    { q: 'Как работает Miam?', a: 'Мы помогаем заведениям распродавать остатки свежей еды в конце дня. Вы заказываете набор через приложение с огромной скидкой и забираете его в указанное «окно самовывоза».' },
    { q: 'Как отменить заказ?', a: 'Вы можете отменить заказ в разделе «Заказы» не позднее чем за 2 часа до начала окна самовывоза. Деньги вернутся автоматически.' },
    { q: 'Что делать, если заведение закрыто?', a: 'Напишите нам в чат поддержки прямо из приложения. Сфотографируйте закрытую дверь, и мы вернем деньги в течение суток.' }
  ];

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="content"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, background: 'var(--bg)', overflowY: 'auto' }}
    >
      <div style={{ background: 'var(--surface)', padding: '20px', display: 'flex', alignItems: 'center', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', display: 'flex', color: 'var(--text-main)' }}><ArrowLeft size={24} /></button>
        <h2 style={{ flex: 1, textAlign: 'center', fontSize: '18px', fontWeight: 800, marginRight: 24 }}>Поддержка</h2>
      </div>

      <div style={{ padding: '24px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--accent)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <MessageCircle size={32} />
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Чем можем помочь?</h1>
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Частые вопросы</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
          {faqs.map((faq, i) => <FAQItem key={i} faq={faq} />)}
        </div>

        <button className="btn-primary" style={{ width: '100%', padding: '18px', fontSize: '16px' }}>
          <MessageCircle size={20} /> Написать в чат поддержки
        </button>
      </div>
    </motion.div>
  );
};

const FAQItem = ({ faq }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: 'var(--surface)', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      <div onClick={() => setOpen(!open)} style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 700 }}>
        {faq.q}
        <motion.div animate={{ rotate: open ? 180 : 0 }}><ChevronDown size={20} color="var(--text-muted)" /></motion.div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
            <p style={{ padding: '0 16px 16px 16px', color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.5 }}>
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupportScreen;
