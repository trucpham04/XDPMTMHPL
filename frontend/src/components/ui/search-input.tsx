import React from "react";
import clsx from "clsx";
import { SearchIcon } from "lucide-react";

export type SearchProps = React.InputHTMLAttributes<HTMLInputElement>;

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
};

const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={clsx(
          "border-input ring-offset-background focus-within:ring-ring flex h-10 items-center rounded-md border bg-white pl-3 text-sm focus-within:ring-1 focus-within:ring-offset-2",
          className,
        )}
      >
        <SearchIcon className="h-[16px] w-[16px]" />
        <input
          {...props}
          type="search"
          ref={ref}
          className="placeholder:text-muted-foreground w-full p-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={props.placeholder || "Search..."}
        />
      </div>
    );
  },
);

SearchInput.displayName = "Search";

export { SearchInput };
