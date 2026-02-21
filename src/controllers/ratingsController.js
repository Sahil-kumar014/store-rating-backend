const pool = require('../config/db');

exports.rateStore = async (req, res) => {
  try {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    if (!store_id || !rating) {
      return res.status(400).json({ message: "Store ID and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const result = await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [user_id, store_id, rating]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);

    if (error.code === '23505') {
      return res.status(400).json({ message: "You have already rated this store" });
    }

    res.status(500).json({ message: "Error rating store" });
  }
};