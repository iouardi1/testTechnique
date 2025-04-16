const express = require('express');
const userController = require('../controllers/userController');
const upload = require('../middlewares/fileUpload');

const router = express.Router();

// get user_photo_by_path
router.get('/getUserPhoto/assets/:filename', userController.getUserPhoto);

// Get all users
router.get('/', userController.getUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Create a new user
router.post('/', upload.single('profile_picture'), userController.createUser);



// Update user
router.put('/:id', upload.single('profile_picture'), userController.updateUser);

// Delete user
router.delete('/:id', userController.deleteUser);

module.exports = router;
