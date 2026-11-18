import React from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiUsers, FiShield, FiHeart, FiFeather, FiArrowRight } from 'react-icons/fi';

const About = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-b from-indigo-50/60 to-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 mb-6">
            About BlogSpace
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-6">
            A Modern Publishing Home for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
              Ideas Worth Sharing
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            BlogSpace is a community of writers, thinkers, developers, and creators sharing insights across technology, science, business, arts, travel, health, and beyond.
          </p>
        </div>
      </section>

      {/* Core Values / Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-gray-100 shadow-sm bg-gradient-to-b from-white to-gray-50/50">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl mb-5">
              <FiFeather />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Effortless Writing</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Clean markdown-inspired typography, responsive design, and intuitive formatting let you focus entirely on your prose.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-gray-100 shadow-sm bg-gradient-to-b from-white to-gray-50/50">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl mb-5">
              <FiUsers />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Engaged Community</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Connect through constructive comments, article likes, author profiles, and curated topics that spark curiosity.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-gray-100 shadow-sm bg-gradient-to-b from-white to-gray-50/50">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center text-xl mb-5">
              <FiShield />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Open</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              JWT-secured authentication, bcrypt password hashing, and full author ownership of your published work.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-extrabold mb-1">60+</div>
            <div className="text-indigo-200 text-sm">Published Articles</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold mb-1">12+</div>
            <div className="text-indigo-200 text-sm">Rich Categories</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold mb-1">100%</div>
            <div className="text-indigo-200 text-sm">Responsive Design</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold mb-1">Open</div>
            <div className="text-indigo-200 text-sm">Full-Stack Tech</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-black text-gray-900 mb-4">Ready to start sharing your ideas?</h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Join readers and authors today. Publish your first article in minutes.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/register" className="btn-primary flex items-center gap-2">
            Create an Account <FiArrowRight />
          </Link>
          <Link to="/explore" className="btn-secondary">
            Explore Articles
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
