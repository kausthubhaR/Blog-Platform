const Post = require('../models/Post');
const Comment = require('../models/Comment');
const calcReadTime = require('../utils/calcReadTime');

// @desc    Get all posts (with pagination, search, category, sort)
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, category, sort } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (category) {
      const baseCat = category.trim().replace(/s$/i, '');
      query.category = { $regex: new RegExp(`^${baseCat}s?$`, 'i') };
    }

    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'popular') sortOption = { likes: -1 };
    if (sort === 'readTime') sortOption = { readTime: 1 };

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'fullName username profileImage')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'author',
      'fullName username profileImage bio'
    );

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }

    res.status(200).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const { title, description, content, featuredImage, category, tags } =
      req.body;

    if (!title || !description || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, content, and category',
      });
    }

    const readTime = calcReadTime(content);

    const post = await Post.create({
      title,
      description,
      content,
      featuredImage: featuredImage || '',
      category,
      tags: tags || [],
      author: req.user._id,
      readTime,
    });

    const populatedPost = await Post.findById(post._id).populate(
      'author',
      'fullName username profileImage'
    );

    res.status(201).json({ success: true, post: populatedPost });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post',
      });
    }

    const { title, description, content, featuredImage, category, tags } =
      req.body;

    if (content) {
      req.body.readTime = calcReadTime(content);
    }

    post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        content,
        featuredImage,
        category,
        tags,
        readTime: req.body.readTime || post.readTime,
      },
      { new: true, runValidators: true }
    ).populate('author', 'fullName username profileImage');

    res.status(200).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a post (and cascade delete comments)
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post',
      });
    }

    await Comment.deleteMany({ post: req.params.id });
    await post.deleteOne();

    res
      .status(200)
      .json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get posts by user
// @route   GET /api/posts/user/:userId
// @access  Public
const getUserPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Post.countDocuments({ author: req.params.userId });
    const posts = await Post.find({ author: req.params.userId })
      .populate('author', 'fullName username profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get posts by category
// @route   GET /api/posts/category/:category
// @access  Public
const getPostsByCategory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const baseCat = req.params.category.trim().replace(/s$/i, '');
    const catQuery = { category: { $regex: new RegExp(`^${baseCat}s?$`, 'i') } };

    const total = await Post.countDocuments(catQuery);
    const posts = await Post.find(catQuery)
      .populate('author', 'fullName username profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like / unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }

    const userId = req.user._id.toString();
    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likesCount: post.likes.length,
      likes: post.likes,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
  getPostsByCategory,
  likePost,
};
