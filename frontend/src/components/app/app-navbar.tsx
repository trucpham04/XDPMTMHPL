import React, { useEffect, useState, useRef } from "react";
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
import { HomeIcon, Users, MessageCircle, SearchIcon, Bell } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import FacebookLogo from "@/assets/logos/facebook_logo.png";
import { User } from "@/types/User";
import SearchDropdown from "@/components/search/search-dropdown";
import SearchResults from "@/components/search/search-results";
import { Button } from "../ui/button";
import axios from "axios";
import { useAuthContext } from "@/contexts/AuthContext";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import UserAvatar from "./userAvatar";

const navItems = [
  {
    name: "Trang chủ",
    icon: HomeIcon,
    link: "/",
  },
  {
    name: "Bạn bè",
    icon: Users,
    link: "/friends",
  },
  {
    name: "Thông báo",
    icon: Bell,
    link: "/notifications",
  },
  {
    name: "Tin nhắn",
    icon: MessageCircle,
    link: "/messages",
  },
];

const AppNavBar: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const { user, logout } = useAuthContext();

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      try {
        // await axios.post("http://localhost:8080/api/search/history", null, {
        //   params: {
        //     searcherId: currentUserId,
        //     userId: null,
        //     searchText: searchQuery.trim(),
        //   },
        // });
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        console.log("✅ Đã lưu tìm kiếm text");
      } catch (error) {
        console.error("❌ Lỗi khi lưu lịch sử:", error);
      }
    }
  };

  useEffect(() => {}, [user]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim() === "") {
        setSuggestions([]);
        return;
      }
      // try {
      //   const response = await axios.get<User[]>(
      //     `http://localhost:8080/api/users/search/users`,
      //     {
      //       params: {
      //         query: searchQuery,
      //         currentUserId: currentUser?.id ?? 0,
      //       },
      //     },
      //   );
      //   setSuggestions(response.data);
      // } catch (error) {
      //   console.error("Lỗi khi tìm kiếm:", error);
      // }
    };

    fetchSuggestions();
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <>
      <div className="fixed top-0 left-0 z-50 flex h-14 w-dvw items-center justify-between bg-[#FFFFFE] shadow-sm">
        <nav className="logo flex gap-2 pl-4">
          <Link to="/">
            <Avatar className="h-10 w-10">
              <AvatarImage src={FacebookLogo}></AvatarImage>
              <AvatarFallback>FB</AvatarFallback>
            </Avatar>
          </Link>

          <div className="relative w-full xl:w-fit" ref={dropdownRef}>
            {/* Ô tìm kiếm */}
            <div className="border-input bg-muted flex h-10 items-center rounded-full text-sm xl:w-[300px] xl:pl-2">
              <div className="flex h-full w-10 items-center justify-center">
                <SearchIcon className="text-muted-foreground h-[16px] w-[16px]" />
              </div>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="search"
                onKeyDown={handleKeyDown}
                onFocus={() => setShowDropdown(true)} // focus hiển thị dropdown
                className="placeholder:text-muted-foreground w-full p-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 xl:block"
                placeholder="Tìm kiếm"
              />
            </div>

            {/* Popup hiển thị khi showDropdown true */}
            {showDropdown && (
              <>
                {/* Nếu input rỗng → hiện lịch sử tìm kiếm */}
                {searchQuery.trim() === "" ? (
                  <SearchDropdown
                    userId={user?.id ?? null}
                    onSelect={async (history) => {
                      const name = history.user
                        ? `${history.user.firstName} ${history.user.lastName}`
                        : history.searchText || "";

                      setSearchQuery(name);

                      try {
                        // Lưu lịch sử tìm kiếm trước khi thay đổi trạng thái
                        await axios.post(
                          "http://localhost:8080/api/search/history",
                          null,
                          {
                            params: {
                              searcherId: user,
                              userId: history?.targetUser?.id,
                              searchText: name,
                            },
                          },
                        );
                        console.log(
                          "✅ Đã lưu lịch sử khi click vào dropdown:",
                          name,
                        );
                      } catch (err) {
                        console.error(
                          "❌ Lỗi khi lưu lịch sử từ dropdown:",
                          err,
                        );
                      }
                      setShowDropdown(false);

                      // Chuyển hướng đến trang tìm kiếm
                      navigate(`/search?q=${encodeURIComponent(name)}`);
                    }}
                  />
                ) : (
                  suggestions.length > 0 && (
                    <SearchResults
                      users={suggestions}
                      onSelect={async (user) => {
                        const name = `${user.firstName} ${user.lastName}`;

                        try {
                          await axios.post(
                            "http://localhost:8080/api/search/history",
                            null,
                            {
                              params: {
                                searcherId: user,
                                userId: user.id,
                                searchText: name,
                              },
                            },
                          );

                          console.log(
                            "✅ Đã lưu lịch sử tìm kiếm cho user:",
                            user,
                          );
                        } catch (error) {
                          console.error(
                            "❌ Lỗi khi lưu lịch sử tìm kiếm:",
                            error,
                          );
                        }

                        setShowDropdown(false);
                        navigate(`/search?q=${encodeURIComponent(name)}`);
                      }}
                    />
                  )
                )}
              </>
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
                        "flex h-14 items-center justify-center",
                        isActive
                          ? "border-b-3 border-blue-600 bg-transparent text-blue-600"
                          : "",
                      )
                    }
                  >
                    <NavigationMenuItem
                      key={item.link}
                      className="w-20 sm:w-24 md:w-28 xl:w-32"
                    >
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
          <Popover>
            <PopoverTrigger className="size-10 cursor-pointer">
              <UserAvatar user={user} />
            </PopoverTrigger>
            <PopoverContent className="w-50 rounded-sm p-1">
              <div className="grid gap-1">
                {user ? (
                  <>
                    {user.roles
                      ? user.roles[0].name == "ROLE_ADMIN" && (
                          <>
                            <Button
                              asChild
                              variant="ghost"
                              className="cursor-pointer rounded-xs"
                            >
                              <Link
                                to={`/admin/user`}
                                className="justify-start"
                              >
                                Trang quản lý
                              </Link>
                            </Button>

                            <Separator className="w-full" />
                          </>
                        )
                      : ""}
                    <Button
                      asChild
                      variant="ghost"
                      className="cursor-pointer rounded-xs"
                    >
                      <Link
                        to={`/profile/${user.id}`}
                        className="justify-start"
                      >
                        Trang cá nhân của bạn
                      </Link>
                    </Button>

                    <Separator className="w-full" />

                    <Button
                      variant="ghost"
                      onClick={logout}
                      className="cursor-pointer justify-start! rounded-xs"
                    >
                      Đăng xuất
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="ghost"
                      className="cursor-pointer rounded-xs"
                    >
                      <Link to="/auth/register" className="justify-start">
                        Đăng ký
                      </Link>
                    </Button>
                    <Separator className="w-full" />
                    <Button
                      asChild
                      variant="ghost"
                      className="cursor-pointer rounded-xs"
                    >
                      <Link to="/auth/login" className="justify-start">
                        Đăng nhập
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  );
};

export default AppNavBar;
