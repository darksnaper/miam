import { Shield, Users, ShoppingBag, TrendingUp, AlertCircle, CheckCircle, MoreVertical, Search, Filter, LogOut } from 'lucide-react';
import { VENUES } from '../../data/mockData';

const AdminDashboard = ({ user, onLogout }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="content"
      style={{ background: '#F0F2F5' }}
    >
      {/* Admin Header */}
      <div style={{ background: 'var(--text-main)', color: 'white', padding: '32px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={24} color="var(--primary)" /> Miam Control
          </h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>
              v1.0 MVP
            </div>
            <button 
              onClick={onLogout}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '8px', borderRadius: '12px', color: 'white' }}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
        <p style={{ opacity: 0.7, fontSize: '14px' }}>Глобальное управление платформой • {user?.name}</p>
      </div>

      {/* Global Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '20px', marginTop: '-20px' }}>
        <AdminStat icon={<TrendingUp size={20} />} label="GMV (7д)" value="452,000₽" />
        <AdminStat icon={<ShoppingBag size={20} />} label="Порций спасено" value="1,240" />
      </div>

      {/* Venues Management */}
      <div style={{ padding: '0 20px 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Активные заведения</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
             <button style={{ background: 'white', border: 'none', padding: '8px', borderRadius: '10px' }}><Search size={16} /></button>
             <button style={{ background: 'white', border: 'none', padding: '8px', borderRadius: '10px' }}><Filter size={16} /></button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {VENUES.map(venue => (
            <div key={venue.id} style={{ 
              background: 'white', borderRadius: '20px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', overflow: 'hidden' }}>
                <img src={venue.image} alt={venue.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{venue.name}</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{venue.type} • {venue.address}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', color: 'var(--primary)', fontWeight: 700, fontSize: '12px' }}>
                   <CheckCircle size={14} /> LIVE
                 </div>
                 <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Комиссия: 15%</p>
              </div>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)' }}>
                <MoreVertical size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Alerts */}
      <div style={{ padding: '0 20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Требует внимания</h2>
        <div style={{ background: '#FFF3E0', borderRadius: '20px', padding: '16px', display: 'flex', gap: '16px', border: '1px solid #FFE0B2' }}>
           <AlertCircle size={24} color="#E65100" />
           <div style={{ flex: 1 }}>
             <p style={{ fontWeight: 700, fontSize: '14px', color: '#E65100' }}>Жалоба на качество</p>
             <p style={{ fontSize: '12px', color: '#6D4C41' }}>Заведение: Братья Караваевы. Заказ #8122. "Еда была холодной".</p>
           </div>
           <button style={{ background: 'white', color: '#E65100', border: 'none', borderRadius: '10px', padding: '4px 12px', fontSize: '12px', fontWeight: 700 }}>РАЗБОР</button>
        </div>
      </div>
    </motion.div>
  );
};

const AdminStat = ({ icon, label, value }) => (
  <div style={{ background: 'white', borderRadius: '24px', padding: '20px', boxShadow: 'var(--shadow-md)' }}>
    <div style={{ color: 'var(--primary)', marginBottom: '8px' }}>{icon}</div>
    <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>{label}</p>
    <p style={{ fontSize: '20px', fontWeight: 800 }}>{value}</p>
  </div>
);

export default AdminDashboard;
