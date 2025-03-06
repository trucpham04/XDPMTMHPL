import React from "react";
import { Button } from "@/components/ui/button";

const Home: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div>
        <h1>Home Page</h1>
        <Button>Click me</Button>
      </div>
    </div>
  );
};

export default Home;
