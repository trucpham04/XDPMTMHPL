import React from "react";
import { User } from "@/types/User";
import { Card } from "@/components/ui/card";
import roadImg from "@/assets/stories/road.jpg";
import { Link } from "react-router-dom";

interface RightSidebarProps {
  friends: User[];
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ friends }) => {
  return (
    <div className="fixed top-16 right-0 hidden h-[calc(100vh-4rem)] w-70 overflow-y-auto p-4 xl:block">
      {/* Sponsored Section */}
      <div className="mb-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-600">Sponsored</h3>
        <Card className="overflow-hidden pt-0">
          <img
            src={roadImg}
            alt="Sponsored content"
            className="h-40 w-full object-cover"
          />
          <div className="px-3">
            <p className="text-sm text-gray-500">Sponsored</p>
            <h4 className="font-medium">Try our new product!</h4>
            <p className="text-sm text-gray-600">
              Discover amazing features and benefits.
            </p>
          </div>
        </Card>
      </div>

      {/* Friends Section */}
      <div className="mb-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-600">Friends</h3>
        <div className="space-y-3">
          {friends.map((friend) => (
            <Link to={`/profile/${friend.id}`} key={friend.id}>
              <div className="hover:bg-background flex items-center space-x-3 rounded-lg p-2">
                <div className="relative">
                  {friend.profilePictureUrl ? (
                    <img
                      src={friend.profilePictureUrl}
                      alt={friend.firstName}
                      className="h-10 w-10 rounded-full bg-gray-200 object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "";
                      }}
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-500">
                      {friend.firstName[0]}
                    </div>
                  )}
                  <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {friend.firstName} {friend.lastName}
                  </p>
                  <p className="text-sm text-gray-500">Online</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
