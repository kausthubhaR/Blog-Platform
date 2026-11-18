import React, { createContext, useContext, useState, useCallback } from 'react';
import postService from '../services/postService';

const PostContext = createContext(null);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchPosts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await postService.getPosts(params);
      const { data } = res;
      setPosts(data.posts || data.data || []);
      setTotal(data.total || 0);
      setPage(data.page || 1);
      setPages(data.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPost = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await postService.getPost(id);
      setPost(res.data.post || res.data.data || res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(async (data) => {
    const res = await postService.createPost(data);
    return res.data.post || res.data.data || res.data;
  }, []);

  const updatePost = useCallback(async (id, data) => {
    const res = await postService.updatePost(id, data);
    const updated = res.data.post || res.data.data || res.data;
    setPost(updated);
    return updated;
  }, []);

  const deletePost = useCallback(async (id) => {
    await postService.deletePost(id);
    setPosts((prev) => prev.filter((p) => p._id !== id));
  }, []);

  const likePost = useCallback(async (id) => {
    const res = await postService.likePost(id);
    const updated = res.data.post || res.data.data || res.data;
    setPost((prev) => (prev && prev._id === id ? { ...prev, ...updated } : prev));
    setPosts((prev) => prev.map((p) => (p._id === id ? { ...p, ...updated } : p)));
    return updated;
  }, []);

  return (
    <PostContext.Provider value={{ posts, post, loading, error, total, page, pages, fetchPosts, fetchPost, createPost, updatePost, deletePost, likePost }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => {
  const ctx = useContext(PostContext);
  if (!ctx) throw new Error('usePost must be used within PostProvider');
  return ctx;
};

export default PostContext;

