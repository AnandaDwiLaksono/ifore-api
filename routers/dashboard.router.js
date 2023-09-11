const express = require('express');

const { getCardHandler } = require('../controllers/dashboard.controller');

const router = express.Router();

router.post('/api/dashboard', getCardHandler);

module.exports = router;
