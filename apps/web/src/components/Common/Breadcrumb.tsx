import React from "react";

const Breadcrumb = ({ pageName }: { pageName: string }) => {
  return (
    <div>
      <h1>{pageName}</h1>
    </div>
  );
};

export default Breadcrumb;
