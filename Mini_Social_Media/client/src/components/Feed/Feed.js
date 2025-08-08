import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import PostCard from '../Posts/PostCard';
import CreatePost from '../Posts/CreatePost';

const Feed = ({ showCreateModal = false }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(showCreateModal);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    setIsCreateModalOpen(showCreateModal);
  }, [showCreateModal]);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (error) {
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDelete = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  const filteredPosts = posts.filter(post =>
    post.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">
            Feed
          </h1>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-64"
              />
            </div>

            {/* Create Post Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Post</span>
            </button>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              {searchTerm ? (
                <div>
                  <p className="text-dark-400 text-lg mb-2">
                    No posts found for "{searchTerm}"
                  </p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-primary-400 hover:text-primary-300"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-dark-400 text-lg mb-4">
                    No posts yet. Be the first to share something!
                  </p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="btn-primary"
                  >
                    Create First Post
                  </button>
                </div>
              )}
            </div>
          ) : (
            filteredPosts.map((post) => (
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

      {/* Create Post Modal */}
      <CreatePost
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};

export default Feed;
