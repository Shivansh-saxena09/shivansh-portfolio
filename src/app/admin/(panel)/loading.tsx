import { FunnelLoader } from "@/components/loaders/Loaders";

/** Admin pages wait on live Supabase reads; this shows while one loads (the public site is static and has none). */
export default function AdminLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <FunnelLoader className="ld-late h-12 w-12" />
    </div>
  );
}
