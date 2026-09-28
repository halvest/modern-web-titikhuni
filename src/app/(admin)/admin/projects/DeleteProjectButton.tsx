"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { deleteProject } from "./actions";

export function DeleteProjectButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm('Hapus proyek "' + title + '" secara permanen?')) {
          return;
        }
        startTransition(async () => {
          const result = await deleteProject(id);
          if (result.error) {
            toast.error(result.error);
            return;
          }
          toast.success(result.warning || "Proyek berhasil dihapus.");
          router.refresh();
        });
      }}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
      aria-label={"Hapus proyek " + title}
    >
      {pending ? (
        <Loader2 size={15} className="animate-spin" aria-hidden="true" />
      ) : (
        <Trash2 size={15} aria-hidden="true" />
      )}
    </button>
  );
}
