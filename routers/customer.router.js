const express = require('express');

const {
  createCustomerHandler,
  getAllCustomerHandler,
  deleteCustomerHandler
} = require('../controllers/customer.controller');

const router = express.Router();

router.post('/api/customers', createCustomerHandler);
router.get('/api/customers', getAllCustomerHandler);
router.delete('/api/customers/:id', deleteCustomerHandler);

module.exports = router;