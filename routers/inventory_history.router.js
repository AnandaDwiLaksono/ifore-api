const express = require('express');

const {
  addInventoryHistoryHandler,
  getAllInventoryHistoryHandler,
  updateInventoryHistoryHandler,
  deleteInventoryHistoryHandler,
  getInventoryHistoryByIdHandler
} = require('../controllers/inventory_history.controller');

const router = express.Router();

router.post('/api/inventory_histories', addInventoryHistoryHandler);
router.get('/api/inventory_histories', getAllInventoryHistoryHandler);
router.get('/api/inventory_histories/:id', getInventoryHistoryByIdHandler);
router.put('/api/inventory_histories/:id', updateInventoryHistoryHandler);
router.delete('/api/inventory_histories/:id', deleteInventoryHistoryHandler);

module.exports = router;
