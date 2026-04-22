import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ShoppingBag, ArrowRight, ShieldCheck, UserPlus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('user'); // 'user' or 'merchant'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const { API_BASE } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        // Login Logic
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        if (!res.ok) throw new Error('Неверный email или пароль');
        
        const userData = await res.json();
        onLogin(userData);
      } else {
        // Registration Logic
        if (!email || !password || !name) {
          alert('Пожалуйста, заполните все поля');
          return;
        }
        
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email, 
            password, 
            name, 
            role: role === 'admin' ? 'admin' : role 
          })
        });

        if (!res.ok) throw new Error('Ошибка при регистрации. Возможно, email уже занят.');

        const newUser = await res.json();
        onLogin(newUser);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="content"
      style={{ 
        background: 'linear-gradient(180deg, #F9FAFB 0%, #F3F4F6 100%)',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 24px'
      }}
    >
      <div style={{ marginTop: '80px', marginBottom: '40px', textAlign: 'center' }}>
        <div style={{ 
          width: '64px', height: '64px', borderRadius: '20px', background: 'var(--primary)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
          margin: '0 auto 16px auto', boxShadow: 'var(--shadow-md)'
        }}>
          <ShoppingBag size={32} />
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 800 }}>{isLogin ? 'С возвращением!' : 'Создать аккаунт'}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
          {isLogin ? 'Войдите в свой профиль Miam' : 'Начните экономить на еде прямо сейчас'}
        </p>
      </div>

      {/* Role Switcher (During Auth) */}
      {!isLogin && (
        <div style={{ 
          display: 'flex', background: 'white', borderRadius: '16px', padding: '4px', marginBottom: '24px',
          boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)'
        }}>
          <RoleToggle 
            active={role === 'user'} 
            label="Я покупатель" 
            onClick={() => setRole('user')} 
            icon={<User size={16} />}
          />
          <RoleToggle 
            active={role === 'merchant'} 
            label="Я заведение" 
            onClick={() => setRole('merchant')} 
            icon={<ShieldCheck size={16} />}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AnimatePresence mode="wait">
          {!isLogin && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <Input icon={<User size={20} />} placeholder="Ваше имя" value={name} onChange={setName} />
            </motion.div>
          )}
        </AnimatePresence>

        <Input icon={<Mail size={20} />} placeholder="Email" type="email" value={email} onChange={setEmail} />
        <Input icon={<Lock size={20} />} placeholder="Пароль" type="password" value={password} onChange={setPassword} />

        {isLogin && (
          <p style={{ textAlign: 'right', fontSize: '12px', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}>
            Забыли пароль?
          </p>
        )}

        <button 
          type="submit"
          style={{ 
            background: 'var(--primary)', color: 'white', border: 'none', padding: '16px', 
            borderRadius: '16px', fontSize: '16px', fontWeight: 700, marginTop: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: '0 10px 20px rgba(76, 175, 80, 0.2)'
          }}
        >
          {isLogin ? 'Войти' : 'Зарегистрироваться'}
          <ArrowRight size={20} />
        </button>
      </form>

      <div style={{ marginTop: 'auto', marginBottom: '40px', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
          <span 
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: 'var(--primary)', fontWeight: 700, marginLeft: '8px', cursor: 'pointer' }}
          >
            {isLogin ? 'Зарегистрироваться' : 'Войти'}
          </span>
        </p>

        {/* Hidden Admin Entry for testing */}
        {isLogin && (
          <div 
            onClick={() => setRole(role === 'admin' ? 'user' : 'admin')}
            style={{ marginTop: '20px', opacity: 0.2, fontSize: '10px' }}
          >
            {role === 'admin' ? '[ADMIN DETECTED]' : '[USER MODE]'}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Input = ({ icon, placeholder, type = 'text', value, onChange }) => (
  <div style={{ 
    display: 'flex', alignItems: 'center', background: 'white', borderRadius: '16px', 
    padding: '12px 16px', border: '1px solid var(--border)', gap: '12px'
  }}>
    <div style={{ color: 'var(--text-muted)' }}>{icon}</div>
    <input 
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ 
        border: 'none', background: 'none', outline: 'none', flex: 1, 
        fontSize: '15px', fontWeight: 500
      }}
    />
  </div>
);

const RoleToggle = ({ active, label, onClick, icon }) => (
  <button 
    onClick={(e) => { e.preventDefault(); onClick(); }}
    style={{ 
      flex: 1, padding: '10px', border: 'none', borderRadius: '12px',
      background: active ? 'var(--primary)' : 'transparent',
      color: active ? 'white' : 'var(--text-muted)',
      fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', 
      gap: '8px', transition: 'all 0.2s', cursor: 'pointer'
    }}
  >
    {icon}
    {label}
  </button>
);

export default AuthScreen;
