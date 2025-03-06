import React from 'react';
import { LayoutProps } from './types';

const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-logo">
          <h1>Ứng dụng của tôi</h1>
        </div>
        <div className="auth-form-container">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;