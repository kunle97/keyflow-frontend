import React from "react";
import Home from "./Home";
import Blog from "./sections/Blog";

const BlogPage = () => {
  return (
    <Home isDarkNav={true}>
      <div
        style={{
          paddingTop: "100px",
          paddingBottom: "230px",
        }}
      >
        <Blog />
      </div>
    </Home>
  );
};

export default BlogPage;
