const express = require('express');
const router = express.Router();
const { getUser, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/:id', getUser);
router.put('/profile', protect, updateProfile);

module.exports = router;
