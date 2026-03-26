// src/app/(admin)/layout.tsx
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-neutral-50 overflow-hidden">
      {/* Sidebar tetap di kiri dengan lebar statis */}
      <AdminSidebar />

      {/* Area Konten Utama */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-neutral-50">
        {/* Hilangkan Navbar publik dari sini! Admin tidak butuh Navbar landing page */}
        <div className="p-4 md:p-10">{children}</div>
      </main>
    </div>
  );
}
