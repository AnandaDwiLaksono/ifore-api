const express = require('express');

const {
  createUserHandler,
  getUserHandler,
  updateUserHandler
} = require('../controllers/user.controller');

const router = express.Router();

router.post('/api/users', createUserHandler);
router.get('/api/users', getUserHandler);
router.put('/api/users/:id', updateUserHandler);

module.exports = router;
