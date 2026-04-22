import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, Clock, MapPin, ChevronRight, ShoppingBag } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useEffect } from 'react';

const OrdersList = ({ onSelectOrder, user }) => {
  const { orders, fetchOrders } = useAppContext();
  
  useEffect(() => {
    if (user?.id) {
      fetchOrders(user.id);
    }
  }, [user]);

  const activeOrders = orders.filter(o => o.status === 'active');
  const pastOrders = orders.filter(o => o.status !== 'active');

  const totalSaved = orders.reduce((acc, o) => acc + (Number(o.savings) || 0), 0);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="content"
      style={{ padding: '24px 20px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Мои заказы</h1>
        <div style={{ background: 'var(--accent)', padding: '8px 16px', borderRadius: '16px', color: 'var(--primary)', fontWeight: 700, fontSize: '14px' }}>
          +{totalSaved}₽ сэкономлено
        </div>
      </div>

      {activeOrders.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: 'var(--primary)' }}>Активные</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeOrders.map(order => (
              <OrderCard key={order.id} order={order} active onClick={() => onSelectOrder(order)} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>История</h2>
        {activeOrders.length === 0 && pastOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.5 }}>
            <ShoppingBag size={48} style={{ marginBottom: '16px' }} />
            <p>У тебя пока нет заказов</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {pastOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const OrderCard = ({ order, active, onClick }) => {
  // Extract data based on whether order is from mock data or local state
  const venueName = typeof order.venue === 'object' ? order.venue.name : order.venue;
  const venueImage = typeof order.venue === 'object' ? order.venue.image : order.image;
  const itemName = order.category ? order.category.name : order.item;
  const itemPrice = order.category ? order.category.price : order.price;
  
  // Format time
  let timeDisplay = order.time;
  if (order.date) {
    const d = new Date(order.date);
    timeDisplay = d.toLocaleDateString([], { day: 'numeric', month: 'short' });
  }

  return (
    <motion.div 
      whileTap={active ? { scale: 0.98 } : {}}
      onClick={onClick}
      style={{
        background: 'var(--surface)',
        borderRadius: '24px',
        padding: '16px',
        display: 'flex',
        gap: '16px',
        boxShadow: 'var(--shadow-sm)',
        border: active ? '1px solid var(--primary)' : '1px solid transparent',
        cursor: active ? 'pointer' : 'default'
      }}
    >
      <div style={{ width: '80px', height: '80px', borderRadius: '16px', overflow: 'hidden', background: 'var(--bg)' }}>
        <img src={venueImage} alt={venueName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{venueName}</h3>
          {active && <QrCode size={20} color="var(--primary)" />}
        </div>
        <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>{itemName}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: active ? 'var(--primary)' : 'var(--text-muted)' }}>
            {timeDisplay}
          </span>
          <span style={{ fontSize: '14px', fontWeight: 800 }}>{itemPrice}₽</span>
        </div>
      </div>
    </motion.div>
  );
};

export default OrdersList;
