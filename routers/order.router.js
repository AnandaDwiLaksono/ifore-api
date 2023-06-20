const express = require('express');

const {
  addOrderHandler,
  getAllOrderHandler,
  getOrderByIdHandler,
  updateOrderHandler,
  deleteOrderHandler
} = require('../controllers/order.controller');

const router = express.Router();

router.post('/api/order_items', addOrderHandler);
router.get('/api/order_items', getAllOrderHandler);
router.get('/api/order_items/:id', getOrderByIdHandler);
router.put('/api/order_items/:id', updateOrderHandler);
router.delete('/api/order_items/:id', deleteOrderHandler);

module.exports = router;
