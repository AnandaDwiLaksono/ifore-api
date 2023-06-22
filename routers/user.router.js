const express = require('express');

const {
  createUserHandler,
  getUserHandler,
  updateUserHandler,
  updateLogoHandler
} = require('../controllers/user.controller');

const router = express.Router();

router.post('/api/users', createUserHandler);
router.get('/api/users', getUserHandler);
router.put('/api/users/:id', updateUserHandler);
router.put('/api/users/logo/:id', updateLogoHandler);

module.exports = router;
