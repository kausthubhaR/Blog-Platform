import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowRight, FiCode, FiHeart, FiBookOpen, FiBriefcase, FiFeather, FiCompass, FiCoffee } from 'react-icons/fi';
import SearchBar from '../components/SearchBar';
import BlogCard from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';
import postService from '../services/postService';

const CATEGORIES = [
  { name: 'Technology', icon: FiCode, color: 'from-blue-500 to-indigo-500' },
  { name: 'Science', icon: FiBookOpen, color: 'from-green-500 to-teal-500' },
  { name: 'Health', icon: FiHeart, color: 'from-rose-500 to-pink-500' },
  { name: 'Business', icon: FiBriefcase, color: 'from-amber-500 to-orange-500' },
  { name: 'Arts', icon: FiFeather, color: 'from-purple-500 to-pink-500' },
  { name: 'Travel', icon: FiCompass, color: 'from-cyan-500 to-blue-500' },
  { name: 'Food', icon: FiCoffee, color: 'from-orange-500 to-red-500' },
];

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await postService.getPosts({ limit: 6, page: 1 });
        setPosts(res.data.posts || res.data.data || []);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleSearch = (val) => {
    if (val.trim()) navigate(`/explore?search=${encodeURIComponent(val)}`);
  };

  const featuredPosts = posts.slice(0, 3);
  const latestPosts = posts.slice(3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border border-indigo-100">
            ✨ Discover. Write. Connect.
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
              Ideas Worth
            </span>
            <br />
            <span className="text-gray-900">Sharing.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto">
            Discover insightful articles, share your thoughts, and connect with curious minds worldwide.
          </p>
          <div className="max-w-xl mx-auto mb-6">
            <SearchBar onSubmit={handleSearch} placeholder="Search for articles, topics, authors..." />
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 btn-primary text-base px-6 py-3"
          >
            Explore Blogs <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Featured Posts */}
      {!loading && featuredPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Posts</h2>
            <Link to="/explore" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              View all <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}

      {loading && (
        <div className="py-20">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Latest Articles */}
      {!loading && latestPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="bg-gradient-to-b from-white to-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Popular Categories</h2>
            <p className="text-gray-500 text-sm">Find content that matters to you</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {CATEGORIES.map(({ name, icon: Icon, color }) => (
              <button
                key={name}
                onClick={() => navigate(`/explore?category=${name}`)}
                className="flex flex-col items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">{name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

