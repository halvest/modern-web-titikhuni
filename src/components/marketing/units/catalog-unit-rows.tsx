import { UnitCard, type CatalogUnit } from "./unit-card";

export function CatalogUnitRows({ units }: { units: CatalogUnit[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {units.map((unit, index) => (
        <UnitCard key={unit.id} unit={unit} index={index} />
      ))}
    </div>
  );
}
