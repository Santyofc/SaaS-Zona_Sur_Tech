import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Not Found | Play SaaS Starter Kit and Boilerplate for Next.js",
};

export default function NotFound() {
  return (
    <div className="pt-[150px] pb-[120px]">
      <div className="container">
        <h1 className="text-3xl font-bold text-center">404 - Not Found</h1>
        <p className="text-center mt-4">The page you are looking for does not exist.</p>
      </div>
    </div>
  );
}
