import React from 'react';

const Login: React.FC = () => {
  return (
    <div className="auth-page login-page">
      <h2>Đăng nhập</h2>
      <form>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Nhập email" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input type="password" id="password" placeholder="Nhập mật khẩu" />
        </div>
        <button type="submit" className="btn-login">Đăng nhập</button>
      </form>
      <p>
        Chưa có tài khoản? <a href="/register">Đăng ký</a>
      </p>
    </div>
  );
};

export default Login;