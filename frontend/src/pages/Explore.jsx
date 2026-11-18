import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import BlogCard from '../components/BlogCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import postService from '../services/postService';

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  const fetchPosts = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await postService.getPosts({ page: 1, limit: 9, ...params });
      setPosts(res.data.posts || res.data.data || []);
      setPage(res.data.page || 1);
      setPages(res.data.pages || 1);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts({ search, category, page: 1 });
    setPage(1);
  }, [search, category, fetchPosts]);

  const handleSearch = (val) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (val) next.set('search', val); else next.delete('search');
      return next;
    });
  };

  const handleCategory = (cat) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (cat) next.set('category', cat); else next.delete('category');
      next.delete('search');
      return next;
    });
  };

  const handlePageChange = (p) => {
    setPage(p);
    fetchPosts({ search, category, page: p });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Explore</h1>
        <p className="text-gray-500 text-sm">Browse all articles from our community</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="sm:flex-1 max-w-md">
          <SearchBar value={search} onChange={handleSearch} onSubmit={handleSearch} />
        </div>
      </div>
      <div className="mb-8">
        <CategoryFilter active={category || 'All'} onSelect={handleCategory} />
      </div>

      {/* Results info */}
      {!loading && (
        <div className="text-sm text-gray-500 mb-6">
          {posts.length > 0
            ? `Showing ${posts.length} article${posts.length !== 1 ? 's' : ''}${category ? ` in ${category}` : ''}${search ? ` for "${search}"` : ''}`
            : null}
        </div>
      )}

      {/* Posts grid */}
      {loading ? (
        <LoadingSpinner size="lg" className="py-20" />
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <FiSearch className="w-16 h-16 mb-4 opacity-20" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
          <p className="text-sm text-center max-w-xs">
            {search ? `No results for "${search}". Try a different keyword.` : 'No posts in this category yet. Check back soon!'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
          <Pagination page={page} pages={pages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
};

export default Explore;

