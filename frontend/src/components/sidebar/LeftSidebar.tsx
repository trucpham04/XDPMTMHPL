import React from "react";
import {
  Users,
  Calendar,
  Bookmark,
  Flag,
  Clock,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import UserAvatar from "../app/userAvatar";

interface Shortcut {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const shortcuts: Shortcut[] = [
  { icon: <Users className="h-6 w-6" />, label: "Friends", href: "/friends" },
  { icon: <Calendar className="h-6 w-6" />, label: "Events", href: "/" },
  { icon: <Bookmark className="h-6 w-6" />, label: "Saved", href: "/" },
  { icon: <Flag className="h-6 w-6" />, label: "Pages", href: "/" },
  { icon: <Clock className="h-6 w-6" />, label: "Memories", href: "/" },
];

export const LeftSidebar: React.FC = () => {
  const { user } = useAuthContext();

  return (
    <div className="fixed top-16 left-0 hidden h-[calc(100vh-4rem)] w-70 overflow-y-auto p-4 xl:block">
      <nav className="space-y-2">
        <Link
          to={`/profile/${user?.id}`}
          className="hover:bg-background flex items-center space-x-3 rounded-lg p-2"
        >
          <UserAvatar user={user} />
          <span className="font-medium">
            {user?.firstName} {user?.lastName}
          </span>
        </Link>

        {shortcuts.map((shortcut) => (
          <Link
            key={shortcut.label}
            to={shortcut.href}
            className="hover:bg-background flex items-center space-x-3 rounded-lg p-4"
          >
            <span className="text-blue-600">{shortcut.icon}</span>
            <span className="font-medium">{shortcut.label}</span>
          </Link>
        ))}
        <button className="hover:bg-background flex w-full items-center space-x-3 rounded-lg p-4 hover:cursor-pointer">
          <ChevronDown className="h-6 w-6 text-gray-600" />
          <span className="font-medium">See More</span>
        </button>
      </nav>
    </div>
  );
};
