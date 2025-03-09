import { SquarePen } from "lucide-react";

import Facebook from "@/assets/logos/facebook_logo.png";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { NavLink } from "react-router-dom";

// Menu items.
const items = Array.from({ length: 100 }, (_, index) => ({
  name: `User ${index + 1}`,
  url: `/messages/${index + 1}`,
  avatar: Facebook, // Thay thế bằng đường dẫn avatar phù hợp
}));

export default function MessageSidebar() {
  return (
    <Sidebar className="mt-14">
      <SidebarHeader className="h-16 shadow-sm">
        <div className="flex h-full w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Chats</h1>
          <SquarePen className="h-5! w-5!" />
        </div>
      </SidebarHeader>
      <SidebarContent className="">
        <SidebarGroup className="">
          <SidebarGroupContent className="">
            <div>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <NavLink to={item.url} className={({ isActive }) => ""}>
                      {({ isActive }) => (
                        <SidebarMenuButton
                          className={`h-16 w-full cursor-pointer ${isActive ? "bg-blue-100 hover:bg-blue-100" : ""}`}
                        >
                          <div className="flex w-full items-center justify-center gap-1">
                            <div className="avatar mr-2">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={item.avatar}></AvatarImage>
                                <AvatarFallback>
                                  {item.name[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="w-full">
                              <div className="flex w-full flex-col gap-1">
                                <div className="flex w-full justify-between">
                                  <div className="max-w-[150px] overflow-hidden overflow-ellipsis">
                                    {item.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    15h
                                  </div>
                                </div>
                                <div className="flex w-fit text-xs text-gray-500">
                                  <div className="max-w-[200px] overflow-hidden overflow-ellipsis">
                                    {item.name}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </SidebarMenuButton>
                      )}
                    </NavLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
