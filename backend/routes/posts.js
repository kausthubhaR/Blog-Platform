const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
  getPostsByCategory,
  likePost,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

// Specific routes BEFORE /:id to avoid conflicts
router.get('/user/:userId', getUserPosts);
router.get('/category/:category', getPostsByCategory);

router.get('/', getPosts);
router.post('/', protect, createPost);

router.get('/:id', getPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, likePost);

module.exports = router;
