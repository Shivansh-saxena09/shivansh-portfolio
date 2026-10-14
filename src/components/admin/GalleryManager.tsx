"use client";

import "@/components/loaders/loaders.css";
import { useActionState, useState, type FormEvent } from "react";
import Image from "next/image";
import { TextInput } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { DoneState, UploadProgress } from "@/components/loaders/Loaders";
import { useDelayed, useJustFinished } from "@/components/loaders/useDelayed";
import { ReorderableList, DragHandle } from "@/components/admin/ReorderableList";
import {
  uploadCaseStudyImage,
  deleteCaseStudyImage,
  reorderCaseStudyImages,
  type ImageUploadState,
} from "@/app/admin/(panel)/case-studies/actions";

export type GalleryImage = { id: string; url: string; altText: string | null; storagePath: string };

const initialState: ImageUploadState = { error: null };
const MAX_UPLOAD_MB = 8;

export function GalleryManager({
  caseStudySlug,
  images,
  imageType = "creative",
}: {
  caseStudySlug: string;
  images: GalleryImage[];
  /** Which of the two case_study_images lists this manages — Creatives
   *  (ad images) or Verified Results (proof screenshots, e.g. cropped
   *  Meta Ads Manager screenshots). Same table/storage/upload mechanism
   *  either way, just scoped by this column so the two never mix. */
  imageType?: "creative" | "proof";
}) {
  const [state, formAction, pending] = useActionState(uploadCaseStudyImage, initialState);
  const late = useDelayed(pending);
  const finished = useJustFinished(pending);
  const noun = imageType === "proof" ? "proof screenshot" : "creative";
  // Unique per instance — this component renders twice on the same admin
  // page (once per imageType), and duplicate id/htmlFor pairs on a page
  // break label association for whichever instance renders second.
  const fileId = `gallery_file_${imageType}`;
  const altId = `gallery_alt_${imageType}`;
  // Checked client-side (before the request is even sent) so an
  // oversized file never reaches Next's own request-body-size limit —
  // that rejection happens in the framework's own request parsing,
  // before the server action itself ever runs, so it can't be caught
  // and shown gracefully from inside the action. Catching it here,
  // plus a matching server-side check (see actions.ts) as a second
  // line of defense, means a visitor never sees that raw crash screen.
  const [clientError, setClientError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const input = e.currentTarget.elements.namedItem("file") as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (file && file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      e.preventDefault();
      setClientError(
        `Image is too large (${(file.size / 1024 / 1024).toFixed(1)}MB) — please upload a file under ${MAX_UPLOAD_MB}MB.`,
      );
      return;
    }
    setClientError(null);
  }

  return (
    <div>
      <p className="font-body text-sm text-warm-grey">
        {images.length > 0
          ? `${images.length} ${noun}${images.length === 1 ? "" : "s"} uploaded${imageType === "creative" ? " — replacing the placeholder tiles on the public page." : "."}`
          : imageType === "proof"
            ? "No proof screenshots uploaded yet — the public page shows just the verification note until one is added."
            : "No real creatives uploaded yet — the public page shows placeholder tiles until at least one image is added."}
      </p>

      <ReorderableList
        items={images.map((img) => ({ ...img }))}
        onReorder={(ids) => reorderCaseStudyImages(ids)}
        renderItem={(image, dragHandleProps) => (
          <div className="flex items-center gap-3 rounded-xl border border-beige-border bg-cream p-3">
            <DragHandle {...dragHandleProps} />
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-beige-border">
              <Image src={image.url} alt={image.altText ?? ""} fill sizes="64px" className="object-cover" />
            </div>
            <p className="flex-1 truncate font-body text-sm text-charcoal">{image.altText || "(no alt text)"}</p>
            <form action={deleteCaseStudyImage}>
              <input type="hidden" name="id" value={image.id} />
              <input type="hidden" name="storage_path" value={image.storagePath} />
              <SubmitButton variant="danger" pendingLabel="…">
                Delete
              </SubmitButton>
            </form>
          </div>
        )}
      />

      <form
        action={formAction}
        onSubmit={handleSubmit}
        className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-beige-border bg-ivory p-4"
      >
        <input type="hidden" name="case_study_slug" value={caseStudySlug} />
        <input type="hidden" name="image_type" value={imageType} />
        <div className="flex flex-col gap-1.5">
          <label htmlFor={fileId} className="font-body text-xs font-medium text-charcoal">
            Image file <span className="font-normal text-warm-grey">(up to {MAX_UPLOAD_MB}MB)</span>
          </label>
          <input
            id={fileId}
            name="file"
            type="file"
            accept="image/*"
            required
            onChange={() => setClientError(null)}
            className="font-body text-sm text-charcoal file:mr-3 file:rounded-full file:border-0 file:bg-terracotta file:px-3 file:py-1.5 file:font-body file:text-xs file:font-medium file:text-ivory hover:file:bg-terracotta-dark"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={altId} className="font-body text-xs font-medium text-charcoal">
            Alt text
          </label>
          <TextInput
            id={altId}
            name="alt_text"
            placeholder={imageType === "proof" ? "Meta Ads Manager — results overview" : "Ad creative — carousel slide 1"}
            className="w-64"
          />
        </div>
        <SubmitButton pendingLabel="Uploading…">Upload</SubmitButton>
      </form>
      <div className="mt-2 min-h-6">
        {late && <UploadProgress label="Uploading…" />}
        {!pending && (clientError ?? state.error) ? (
          <DoneState ok={false} message={clientError ?? state.error} />
        ) : (
          !pending && finished && <DoneState ok message="Uploaded" />
        )}
      </div>
    </div>
  );
}
