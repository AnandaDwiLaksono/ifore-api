const express = require('express');

const {
  addInventoryHandler,
  getAllInventoryHandler,
  updateInventoryHandler,
  deleteInventoryHandler,
  getInventoryByIdHandler
} = require('../controllers/inventory.controller');

const router = express.Router();

router.post('/api/inventories', addInventoryHandler);
router.get('/api/inventories', getAllInventoryHandler);
router.get('/api/inventories/:id', getInventoryByIdHandler);
router.put('/api/inventories/:id', updateInventoryHandler);
router.delete('/api/inventories/:id', deleteInventoryHandler);

module.exports = router;
