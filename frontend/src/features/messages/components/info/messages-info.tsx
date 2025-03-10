import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Facebook from "@/assets/logos/facebook_logo.png";
import { Button } from "@/components/ui/button";
import { UserRound, Bell } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function MessagesInfo({ className }: React.ComponentProps<"div">) {
  return (
    <>
      <Sidebar side="right" className={cn(className)}>
        <SidebarContent>
          <div className="mt-14 flex flex-col items-center justify-center gap-4">
            <Avatar className="h-30 w-30">
              <AvatarImage src={Facebook} />
              <AvatarFallback></AvatarFallback>
            </Avatar>

            <div>
              <div className="text-2xl font-semibold">Pham Duy Truc</div>

              <div className="my-3 flex justify-around">
                <Tooltip delayDuration={700}>
                  <TooltipTrigger className="flex flex-col items-center gap-1">
                    <UserRound className="size-5!" />
                    <div className="text-xs">Profile</div>
                  </TooltipTrigger>
                  <TooltipContent>Profile</TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={700}>
                  <TooltipTrigger className="flex flex-col items-center gap-1">
                    <Bell className="size-5!" />
                    <div className="text-xs">Mute</div>
                  </TooltipTrigger>
                  <TooltipContent>Mute</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
    </>
  );
}

export default MessagesInfo;
