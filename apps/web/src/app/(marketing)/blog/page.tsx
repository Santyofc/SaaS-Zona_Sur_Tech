/**
 * /blog — Blog index page
 * Server Component — fetches latest published posts from CMS.
 * High-end "hacker-tech" edition.
 */
import { Metadata } from "next";
import { getLatestPosts } from "@/lib/cms/queries";
import BlogIndexClient from "./BlogIndexClient";

const BASE_URL = "https://zonasurtech.online";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog | Facturación Electrónica y ERP Costa Rica | ZonaSur Tech",
    description:
      "Explora artículos técnicos sobre facturación electrónica Hacienda v4.3, ERP, inventario y gestión SaaS disruptiva en Costa Rica.",
    alternates: {
      canonical: `${BASE_URL}/blog`,
    },
    openGraph: {
      title: "Blog ZonaSur Tech | ERP y Facturación Costa Rica",
      description:
        "Artículos técnicos sobre facturación electrónica Hacienda, ERP y gestión empresarial para PYMES costarricenses.",
      url: `${BASE_URL}/blog`,
      images: [
        {
          url: "/images/og/og-blog.png", // Ensure this exists or fallback to og-default
          width: 1200,
          height: 630,
          alt: "Blog ZonaSur Tech",
        },
      ],
    },
  };
}

export default async function BlogIndexPage() {
  let posts: any[] = [];

  try {
    posts = await getLatestPosts(50);
  } catch (error) {
    console.error("Critical: Error fetching blog posts at build time", error);
    // Keep posts as empty array, BlogIndexClient handles empty state
  }

  return <BlogIndexClient initialPosts={JSON.parse(JSON.stringify(posts))} />;
}
