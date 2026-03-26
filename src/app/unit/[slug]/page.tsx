import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { MapPin, CheckCircle } from "lucide-react";
import { formatRupiah } from "@/lib/formatRupiah";

export default async function UnitDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data: unit } = await supabase
    .from("units")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!unit)
    return <div className="py-32 text-center">Unit tidak ditemukan.</div>;

  return (
    <main className="pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gambar */}
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-neutral-100">
            <Image
              src={unit.image_url}
              alt={unit.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 text-neutral-400 mb-4">
              <MapPin size={16} />
              <span className="text-sm uppercase tracking-widest">
                {unit.location}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {unit.title}
            </h1>
            <p className="text-2xl text-amber-600 font-bold mb-8">
              {formatRupiah(unit.price)}
            </p>

            <div className="prose prose-neutral max-w-none mb-10">
              <p>
                {unit.description || "Deskripsi unit akan segera diperbarui."}
              </p>
            </div>

            <a
              href={`https://wa.me/628123456789?text=Halo Titik Huni, saya tertarik dengan unit ${unit.title}`}
              className="bg-black text-white text-center py-4 rounded-xl font-bold hover:bg-neutral-800 transition"
            >
              Hubungi Marketing
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
