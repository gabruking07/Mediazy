import type { MetadataRoute } from "next";
import { brand } from "@/shared/brand";
import { categories, tools } from "@/shared/tools/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = brand.url;
  const staticRoutes = ["", "/tools", "/about", "/contact", "/privacy", "/terms", "/login"];
  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}`, lastModified: new Date() })),
    ...tools.map((tool) => ({ url: `${base}/tools/${tool.slug}`, lastModified: new Date() })),
    ...categories.map((category) => ({ url: `${base}${category.href}`, lastModified: new Date() }))
  ];
}
