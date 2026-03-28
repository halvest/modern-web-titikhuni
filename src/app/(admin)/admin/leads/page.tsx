import { createClient } from "@/utils/supabase/server";
import { LeadsList } from "./LeadsList";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const supabase = await createClient();

  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-10 text-xs uppercase tracking-widest text-stone-400">
        Database Connection Error.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFCFB] text-stone-900 font-sans">
      <header className="border-b border-stone-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-medium uppercase tracking-[0.5em] text-emerald-600">
              Titik Huni CRM
            </span>
            <h1 className="text-xl font-medium tracking-tight uppercase">
              Manajemen Leads
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <LeadsList initialLeads={leads || []} />
      </main>
    </div>
  );
}
