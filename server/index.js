import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// --- AUTH ROUTES ---

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, role } = req.body;
  try {
    const user = await prisma.user.create({
      data: { email, password, name, role: role || 'user' },
      include: { favorites: true }
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'User already exists or invalid data' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { favorites: true }
    });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- DATA ROUTES ---

app.get('/api/version', (req, res) => {
  res.json({
    latest: 11, // Увеличьте это число на сервере, когда захотите заставить всех обновиться
    link: "https://github.com/darksnaper/miam/releases/download/miam/app-debug.apk" // Замените на прямую ссылку на APK
  });
});

app.get('/api/districts', async (req, res) => {
  try {
    const districts = await prisma.district.findMany();
    res.json(districts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/venues', async (req, res) => {
  try {
    const venues = await prisma.venue.findMany({
      include: {
        menuPositions: true
      }
    });

    const formattedVenues = venues.map(v => ({
      ...v,
      categories: v.menuPositions
    }));

    res.json(formattedVenues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ORDER ROUTES ---

app.post('/api/orders', async (req, res) => {
  try {
    const { userId, itemId, code } = req.body;
    const venueId = parseInt(req.body.venueId);
    const savings = parseInt(req.body.savings) || 0;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Уменьшаем слоты
      const item = await tx.menuPosition.findUnique({ where: { id: itemId } });
      if (!item) throw new Error('Предмет не найден');
      if (item.slots <= 0) throw new Error('Места в этом заведении уже закончились');

      await tx.menuPosition.update({
        where: { id: itemId },
        data: { slots: item.slots - 1 }
      });

      // 2. Создаем заказ
      const order = await tx.order.create({
        data: {
          userId,
          venueId,
          menuPositionId: itemId,
          savings,
          code: code || Math.floor(1000 + Math.random() * 9000).toString(),
        },
        include: {
          venue: true,
          menuPosition: true
        }
      });

      // 3. Обновляем статистику пользователя (Строго!)
      await tx.user.update({
        where: { id: userId },
        data: {
          totalSaved: { increment: savings },
          totalOrders: { increment: 1 }
        }
      });

      return order;
    });

    res.json(result);
  } catch (error) {
    console.error("Order error:", error);
    // Отправляем понятную ошибку на фронтенд
    const message = error.message.includes('Foreign key constraint')
      ? 'Ошибка аккаунта. Пожалуйста, перезайдите в профиль.'
      : error.message;
    res.status(400).json({ error: message });
  }
});

app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.params.userId },
      include: {
        venue: true,
        menuPosition: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Format to match frontend structure
    const formatted = orders.map(o => ({
      id: o.id,
      venue: o.venue,
      category: o.menuPosition,
      code: o.code,
      status: o.status,
      savings: o.savings,
      date: o.createdAt
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- USER PROFILE ROUTES ---

app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        favorites: true,
        orders: true // Берем заказы для сверки
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Считаем реальную сумму из истории
    const actualSaved = user.orders.reduce((sum, o) => sum + (o.savings || 0), 0);
    const actualOrdersCount = user.orders.length;

    // Если в профиле цифры меньше (например, после миграции), обновляем их
    if (user.totalSaved !== actualSaved || user.totalOrders !== actualOrdersCount) {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          totalSaved: actualSaved,
          totalOrders: actualOrdersCount
        },
        include: { favorites: true }
      });
      return res.json(updatedUser);
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/:userId/favorites/:venueId', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.userId },
      data: {
        favorites: { connect: { id: parseInt(req.params.venueId) } }
      },
      include: { favorites: true }
    });
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:userId/favorites/:venueId', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.userId },
      data: {
        favorites: { disconnect: { id: parseInt(req.params.venueId) } }
      },
      include: { favorites: true }
    });
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- MERCHANT ROUTES ---

app.post('/api/venues', async (req, res) => {
  try {
    const venue = await prisma.venue.create({ data: req.body });
    res.json(venue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const item = await prisma.menuPosition.create({ data: req.body });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export for Vercel
export default app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Miam Full-Database Server running on http://localhost:${PORT}`);
  });
}
