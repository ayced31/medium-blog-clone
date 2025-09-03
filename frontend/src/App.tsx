import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Home } from './pages/Home';
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { BlogDetail } from './pages/blog/BlogDetail';
import { CreateBlog } from './pages/blog/CreateBlog';
import { EditBlog } from './pages/blog/EditBlog';
import './index.css';
import './styles/components.css';

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/write" element={<CreateBlog />} />
          <Route path="/edit/:id" element={<EditBlog />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
};

export default App;