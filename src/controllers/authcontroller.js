const bcrypt = require('bcrypt');
const pool = require('../config/db');

exports.register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role`,
      [name, email, hashedPassword, address, 'USER']
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0]
    });

  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Email already exists' });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
  { id: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      role: user.role
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
