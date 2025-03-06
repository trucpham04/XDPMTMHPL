import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
// import Link from "next/link"

const NotFound: React.FC = () => {
  return (
    <div className="">
      <h1>404</h1>
      <h2>Không tìm thấy trang</h2>
      <p>Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
      <Button asChild className="hover:underline! text-white!">
        <Link to="/">Quay lại trang chủ</Link>
      </Button>
    </div>
  );
};

export default NotFound;
