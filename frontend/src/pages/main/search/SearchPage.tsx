// src/pages/search/SearchPage.tsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import Filters from "./Filters";
import PeopleResults from "./PeopleResults";
import PostResults from "./PostResults";
import PlaceholderResult from "./PlaceholderResult";
import AllResults from "./AllResults";

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "people";

  return (
    <div className="sticky top-14 flex min-h-screen w-full rounded-lg border p-4">
      <Filters />
      <div className="flex flex-1 justify-center px-4">
        <div className="w-full max-w-2xl">
          <div className="rounded-lg border bg-white p-4">
            {type === "all" && <AllResults query={query} />}
            {type === "people" && <PeopleResults query={query} />}
            {type === "posts" && <PostResults query={query} />}

            {type !== "people" && type !== "posts" && type !== "all" && (
              <PlaceholderResult type={type} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
