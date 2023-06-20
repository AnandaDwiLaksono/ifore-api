const express = require('express');

const {
  addTransactionHandler,
  getAllTransactionHandler,
  getTransactionByIdHandler,
  updateTransactionHandler,
  deleteTransactionHandler
} = require('../controllers/transaction.controller');

const router = express.Router();

router.post('/api/transaction_histories', addTransactionHandler);
router.get('/api/transaction_histories', getAllTransactionHandler);
router.get('/api/transaction_histories/:id', getTransactionByIdHandler);
router.put('/api/transaction_histories/:id', updateTransactionHandler);
router.delete('/api/transaction_histories/:id', deleteTransactionHandler);

module.exports = router;
