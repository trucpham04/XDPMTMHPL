// src/pages/search/FilterItem.tsx
import React from "react";

interface FilterItemProps {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const FilterItem: React.FC<FilterItemProps> = ({ label, icon, active, onClick }) => {
  return (
    <div
      className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg ${
        active ? "bg-blue-100 text-blue-600 font-medium" : "hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
};

export default FilterItem;
