import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext"; // Import context

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, error, loading } = useAuthContext(); // Lấy register, error, loading từ AuthContext
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    // birthDate: "",
    // gender: "",
    username: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { firstName, lastName, email, username, password } = form;

    // Gọi API đăng ký từ context
    const isRegistered = await register({
      username: username,
      email: email,
      password,
      firstName,
      lastName,
      roles: ["user"],
    });

    if (isRegistered) {
      alert("Đăng ký thành công! Chuyển hướng đến đăng nhập.");
      navigate("/auth/login");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-[450px] rounded-lg bg-white p-8 shadow-2xl">
        <h2 className="mb-2 text-center text-3xl font-bold">Tạo tài khoản</h2>
        <p className="mb-4 text-center text-gray-600">
          Nhanh chóng và dễ dàng.
        </p>

        <p className="mb-4 text-center text-sm text-gray-500">
          Những người dùng dịch vụ của chúng tôi có thể đã tải thông tin liên hệ
          của bạn lên Facebook.{" "}
          <span className="cursor-pointer text-blue-600 hover:underline">
            Tìm hiểu thêm.
          </span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex space-x-4">
            <Input
              name="firstName"
              placeholder="Họ"
              className="w-1/2 p-3 text-lg"
              onChange={handleChange}
              required
            />
            <Input
              name="lastName"
              placeholder="Tên"
              className="w-1/2 p-3 text-lg"
              onChange={handleChange}
              required
            />
          </div>

          <Input
            name="username"
            placeholder="Tên người dùng"
            className="mb-4 w-full p-3 text-lg"
            onChange={handleChange}
            required
          />

          <Input
            name="email"
            placeholder="Email"
            className="mb-4 w-full p-3 text-lg"
            onChange={handleChange}
            required
          />

          <Input
            name="password"
            type="password"
            placeholder="Mật khẩu"
            className="mb-4 w-full p-3 text-lg"
            onChange={handleChange}
            required
          />

          {/* <label className="mb-2 block font-semibold text-gray-700">
            Ngày sinh
          </label>
          <Input
            name="birthDate"
            type="date"
            className="mb-4 w-full p-3 text-lg"
            onChange={handleChange}
            required
          /> */}

          {/* <label className="mb-2 block font-semibold text-gray-700">
            Giới tính
          </label>
          <div className="mb-4 flex justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="gender"
                value="Nam"
                onChange={handleChange}
                required
              />
              <span>Nam</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="gender"
                value="Nữ"
                onChange={handleChange}
                required
              />
              <span>Nữ</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="gender"
                value="Khác"
                onChange={handleChange}
                required
              />
              <span>Khác</span>
            </label>
          </div> */}

          <Button
            type="submit"
            className="w-full bg-green-500 py-3 text-lg font-semibold text-white hover:bg-green-600"
            disabled={loading} // Disable button khi đang tải
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </Button>

          {error && (
            <p className="mt-4 text-center text-red-600">{error}</p> // Hiển thị lỗi nếu có
          )}
        </form>

        <p className="mt-4 text-center text-xs text-gray-500">
          Bằng cách nhấp vào Đăng ký, bạn đồng ý với{" "}
          <span className="cursor-pointer text-blue-600 hover:underline">
            Điều khoản
          </span>
          ,{" "}
          <span className="cursor-pointer text-blue-600 hover:underline">
            Chính sách quyền riêng tư
          </span>{" "}
          và{" "}
          <span className="cursor-pointer text-blue-600 hover:underline">
            Chính sách cookie
          </span>{" "}
          của chúng tôi. Bạn có thể nhận được thông báo của chúng tôi qua SMS và
          hủy nhận bất kỳ lúc nào.
        </p>

        <p
          className="mt-4 cursor-pointer text-center text-blue-600 hover:underline"
          onClick={() => navigate("/auth/login")}
        >
          Bạn đã có tài khoản? Đăng nhập
        </p>
      </div>
    </div>
  );
};

export default Register;
