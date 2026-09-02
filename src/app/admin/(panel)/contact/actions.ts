"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateContactInfo(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_info")
    .update({
      email: String(formData.get("email")),
      whatsapp: String(formData.get("whatsapp")),
      linkedin: String(formData.get("linkedin")),
      github: String(formData.get("github")),
    })
    .eq("id", 1);
  if (error) throw error;
  // Contact links render in the Header/Footer on every page.
  revalidatePath("/", "layout");
}
