import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Facebook from "@/assets/logos/facebook_logo.png";
import { Button } from "@/components/ui/button";
import { UserRound, Bell } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
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
                <Tooltip>
                  <div className="flex flex-col gap-1 text-center">
                    <TooltipTrigger>
                      <Button
                        variant={"secondary"}
                        size={"icon"}
                        className="rounded-full"
                      >
                        <UserRound className="size-5!" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Profile</TooltipContent>
                    <div className="text-xs">Profile</div>
                  </div>
                </Tooltip>

                <Tooltip>
                  <div className="flex flex-col gap-1 text-center">
                    <TooltipTrigger>
                      <Button
                        variant={"secondary"}
                        size={"icon"}
                        className="rounded-full"
                      >
                        <Bell className="size-5!" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Mute</TooltipContent>
                    <div className="text-xs">Mute</div>
                  </div>
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
