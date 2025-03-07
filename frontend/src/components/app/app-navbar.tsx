import React from "react";
import clsx from "clsx";
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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HomeIcon, Users, MessageCircle, Bell, SearchIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import FacebookLogo from "@/assets/logos/facebook_logo.png";

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

const Sidebar: React.FC = () => {
  return (
    <>
      <div className="flex h-14 w-dvw items-center justify-between bg-[#FFFFFE] shadow-sm fixed top-0 left-0">
        <nav className="logo flex gap-2 pl-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={FacebookLogo}></AvatarImage>
            <AvatarFallback>FB</AvatarFallback>
          </Avatar>
          <div
            className={clsx(
              "border-input bg-muted flex h-10 w-10 xl:w-fit items-center rounded-full xl:pl-2 text-sm",
            )}
          >
            <div className="flex items-center justify-center h-full w-10">
              <SearchIcon className="text-muted-foreground h-[16px] w-[16px]" />
            </div>
            <input
              type="search"
              ref={undefined}
              className="placeholder:text-muted-foreground hidden w-full p-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 xl:block"
              placeholder={"Search Facebook"}
            />
          </div>
        </nav>

        <nav className="center-nav absolute top-1/2 left-1/2 w-fit -translate-1/2 transform hidden sm:block">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => {
                return (
                  <TooltipProvider key={item.name}>
                    <NavLink
                      to={item.link}
                      className={({ isActive }) =>
                        clsx(
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
                  </TooltipProvider>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <nav className="user flex gap-3 pr-4">
          {/* <Button className="h-10 w-10 rounded-full cursor-pointer hover:bg-zinc-300" variant={"secondary"}>
            <Bell className="w-5! h-5!" fill=""/>
          </Button> */}
          <Avatar className="h-10 w-10">
            <AvatarImage src={FacebookLogo} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
