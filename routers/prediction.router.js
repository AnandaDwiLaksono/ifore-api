const express = require('express');

const { RandomForestModel } = require('../controllers/prediction.controller');

const router = express.Router();

router.post('/api/predictions/randomforest', RandomForestModel);

module.exports = router;
