"use client";

import { Trash2, Loader2 } from "lucide-react";
import { deleteUnit } from "./actions";
import { useState } from "react";
import { toast } from "react-hot-toast";

export function DeleteButton({ id }: { id: string }) {
  const [isPending, setIsPending] = useState(false);

  const handleAction = async () => {
    const confirmed = window.confirm("Hapus unit ini dari katalog?");
    if (!confirmed) return;

    setIsPending(true);
    try {
      const result = await deleteUnit(id);
      if (result?.error) throw new Error(result.error);
      toast.success("Unit berhasil dihapus");
    } catch (error) {
      toast.error("Gagal menghapus unit");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleAction}
      disabled={isPending}
      className="flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300 border border-transparent disabled:opacity-50"
    >
      {isPending ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Trash2 size={14} />
      )}
      <span className="text-[9px] font-bold uppercase tracking-widest hidden lg:block">
        {isPending ? "Proses..." : "Hapus"}
      </span>
    </button>
  );
}
