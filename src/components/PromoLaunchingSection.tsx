'use client';

import { motion } from 'framer-motion';
import { DollarSign, MapPin, ShieldCheck } from 'lucide-react';
import { ReactNode } from 'react';

// Card Komponen untuk Keuntungan
const BenefitCard = ({
  icon,
  title,
  children,
  delay,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7, delay }}
    className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100"
  >
    <div className="bg-yellow-100 text-yellow-500 w-14 h-14 rounded-full flex items-center justify-center mb-5">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-slate-800 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{children}</p>
  </motion.div>
);

export const PromoLaunchingSection = () => {
  return (
    <section id="benefits" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        {/* Judul Seksi */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
            Investasi Cerdas dengan Keuntungan Maksimal
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Villa Lodji Svarga 2 dirancang untuk memberikan Anda keuntungan pasif yang stabil dengan risiko minimal.
          </p>
        </motion.div>

        {/* Grid untuk Kartu Keuntungan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <BenefitCard
            icon={<DollarSign className="w-8 h-8" />}
            title="Passive Income Terjamin"
            delay={0.2}
          >
            Dapatkan potensi penghasilan pasif hingga <b>Rp6 Juta per bulan</b>. Investasi Anda dijamin kembali modal dalam 5 tahun, tertulis resmi di depan notaris.
          </BenefitCard>

          <BenefitCard
            icon={<MapPin className="w-8 h-8" />}
            title="Lokasi Super Strategis"
            delay={0.4}
          >
            Berada di pusat keramaian Yogyakarta, dekat dengan kampus ternama seperti UPN dan pusat perbelanjaan. Nilai sewa dan properti yang terus meningkat.
          </BenefitCard>

          <BenefitCard
            icon={<ShieldCheck className="w-8 h-8" />}
            title="Manajemen Profesional"
            delay={0.6}
          >
            Villa Anda dikelola sepenuhnya oleh tim profesional kami. Anda tidak perlu khawatir tentang operasional, perawatan, atau mencari penyewa. Cukup terima hasilnya.
          </BenefitCard>
        </div>
      </div>
    </section>
  );
};