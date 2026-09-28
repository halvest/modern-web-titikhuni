const compactNumber = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });

export function formatUnitPrice({
  price,
  prefix,
  suffix,
  status,
}: {
  price: number | string | null | undefined;
  prefix?: string | null;
  suffix?: string | null;
  status?: string | null;
}) {
  const numericPrice = Number(price);
  if (status === "Coming Soon" || !Number.isFinite(numericPrice) || numericPrice <= 0) {
    return "Harga menyusul";
  }

  let amount: string;
  if ((suffix === "Miliar" || (!suffix && numericPrice >= 1_000_000_000)) && numericPrice >= 1_000_000_000) {
    amount = `Rp${compactNumber.format(numericPrice / 1_000_000_000)} Miliar`;
  } else if ((suffix === "Juta" || (!suffix && numericPrice >= 1_000_000)) && numericPrice >= 1_000_000) {
    amount = `Rp${compactNumber.format(numericPrice / 1_000_000)} Juta`;
  } else {
    amount = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(numericPrice);
  }

  return [prefix, amount].filter(Boolean).join(" ");
}

export function getUnitLocationParts(unit: {
  location?: string | null;
  village?: string | null;
  district?: string | null;
  city?: string | null;
  province?: string | null;
}) {
  const granular = [unit.village, unit.district, unit.city]
    .map((value) => value?.trim())
    .filter(Boolean) as string[];

  if (granular.length) {
    return [...granular, unit.province?.trim()].filter(Boolean) as string[];
  }

  const legacy = (unit.location || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  if (legacy.length) return legacy;
  return [unit.province?.trim() || "Yogyakarta"];
}

export function getUnitLocationLabel(unit: Parameters<typeof getUnitLocationParts>[0]) {
  return getUnitLocationParts(unit).join(", ");
}
