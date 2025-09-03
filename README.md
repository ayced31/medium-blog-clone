# Medium Clone - Full Stack Blog Platform

A modern, full-stack blog platform built with React/TypeScript frontend and Cloudflare Workers backend, styled like Medium.

## Features

### Frontend Features
- **Modern React Architecture**: Built with Vite, TypeScript, and functional components
- **State Management**: Recoil for optimized state management with minimal re-renders
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Medium-style UI**: Clean, minimalist design following Medium's aesthetic
- **Authentication**: JWT-based authentication with protected routes
- **Blog Management**: Create, edit, view, and manage blog posts
- **Search & Filtering**: Search blogs by title/content and filter by tags
- **Optimistic Updates**: Smooth UX with loading states and error handling

### Backend Features
- **Serverless Architecture**: Cloudflare Workers with Hono framework
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth with secure password hashing
- **Rate Limiting**: Endpoint-specific rate limiting
- **Validation**: Zod schemas for request validation
- **CORS & Error Handling**: Global middleware for cross-origin requests and error handling

## Project Structure

```
medium-blog/
├── backend/                 # Cloudflare Workers backend
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Rate limiting, auth, CORS
│   │   ├── routes/         # API routes
│   │   ├── services/       # Database and auth services
│   │   ├── validators/     # Zod schemas
│   │   └── types/          # TypeScript types
│   ├── prisma/             # Database schema and migrations
│   └── wrangler.jsonc      # Cloudflare Workers config
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/         # Reusable UI components
│   │   │   ├── layout/     # Header, Layout, Sidebar
│   │   │   └── blog/       # Blog-specific components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Route components
│   │   ├── services/       # API service layer
│   │   ├── store/          # Recoil state management
│   │   ├── styles/         # Tailwind CSS and component styles
│   │   ├── types/          # TypeScript interfaces
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   ├── index.html          # HTML template
│   ├── package.json        # Frontend dependencies
│   └── vite.config.ts      # Vite configuration
└── CLAUDE.md               # Developer instructions
```

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Recoil** for state management
- **React Router** for routing
- **Axios** for API requests
- **Lucide React** for icons

### Backend
- **Cloudflare Workers** (Serverless)
- **Hono** framework
- **PostgreSQL** database
- **Prisma** ORM
- **Zod** for validation
- **JWT** for authentication

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Cloudflare account (for deployment)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create `.env` file in backend directory:
   ```env
   DATABASE_URL="postgresql://username:password@host:port/database"
   DIRECT_URL="postgresql://username:password@host:port/database"
   JWT_SECRET="your-jwt-secret"
   ```

4. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   npx prisma generate --no-engine
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

Backend will be running at `http://localhost:8787`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create `.env.local` file in frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8787/api/v1
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

Frontend will be running at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/v1/signup` - User registration
- `POST /api/v1/signin` - User login

### Blog Management (Protected)
- `GET /api/v1/blog/:id` - Get specific blog
- `POST /api/v1/blog` - Create new blog
- `PUT /api/v1/blog/:id` - Update blog

### User Management (Protected)
- `GET /api/v1/user/profile` - Get user profile
- `PUT /api/v1/user/profile` - Update profile
- `PUT /api/v1/user/password` - Change password
- `GET /api/v1/user/blogs` - Get user's blogs
- `DELETE /api/v1/user/account` - Delete account

### Public Endpoints
- `GET /api/v1/public/blogs` - Get published blogs (with pagination/search)
- `GET /api/v1/public/blog/:id` - Get public blog
- `GET /api/v1/public/author/:id/blogs` - Get author's blogs
- `GET /api/v1/public/tags` - Get popular tags

## Design Principles

### Frontend Architecture
- **Component Composition**: Reusable UI components with consistent props interface
- **Custom Hooks**: Business logic separated into custom hooks (`useAuth`, `useBlogs`)
- **Optimized Rendering**: Recoil selectors prevent unnecessary re-renders
- **Error Boundaries**: Graceful error handling throughout the app
- **Loading States**: Skeleton screens and loading indicators

### Styling Approach
- **Utility-First**: Tailwind CSS for rapid development
- **Component Classes**: Custom CSS classes in `components.css` for complex components
- **Medium Aesthetic**: Clean typography, generous whitespace, subtle shadows
- **Responsive Design**: Mobile-first with progressive enhancement

## Authentication Flow

1. User signs up/signs in via `/signup` or `/signin`
2. Backend returns JWT token
3. Token stored in localStorage and automatically included in API requests
4. Protected routes check authentication status
5. Token refresh handled automatically

## Security Features

- **Password Hashing**: Secure bcrypt hashing
- **JWT Authentication**: Stateless authentication
- **Rate Limiting**: Request throttling per endpoint
- **Input Validation**: Zod schemas validate all inputs
- **CORS Protection**: Configured for cross-origin requests
- **SQL Injection Protection**: Prisma ORM parameterized queries

## Deployment

### Backend Deployment
```bash
cd backend
npm run deploy
```

### Frontend Deployment
Build the frontend and deploy to any static hosting service:
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel, Netlify, etc.
```