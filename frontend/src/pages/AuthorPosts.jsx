import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCalendar, FiBookOpen } from 'react-icons/fi';
import userService from '../services/userService';
import postService from '../services/postService';
import BlogCard from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AuthorPosts() {
  const params = useParams();
  const id = params.id || params.authorId;
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [userRes, postsRes] = await Promise.all([
          userService.getUser(id),
          postService.getUserPosts(id),
        ]);
        setAuthor(userRes.data.user);
        setPosts(postsRes.data.posts || []);
      } catch (err) {
        setError('Failed to load author information.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    </div>
  );

  const initials = author?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  const memberSince = author?.createdAt ? new Date(author.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '';

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Author Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {author?.profileImage ? (
              <img
                src={author.profileImage}
                alt={author.fullName}
                className="w-20 h-20 rounded-full object-cover border-4 border-indigo-100"
                onError={e => e.target.style.display = 'none'}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-indigo-600 text-white text-xl font-bold flex items-center justify-center border-4 border-indigo-100">
                {initials}
              </div>
            )}
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{author?.fullName}</h1>
              <p className="text-indigo-600 font-medium">@{author?.username}</p>
              {author?.bio && <p className="text-gray-600 mt-2 max-w-xl">{author.bio}</p>}
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500 justify-center sm:justify-start">
                <span className="flex items-center gap-1">
                  <FiCalendar className="text-indigo-400" /> Member since {memberSince}
                </span>
                <span className="flex items-center gap-1">
                  <FiBookOpen className="text-indigo-400" /> {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        <h2 className="text-xl font-bold text-gray-900 mb-6">All Articles</h2>
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-700">No articles yet</h3>
            <p className="text-gray-500 mt-2">This author hasn't published any articles yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

