import { UnitCard, type CatalogUnit } from "./unit-card";

import { ArrowLeftRight } from "lucide-react";

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export function CatalogUnitRows({ units }: { units: CatalogUnit[] }) {
  // Chunk into groups of 3. 
  // On desktop, this perfectly matches the 3-column grid.
  // On mobile, this creates manageable horizontal sliders of 3 cards max.
  const chunks = chunkArray(units, 3);

  return (
    <div className="flex flex-col gap-10 md:gap-12">
      {chunks.map((chunk, chunkIndex) => (
        <div key={chunkIndex} className="relative">
          {/* Mobile Swipe Indicator (only shown if more than 1 item) */}
          {chunk.length > 1 && (
            <div className="mb-3 flex items-center justify-end lg:hidden">
              <span className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">
                Geser <ArrowLeftRight size={14} className="shrink-0" />
              </span>
            </div>
          )}

          {/* 
            Mobile: Horizontal slider (grid-flow-col)
            Desktop: CSS Grid (grid-cols-3)
          */}
          <div
            className="-mx-5 grid snap-x snap-mandatory grid-flow-col auto-cols-[86vw] items-stretch gap-4 overflow-x-auto overscroll-x-contain scroll-px-5 px-5 pb-3 scrollbar-hide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:-mx-7 sm:auto-cols-[44vw] sm:scroll-px-7 sm:px-7 md:auto-cols-[42vw] lg:mx-0 lg:grid-flow-row lg:grid-cols-3 lg:auto-cols-auto lg:gap-8 lg:overflow-visible lg:px-0 lg:pb-0"
            tabIndex={0}
            aria-label={`Grup unit ${chunkIndex + 1}`}
          >
            {chunk.map((unit, index) => (
              <UnitCard key={unit.id} unit={unit} index={index + chunkIndex * 3} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
