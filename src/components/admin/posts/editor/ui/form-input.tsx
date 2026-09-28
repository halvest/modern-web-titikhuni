import React, { useId } from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FormInput({ label, className = "", ...props }: FormInputProps) {
  const generatedId = useId();
  const id = props.id || generatedId;
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-[11px] uppercase font-bold text-slate-600 tracking-widest block">
        {label}
      </label>
      <input
        id={id}
        className={`w-full p-4 bg-slate-50 rounded-xl outline-none border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all text-sm font-bold text-slate-900 ${className}`}
        {...props}
      />
    </div>
  );
}

export function FormTextarea({ label, className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const generatedId = useId();
  const id = props.id || generatedId;
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-[11px] uppercase font-bold text-slate-600 tracking-widest block">
        {label}
      </label>
      <textarea
        id={id}
        className={`w-full p-4 bg-slate-50 rounded-xl outline-none border border-slate-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all text-sm leading-relaxed text-slate-900 ${className}`}
        {...props}
      />
    </div>
  );
}
