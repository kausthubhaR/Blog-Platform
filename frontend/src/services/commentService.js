import api from './api';

const commentService = {
  getComments: (postId) => api.get(`/comments/${postId}`),
  addComment: (postId, data) => api.post(`/comments/${postId}`, data),
  updateComment: (commentId, data) => api.put(`/comments/${commentId}`, data),
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
};

export default commentService;

