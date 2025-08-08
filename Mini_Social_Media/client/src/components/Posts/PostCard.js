import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Trash2, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';

const PostCard = ({ post, onDelete, onUpdate }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  
  const { user } = useAuthStore();
  const isLiked = post.likes?.includes(user?.id);
  const isOwner = post.user === user?.id;

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like posts');
      return;
    }

    setLoading(true);
    try {
      const response = await api.put(`/posts/like/${post._id}`);
      onUpdate({ ...post, likes: response.data });
    } catch (error) {
      toast.error('Failed to like post');
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const response = await api.post(`/posts/comment/${post._id}`, {
        text: newComment,
      });
      onUpdate({ ...post, comments: response.data });
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await api.delete(`/posts/comment/${post._id}/${commentId}`);
      onUpdate({ ...post, comments: response.data });
      toast.success('Comment deleted!');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${post._id}`);
        onDelete(post._id);
        toast.success('Post deleted!');
      } catch (error) {
        toast.error('Failed to delete post');
      }
    }
  };

  return (
    <div className="card p-6 mb-6 animate-fade-in">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
            {post.profileImage ? (
              <img
                src={post.profileImage}
                alt={post.username}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold">
                {post.username?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <Link
              to={`/profile/${post.user}`}
              className="font-semibold text-white hover:text-primary-400 transition-colors"
            >
              {post.username}
            </Link>
            <p className="text-sm text-dark-400">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {isOwner && (
          <button
            onClick={handleDeletePost}
            className="text-dark-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-white leading-relaxed">{post.text}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post"
            className="mt-4 rounded-lg w-full max-h-96 object-cover"
          />
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between border-t border-dark-700 pt-4">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center space-x-2 transition-colors ${
              isLiked
                ? 'text-primary-400 hover:text-primary-300'
                : 'text-dark-400 hover:text-primary-400'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{post.likes?.length || 0}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-dark-400 hover:text-primary-400 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.comments?.length || 0}</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 border-t border-dark-700 pt-4">
          {/* Add Comment */}
          <form onSubmit={handleComment} className="mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="input-field flex-1"
                disabled={commentLoading}
              />
              <button
                type="submit"
                disabled={commentLoading || !newComment.trim()}
                className="btn-primary px-4"
              >
                {commentLoading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {post.comments?.map((comment) => (
              <div key={comment._id} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  {comment.profileImage ? (
                    <img
                      src={comment.profileImage}
                      alt={comment.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-sm font-semibold">
                      {comment.username?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="bg-dark-700 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/profile/${comment.user}`}
                        className="font-semibold text-white hover:text-primary-400 transition-colors"
                      >
                        {comment.username}
                      </Link>
                      {comment.user === user?.id && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-dark-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-white mt-1">{comment.text}</p>
                    <p className="text-xs text-dark-400 mt-2">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
