import React, { createContext, useContext, useState, useEffect } from 'react';
import { CATEGORIES as INITIAL_CATEGORIES } from '../data/mockData';

const translations = {
  ru: {
    'nav.home': 'Главная',
    'nav.orders': 'Заказы',
    'nav.profile': 'Профиль',
    'profile.title': 'Профиль',
    'profile.saved': 'Всего сэкономлено',
    'profile.goal': 'До статуса "Легенда скидок"',
    'profile.orders': 'Выгодных заказов',
    'profile.favorites': 'Любимых мест',
    'profile.menu.favorites': 'Избранные заведения',
    'profile.menu.notifications': 'Настройки уведомлений',
    'profile.menu.settings': 'Настройки и оплата',
    'profile.menu.support': 'Служба поддержки',
    'profile.menu.logout': 'Выйти',
    'profile.badges.title': 'Достижения',
    'settings.title': 'Настройки и оплата',
    'settings.general': 'ОБЩИЕ',
    'settings.theme': 'Тема оформления',
    'settings.theme.light': 'Светлая',
    'settings.theme.dark': 'Темная',
    'settings.theme.system': 'Системная',
    'settings.lang': 'Язык приложения',
    'settings.cache': 'Очистить кэш',
    'settings.personal': 'ЛИЧНЫЕ ДАННЫЕ',
    'settings.name': 'Имя',
    'settings.phone': 'Телефон',
    'settings.payment': 'СПОСОБЫ ОПЛАТЫ',
    'settings.add_card': 'Добавить карту',
    'onboarding.title': 'Любимая еда за полцены.',
    'onboarding.subtitle': 'Спасай вкусные порции из ресторанов и пекарен со скидкой 50% и больше.',
    'onboarding.btn': 'Хочу скидку!',
    'onboarding.button': 'Продолжить',
    'Пекарня': 'Пекарня',
    'Супермаркет': 'Супермаркет',
    'Кафе': 'Кафе',
    'Кондитерская': 'Кондитерская',
    'ВкусВилл': 'ВкусВилл',
    'ЦЕХ85': 'ЦЕХ85',
    'Люди Любят': 'Люди Любят',
    'Эклерная Клер': 'Эклерная Клер',
    'Кронверкский проспект, 47': 'Кронверкский проспект, 47',
    'Сытнинская улица, 14': 'Сытнинская улица, 14',
    'Большой проспект ПС, 32': 'Большой проспект ПС, 32',
    'Малый проспект ПС, 22': 'Малый проспект ПС, 22',
    'Все': 'Все',
    'home.available': 'Доступно в районе',
    'home.nearby': 'Рядом с тобой',
    'home.sold_out': 'ПРОДАНО',
    'home.portions': 'порций',
    'home.until': 'До',
    'venue.pickup': 'Окно самовывоза:',
    'venue.available': 'Доступные наборы:',
    'venue.old_price': 'Обычно',
    'venue.add': 'Добавить',
    'payment.title': 'Оплата заказа',
    'payment.your_order': 'Ваш заказ',
    'payment.net_profit': 'Ваша чистая выгода:',
    'payment.method': 'Способ оплаты',
    'payment.card': 'Банковская карта',
    'payment.secure': 'Безопасный платеж. Miam не хранит данные карт.',
    'payment.processing': 'Обработка...',
    'payment.pay': 'Оплатить',
    'checkout.title': 'Твой заказ',
    'checkout.success': 'Оплачено!',
    'checkout.subtitle': 'Предъяви QR-код на кассе до закрытия',
    'checkout.order': 'Заказ',
    'checkout.time': 'Время',
    'checkout.status': 'Статус',
    'checkout.ready': 'Готов к выдаче',
    'checkout.done': 'Готово',
    'merchant.home': 'Главная',
    'merchant.inventory': 'Слоты',
    'merchant.orders': 'Заказы',
    'merchant.scanner': 'Сканер',
    'merchant.online': 'В СЕТИ',
    'merchant.stats.revenue': 'Выручка',
    'merchant.stats.saved': 'Выгода клиентов',
    'merchant.inventory.title': 'Выставить слоты',
    'merchant.inventory.per_slot': '/ слот',
    'merchant.orders.recent': 'Последние заказы',
    'merchant.orders.all': 'Все',
    'merchant.orders.issue': 'ВЫДАТЬ',
    'merchant.profile': 'Профиль',
    'merchant.add_set': 'Добавить набор',
    'merchant.add_set.name': 'Название (Например: Секретный ужин)',
    'merchant.add_set.price': 'Цена (₽)',
    'merchant.add_set.save': 'Сохранить',
    'merchant.profile.income.week': 'Доход за 7 дней',
    'merchant.profile.income.month': 'Доход за месяц',
    'merchant.profile.income.year': 'Доход за год',
    'merchant.profile.income.all': 'Доход за всё время',
    'merchant.profile.total_orders': 'Всего заказов',
    'merchant.profile.cancellations': 'Процент отмен',
    'merchant.profile.arpu': 'Средний чек',
    'merchant.profile.settings': 'Настройки аккаунта',
  },
  en: {
    'nav.home': 'Home',
    'nav.orders': 'Orders',
    'nav.profile': 'Profile',
    'profile.title': 'Profile',
    'profile.saved': 'Total saved',
    'profile.goal': 'To "Discount Legend" status',
    'profile.orders': 'Rescued meals',
    'profile.favorites': 'Favorite places',
    'profile.menu.favorites': 'Favorites',
    'profile.menu.notifications': 'Notifications',
    'profile.menu.settings': 'Settings & Payment',
    'profile.menu.support': 'Support',
    'profile.menu.logout': 'Logout',
    'profile.badges.title': 'Achievements',
    'settings.title': 'Settings & Payment',
    'settings.general': 'GENERAL',
    'settings.theme': 'Appearance',
    'settings.theme.light': 'Light',
    'settings.theme.dark': 'Dark',
    'settings.theme.system': 'System',
    'settings.lang': 'App Language',
    'settings.cache': 'Clear Cache',
    'settings.personal': 'PERSONAL INFO',
    'settings.name': 'Name',
    'settings.phone': 'Phone',
    'settings.payment': 'PAYMENT METHODS',
    'settings.add_card': 'Add Card',
    'onboarding.title': 'Favorite food at half price.',
    'onboarding.subtitle': 'Rescue delicious meals from restaurants and bakeries at 50% off or more.',
    'onboarding.btn': 'Get Discount!',
    'onboarding.button': 'Continue',
    'Пекарня': 'Bakery',
    'Супермаркет': 'Supermarket',
    'Кафе': 'Cafe',
    'Кондитерская': 'Pastry Shop',
    'ВкусВилл': 'VkusVill',
    'ЦЕХ85': 'TSEKH85',
    'Люди Любят': 'People Love',
    'Эклерная Клер': 'Eclair Clair',
    'Кронверкский проспект, 47': 'Kronverkskiy ave, 47',
    'Сытнинская улица, 14': 'Sytninskaya st, 14',
    'Большой проспект ПС, 32': 'Bolshoy ave PS, 32',
    'Малый проспект ПС, 22': 'Maly ave PS, 22',
    'Все': 'All',
    'home.available': 'Available in',
    'home.nearby': 'Nearby',
    'home.sold_out': 'SOLD OUT',
    'home.portions': 'portions',
    'home.until': 'Until',
    'venue.pickup': 'Pickup window:',
    'venue.available': 'Available packs:',
    'venue.old_price': 'Usually',
    'venue.add': 'Add',
    'payment.title': 'Order Payment',
    'payment.your_order': 'Your order',
    'payment.net_profit': 'Your net profit:',
    'payment.method': 'Payment method',
    'payment.card': 'Bank card',
    'payment.secure': 'Secure payment. Miam saves no card data.',
    'payment.processing': 'Processing...',
    'payment.pay': 'Pay',
    'checkout.title': 'Your order',
    'checkout.success': 'Paid!',
    'checkout.subtitle': 'Show QR code at the cash register',
    'checkout.order': 'Order',
    'checkout.time': 'Time',
    'checkout.status': 'Status',
    'checkout.ready': 'Ready for pickup',
    'checkout.done': 'Done',
    'merchant.home': 'Home',
    'merchant.inventory': 'Inventory',
    'merchant.orders': 'Orders',
    'merchant.scanner': 'Scanner',
    'merchant.online': 'ONLINE',
    'merchant.stats.revenue': 'Revenue',
    'merchant.stats.saved': 'Customer Savings',
    'merchant.inventory.title': 'Manage Slots',
    'merchant.inventory.per_slot': '/ slot',
    'merchant.orders.recent': 'Recent Orders',
    'merchant.orders.all': 'All',
    'merchant.orders.issue': 'ISSUE',
    'merchant.profile': 'Profile',
    'merchant.add_set': 'Add Package',
    'merchant.add_set.name': 'Name (e.g. Secret Dinner)',
    'merchant.add_set.price': 'Price (₽)',
    'merchant.add_set.save': 'Save',
    'merchant.profile.income.week': '7-Day Income',
    'merchant.profile.income.month': 'Monthly Income',
    'merchant.profile.income.year': 'Yearly Income',
    'merchant.profile.income.all': 'All-Time Income',
    'merchant.profile.total_orders': 'Total Orders',
    'merchant.profile.cancellations': 'Cancel Rate',
    'merchant.profile.arpu': 'Average Check',
    'merchant.profile.settings': 'Account Settings',
  }
};

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('miam_theme') || 'system');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('miam_user');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      // PostgreSQL uses UUID strings.
      // The old mock user generated IDs using Date.now() which are pure numbers (or numeric strings).
      // If the ID can be perfectly converted to a massive number, it's a legacy timestamp.
      if (!parsed?.id || (!isNaN(Number(parsed.id)) && Number(parsed.id) > 1000000)) {
        localStorage.removeItem('miam_user');
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });
  const logout = () => {
    setUser(null);
    setOrders([]);
    localStorage.removeItem('miam_user');
  };
  const [lang, setLang] = useState(localStorage.getItem('miam_lang') || 'ru');
  const [venues, setVenues] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = 'https://miam-pied.vercel.app/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [venuesRes, districtsRes] = await Promise.all([
          fetch(`${API_BASE}/venues`),
          fetch(`${API_BASE}/districts`)
        ]);
        
        const venuesData = await venuesRes.json();
        const districtsData = await districtsRes.json();
        
        setVenues(Array.isArray(venuesData) ? venuesData : []);
        setDistricts(Array.isArray(districtsData) ? districtsData : []);

        if (user) {
          const ordersRes = await fetch(`${API_BASE}/orders/user/${user.id}`);
          const ordersData = await ordersRes.json();
          setOrders(Array.isArray(ordersData) ? ordersData : []);
          
          // Background fetch to update user cache (favorites, totalSaved, status etc)
          try {
            const userRes = await fetch(`${API_BASE}/users/${user.id}`);
            const userData = await userRes.json();
            if (!userData.error) setUser(userData);
          } catch (e) { console.error('Failed to update fresh user data', e); }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Не удалось загрузить данные. Проверьте интернет или состояние сервера.');
        alert('Ошибка сервера: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('miam_theme', theme);
    document.body.className = '';
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.body.classList.add('dark-theme');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('miam_lang', lang);
  }, [lang]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('miam_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('miam_user');
    }
  }, [user]);

  const t = (key) => translations[lang]?.[key] || key;

  const fetchOrders = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}/orders/user/${userId}`);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const updateVenueSlots = async (venueId, categoryId, delta) => {
    setVenues(prev => prev.map(v => {
      if (v.id !== venueId) return v;
      return {
        ...v,
        categories: v.categories.map(cat => 
          cat.id === categoryId ? { ...cat, slots: Math.max(0, cat.slots + delta) } : cat
        )
      };
    }));

    try {
      await fetch(`${API_BASE}/items/${categoryId}/slots`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta })
      });
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const addVenueCategory = async (venueId, newCategory) => {
    try {
      const res = await fetch(`${API_BASE}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newCategory, venueId })
      });
      const savedItem = await res.json();
      
      setVenues(prev => prev.map(v => {
        if (v.id !== venueId) return v;
        return { ...v, categories: [...v.categories, savedItem] };
      }));
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/users/${user.id}`);
      const data = await res.json();
      if (!data.error) setUser(data);
    } catch (e) { console.error('Failed to refresh user', e); }
  };

  const toggleFavoriteVenue = async (venueId) => {
    if (!user) return;
    const isFav = user.favorites?.some(v => v.id === venueId);
    try {
      // Optimistic update
      const newFavs = isFav 
        ? user.favorites.filter(v => v.id !== venueId)
        : [...(user.favorites || []), venues.find(v => v.id === venueId)].filter(Boolean);
      setUser(prev => ({ ...prev, favorites: newFavs }));

      // API Call
      const res = await fetch(`${API_BASE}/users/${user.id}/favorites/${venueId}`, {
        method: isFav ? 'DELETE' : 'POST'
      });
      const data = await res.json();
      if (Array.isArray(data)) setUser(prev => ({ ...prev, favorites: data }));
    } catch (e) {
      console.error('Favorite toggle failed', e);
      refreshUser(); // revert on fail
    }
  };

  return (
    <AppContext.Provider value={{ 
      theme, setTheme, lang, setLang, t, 
      venues, districts, isLoading,
      fetchOrders, updateVenueSlots, addVenueCategory, 
      orders, setOrders,
      user, setUser, logout, refreshUser, toggleFavoriteVenue,
      API_BASE
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
