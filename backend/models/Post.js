const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    featuredImage: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Technology',
        'Programming',
        'Artificial Intelligence',
        'Web Development',
        'Cybersecurity',
        'Lifestyle',
        'Education',
        'Other',
      ],
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    readTime: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search and filtering
postSchema.index({ title: 'text', description: 'text', content: 'text' });
postSchema.index({ category: 1 });
postSchema.index({ author: 1 });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
