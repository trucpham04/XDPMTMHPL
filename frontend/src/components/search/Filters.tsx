// src/pages/search/Filters.tsx
import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import FilterItem from "./FilterItem";
import {
  Home,
  MessageSquare,
  Users,
  // Video,
  // Store,
  // Landmark,
  // MapPin,
  // UsersRound,
  // Star,
} from "lucide-react";

const Filters: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "all";
  const navigate = useNavigate();

  const handleClick = (filterType: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}&type=${filterType}`);
  };

  return (
    <div className="w-80 rounded-lg border-r bg-white p-4">
      <div className="mb-4">
        <h1 className="text-xl font-bold">Search results</h1>
        <hr className="mt-2 border-t" />
      </div>
      <h2 className="mb-4 text-lg font-semibold">Filters</h2>
      <div className="space-y-2">
        <FilterItem
          label="All"
          icon={<Home size={20} />}
          active={type === "all"}
          onClick={() => handleClick("all")}
        />
        <FilterItem
          label="Posts"
          icon={<MessageSquare size={20} />}
          active={type === "posts"}
          onClick={() => handleClick("posts")}
        />
        <FilterItem
          label="People"
          icon={<Users size={20} />}
          active={type === "people"}
          onClick={() => handleClick("people")}
        />
        {/* <FilterItem
          label="Videos"
          icon={<Video size={20} />}
          active={type === "videos"}
          onClick={() => handleClick("videos")}
        />
        <FilterItem
          label="Marketplace"
          icon={<Store size={20} />}
          active={type === "marketplace"}
          onClick={() => handleClick("marketplace")}
        />
        <FilterItem
          label="Pages"
          icon={<Landmark size={20} />}
          active={type === "pages"}
          onClick={() => handleClick("pages")}
        />
        <FilterItem
          label="Places"
          icon={<MapPin size={20} />}
          active={type === "places"}
          onClick={() => handleClick("places")}
        />
        <FilterItem
          label="Groups"
          icon={<UsersRound size={20} />}
          active={type === "groups"}
          onClick={() => handleClick("groups")}
        />
        <FilterItem
          label="Events"
          icon={<Star size={20} />}
          active={type === "events"}
          onClick={() => handleClick("events")}
        /> */}
      </div>
    </div>
  );
};

export default Filters;
