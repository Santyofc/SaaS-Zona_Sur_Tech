import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Error Pages | Play SaaS Starter Kit and Boilerplate for Next.js",
};

export default function ErrorPage() {
  return (
    <div className="pt-[150px] pb-[120px]">
      <div className="container">
        <h1 className="text-3xl font-bold text-center">404 - Not Found</h1>
        <p className="text-center mt-4">The page you are looking for does not exist.</p>
      </div>
    </div>
  );
}
