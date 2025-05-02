import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthContext } from "@/contexts/AuthContext";
import { LoginRequest } from "@/services/authService";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, error, loading } = useAuthContext();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const credentials: LoginRequest = {
      identifier: email,
      password: password,
    };

    const isLoggedIn = await login(credentials);

    if (isLoggedIn) {
      console.log("Đăng nhập thành công");

      navigate("/");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-5xl items-center justify-center space-x-20">
        {/* Phần trái - Mô tả */}
        <div className="w-1/2">
          <h1 className="text-7xl font-bold text-blue-600">facebook</h1>
          <p className="mt-6 w-[90%] text-2xl leading-snug">
            Facebook giúp bạn kết nối và chia sẻ với mọi người trong cuộc sống
            của bạn.
          </p>
        </div>

        {/* Phần phải - Form đăng nhập */}
        <div className="w-[420px] rounded-lg bg-white p-10 shadow-2xl">
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Tên người dùng"
              className="mb-4 p-4 text-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Mật khẩu"
              className="mb-4 p-4 text-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              className="w-full bg-blue-600 py-3 text-lg font-semibold text-white hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
            {error && (
              <p className="mt-4 text-center text-red-600">{error}</p> // Hiển thị lỗi nếu có
            )}
            <p className="mt-4 cursor-pointer text-center text-base text-blue-600 hover:underline">
              Quên mật khẩu?
            </p>
            <hr className="my-6" />
            <Button
              className="w-full bg-green-500 py-3 text-lg font-semibold text-white hover:bg-green-600"
              onClick={() => navigate("/auth/register")}
            >
              Tạo tài khoản mới
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
