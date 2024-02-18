const express = require('express');

const { getModelForecasting } = require('../controllers/modelForecasting.controller');

const router = express.Router();

router.post('/api/model-forecasting', getModelForecasting);

module.exports = router;
