import express from 'express';
import cors from 'cors';
import { PrismaClient } from './prisma/generated/client/index.js';
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
      data: { email, password, name, role: role || 'user' }
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'User already exists or invalid data' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- DATA ROUTES ---

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
  const { userId, venueId, itemId, savings, code } = req.body;
  
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Decrement slots
      const item = await tx.menuPosition.findUnique({ where: { id: itemId } });
      if (!item || item.slots <= 0) throw new Error('No slots available');
      
      await tx.menuPosition.update({
        where: { id: itemId },
        data: { slots: item.slots - 1 }
      });

      // 2. Create order
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
      
      return order;
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
