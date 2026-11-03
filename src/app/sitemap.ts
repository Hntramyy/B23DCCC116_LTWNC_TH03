import type { MetadataRoute } from "next";
import { getDeadlines, getSubjects } from "@/lib/data";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [deadlines, subjects] = await Promise.all([getDeadlines(), getSubjects()]);
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/deadlines`, changeFrequency: "daily", priority: 0.9 },
    ...subjects.map((subject) => ({
      url: `${baseUrl}/subjects/${subject.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...deadlines.map((deadline) => ({
      url: `${baseUrl}/deadlines/${deadline.id}`,
      lastModified: new Date(deadline.dueDate),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
