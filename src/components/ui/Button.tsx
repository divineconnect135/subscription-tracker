import type { ComponentProps } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
};

const baseClasses = [
  "inline-flex min-h-11 items-center justify-center",
  "gap-2 rounded-lg px-4 py-2.5",
  "text-sm font-semibold",
  "transition-colors",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-2",
  "focus-visible:outline-blue-700",
  "disabled:pointer-events-none",
  "disabled:opacity-60",
].join(" ");

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-slate-900 text-white hover:bg-slate-800",

  secondary:
    "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100",

  danger: "bg-red-700 text-white hover:bg-red-800",

  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  className = "",
): string {
  return [baseClasses, variantClasses[variant], className]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  variant = "primary",
  className = "",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={buttonClasses(variant, className)}
    >
      {children}
    </button>
  );
}
