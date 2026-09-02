"use client";

import { useState, type ReactNode } from "react";

/**
 * Drag-and-drop reorder, native HTML5 DnD (no library — this is the one
 * generic list-reordering UI shared by every manager, so it's worth
 * having, but not worth a dependency for). Renders optimistically as the
 * user drags, then fires `onReorder` with the new id order once dropped;
 * the caller is responsible for persisting it (a Server Action updating
 * each row's sort_order) and for reflecting any failure back (e.g. via
 * router.refresh()).
 */
export function ReorderableList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
}: {
  items: T[];
  onReorder: (orderedIds: string[]) => void;
  renderItem: (item: T, dragHandleProps: { draggable: true; onDragStart: () => void }) => ReactNode;
}) {
  const [order, setOrder] = useState(items.map((i) => i.id));
  const [dragId, setDragId] = useState<string | null>(null);

  // Keep local order in sync if the underlying list changes (e.g. after
  // an add/delete elsewhere causes a server refresh).
  if (items.length !== order.length || items.some((i, idx) => order[idx] !== i.id && !order.includes(i.id))) {
    const nextIds = items.map((i) => i.id);
    if (JSON.stringify(nextIds.slice().sort()) !== JSON.stringify(order.slice().sort())) {
      setOrder(nextIds);
    }
  }

  const byId = new Map(items.map((i) => [i.id, i]));

  function handleDrop(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const next = [...order];
    const from = next.indexOf(dragId);
    const to = next.indexOf(targetId);
    next.splice(from, 1);
    next.splice(to, 0, dragId);
    setOrder(next);
    setDragId(null);
    onReorder(next);
  }

  return (
    <div className="flex flex-col gap-2">
      {order.map((id) => {
        const item = byId.get(id);
        if (!item) return null;
        return (
          <div
            key={id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(id)}
            className={dragId === id ? "opacity-50" : ""}
          >
            {renderItem(item, { draggable: true, onDragStart: () => setDragId(id) })}
          </div>
        );
      })}
    </div>
  );
}

export function DragHandle(props: { draggable: true; onDragStart: () => void }) {
  return (
    <span
      {...props}
      className="flex h-8 w-8 shrink-0 cursor-grab items-center justify-center text-warm-grey active:cursor-grabbing"
      aria-label="Drag to reorder"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <circle cx="9" cy="6" r="1.5" />
        <circle cx="15" cy="6" r="1.5" />
        <circle cx="9" cy="12" r="1.5" />
        <circle cx="15" cy="12" r="1.5" />
        <circle cx="9" cy="18" r="1.5" />
        <circle cx="15" cy="18" r="1.5" />
      </svg>
    </span>
  );
}
