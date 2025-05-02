import { Edit, Plus, Search, Lock } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

interface AdminNavbarProps {
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSearch: (keyword: string) => void;
}

export default function AdminNavbar({
  onAdd,
  onEdit,
  onDelete,
  onSearch,
}: AdminNavbarProps) {
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    onSearch(keyword);
  };

  return (
    <div className="flex items-center justify-between bg-white p-4 shadow-md">
      {/* Thanh tìm kiếm bên trái */}
      <div className="mr-4 flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="Tìm kiếm..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className="flex-1"
        />
        <Button
          onClick={handleSearch}
          className="bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          <Search />
        </Button>
      </div>

      {/* Các nút bên phải */}
      <div className="flex items-center space-x-2">
        <Button
          className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={onAdd}
        >
          <Plus className="mr-1" /> Thêm
        </Button>
        <Button
          className="cursor-pointer rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
          onClick={onEdit}
        >
          <Edit className="mr-1" /> Sửa
        </Button>
        <Button
          className="cursor-pointer rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          onClick={onDelete}
        >
          <Lock className="mr-1" /> Khóa/Mở khóa
        </Button>
      </div>
    </div>
  );
}
