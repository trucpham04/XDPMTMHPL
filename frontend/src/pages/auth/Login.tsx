import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-5xl items-center justify-center space-x-20">
        {/* Phần trái - Mô tả */}
        <div className="w-1/2">
          <h1 className="text-7xl font-bold text-blue-600">facebook</h1>
          <p className="mt-6 text-2xl leading-snug w-[90%]">
            Facebook giúp bạn kết nối và chia sẻ với mọi người trong cuộc sống của bạn.
          </p>
        </div>

        {/* Phần phải - Form đăng nhập */}
        <div className="w-[420px] bg-white p-10 rounded-lg shadow-2xl">
          <Input
            type="text"
            placeholder="Email hoặc số điện thoại"
            className="mb-4 text-lg p-4"
          />
          <Input
            type="password"
            placeholder="Mật khẩu"
            className="mb-4 text-lg p-4"
          />
          <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 text-lg py-3 font-semibold">
            Đăng nhập
          </Button>
          <p className="text-center text-base text-blue-600 mt-4 cursor-pointer hover:underline">
            Quên mật khẩu?
          </p>
          <hr className="my-6" />
          <Button
            className="w-full bg-green-500 text-white hover:bg-green-600 text-lg py-3 font-semibold"
            onClick={() => navigate("/auth/register")}
          >
            Tạo tài khoản mới
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
