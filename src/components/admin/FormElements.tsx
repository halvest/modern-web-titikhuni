// src/components/admin/FormElements.tsx
import type { InputHTMLAttributes, ReactNode } from "react";

export const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[10px] uppercase tracking-[0.3em] text-foreground-soft font-bold mb-2 block">
    {children}
  </label>
);

export const InputField = ({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <div className="mb-8">
    <Label>{label}</Label>
    <input
      {...props}
      className="w-full bg-transparent border-b border-border py-3 outline-none focus:border-black transition-all text-sm font-medium placeholder:text-neutral-300"
    />
  </div>
);

export const SectionTitle = ({ icon, title }: { icon: ReactNode; title: string }) => (
  <div className="flex items-center gap-3 mb-8 pt-4">
    <div className="p-2 bg-neutral-50 rounded-lg text-foreground-soft">{icon}</div>
    <h3 className="text-xs uppercase tracking-widest font-black">{title}</h3>
  </div>
);
