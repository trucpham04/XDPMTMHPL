import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { User } from "@/types/User";
import roadImg from "@/assets/stories/road.jpg";
import planeImg from "@/assets/stories/plane.jpg";
import cityImg from "@/assets/stories/city.jpg";

interface Story {
  id: number;
  user: User;
  imageUrl: string;
}

interface StoriesProps {
  stories: Story[];
}

export const Stories: React.FC<StoriesProps> = ({ stories }) => {
  const images = [roadImg, planeImg, cityImg];
  return (
    <Card className="mb-6 w-full overflow-hidden bg-white p-4">
      <Carousel>
        <CarouselContent className="-ml-2">
          <CarouselItem className="min-w-32 basis-1/6 pl-2">
            <div className="relative flex h-48 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg bg-gray-200">
              <div className="flex h-full w-full flex-col items-center justify-center">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                  +
                </div>
                <span className="text-center text-sm font-semibold">
                  Create story
                </span>
              </div>
            </div>
          </CarouselItem>
          {stories.map((story, idx) => (
            <CarouselItem key={story.id} className="min-w-32 basis-1/6 pl-2">
              <div className="relative cursor-pointer">
                <div className="relative h-48 w-full overflow-hidden rounded-lg">
                  <img
                    src={images[idx % images.length]}
                    alt={`${story.user.firstName}'s story`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <div className="flex items-center space-x-2">
                      <img
                        src={story.user.profilePictureUrl || undefined}
                        alt={story.user.firstName[0]}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-blue-500 bg-gray-200 object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "";
                        }}
                      />
                      <span className="text-sm font-semibold text-white">
                        {story.user.firstName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </Card>
  );
};
