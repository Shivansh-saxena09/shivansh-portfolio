"use client";

import { useActionState } from "react";
import Image from "next/image";
import { TextInput } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ReorderableList, DragHandle } from "@/components/admin/ReorderableList";
import {
  uploadCaseStudyImage,
  deleteCaseStudyImage,
  reorderCaseStudyImages,
  type ImageUploadState,
} from "@/app/admin/(panel)/case-studies/actions";

export type GalleryImage = { id: string; url: string; altText: string | null; storagePath: string };

const initialState: ImageUploadState = { error: null };

export function GalleryManager({ caseStudySlug, images }: { caseStudySlug: string; images: GalleryImage[] }) {
  const [state, formAction] = useActionState(uploadCaseStudyImage, initialState);

  return (
    <div>
      <p className="font-body text-sm text-warm-grey">
        {images.length > 0
          ? `${images.length} real creative${images.length === 1 ? "" : "s"} uploaded — replacing the placeholder tiles on the public page.`
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

      <form action={formAction} className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-beige-border bg-ivory p-4">
        <input type="hidden" name="case_study_slug" value={caseStudySlug} />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="gallery_file" className="font-body text-xs font-medium text-charcoal">
            Image file
          </label>
          <input
            id="gallery_file"
            name="file"
            type="file"
            accept="image/*"
            required
            className="font-body text-sm text-charcoal file:mr-3 file:rounded-full file:border-0 file:bg-terracotta file:px-3 file:py-1.5 file:font-body file:text-xs file:font-medium file:text-ivory hover:file:bg-terracotta-dark"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="gallery_alt" className="font-body text-xs font-medium text-charcoal">
            Alt text
          </label>
          <TextInput id="gallery_alt" name="alt_text" placeholder="Ad creative — carousel slide 1" className="w-64" />
        </div>
        <SubmitButton pendingLabel="Uploading…">Upload</SubmitButton>
      </form>
      {state.error && (
        <p role="alert" className="mt-2 font-body text-sm text-terracotta-dark">
          {state.error}
        </p>
      )}
    </div>
  );
}
