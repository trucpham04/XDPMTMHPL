import React from 'react';
import { LayoutProps } from './types';

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="main-layout">
      <header className="main-header">
        <nav>
          <div className="logo">Logo</div>
          <ul className="nav-links">
            <li><a href="/">Trang chủ</a></li>
            <li><a href="/about">Giới thiệu</a></li>
            <li><a href="/contact">Liên hệ</a></li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="main-footer">
        <p>© {new Date().getFullYear()} - Dự án React của trucpham04</p>
      </footer>
    </div>
  );
};

export default MainLayout;