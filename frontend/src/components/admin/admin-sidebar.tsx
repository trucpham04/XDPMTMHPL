import { Link, useLocation } from "react-router-dom";
import { User, ChevronRight, ListCheck } from "lucide-react";

const friendNavItems = [
  {
    name: "Người dùng",
    icon: User,
    link: "/admin/user",
    extraIcon: ChevronRight,
  },
  {
    name: "Bài viết",
    icon: ListCheck,
    link: "/admin/post",
  },
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  return (
    <aside className="h-screen w-full bg-white p-2 shadow-sm">
      <h2 className="mb-4 text-xl font-bold">Admin</h2>
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
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default AdminSidebar;
