import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import axios from 'axios';
import db, { initDb } from './db.js';

dotenv.config();

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your_super_secret_jwt_key_here';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Initialize Database
initDb().then(() => {
  console.log('Database initialized successfully.');
}).catch(err => {
  console.error('Database init failed:', err);
});

// Auth Routes
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: err.message });
    }
    
    const token = jwt.sign({ id: this.lastID, name, email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: this.lastID, name, email } });
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  db.get('SELECT id, name, email, phone, location, farm_size, profile_picture FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ user });
  });
});

app.put('/api/auth/profile', authenticateToken, (req, res) => {
  const { phone, location, farm_size, profile_picture, name } = req.body;
  
  db.run(
    'UPDATE users SET name = ?, phone = ?, location = ?, farm_size = ?, profile_picture = ? WHERE id = ?',
    [name, phone, location, farm_size, profile_picture, req.user.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, message: 'Profile updated' });
    }
  );
});

// GET real schemes
app.get('/api/schemes', (req, res) => {
  db.all('SELECT * FROM schemes', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Stripe Checkout Session
app.post('/api/create-checkout-session', authenticateToken, async (req, res) => {
  const { items } = req.body; // Array of cart items

  try {
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // Stripe expects amounts in cents/paise
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:5179/cart?success=true',
      cancel_url: 'http://localhost:5179/cart?canceled=true',
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Hugging Face AI Disease Scanner Endpoint
app.post('/api/scan-disease', authenticateToken, async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ error: 'No image provided' });

    // Strip base64 header
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    // Make request to Hugging Face Inference API using a popular Plant Disease model
    // Note: If no token is provided, this will likely fail or hit a rate limit.
    const hfToken = process.env.HUGGING_FACE_TOKEN;
    
    if (!hfToken || hfToken === 'hf_placeholder_token_here') {
      // Return a simulated response if API key is missing (for demo purposes)
      return setTimeout(() => {
        res.json({
          disease: 'Leaf Blight (Simulated - No API Key)',
          confidence: 94.2,
          severity: 'Moderate',
          recommendation: 'Please configure HUGGING_FACE_TOKEN in server/.env to get real predictions.'
        });
      }, 2000);
    }

    const response = await axios.post(
      'https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification',
      buffer,
      {
        headers: {
          'Authorization': `Bearer ${hfToken}`,
          'Content-Type': 'application/octet-stream'
        }
      }
    );

    // HF returns an array of label/score objects
    const predictions = response.data;
    if (predictions && predictions.length > 0) {
      const topPrediction = predictions[0];
      
      res.json({
        disease: topPrediction.label,
        confidence: (topPrediction.score * 100).toFixed(1),
        severity: topPrediction.score > 0.8 ? 'High' : 'Moderate',
        recommendation: 'Based on AI analysis, monitor the crop closely. Apply standard fungicides if spread continues.'
      });
    } else {
      res.status(500).json({ error: 'Could not identify disease.' });
    }

  } catch (error) {
    console.error("AI API Error:", error.response?.data || error.message);
    res.status(500).json({ error: 'AI processing failed. Ensure HF token is valid.' });
  }
});

// GET all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET market prices
app.get('/api/market-prices', (req, res) => {
  db.all('SELECT * FROM market_prices', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Backend API Server running on http://localhost:${PORT}`);
});
