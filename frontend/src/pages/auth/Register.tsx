import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    contact: "", 
    password: "",
    birthDate: "",
    gender: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Đăng ký thành công! Chuyển hướng đến đăng nhập.");
    navigate("/auth/login");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-[450px] bg-white p-8 rounded-lg shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-2">Tạo tài khoản</h2>
        <p className="text-gray-600 text-center mb-4">Nhanh chóng và dễ dàng.</p>


        <p className="text-sm text-gray-500 text-center mb-4">
          Những người dùng dịch vụ của chúng tôi có thể đã tải thông tin liên hệ của bạn lên Facebook.{" "}
          <span className="text-blue-600 cursor-pointer hover:underline">Tìm hiểu thêm.</span>
        </p>

        <form onSubmit={handleSubmit}>

          <div className="flex space-x-4 mb-4">
            <Input name="firstName" placeholder="Họ" className="w-1/2 p-3 text-lg" onChange={handleChange} required />
            <Input name="lastName" placeholder="Tên" className="w-1/2 p-3 text-lg" onChange={handleChange} required />
          </div>


          <Input
            name="contact"
            placeholder="Email hoặc số di động"
            className="w-full p-3 text-lg mb-4"
            onChange={handleChange}
            required
          />

          <Input
            name="password"
            type="password"
            placeholder="Mật khẩu"
            className="w-full p-3 text-lg mb-4"
            onChange={handleChange}
            required
          />

          <label className="block text-gray-700 font-semibold mb-2">Ngày sinh</label>
          <Input
            name="birthDate"
            type="date"
            className="w-full p-3 text-lg mb-4"
            onChange={handleChange}
            required
          />

          <label className="block text-gray-700 font-semibold mb-2">Giới tính</label>
          <div className="flex justify-between mb-4">
            <label className="flex items-center space-x-2">
              <input type="radio" name="gender" value="Nam" onChange={handleChange} required />
              <span>Nam</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="gender" value="Nữ" onChange={handleChange} required />
              <span>Nữ</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="gender" value="Khác" onChange={handleChange} required />
              <span>Khác</span>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-500 text-white hover:bg-green-600 text-lg py-3 font-semibold"
          >
            Đăng ký
          </Button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          Bằng cách nhấp vào Đăng ký, bạn đồng ý với{" "}
          <span className="text-blue-600 cursor-pointer hover:underline">Điều khoản</span>,{" "}
          <span className="text-blue-600 cursor-pointer hover:underline">Chính sách quyền riêng tư</span> và{" "}
          <span className="text-blue-600 cursor-pointer hover:underline">Chính sách cookie</span> của chúng tôi.{" "}
          Bạn có thể nhận được thông báo của chúng tôi qua SMS và hủy nhận bất kỳ lúc nào.
        </p>

        <p
          className="text-blue-600 text-center mt-4 cursor-pointer hover:underline"
          onClick={() => navigate("/auth/login")}
        >
          Bạn đã có tài khoản? Đăng nhập
        </p>
      </div>
    </div>
  );
}
