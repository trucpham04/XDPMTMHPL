// src/pages/search/PlaceholderResult.tsx
import React from "react";

interface Props {
  type: string;
}

const PlaceholderResult: React.FC<Props> = ({ type }) => {
  return (
    <>
      <h2 className="mb-4 text-xl font-bold capitalize">{type}</h2>
      <p className="text-gray-500 italic">No content available for "{type}".</p>
    </>
  );
};

export default PlaceholderResult;
