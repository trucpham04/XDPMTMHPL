import React from "react";
import MessageHeader from "./message-header";
import { Input } from "@/components/ui/input";

export default function MessageMain({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed flex h-[calc(100vh-56px)] flex-col">
        <MessageHeader />
        {/* <div className="w-full">
        </div> */}
        <div className="flex-1 overflow-auto">{children}</div>
        <div className="flex h-14 items-center justify-center bg-white py-4">
          <Input />
        </div>
      </div>
    </>
  );
}
