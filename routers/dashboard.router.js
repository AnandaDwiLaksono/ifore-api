const express = require('express');

const { getCardData, getIncomeProfitData, getCategoryData, getPredictionData } = require('../controllers/dashboard.controller');

const router = express.Router();

router.post('/api/dashboard/card', getCardData);
router.get('/api/dashboard/income-profit', getIncomeProfitData);
router.post('/api/dashboard/category', getCategoryData);
router.get('/api/dashboard/prediction', getPredictionData);

module.exports = router;
