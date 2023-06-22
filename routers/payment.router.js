const express = require('express');

const {
  createPaymentTypeHandler,
  getAllPaymentTypeHandler,
  deletePaymentTypeHandler
} = require('../controllers/payment.controller');

const router = express.Router();

router.post('/api/payment_types', createPaymentTypeHandler);
router.get('/api/payment_types', getAllPaymentTypeHandler);
// router.put('/api/payment_types/:id', updatePaymentTypeHandler);
router.delete('/api/payment_types/:id', deletePaymentTypeHandler);

module.exports = router;
