const express = require('express');

const { getCardHandler, getIncomeProfit } = require('../controllers/dashboard.controller');

const router = express.Router();

router.post('/api/dashboard/card', getCardHandler);
router.get('/api/dashboard/income-profit', getIncomeProfit);

module.exports = router;
