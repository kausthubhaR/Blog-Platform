import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiEdit2, FiCalendar, FiBookOpen } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import postService from '../services/postService';
import BlogCard from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, updateUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ fullName: '', bio: '', profileImage: '' });
  const [error, setError] = useState('');

  // Determine whose profile to show
  const isOwnProfile = !id || (currentUser && (currentUser._id === id || !id));
  const userId = id || currentUser?._id;

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const [userRes, postsRes] = await Promise.all([
        userService.getUser(userId),
        postService.getUserPosts(userId),
      ]);
      setProfileUser(userRes.data.user);
      setPosts(postsRes.data.posts || []);
      setForm({
        fullName: userRes.data.user.fullName || '',
        bio: userRes.data.user.bio || '',
        profileImage: userRes.data.user.profileImage || '',
      });
    } catch (err) {
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await userService.updateProfile(form);
      setProfileUser(res.data.user);
      updateUser(res.data.user);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  if (error && !profileUser) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500">{error}</p>
    </div>
  );

  const initials = profileUser?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  const memberSince = profileUser?.createdAt ? new Date(profileUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '';

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {profileUser?.profileImage ? (
                <img
                  src={profileUser.profileImage}
                  alt={profileUser.fullName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <div
                className="w-24 h-24 rounded-full bg-indigo-600 text-white text-2xl font-bold flex items-center justify-center border-4 border-indigo-100"
                style={{ display: profileUser?.profileImage ? 'none' : 'flex' }}
              >
                {initials}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              {editing ? (
                <form onSubmit={handleSave} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={e => setForm({ ...form, fullName: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      value={form.bio}
                      onChange={e => setForm({ ...form, bio: e.target.value })}
                      className="input-field resize-none"
                      rows={3}
                      maxLength={300}
                      placeholder="Tell readers about yourself..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL</label>
                    <input
                      type="url"
                      value={form.profileImage}
                      onChange={e => setForm({ ...form, profileImage: e.target.value })}
                      className="input-field"
                      placeholder="https://..."
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <div className="flex gap-3">
                    <button type="submit" disabled={saving} className="btn-primary">
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" onClick={() => { setEditing(false); setError(''); }} className="btn-secondary">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">{profileUser?.fullName}</h1>
                  <p className="text-indigo-600 font-medium mt-1">@{profileUser?.username}</p>
                  {profileUser?.bio && (
                    <p className="text-gray-600 mt-3 max-w-xl">{profileUser.bio}</p>
                  )}
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500 justify-center sm:justify-start">
                    <span className="flex items-center gap-1">
                      <FiCalendar className="text-indigo-400" /> Member since {memberSince}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiBookOpen className="text-indigo-400" /> {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                    </span>
                  </div>
                  {isOwnProfile && currentUser && (
                    <button
                      onClick={() => setEditing(true)}
                      className="mt-4 btn-secondary flex items-center gap-2 mx-auto sm:mx-0"
                    >
                      <FiEdit2 /> Edit Profile
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Posts */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {isOwnProfile && currentUser ? 'My Articles' : `Articles by ${profileUser?.fullName}`}
          </h2>
          {posts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-700">No articles yet</h3>
              <p className="text-gray-500 mt-2">
                {isOwnProfile && currentUser ? (
                  <>Ready to share your ideas? <Link to="/create-post" className="text-indigo-600 hover:underline">Create your first post</Link></>
                ) : 'This author hasn\'t published any articles yet.'}
              </p>
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
    </div>
  );
}

