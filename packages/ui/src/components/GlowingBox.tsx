import React from "react";

interface GlowingBoxProps {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const GlowingBox: React.FC<GlowingBoxProps> = ({ 
  children, 
  className = "", 
  contentClassName = "" 
}) => {
  return (
    <div className={`glowing-box ${className}`}>
      <div className={`glowing-content ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};
