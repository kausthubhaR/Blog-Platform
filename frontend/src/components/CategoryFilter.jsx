import React from 'react';

const CATEGORIES = ['All', 'Technology', 'Science', 'Health', 'Business', 'Arts', 'Travel', 'Food'];

const CategoryFilter = ({ active = 'All', onSelect }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect && onSelect(cat === 'All' ? '' : cat)}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors duration-200 whitespace-nowrap
            ${(active === cat || (cat === 'All' && !active))
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600'
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;

