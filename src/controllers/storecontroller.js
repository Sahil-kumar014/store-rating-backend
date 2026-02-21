const pool = require('../config/db');

exports.createStore = async (req, res) => {
  try {
    const { name, address } = req.body;

    const result = await pool.query(
      'INSERT INTO stores (name, address, created_by) VALUES ($1, $2, $3) RETURNING *',
      [name, address, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating store' });
  }
};

exports.getAllStores = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        stores.id,
        stores.name,
        stores.address,
        ROUND(AVG(ratings.rating), 2) AS average_rating
      FROM stores
      LEFT JOIN ratings 
        ON stores.id = ratings.store_id
      GROUP BY stores.id
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching stores" });
  }
};