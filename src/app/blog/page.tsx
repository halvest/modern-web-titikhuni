// src/app/blog/page.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, User, Tag } from "lucide-react";

// 1. SEO Metadata (Penting untuk SEO Next.js)
export const metadata = {
  title: "Inspirasi Hunian & Investasi Properti | Titik Huni",
  description:
    "Temukan tips desain interior modern tropis, panduan membeli rumah di Bantul, dan tren investasi properti terbaru di Yogyakarta.",
  keywords: [
    "Rumah Bantul",
    "Investasi Properti Jogja",
    "Desain Rumah Tropis",
    "Titik Huni",
  ],
};

const POSTS = [
  {
    id: 1,
    title: "Mengapa Bangunjiwo Menjadi Primadona Properti di Bantul",
    excerpt:
      "Analisis mendalam mengenai pertumbuhan nilai investasi dan daya tarik lingkungan asri di kawasan Bangunjiwo, Yogyakarta.",
    date: "2024-03-15",
    author: "Tim Titik Huni",
    category: "Investasi",
    image: "/assets/images/blog/bangunjiwo-investasi.jpg", // Pastikan path gambar tersedia
    slug: "investasi-properti-bangunjiwo",
  },
  {
    id: 2,
    title: "5 Tips Desain Rumah Modern Tropis untuk Lahan Terbatas",
    excerpt:
      "Cara memaksimalkan sirkulasi udara dan cahaya alami pada bangunan dengan luas tanah di bawah 120m².",
    date: "2024-03-10",
    author: "Arsitek Kami",
    category: "Desain",
    image: "/assets/images/blog/desain-tropis.jpg",
    slug: "tips-desain-modern-tropis",
  },
  {
    id: 3,
    title: "Panduan Lengkap Akad Kredit Rumah di Yogyakarta",
    excerpt:
      "Langkah-langkah praktis dan berkas yang perlu disiapkan saat ingin mengambil hunian melalui skema KPR.",
    date: "2024-03-05",
    author: "Legal Team",
    category: "Edukasi",
    image: "/assets/images/blog/panduan-kpr.jpg",
    slug: "panduan-akad-kredit-rumah",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="pt-32 pb-16 px-6 md:px-12 lg:px-24 border-b border-neutral-100">
        <div className="max-w-4xl">
          <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-6">
            Journal & Insights
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-8">
            Catatan <br />
            <span className="text-neutral-300">Ruang & Hidup.</span>
          </h1>
          <p className="text-neutral-500 max-w-xl text-lg leading-relaxed">
            Berbagi cerita seputar hunian, arsitektur, dan cara kami
            mendefinisikan ketenangan di tengah alam Yogyakarta.
          </p>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="px-6 md:px-12 lg:px-24 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {POSTS.map((post) => (
            <article key={post.id} className="group cursor-pointer">
              <Link href={`/blog/${post.slug}`} className="block">
                {/* Image Wrapper */}
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100 mb-6">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 text-[9px] uppercase font-bold tracking-widest rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-neutral-400 text-[10px] uppercase tracking-widest font-medium">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString("id-ID", {
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      <span>{post.author}</span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight group-hover:text-neutral-500 transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-neutral-500 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-2 pt-2 text-black font-bold text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all">
                    Baca Selengkapnya <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter / CTA (Optional) */}
      <section className="bg-neutral-50 px-6 py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold tracking-tight mb-4">
            Dapatkan Update Unit Terbaru
          </h3>
          <p className="text-neutral-500 mb-8">
            Jadilah yang pertama tahu saat kami merilis unit hunian baru di
            lokasi strategis lainnya.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              placeholder="Alamat Email Anda"
              className="px-6 py-4 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black transition-all w-full sm:w-80"
            />
            <button className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-neutral-800 transition-all">
              Berlangganan
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
