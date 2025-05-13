import { Link, useLocation } from "react-router-dom";
import {
  Users,
  User,
  UserPlus,
  UserCheck,
  Gift,
  List,
  ChevronRight,
} from "lucide-react";

const friendNavItems = [
  { name: "Trang chủ", icon: Users, link: "/friends" },
  {
    name: "Lời mời kết bạn",
    icon: UserPlus,
    link: "/friends/requests",
    extraIcon: ChevronRight,
  },
  { name: "Gợi ý", icon: UserCheck, link: "/friends/suggest", extraIcon: ChevronRight },
  {
    name: "Tất cả bạn bè",
    icon: User,
    link: "/friends/all",
    extraIcon2: List,
    extraIcon: ChevronRight,
  },
  // { name: "Sinh nhật", icon: Gift, link: "/friends/birthdays" },
  // { name: "Danh sách tùy chỉnh", icon: List, link: "/friends/custom-list", extraIcon: ChevronRight },
];

const FriendNavBar: React.FC = () => {
  const location = useLocation();
  return (
    <aside className="h-screen w-full bg-white p-2 shadow-sm">
      <h2 className="mb-4 text-xl font-bold">Bạn bè</h2>
      <ul>
        {friendNavItems.map((item, index) => {
          const isActive = location.pathname === item.link;
          return (
            <li
              key={index}
              className={`rounded-lg ${isActive ? "bg-gray-200" : ""}`}
            >
              <Link
                to={item.link}
                className="flex items-center rounded p-2 text-base font-medium hover:bg-gray-100"
              >
                <div
                  className={`mr-3 flex h-9 w-9 items-center justify-center rounded-full ${isActive ? "bg-blue-500" : "bg-gray-200"}`}
                >
                  <item.icon
                    className={`relative h-5 w-5 ${isActive ? "text-white" : "text-gray-700"}`}
                  />
                </div>
                {item.name}
                {item.extraIcon2 && (
                  <item.extraIcon2 className="absolute mb-2 ml-6 h-2 w-2 text-gray-500" />
                )}
                {item.extraIcon && (
                  <item.extraIcon className="ml-auto h-6 w-6 text-gray-500" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default FriendNavBar;
