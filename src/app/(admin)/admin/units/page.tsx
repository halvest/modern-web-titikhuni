import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, ExternalLink, MapPin, Search } from "lucide-react";
import { formatRupiah } from "@/lib/formatRupiah";
import { DeleteButton } from "./DeleteButton";

export default async function UnitsPage() {
  const supabase = await createClient();
  const { data: units } = await supabase
    .from("units")
    .select("*")
    .is("deleted_at", null)
    .order("priority_order", { ascending: true });

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-neutral-900 leading-none">
            Katalog <span className="text-neutral-300">Properti</span>
          </h1>
          <p className="text-[10px] text-neutral-400 mt-3 font-bold uppercase tracking-[0.3em]">
            Manajemen listing unit dan inventaris Titik Huni
          </p>
        </div>

        <Link
          href="/admin/units/new"
          className="bg-black text-white px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-neutral-800 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-black/10"
        >
          <Plus size={16} strokeWidth={3} /> Tambah Unit Baru
        </Link>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 border-b border-neutral-100">
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-black text-neutral-400">
                  Info Unit
                </th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-black text-neutral-400">
                  Harga & Spesifikasi
                </th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-black text-neutral-400">
                  Status
                </th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-widest font-black text-neutral-400 text-right">
                  Manajemen
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {units && units.length > 0 ? (
                units.map((unit) => (
                  <tr
                    key={unit.id}
                    className="hover:bg-neutral-50/50 transition-all group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-neutral-100 shrink-0 shadow-sm">
                          <Image
                            src={
                              unit.image_url || "/assets/images/placeholder.jpg"
                            }
                            alt={unit.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-sm font-black uppercase tracking-tight text-neutral-900 leading-none">
                            {unit.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-neutral-400">
                            <MapPin size={10} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">
                              {unit.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-neutral-900">
                          {formatRupiah(unit.price)}
                        </p>
                        <p className="text-[10px] text-neutral-400 font-medium">
                          {unit.land_area}m² Tanah • {unit.bedroom_count}KT •{" "}
                          {unit.bathroom_count}KM
                        </p>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <StatusBadge status={unit.status} />
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex justify-end items-center gap-2">
                        <ActionButton
                          href={`/unit/${unit.slug}`}
                          icon={<ExternalLink size={14} />}
                          label="Preview"
                          target="_blank"
                        />
                        <ActionButton
                          href={`/admin/units/edit/${unit.id}`}
                          icon={<Edit size={14} />}
                          label="Edit"
                          variant="blue"
                        />
                        <DeleteButton id={unit.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-8 py-32 text-center text-neutral-400 opacity-20"
                  >
                    <Search size={48} className="mx-auto mb-4" />
                    <p className="text-xs font-bold uppercase tracking-[0.3em]">
                      Belum ada unit tersedia
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Internal UI Components
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Tersedia: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Sold: "bg-neutral-900 text-white border-neutral-900",
    Booked: "bg-amber-50 text-amber-600 border-amber-100",
    "Coming Soon": "bg-blue-50 text-blue-600 border-blue-100",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${styles[status] || styles["Tersedia"]}`}
    >
      {status}
    </span>
  );
}

function ActionButton({
  href,
  icon,
  label,
  variant = "neutral",
  ...props
}: any) {
  const variants: Record<string, string> = {
    neutral: "hover:bg-black hover:text-white",
    blue: "hover:bg-blue-600 hover:text-white",
  };
  return (
    <Link
      href={href}
      {...props}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-400 transition-all duration-300 border border-transparent hover:border-neutral-100 hover:shadow-sm ${variants[variant]}`}
    >
      {icon}
      <span className="text-[9px] font-bold uppercase tracking-widest hidden lg:block">
        {label}
      </span>
    </Link>
  );
}
