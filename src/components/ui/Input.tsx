import type { ComponentProps } from "react";

type InputProps = ComponentProps<"input"> & {
  id: string;
  label: string;
};

export function Input({ id, label, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        {...props}
        id={id}
        className={[
          "w-full rounded-lg border border-slate-300",
          "bg-white px-3.5 py-2.5 text-sm",
          "placeholder:text-slate-400",
          "focus:border-brand-600 focus:outline-2",
          "focus:outline-brand-600/20",
          "disabled:cursor-not-allowed disabled:bg-slate-100",
          className,
        ].join(" ")}
      />
    </div>
  );
}
