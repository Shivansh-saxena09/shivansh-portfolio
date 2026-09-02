"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ResumeUploadState = { error: string | null };

const RESUME_PATH = "resume/resume.pdf";

export async function uploadResume(
  _prevState: ResumeUploadState,
  formData: FormData,
): Promise<ResumeUploadState> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a PDF file first." };
  }
  if (file.type !== "application/pdf") {
    return { error: "File must be a PDF." };
  }

  const supabase = await createClient();

  // Fixed path so storage never accumulates old resumes — `upsert`
  // replaces the previous file in place. The public URL for a fixed
  // path never changes, so a cache-busting query string is appended to
  // what's actually stored in resume_url, forcing browsers/CDNs to fetch
  // the new file instead of serving a stale cached copy.
  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(RESUME_PATH, file, { upsert: true, contentType: "application/pdf" });
  if (uploadError) return { error: uploadError.message };

  const { data } = supabase.storage.from("media").getPublicUrl(RESUME_PATH);
  const { error } = await supabase
    .from("site_settings")
    .update({ resume_url: `${data.publicUrl}?v=${Date.now()}` })
    .eq("id", 1);
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { error: null };
}
