const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Get all users
router.get('/', userController.getUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Create a new user
router.post('/', userController.createUser);

// Update user
router.put('/:id', userController.updateUser);

// Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;
