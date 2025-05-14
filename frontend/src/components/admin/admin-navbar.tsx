import { Edit, Plus, Search, Lock, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export type AdminAction = {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  disabled?: boolean;
};

interface AdminNavbarProps {
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSearch: (keyword: string) => void;
  title?: string;
  actions?: AdminAction[];
  selectedCount?: number;
  onBulkAction?: (action: string) => void;
  bulkActions?: AdminAction[];
  searchPlaceholder?: string;
}

export default function AdminNavbar({
  onAdd,
  onEdit,
  onDelete,
  onSearch,
  title,
  actions = [],
  selectedCount = 0,
  onBulkAction,
  bulkActions = [],
  searchPlaceholder = "Tìm kiếm...",
}: AdminNavbarProps) {
  const [keyword, setKeyword] = useState("");
  const [isBulkActionMenuOpen, setIsBulkActionMenuOpen] = useState(false);

  const handleSearch = () => {
    onSearch(keyword);
  };

  const defaultActions: AdminAction[] = [
    ...(onAdd
      ? [
          {
            label: "Thêm",
            icon: <Plus className="mr-1 h-4 w-4" />,
            onClick: onAdd,
            variant: "default" as const,
          },
        ]
      : []),
    ...(onEdit
      ? [
          {
            label: "Sửa",
            icon: <Edit className="mr-1 h-4 w-4" />,
            onClick: onEdit,
            variant: "secondary" as const,
          },
        ]
      : []),
    ...(onDelete
      ? [
          {
            label: "Xóa",
            icon: <Trash2 className="mr-1 h-4 w-4" />,
            onClick: onDelete,
            variant: "destructive" as const,
          },
        ]
      : []),
    ...actions,
  ];

  return (
    <div className="flex flex-col gap-4 bg-white p-4 shadow-md">
      {/* Title */}
      {title && <h1 className="text-2xl font-bold">{title}</h1>}

      <div className="flex items-center justify-between">
        {/* Search bar */}
        <div className="mr-4 flex w-full max-w-sm items-center space-x-2">
          <Input
            type="text"
            placeholder={searchPlaceholder}
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
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Bulk Actions */}
          {selectedCount > 0 && bulkActions.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Đã chọn {selectedCount} mục
              </span>
              <DropdownMenu
                open={isBulkActionMenuOpen}
                onOpenChange={setIsBulkActionMenuOpen}
              >
                <DropdownMenuTrigger>
                  <Button variant="outline" size="sm">
                    Thao tác hàng loạt
                    <MoreHorizontal className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {bulkActions.map((action, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={action.onClick}
                      className={action.variant === "destructive" ? "text-red-600" : ""}
                    >
                      {action.icon}
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Default Actions */}
          {defaultActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "default"}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
