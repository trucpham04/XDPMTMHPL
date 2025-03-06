import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '@/layouts/MainLayout';
// import AdminLayout from '@/layouts/AdminLayout';
import AuthLayout from '@/layouts/AuthLayout';

// Pages
import Home from '@/pages/Home';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';
// import Register from '@/pages/Register';
// import AdminDashboard from '@/pages/admin/Dashboard';
// import AdminUsers from '@/pages/admin/Users';
// import AdminProducts from '@/pages/admin/Products';
// import AdminSettings from '@/pages/admin/Settings';
import NotFound from '@/pages/NotFound';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Layout Routes */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        
        {/* Auth Layout Routes */}
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        {/* <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} /> */}
        
        {/* Admin Layout Routes */}
        {/* <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} /> */}
        {/* <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} /> */}
        {/* <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} /> */}
        {/* <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} /> */}
        
        {/* 404 Page */}
        <Route path="/404" element={<MainLayout><NotFound /></MainLayout>} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;