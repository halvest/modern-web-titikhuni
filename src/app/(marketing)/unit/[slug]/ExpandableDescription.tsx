"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function ExpandableDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 320;

  return (
    <div>
      <p className={`max-w-3xl whitespace-pre-wrap text-[0.98rem] leading-7 text-foreground-muted ${!expanded && isLong ? "line-clamp-5" : ""}`}>{text}</p>
      {isLong && (
        <button type="button" onClick={() => setExpanded((value) => !value)} className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover">
          {expanded ? "Tampilkan lebih sedikit" : "Lihat selengkapnya"}
          <ChevronDown size={16} className={expanded ? "rotate-180" : ""} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
