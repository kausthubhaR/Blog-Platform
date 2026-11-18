import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiChevronDown, FiPenTool, FiUser, FiFileText, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Technology', 'Science', 'Health', 'Business', 'Arts', 'Travel', 'Food'];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const catRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'}`;

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              BlogSpace
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/explore" className={navLinkClass}>Explore</NavLink>

            {/* Categories dropdown */}
            <div className="relative" ref={catRef}>
              <button
                onClick={() => setCatOpen((o) => !o)}
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Categories <FiChevronDown className={`transition-transform ${catOpen ? 'rotate-180' : ''}`} />
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { navigate(`/explore?category=${cat}`); setCatOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <NavLink to="/about" className={navLinkClass}>About</NavLink>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/create-post" className="btn-primary flex items-center gap-2 text-sm">
                  <FiPenTool /> Create Post
                </Link>
                <div className="relative" ref={userRef}>
                  <button onClick={() => setUserOpen((o) => !o)} className="flex items-center gap-2 focus:outline-none">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt={user.fullName} className="w-9 h-9 rounded-full object-cover border-2 border-indigo-100" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                        {user?.fullName?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <FiChevronDown className={`text-gray-500 transition-transform ${userOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {userOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                      <Link to="/profile" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                        <FiUser /> Profile
                      </Link>
                      <Link to={`/authors/${user?._id}`} onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                        <FiFileText /> My Posts
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <FiLogOut /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Register</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors" onClick={() => setMobileOpen((o) => !o)}>
            {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <NavLink to="/" end className={navLinkClass} onClick={() => setMobileOpen(false)}>Home</NavLink>
          <div className="block" />
          <NavLink to="/explore" className={navLinkClass} onClick={() => setMobileOpen(false)}>Explore</NavLink>
          <div className="block" />
          <NavLink to="/about" className={navLinkClass} onClick={() => setMobileOpen(false)}>About</NavLink>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 mt-3">Categories</p>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { navigate(`/explore?category=${cat}`); setMobileOpen(false); }}
                  className="text-left text-sm text-gray-700 hover:text-indigo-600 py-1 transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <hr className="border-gray-100" />
          {isAuthenticated ? (
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-3 mb-3">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.fullName} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                    {user?.fullName?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-900">{user?.fullName}</p>
                  <p className="text-xs text-gray-500">@{user?.username}</p>
                </div>
              </div>
              <Link to="/create-post" onClick={() => setMobileOpen(false)} className="btn-primary w-full text-center block text-sm">Create Post</Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="block text-sm text-gray-700 hover:text-indigo-600 py-1">Profile</Link>
              <Link to={`/authors/${user?._id}`} onClick={() => setMobileOpen(false)} className="block text-sm text-gray-700 hover:text-indigo-600 py-1">My Posts</Link>
              <button onClick={handleLogout} className="block text-sm text-red-600 hover:text-red-700 py-1">Logout</button>
            </div>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary flex-1 text-center text-sm">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 text-center text-sm">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

