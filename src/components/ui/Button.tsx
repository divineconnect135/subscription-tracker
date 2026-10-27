import type { ComponentProps } from "react";

const variants = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary:
    "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
  ghost: "text-slate-700 hover:bg-slate-100",
};

type ButtonVariant = keyof typeof variants;

export function buttonClasses(variant: ButtonVariant = "primary") {
  return [
    "inline-flex items-center justify-center gap-2",
    "rounded-lg px-4 py-2.5 text-sm font-semibold",
    "transition-colors focus-visible:outline-2",
    "focus-visible:outline-offset-2",
    "focus-visible:outline-brand-600",
    "disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
  ].join(" ");
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
};

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`${buttonClasses(variant)} ${className}`}
    />
  );
}
