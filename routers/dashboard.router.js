const express = require('express');

const { getCardData, getIncomeProfitData, getCategoryData, getPredictionData, getTransactionHistoryData } = require('../controllers/dashboard.controller');

const router = express.Router();

router.post('/api/dashboard/card', getCardData);
router.post('/api/dashboard/income-profit', getIncomeProfitData);
router.post('/api/dashboard/category', getCategoryData);
router.get('/api/dashboard/prediction', getPredictionData);
router.get('/api/dashboard/transaction', getTransactionHistoryData);

module.exports = router;
