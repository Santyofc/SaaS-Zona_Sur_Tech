import React from "react";

export const LogoZS = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="200" height="200" rx="60" fill="currentColor" fillOpacity="0.1"/>
    <path d="M55 55H145L55 145H145" stroke="currentColor" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="175" cy="25" r="14" fill="#0075FF" />
    <circle cx="25" cy="175" r="14" fill="#7756FC" />
  </svg>
);
