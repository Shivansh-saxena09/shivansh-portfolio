import { getSiteSettings } from "@/lib/data/site";
import { ResumeUploadForm } from "@/components/admin/ResumeUploadForm";

export default async function AdminResumePage() {
  const settings = await getSiteSettings();
  const isPlaceholder = settings.resumeUrl.includes("resume-placeholder");

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-2xl font-bold text-charcoal">Resume</h1>
      <p className="mt-1 font-body text-sm text-warm-grey">
        Powers the download button on /about and /engineering.
      </p>

      <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-beige-border bg-ivory p-6">
        <div>
          <p className="font-body text-sm font-medium text-charcoal">
            {isPlaceholder ? "Placeholder PDF (not a real resume)" : "Current resume"}
          </p>
          <p className="font-body text-xs text-warm-grey">
            Last updated {new Date(settings.resumeUpdatedAt).toLocaleString("en-IN")}
          </p>
        </div>
        <a
          href={settings.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full border border-beige-border px-4 py-2 font-body text-sm font-medium text-charcoal transition-colors hover:border-sage hover:text-sage-dark"
        >
          View current
        </a>
      </div>

      <div className="mt-6">
        <ResumeUploadForm />
      </div>
    </div>
  );
}
