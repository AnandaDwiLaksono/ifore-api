const express = require('express');

const { getCardData, getIncomeProfitData, getCategoryData, getPredictionData, getTransactionHistoryData } = require('../controllers/dashboard.controller');

const router = express.Router();

router.post('/api/dashboard/card', getCardData);
router.post('/api/dashboard/income-profit', getIncomeProfitData);
router.post('/api/dashboard/category', getCategoryData);
router.post('/api/dashboard/transaction', getTransactionHistoryData);
router.get('/api/dashboard/prediction', getPredictionData);

module.exports = router;
