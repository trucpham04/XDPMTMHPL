
import React, { useEffect, useState, useRef } from "react";
import clsx from "clsx";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HomeIcon, Users, MessageCircle, Bell, SearchIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import FacebookLogo from "@/assets/logos/facebook_logo.png";
// import { getAllUsers } from "@/API/UserService";
import { User } from "@/API/UserServiceInterface";
import SearchDropdown from "@/components/search/search-dropdown";
import SearchResults from "@/components/search/search-results";
import { getAllUsers } from "@/API/UserServiceMock"; //  dùng mock
import { Button } from "../ui/button";

const navItems = [
  {
    name: "Home",
    icon: HomeIcon,
    link: "/",
  },
  {
    name: "Friends",
    icon: Users,
    link: "/friends",
  },
  {
    name: "Notifications",
    icon: Bell,
    link: "/notifications",
  },
  {
    name: "Chat",
    icon: MessageCircle,
    link: "/messages",
  },
];

const AppNavBar: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [searchHistory, setSearchHistory] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const search = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    setName(event.target.value);
    setShowDropdown(true);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && name.trim() !== "") {
      const newUser: User = {
        id: Date.now(), // Tạm thời, vì không lấy từ API
        name: name.trim(),
        avatarUrl: "", // Avatar rỗng hoặc avatar mặc định
      };

      setSearchHistory((prev) => {
        const exists = prev.some((u) => u.name === newUser.name);
        if (exists) return prev;
        return [newUser, ...prev.slice(0, 7)];
      });

      setShowDropdown(false); // Ẩn dropdown nếu muốn
    }
  };

  const handleDeleteHistory = (idToDelete: number) => {
    setSearchHistory((prev) => prev.filter((user) => user.id !== idToDelete));
  };

  useEffect(() => {
    if (name.trim() === "") return;
    getAllUsers(name)
      .then((userList) => {
        setUsers(userList.data);
      })
      .catch((err) => {
        console.error("Lỗi khi tìm user:", err);
      });
  }, [name]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false); // Ẩn dropdown khi click ra ngoài
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <>
      <div className="fixed top-0 left-0 flex h-14 w-dvw items-center justify-between bg-[#FFFFFE] shadow-sm">
        <nav className="logo flex gap-2 pl-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={FacebookLogo}></AvatarImage>
            <AvatarFallback>FB</AvatarFallback>
          </Avatar>
          <div className="relative w-full xl:w-fit" ref={dropdownRef}>
            {/* Ô tìm kiếm */}
            <div className="border-input bg-muted flex h-10 w-10 items-center rounded-full text-sm xl:w-[300px] xl:pl-2">
              <div className="flex h-full w-10 items-center justify-center">
                <SearchIcon className="text-muted-foreground h-[16px] w-[16px]" />
              </div>
              <input
                onChange={search}
                type="search"
                onKeyDown={handleKeyDown}
                onFocus={() => setShowDropdown(true)} // focus hiển thị dropdown
                className="placeholder:text-muted-foreground hidden w-full p-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 xl:block"
                placeholder="Search Facebook"
              />
            </div>

            {/* Popup hiển thị khi showDropdown true */}
            {showDropdown && name.trim() === "" && (
              <SearchDropdown
                history={searchHistory}
                onSelect={(value) => setName(value)}
                onDelete={handleDeleteHistory}
              />
            )}

            {showDropdown && name.trim() !== "" && users.length > 0 && (
              <SearchResults
                users={users}
                onSelect={(selectedUser) => {
                  setName(selectedUser.name);

                  // Thêm vào lịch sử, tránh trùng id
                  setSearchHistory((prev) => {
                    if (prev.some((user) => user.id === selectedUser.id))
                      return prev;
                    return [selectedUser, ...prev.slice(0, 7)];
                  });

                  setShowDropdown(false); // Ẩn dropdown sau khi chọn
                }}
              />
            )}
          </div>
        </nav>

        <nav className="center-nav absolute top-1/2 left-1/2 hidden w-fit -translate-1/2 transform sm:block">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => {
                return (
                  <NavLink
                    key={item.name}
                    to={item.link}
                    className={({ isActive }) =>
                      cn(
                        "h-14 w-20 sm:w-24 md:w-28 xl:w-32",
                        isActive
                          ? "border-b-3 border-blue-600 bg-transparent text-blue-600"
                          : "",
                      )
                    }
                  >
                    <NavigationMenuItem key={item.link}>
                      <Tooltip delayDuration={700}>
                        <TooltipTrigger className="h-full w-full">
                          <NavigationMenuLink asChild>
                            <div className="flex cursor-pointer items-center justify-center py-3 hover:text-inherit">
                              <item.icon className="h-6! w-6! text-inherit"></item.icon>
                            </div>
                          </NavigationMenuLink>
                          <TooltipContent>{item.name}</TooltipContent>
                        </TooltipTrigger>
                      </Tooltip>
                    </NavigationMenuItem>
                  </NavLink>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="user flex gap-3 pr-4">
          <Button asChild className="cursor-pointer">
            <Avatar className="h-10 w-10 rounded-full p-0 shadow-sm">
              <AvatarImage src={FacebookLogo} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>
    </>
  );
};

export default AppNavBar;
