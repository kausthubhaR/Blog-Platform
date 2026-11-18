import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiClock, FiCalendar } from 'react-icons/fi';

const CATEGORY_COLORS = {
  Technology: 'bg-blue-100 text-blue-700',
  Science:    'bg-green-100 text-green-700',
  Health:     'bg-rose-100 text-rose-700',
  Business:   'bg-amber-100 text-amber-700',
  Arts:       'bg-purple-100 text-purple-700',
  Travel:     'bg-cyan-100 text-cyan-700',
  Food:       'bg-orange-100 text-orange-700',
};

const PLACEHOLDER_GRADIENTS = [
  'from-indigo-400 to-purple-500',
  'from-blue-400 to-indigo-500',
  'from-purple-400 to-pink-500',
  'from-teal-400 to-blue-500',
  'from-orange-400 to-rose-500',
];

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const BlogCard = ({ post }) => {
  if (!post) return null;
  const { _id, title, description, featuredImage, category, author, createdAt, readTime, likes } = post;

  const gradientClass = PLACEHOLDER_GRADIENTS[(_id?.charCodeAt(0) || 0) % PLACEHOLDER_GRADIENTS.length];
  const categoryColor = CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-700';

  return (
    <article className="card flex flex-col h-full">
      <Link to={`/posts/${_id}`} className="block overflow-hidden">
        {featuredImage ? (
          <img
            src={featuredImage}
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
        ) : null}
        {!featuredImage && (
          <div className={`w-full h-48 bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
            <span className="text-white text-5xl font-bold opacity-30">{title?.[0]?.toUpperCase()}</span>
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-1">
        {category && (
          <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full mb-3 w-fit ${categoryColor}`}>
            {category}
          </span>
        )}

        <Link to={`/posts/${_id}`} className="group">
          <h3 className="text-base font-bold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {title}
          </h3>
        </Link>

        {description && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">{description}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2">
            {author?.profileImage ? (
              <img src={author.profileImage} alt={author.fullName} className="w-7 h-7 rounded-full object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
                {author?.fullName?.[0]?.toUpperCase() || '?'}
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-gray-800">{author?.fullName || 'Unknown'}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <FiCalendar className="w-3 h-3" />
                <span>{formatDate(createdAt)}</span>
                {readTime && (
                  <>
                    <span>·</span>
                    <FiClock className="w-3 h-3" />
                    <span>{readTime} min read</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <FiHeart className="w-3.5 h-3.5" />
            <span>{likes?.length || 0}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;

