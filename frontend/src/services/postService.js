import api from './api';

const postService = {
  getPosts: (params) => api.get('/posts', { params }),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (data) => api.post('/posts', data),
  updatePost: (id, data) => api.put(`/posts/${id}`, data),
  deletePost: (id) => api.delete(`/posts/${id}`),
  getUserPosts: (userId) => api.get(`/posts/user/${userId}`),
  getPostsByCategory: (category) => api.get(`/posts/category/${category}`),
  likePost: (id) => api.post(`/posts/${id}/like`),
};

export default postService;

