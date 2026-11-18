import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiHeart, FiEdit2, FiTrash2, FiClock, FiCalendar, FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import postService from '../services/postService';
import CommentSection from '../components/CommentSection';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORY_COLORS = {
  Technology: 'bg-blue-100 text-blue-700',
  Science:    'bg-green-100 text-green-700',
  Health:     'bg-rose-100 text-rose-700',
  Business:   'bg-amber-100 text-amber-700',
  Arts:       'bg-purple-100 text-purple-700',
  Travel:     'bg-cyan-100 text-cyan-700',
  Food:       'bg-orange-100 text-orange-700',
};

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likingInProgress, setLikingInProgress] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await postService.getPost(id);
        const p = res.data.post || res.data.data || res.data;
        setPost(p);
        setLikeCount(p.likes?.length || 0);
        setLiked(user && p.likes?.includes(user._id));
      } catch {
        addToast('Post not found', 'error');
        navigate('/explore');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const isAuthor = isAuthenticated && user && post && (user._id === (post.author?._id || post.author));

  const handleLike = async () => {
    if (!isAuthenticated) { addToast('Please log in to like posts', 'info'); return; }
    if (likingInProgress) return;
    setLikingInProgress(true);
    try {
      const res = await postService.likePost(id);
      const updated = res.data.post || res.data.data || res.data;
      setLikeCount(updated.likes?.length ?? likeCount);
      setLiked(user && updated.likes?.includes(user._id));
    } catch {
      addToast('Failed to like post', 'error');
    } finally {
      setLikingInProgress(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await postService.deletePost(id);
      addToast('Post deleted successfully', 'success');
      navigate('/');
    } catch {
      addToast('Failed to delete post', 'error');
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!post) return null;

  const categoryColor = CATEGORY_COLORS[post.category] || 'bg-gray-100 text-gray-700';

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-8 transition-colors">
        <FiArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="rounded-2xl overflow-hidden mb-8 aspect-video">
          <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Category */}
      {post.category && (
        <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${categoryColor}`}>
          {post.category}
        </span>
      )}

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-6">{post.title}</h1>

      {/* Author Info Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {post.author?.profileImage ? (
            <img src={post.author.profileImage} alt={post.author.fullName} className="w-11 h-11 rounded-full object-cover" />
          ) : (
            <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
              {post.author?.fullName?.[0]?.toUpperCase() || '?'}
            </div>
          )}
          <div>
            <Link to={`/authors/${post.author?._id}`} className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
              {post.author?.fullName || 'Unknown'}
            </Link>
            <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
              <span className="flex items-center gap-1"><FiCalendar className="w-3 h-3" /> {formatDate(post.createdAt)}</span>
              {post.readTime && <span className="flex items-center gap-1"><FiClock className="w-3 h-3" /> {post.readTime} min read</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
              liked ? 'bg-red-50 border-red-200 text-red-500' : 'border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-500'
            }`}
          >
            <FiHeart className={liked ? 'fill-red-500 text-red-500' : ''} />
            {likeCount}
          </button>

          {isAuthor && (
            <>
              <Link to={`/edit-post/${post._id}`} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-200 text-indigo-600 text-sm font-medium hover:bg-indigo-50 transition-colors">
                <FiEdit2 className="w-4 h-4" /> Edit
              </Link>
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
              >
                <FiTrash2 className="w-4 h-4" /> Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      {post.description && (
        <p className="text-lg text-gray-500 leading-relaxed mb-8 italic border-l-4 border-indigo-200 pl-4">{post.description}</p>
      )}

      {/* Content */}
      <div
        className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-10"
        dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n/g, '<br/>') || '' }}
      />

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10 pt-6 border-t border-gray-100">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">#{tag}</span>
          ))}
        </div>
      )}

      <CommentSection postId={id} />

      <ConfirmDialog
        isOpen={confirmDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </article>
  );
};

export default PostDetail;

