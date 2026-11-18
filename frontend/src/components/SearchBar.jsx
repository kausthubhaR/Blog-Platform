import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ value = '', onChange, onSubmit, placeholder = 'Search articles...' }) => {
  const [inputVal, setInputVal] = useState(value);
  const debounceRef = useRef(null);

  useEffect(() => {
    setInputVal(value);
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    setInputVal(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (onChange) onChange(val);
    }, 300);
  };

  const handleClear = () => {
    setInputVal('');
    clearTimeout(debounceRef.current);
    if (onChange) onChange('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(inputVal);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
      <input
        type="text"
        value={inputVal}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm shadow-sm"
      />
      {inputVal && (
        <button type="button" onClick={handleClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
          <FiX className="w-4 h-4" />
        </button>
      )}
    </form>
  );
};

export default SearchBar;

