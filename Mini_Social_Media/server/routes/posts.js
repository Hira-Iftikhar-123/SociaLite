const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/posts
router.post('/', [
  auth,
  body('text').notEmpty().withMessage('Text is required').isLength({ max: 2000 }).withMessage('Text must be less than 2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text, image } = req.body;

    const newPost = new Post({
      text,
      image: image || '',
      user: req.user.id,
      username: req.user.username,
      profileImage: req.user.profileImage
    });

    const post = await newPost.save();
    await post.populate('user', ['username', 'profileImage']);

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', ['username', 'profileImage'])
      .populate('comments.user', ['username', 'profileImage'])
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', ['username', 'profileImage'])
      .populate('comments.user', ['username', 'profileImage']);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/posts/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check user owns post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/posts/like/:id
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if post has already been liked
    if (post.likes.some(like => like.toString() === req.user.id)) {
      // Unlike
      post.likes = post.likes.filter(like => like.toString() !== req.user.id);
    } else {
      // Like
      post.likes.unshift(req.user.id);
    }

    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/posts/comment/:id
router.post('/comment/:id', [
  auth,
  body('text').notEmpty().withMessage('Text is required').isLength({ max: 1000 }).withMessage('Comment must be less than 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      text: req.body.text,
      username: req.user.username,
      user: req.user.id,
      profileImage: req.user.profileImage
    };

    post.comments.unshift(newComment);
    await post.save();

    res.json(post.comments);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/posts/comment/:id/:comment_id
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Pull out comment
    const comment = post.comments.find(comment => comment.id === req.params.comment_id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment does not exist' });
    }

    // Check user owns comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    // Get remove index
    const removeIndex = post.comments.map(comment => comment.id).indexOf(req.params.comment_id);
    post.comments.splice(removeIndex, 1);

    await post.save();
    res.json(post.comments);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
