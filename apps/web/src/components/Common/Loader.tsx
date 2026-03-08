import React from "react";

interface LoaderProps {
  className?: string;
}

const Loader = ({ className }: LoaderProps) => {
  return (
    <span
      className={`ml-1.5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent ${className}`}
    ></span>
  );
};

export default Loader;
