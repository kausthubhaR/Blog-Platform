import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiTwitter, FiGithub } from 'react-icons/fi';

const CATEGORIES = ['Technology', 'Science', 'Health', 'Business', 'Arts', 'Travel', 'Food'];

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-navy text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              BlogSpace
            </span>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              Ideas Worth Sharing — Discover insightful articles, share your thoughts, and connect with curious minds worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {[{ label: 'Home', to: '/' }, { label: 'Explore', to: '/explore' }, { label: 'Categories', to: '/explore' }, { label: 'About', to: '/about' }].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => navigate(`/explore?category=${cat}`)}
                    className="text-sm text-gray-400 hover:text-indigo-400 transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:hello@blogspace.dev" className="flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-400 transition-colors">
                  <FiMail className="w-4 h-4" /> hello@blogspace.dev
                </a>
              </li>
              <li>
                <a href="https://twitter.com/blogspace" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-400 transition-colors">
                  <FiTwitter className="w-4 h-4" /> @blogspace
                </a>
              </li>
              <li>
                <a href="https://github.com/blogspace" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-400 transition-colors">
                  <FiGithub className="w-4 h-4" /> github/blogspace
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} BlogSpace. All rights reserved. Built with ❤️ for writers everywhere.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

