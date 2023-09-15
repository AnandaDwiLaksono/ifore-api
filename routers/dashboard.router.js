const express = require('express');

const { getCardHandler, getIncomeProfit, getCategoryData } = require('../controllers/dashboard.controller');

const router = express.Router();

router.post('/api/dashboard/card', getCardHandler);
router.get('/api/dashboard/income-profit', getIncomeProfit);
router.post('/api/dashboard/category', getCategoryData);

module.exports = router;
