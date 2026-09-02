import { cache } from "react";
import { createClient } from "@/lib/supabase/public";

export type Service = {
  id: string;
  title: string;
  description: string;
};

export const getServices = cache(async function getServices(): Promise<Service[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, title, description")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data as Service[];
});
