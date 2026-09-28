export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-[1400px] animate-pulse space-y-6" aria-label="Memuat halaman admin" aria-busy="true">
      <div className="space-y-2">
        <div className="h-7 w-44 rounded bg-slate-200" />
        <div className="h-4 w-80 max-w-full rounded bg-slate-100" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => <div key={item} className="h-24 rounded-xl border border-slate-200 bg-white" />)}
      </div>
      <div className="h-80 rounded-xl border border-slate-200 bg-white" />
    </div>
  );
}
