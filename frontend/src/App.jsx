import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { PostProvider } from './context/PostContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Explore from './pages/Explore';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AuthorPosts from './pages/AuthorPosts';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <PostProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/posts/:id" element={<PostDetail />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/posts/create" element={<CreatePost />} />
                    <Route path="/posts/:id/edit" element={<EditPost />} />
                    <Route path="/profile" element={<Profile />} />
                  </Route>
                  <Route path="/author/:authorId" element={<AuthorPosts />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </PostProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
