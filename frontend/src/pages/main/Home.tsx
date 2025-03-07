import React from "react";
import { Button } from "@/components/ui/button";

const Home: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-[10000px]">
        <h1>Home Page</h1>
        <Button>Click me</Button>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Temporibus
          id iure totam eius reprehenderit, dolorum nulla ducimus earum est
          beatae hic quidem doloremque dolore quos nisi culpa at quia inventore.
        </p>
      </div>
    </div>
  );
};

export default Home;
