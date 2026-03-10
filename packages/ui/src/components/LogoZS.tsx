import React from "react";

export const LogoZS = ({ className }: { className?: string }) => (
  <div className={`relative ${className} flex items-center justify-center overflow-hidden rounded-2xl`}>
    {/* Optional: Add a subtle animated backdrop or ring here later */}
    <img 
      src="/images/mascot.png" 
      alt="Zona Sur Tech Logo" 
      className="object-contain w-full h-full absolute inset-0 text-transparent"
    />
  </div>
);
