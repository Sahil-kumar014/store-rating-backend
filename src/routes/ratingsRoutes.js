const express = require('express');
const router = express.Router();
const { rateStore } = require('../controllers/ratingsController');
const { authenticate, authorize } = require('../middlewares/authmiddleware');

router.post('/', authenticate, authorize('USER'), rateStore);

module.exports = router;