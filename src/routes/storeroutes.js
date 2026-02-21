const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/authmiddleware');
const storecontroller = require('../controllers/storecontroller');

// ADMIN can create store
router.post(
  '/create',
  authenticate,
  authorize('ADMIN'),
  storecontroller.createStore
);

// Anyone logged in can see stores
router.get(
  '/',
  authenticate,
  storecontroller.getAllStores
);

module.exports = router;
