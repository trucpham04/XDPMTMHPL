import React from "react";
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
  return (
    <>
      <div className="bg-background dark:bg-accent fixed top-0 left-0 z-50 flex h-14 w-dvw items-center justify-between shadow-sm">
        <nav className="logo flex gap-2 pl-4">
          <NavLink to="/" className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src={FacebookLogo}></AvatarImage>
              <AvatarFallback>FB</AvatarFallback>
            </Avatar>
          </NavLink>
          <div
            className={cn(
              "border-input dark:bg-background bg-accent flex h-10 w-10 items-center rounded-full text-sm xl:w-fit xl:pl-2",
            )}
          >
            <div className="flex h-full w-10 items-center justify-center">
              <SearchIcon className="text-muted-foreground h-[16px] w-[16px]" />
            </div>
            <input
              type="search"
              ref={undefined}
              className="placeholder:text-muted-foreground hidden w-full py-2 pr-4 pl-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 xl:block"
              placeholder={"Search Facebook"}
            />
          </div>
        </nav>

        <nav className="center-nav absolute top-1/2 left-1/2 hidden w-fit -translate-1/2 transform sm:block">
          <NavigationMenu className="w-full">
            <NavigationMenuList className="w-full">
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
