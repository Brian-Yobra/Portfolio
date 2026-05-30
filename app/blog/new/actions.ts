"use server";

import { createBlogPost } from "@/lib/blog";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function submitBlogPost(formData: FormData) {
  const title = formData.get("title") as string;
  let slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;
  const tagsString = formData.get("tags") as string;
  const coverImage = formData.get("coverImage") as string;
  const readingTime = formData.get("readingTime") as string;

  if (!title || !content) {
    throw new Error("Title and Content are required.");
  }

  // Auto-generate slug if not provided
  if (!slug) {
    slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Parse tags
  const tags = tagsString
    ? tagsString
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
    : [];

  const success = await createBlogPost({
    slug,
    title,
    description,
    content,
    category: category || "General",
    tags,
    coverImage: coverImage || "",
    readingTime: readingTime || "3 min read",
  });

  if (success) {
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    redirect("/blog");
  } else {
    throw new Error("Failed to save post to the database.");
  }
}
