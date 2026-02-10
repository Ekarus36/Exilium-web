import type { MetadataRoute } from "next";
import { getAllDocumentPaths, getAllCategories } from "@/tools/wiki/lib/loader";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://exilium.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/player`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/tools/tracker`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Category pages
  const categories = getAllCategories();
  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${BASE_URL}/player/${category}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Document pages
  const documentPaths = getAllDocumentPaths();
  const documentPages: MetadataRoute.Sitemap = documentPaths.map(
    ({ category, slug }) => ({
      url: `${BASE_URL}/player/${category}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
  );

  return [...staticPages, ...categoryPages, ...documentPages];
}
