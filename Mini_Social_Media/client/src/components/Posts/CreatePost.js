import React, { useState } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const CreatePost = ({ isOpen, onClose, onPostCreated }) => {
  const [formData, setFormData] = useState({
    text: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.text.trim()) {
      toast.error('Please enter some text for your post');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/posts', formData);
      onPostCreated(response.data);
      setFormData({ text: '', image: '' });
      onClose();
      toast.success('Post created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ text: '', image: '' });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Create New Post</h2>
          <button
            onClick={handleClose}
            className="text-dark-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              What's on your mind?
            </label>
            <textarea
              name="text"
              value={formData.text}
              onChange={handleChange}
              className="input-field w-full h-32 resize-none"
              placeholder="Share your thoughts..."
              maxLength={2000}
              required
            />
            <div className="text-right mt-1">
              <span className="text-sm text-dark-400">
                {formData.text.length}/2000
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Image URL
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="input-field w-full pl-10"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {formData.image && (
            <div className="bg-dark-700 rounded-lg p-4">
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  toast.error('Invalid image URL');
                }}
              />
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.text.trim()}
              className="btn-primary"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
