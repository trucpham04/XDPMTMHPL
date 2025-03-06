import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DefaultLayout from "@/layouts/DefaultLayout";

import Home from "@/pages/Home";
import About from "@/pages/About";

const routes: React.FC = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default routes;
