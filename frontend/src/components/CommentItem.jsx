import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import commentService from '../services/commentService';
import { useToast } from '../context/ToastContext';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const CommentItem = ({ comment, onDelete, onUpdate }) => {
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [saving, setSaving] = useState(false);

  const isOwner = isAuthenticated && user && (user._id === (comment.user?._id || comment.user));

  const handleSave = async () => {
    if (!editText.trim()) return;
    setSaving(true);
    try {
      const res = await commentService.updateComment(comment._id, { content: editText });
      onUpdate(res.data.comment || res.data.data || res.data);
      setEditing(false);
      addToast('Comment updated', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update comment', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await commentService.deleteComment(comment._id);
      onDelete(comment._id);
      addToast('Comment deleted', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete comment', 'error');
    }
  };

  return (
    <div className="flex gap-3 py-4 border-b border-gray-100 last:border-0">
      <div className="flex-shrink-0">
        {comment.user?.profileImage ? (
          <img src={comment.user.profileImage} alt={comment.user.fullName} className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
            {comment.user?.fullName?.[0]?.toUpperCase() || '?'}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-sm font-semibold text-gray-900">{comment.user?.fullName || 'Unknown'}</span>
            <span className="text-xs text-gray-400 ml-2">{formatDate(comment.createdAt)}</span>
          </div>
          {isOwner && !editing && (
            <div className="flex items-center gap-1">
              <button onClick={() => setEditing(true)} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors">
                <FiEdit2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={handleDelete} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors">
                <FiTrash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
        {editing ? (
          <div className="mt-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="input-field text-sm resize-none"
              rows={3}
            />
            <div className="flex gap-2 mt-2">
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-1 text-xs btn-primary py-1 px-3">
                <FiSave className="w-3 h-3" /> Save
              </button>
              <button onClick={() => { setEditing(false); setEditText(comment.content); }} className="flex items-center gap-1 text-xs btn-secondary py-1 px-3">
                <FiX className="w-3 h-3" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-700 mt-1 leading-relaxed">{comment.content}</p>
        )}
      </div>
    </div>
  );
};

export default CommentItem;

