# BlogSpace - Full-Stack Blog Platform

## Overview
Modern full-stack blogging platform built with React, Node.js, Express, and MongoDB.

## Features
- User authentication (register, login, JWT)
- Create, edit, delete blog posts
- Comment system (add, edit, delete)
- Like/unlike posts
- Search and filter by category
- Pagination
- Responsive design
- User profiles

## Tech Stack
### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router DOM v6
- Axios
- React Icons

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- express-rate-limit
- helmet

## Project Structure
```
blog-platform/
  frontend/     # React Vite app (port 5173)
  backend/      # Express API server (port 5000)
  README.md
  .gitignore
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kausthubhaR/Blog-Platform.git
cd Blog-Platform
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Configure environment variables:
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### Environment Variables
Create `backend/.env` with:
```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_secret_key
```

### Running the Application

**Start the backend** (from backend/ directory):
```bash
npm run dev
```
Server runs on http://localhost:5000

**Start the frontend** (from frontend/ directory):
```bash
npm run dev
```
App runs on http://localhost:5173

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout

#### Posts
- `GET /api/posts` - Get all posts (supports ?page, ?limit, ?category, ?search, ?sort)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (protected)
- `PUT /api/posts/:id` - Update post (protected, owner only)
- `DELETE /api/posts/:id` - Delete post (protected, owner only)
- `GET /api/posts/user/:userId` - Get posts by user
- `GET /api/posts/category/:category` - Get posts by category
- `POST /api/posts/:id/like` - Like/unlike post (protected)

#### Comments
- `GET /api/comments/:postId` - Get comments for post
- `POST /api/comments/:postId` - Add comment (protected)
- `PUT /api/comments/:commentId` - Update comment (protected, owner only)
- `DELETE /api/comments/:commentId` - Delete comment (protected, owner only)

#### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile (protected)

## Sample Data
Run the seed script to populate test data:
```bash
cd backend
node seed.js
```
This creates sample users and blog posts for testing.

### Test Accounts (after seeding)
| Email | Password |
|-------|----------|
| john@example.com | password123 |
| jane@example.com | password123 |
| alex@example.com | password123 |

## Testing with Postman
Import the API endpoints listed above. Set the Authorization header as `Bearer <your-jwt-token>`.

## Deployment
- **Frontend**: Vercel or Netlify (build command: `npm run build`, output directory: `dist`)
- **Backend**: Railway, Render, or Heroku (set environment variables in dashboard)
- **Database**: MongoDB Atlas

## License
MIT
