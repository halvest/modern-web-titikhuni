import React, { useId, type ReactNode } from "react";

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className" | "prefix"> {
  label: string;
  helper?: string;
  error?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  containerClassName?: string;
}

export function FormInput({
  label,
  helper,
  error,
  prefix,
  suffix,
  containerClassName = "",
  id,
  required,
  ...props
}: FormInputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const descriptionId = `${inputId}-description`;

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
        {label}{required && <span className="ml-1 text-rose-500" aria-hidden="true">*</span>}
      </label>
      <div className="relative">
        {prefix && <span className={`pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-500`}>{prefix}</span>}
        <input
          {...props}
          id={inputId}
          required={required}
          aria-invalid={!!error}
          aria-describedby={helper || error ? descriptionId : undefined}
          className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:ring-2 ${
            error
              ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
              : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
          } ${prefix ? (typeof prefix === "string" && prefix.length > 3 ? "pl-16" : "pl-10") : ""} ${suffix ? "pr-12" : ""}`}
        />
        {suffix && <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-slate-500">{suffix}</span>}
      </div>
      {(error || helper) && (
        <p id={descriptionId} className={`text-xs ${error ? "text-rose-600" : "text-slate-500"}`}>
          {error || helper}
        </p>
      )}
    </div>
  );
}

interface FormTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {
  label: string;
  helper?: string;
  error?: string;
  containerClassName?: string;
}

export function FormTextarea({
  label,
  helper,
  error,
  containerClassName = "",
  id,
  required,
  ...props
}: FormTextareaProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const descriptionId = `${inputId}-description`;

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
        {label}{required && <span className="ml-1 text-rose-500" aria-hidden="true">*</span>}
      </label>
      <textarea
        {...props}
        id={inputId}
        required={required}
        aria-invalid={!!error}
        aria-describedby={helper || error ? descriptionId : undefined}
        className={`w-full resize-y rounded-lg border bg-white px-3 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:ring-2 ${
          error
            ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
            : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
        }`}
      />
      {(error || helper) && (
        <p id={descriptionId} className={`text-xs ${error ? "text-rose-600" : "text-slate-500"}`}>
          {error || helper}
        </p>
      )}
    </div>
  );
}

interface FormSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "className"> {
  label: string;
  helper?: string;
  error?: string;
  children: ReactNode;
  containerClassName?: string;
}

export function FormSelect({
  label,
  helper,
  error,
  children,
  containerClassName = "",
  id,
  required,
  ...props
}: FormSelectProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const descriptionId = `${inputId}-description`;

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
        {label}{required && <span className="ml-1 text-rose-500" aria-hidden="true">*</span>}
      </label>
      <select
        {...props}
        id={inputId}
        required={required}
        aria-invalid={!!error}
        aria-describedby={helper || error ? descriptionId : undefined}
        className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:ring-2 ${
          error
            ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
            : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
        }`}
      >
        {children}
      </select>
      {(error || helper) && (
        <p id={descriptionId} className={`text-xs ${error ? "text-rose-600" : "text-slate-500"}`}>
          {error || helper}
        </p>
      )}
    </div>
  );
}
