const express = require('express');

const {
  createCategoryHandler,
  getAllCategoryHandler,
  deleteCategoryHandler
} = require('../controllers/category.controller');

const router = express.Router();

router.post('/api/categories', createCategoryHandler);
router.get('/api/categories', getAllCategoryHandler);
router.delete('/api/categories/:id', deleteCategoryHandler);

module.exports = router;
