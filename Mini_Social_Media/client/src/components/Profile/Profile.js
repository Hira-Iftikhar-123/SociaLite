import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, Edit3, Heart, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import PostCard from '../Posts/PostCard';
import EditProfile from './EditProfile';

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  
  const { user: currentUser } = useAuthStore();
  const isOwnProfile = currentUser?.id === id;

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/users/profile/${id}`);
      setProfile(response.data.user);
      setPosts(response.data.posts);
    } catch (error) {
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error('Please login to follow users');
      return;
    }

    setFollowLoading(true);
    try {
      const response = await api.put(`/users/follow/${id}`);
      setProfile(prev => ({
        ...prev,
        followers: response.data.followers
      }));
      toast.success(
        profile.followers.includes(currentUser.id)
          ? 'Unfollowed successfully'
          : 'Followed successfully'
      );
    } catch (error) {
      toast.error('Failed to follow/unfollow');
    } finally {
      setFollowLoading(false);
    }
  };

  const handlePostDelete = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">User not found</h2>
          <p className="text-dark-400">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const isFollowing = profile.followers?.includes(currentUser?.id);

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Image */}
            <div className="w-32 h-32 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.username}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <User className="w-16 h-16 text-white" />
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {profile.username}
                  </h1>
                  {profile.bio && (
                    <p className="text-dark-300 max-w-md">{profile.bio}</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 md:mt-0">
                  {!isOwnProfile && (
                    <button
                      onClick={handleFollow}
                      disabled={followLoading}
                      className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                        isFollowing
                          ? 'bg-dark-700 text-white hover:bg-dark-600'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      }`}
                    >
                      {followLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : isFollowing ? (
                        'Unfollow'
                      ) : (
                        'Follow'
                      )}
                    </button>
                  )}

                  {isOwnProfile && (
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-center md:justify-start space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{posts.length}</div>
                  <div className="text-dark-400">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {profile.followers?.length || 0}
                  </div>
                  <div className="text-dark-400">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {profile.following?.length || 0}
                  </div>
                  <div className="text-dark-400">Following</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            {isOwnProfile ? 'Your Posts' : `${profile.username}'s Posts`}
          </h2>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-dark-400" />
              </div>
              <p className="text-dark-400 text-lg">
                {isOwnProfile
                  ? "You haven't posted anything yet."
                  : `${profile.username} hasn't posted anything yet.`}
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDelete={handlePostDelete}
                onUpdate={handlePostUpdate}
              />
            ))
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfile
          profile={profile}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default Profile;
