require('dotenv').config();
require('./src/config/db');

const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/authRoutes');
const { authenticate, authorize } = require('./src/middlewares/authmiddleware');

const app = express();

app.use(cors());
app.use(express.json());

const storeroutes = require('./src/routes/storeroutes');

app.use('/api/stores', storeroutes);


app.use('/api/auth', authRoutes);
const ratingsRoutes = require('./src/routes/ratingsRoutes');
app.use('/api/ratings', ratingsRoutes);

app.get('/', (req, res) => {
  res.send('Store Rating API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/api/protected', authenticate, (req, res) => {
  res.json({
    message: 'You accessed protected route',
    user: req.user
  });
});

app.get('/api/admin-only', authenticate, authorize('ADMIN'), (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});