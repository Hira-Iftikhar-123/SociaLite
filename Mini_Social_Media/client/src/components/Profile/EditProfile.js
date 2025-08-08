import React, { useState } from 'react';
import { X, User, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';

const EditProfile = ({ profile, isOpen, onClose, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    username: profile?.username || '',
    bio: profile?.bio || '',
    profileImage: profile?.profileImage || '',
  });
  const [loading, setLoading] = useState(false);
  
  const { updateUser } = useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put('/users/profile', formData);
      onProfileUpdate(response.data);
      updateUser(response.data);
      onClose();
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        username: profile?.username || '',
        bio: profile?.bio || '',
        profileImage: profile?.profileImage || '',
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
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
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-field w-full pl-10"
                placeholder="Enter your username"
                required
                minLength={3}
                maxLength={30}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="input-field w-full h-24 resize-none"
              placeholder="Tell us about yourself..."
              maxLength={500}
            />
            <div className="text-right mt-1">
              <span className="text-sm text-dark-400">
                {formData.bio.length}/500
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Profile Image URL
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
              <input
                type="url"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                className="input-field w-full pl-10"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          {formData.profileImage && (
            <div className="bg-dark-700 rounded-lg p-4">
              <img
                src={formData.profileImage}
                alt="Profile preview"
                className="w-24 h-24 rounded-full object-cover mx-auto"
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
              disabled={loading || !formData.username.trim()}
              className="btn-primary"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Updating...</span>
                </div>
              ) : (
                'Update Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
