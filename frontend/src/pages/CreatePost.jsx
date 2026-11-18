import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiImage, FiTag } from 'react-icons/fi';
import postService from '../services/postService';
import { useToast } from '../context/ToastContext';

const CATEGORIES = ['Technology', 'Science', 'Health', 'Business', 'Arts', 'Travel', 'Food'];

const PostForm = ({ initial = {}, onSubmit, loading, submitLabel }) => {
  const [form, setForm] = useState({
    title: initial.title || '',
    description: initial.description || '',
    content: initial.content || '',
    featuredImage: initial.featuredImage || '',
    category: initial.category || '',
    tags: initial.tags ? initial.tags.join(', ') : '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.content.trim()) errs.content = 'Content is required';
    if (!form.category) errs.category = 'Category is required';
    return errs;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const payload = {
      ...form,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Your post title..." className={`input-field text-lg font-semibold ${errors.title ? 'border-red-400' : ''}`} />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
        <input name="description" value={form.description} onChange={handleChange} placeholder="A brief description of your post..." className="input-field" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Content <span className="text-red-500">*</span></label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="Write your article content here..."
          rows={16}
          className={`input-field resize-none font-mono text-sm leading-relaxed ${errors.content ? 'border-red-400' : ''}`}
        />
        {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
          <select name="category" value={form.category} onChange={handleChange} className={`input-field ${errors.category ? 'border-red-400' : ''}`}>
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><FiTag className="w-3.5 h-3.5" /> Tags</label>
          <input name="tags" value={form.tags} onChange={handleChange} placeholder="react, javascript, webdev" className="input-field" />
          <p className="text-xs text-gray-400 mt-1">Comma-separated</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><FiImage className="w-3.5 h-3.5" /> Featured Image URL</label>
        <input name="featuredImage" value={form.featuredImage} onChange={handleChange} placeholder="https://example.com/image.jpg" className="input-field" />
        {form.featuredImage && (
          <div className="mt-3 rounded-xl overflow-hidden h-40 border border-gray-100">
            <img src={form.featuredImage} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={loading} className="btn-primary px-8 py-2.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? 'Publishing...' : submitLabel || 'Publish Post'}
        </button>
      </div>
    </form>
  );
};

const CreatePost = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (payload) => {
    setLoading(true);
    try {
      const res = await postService.createPost(payload);
      const created = res.data.post || res.data.data || res.data;
      addToast('Post published successfully!', 'success');
      navigate(`/posts/${created._id}`);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create post', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
        <p className="text-gray-500 text-sm mt-1">Share your ideas with the world</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <PostForm onSubmit={handleSubmit} loading={loading} submitLabel="Publish Post" />
      </div>
    </div>
  );
};

export { PostForm };
export default CreatePost;

