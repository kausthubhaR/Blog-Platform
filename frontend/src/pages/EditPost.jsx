import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PostForm } from './CreatePost';
import postService from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await postService.getPost(id);
        const p = res.data.post || res.data.data || res.data;
        const authorId = p.author?._id || p.author;
        if (user && authorId !== user._id) {
          addToast('You are not authorized to edit this post', 'error');
          navigate('/');
          return;
        }
        setPost(p);
      } catch {
        addToast('Post not found', 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      const res = await postService.updatePost(id, payload);
      const updated = res.data.post || res.data.data || res.data;
      addToast('Post updated successfully!', 'success');
      navigate(`/posts/${updated._id || id}`);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update post', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!post) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
        <p className="text-gray-500 text-sm mt-1">Update your article</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <PostForm initial={post} onSubmit={handleSubmit} loading={saving} submitLabel="Save Changes" />
      </div>
    </div>
  );
};

export default EditPost;

