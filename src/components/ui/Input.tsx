import type { ComponentProps } from "react";

type InputProps = ComponentProps<"input"> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
};

export function Input({
  id,
  label,
  hint,
  error,
  className = "",
  required,
  ...props
}: InputProps) {
  const describedBy = [
    props["aria-describedby"],
    hint ? `${id}-hint` : undefined,
    error ? `${id}-error` : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-slate-800"
      >
        {label}

        {required && (
          <span aria-hidden="true" className="ml-1 text-red-700">
            *
          </span>
        )}
      </label>

      <input
        {...props}
        id={id}
        required={required}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : props["aria-invalid"]}
        className={[
          "block min-h-11 w-full rounded-lg",
          "border border-slate-300 bg-white",
          "px-3.5 py-2.5 text-sm text-slate-900",
          "placeholder:text-slate-500",
          "focus-visible:border-blue-700",
          "disabled:bg-slate-100",
          "disabled:text-slate-500",
          error ? "border-red-700" : "border-slate-300",
          className,
        ].join(" ")}
      />

      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-600">
          {hint}
        </p>
      )}

      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
