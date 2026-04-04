/**
 * /blog — Blog index page
 * Server Component — fetches latest published posts from CMS.
 * High-end "hacker-tech" edition.
 */
import { Metadata } from "next";
import { getLatestPosts, isCmsDatabaseConfigured } from "@/lib/cms/queries";
import BlogIndexClient from "./BlogIndexClient";

const BASE_URL = "https://zonasurtech.online";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blog | Automatización, IA y Operaciones | ZonaSur Tech",
    description:
      "Ideas, guías y aprendizajes sobre procesos, automatización e IA aplicada a la operación real de empresas en Costa Rica.",
    alternates: {
      canonical: `${BASE_URL}/blog`,
    },
    openGraph: {
      title: "Blog ZonaSur Tech | Automatización, IA y Business OS",
      description:
        "Artículos y notas prácticas sobre Business OS, automatización e IA aplicada al trabajo real.",
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

  if (!isCmsDatabaseConfigured()) {
    return <BlogIndexClient initialPosts={posts} />;
  }

  try {
    posts = await getLatestPosts(50);
  } catch {
    // Keep posts as empty array, BlogIndexClient handles empty state
  }

  return <BlogIndexClient initialPosts={JSON.parse(JSON.stringify(posts))} />;
}
