import React, { useState, useEffect, useCallback } from 'react';
import { FiMessageCircle, FiSend } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import commentService from '../services/commentService';
import CommentItem from './CommentItem';
import LoadingSpinner from './LoadingSpinner';

const CommentSection = ({ postId }) => {
  const { isAuthenticated, user } = useAuth();
  const { addToast } = useToast();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await commentService.getComments(postId);
      setComments(res.data.comments || res.data.data || res.data || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId, fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const res = await commentService.addComment(postId, { content });
      const newComment = res.data.comment || res.data.data || res.data;
      setComments((prev) => [{ ...newComment, user: { _id: user._id, fullName: user.fullName, profileImage: user.profileImage } }, ...prev]);
      setContent('');
      addToast('Comment posted!', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to post comment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => setComments((prev) => prev.filter((c) => c._id !== id));
  const handleUpdate = (updated) => setComments((prev) => prev.map((c) => (c._id === updated._id ? { ...c, ...updated } : c)));

  return (
    <section className="mt-10">
      <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-6">
        <FiMessageCircle className="text-indigo-600" />
        Comments <span className="text-gray-400 font-normal text-base">({comments.length})</span>
      </h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-start gap-3">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.fullName} className="w-10 h-10 rounded-full object-cover flex-shrink-0 mt-1" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white font-semibold mt-1">
                {user?.fullName?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a thoughtful comment..."
                className="input-field text-sm resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={submitting || !content.trim()}
                  className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend className="w-4 h-4" />
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-indigo-50 rounded-xl p-4 mb-8 text-sm text-indigo-700 text-center">
          <a href="/login" className="font-semibold hover:underline">Log in</a> to leave a comment.
        </div>
      )}

      {loading ? (
        <LoadingSpinner className="py-8" />
      ) : comments.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <FiMessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div>
          {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} onDelete={handleDelete} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </section>
  );
};

export default CommentSection;

