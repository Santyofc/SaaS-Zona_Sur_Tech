import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Blog Details | Play SaaS Starter Kit and Boilerplate for Next.js",
};

export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="pt-[150px] pb-[120px]">
      <div className="container">
        <h1 className="text-3xl font-bold text-center">Blog: {slug}</h1>
      </div>
    </div>
  );
}
