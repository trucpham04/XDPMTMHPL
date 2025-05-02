// src/pages/search/SearchPage.tsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import Filters from "@/components/search/Filters";
import PeopleResults from "@/components/search/PeopleResults";
import PostResults from "@/components/search/PostResults";
import PlaceholderResult from "@/components/search/PlaceholderResult";
import AllResults from "@/components/search/AllResults";
import { useAuthContext } from "@/contexts/AuthContext";

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "people";
  const { user } = useAuthContext();
  const currentUserId = user?.id;
  // const currentUserId = useSelector((state: RootState) => state.auth.currentUser?.id);

  return (
    <div className="sticky top-14 flex min-h-screen w-full rounded-lg border p-4">
      <Filters />
      <div className="flex flex-1 justify-center px-4">
        <div className="w-full max-w-2xl">
          <div className="rounded-lg border bg-white p-4">
            {type === "all" && (
              <AllResults query={query} currentUserId={currentUserId} />
            )}

            {type === "people" && (
              <PeopleResults query={query} currentUserId={currentUserId} />
            )}
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
