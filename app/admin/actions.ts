'use server';

import { deleteBlogPost } from '@/lib/blog';
import { revalidatePath } from 'next/cache';

export async function deletePost(slug: string): Promise<{ success: boolean; error?: string }> {
  if (!slug) {
    return { success: false, error: 'Slug is required.' };
  }

  const success = await deleteBlogPost(slug);

  if (success) {
    revalidatePath('/blog');
    revalidatePath('/admin');
    return { success: true };
  } else {
    return { success: false, error: `Failed to delete post "${slug}".` };
  }
}
