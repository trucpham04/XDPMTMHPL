import { Link } from "react-router-dom";
import { Users, User, UserPlus, UserCheck, Gift, List, ChevronRight } from "lucide-react";

const friendNavItems = [
  { name: "Trang chủ", icon: Users, link: "/friends" },
  { name: "Lời mời kết bạn", icon: UserPlus, link: "/friends/requests", extraIcon: ChevronRight },
  { name: "Gợi ý", icon: UserCheck, link: "/friends/suggestions", extraIcon: ChevronRight },
  { name: "Tất cả bạn bè", icon: User, link: "/friends/all", extraIcon2: List, extraIcon: ChevronRight },
  { name: "Sinh nhật", icon: Gift, link: "/friends/birthdays" },
  { name: "Danh sách tùy chỉnh", icon: List, link: "/friends/custom-list", extraIcon: ChevronRight },
];

const FriendNavBar: React.FC = () => {
  return (
    <aside className="w-full p-2 bg-white shadow-sm h-screen">
      <h2 className="text-xl font-bold mb-4">Bạn bè</h2>
      <ul>
        {friendNavItems.map((item, index) => (
          <li key={index}>
          <Link to={item.link} className="flex text-base font-medium items-center p-2 hover:bg-gray-100 rounded">
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 mr-3">
              <item.icon className="w-5 h-5 text-gray-700" />
            </div>
            {item.name}
            {item.extraIcon2 && <item.extraIcon2 className="w-2 h-2 text-gray-500 ml-2" />}
            {item.extraIcon && <item.extraIcon className="w-6 h-6 text-gray-500 ml-auto" />}
          </Link>
        </li>
        ))}
      </ul>
    </aside>
  );
};

export default FriendNavBar;
