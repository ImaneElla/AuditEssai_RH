import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-medium tracking-tight transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "border border-zinc-200/80 bg-zinc-100 text-zinc-800",
        secondary:
          "border border-zinc-200/70 bg-zinc-100/60 text-zinc-700",
        destructive:
          "border border-rose-200/80 bg-rose-50/70 text-rose-800",
        outline:
          "text-zinc-700 border border-zinc-200/80 bg-transparent",
        appleBlue:
          "border border-zinc-200/80 bg-zinc-100/60 text-zinc-700 font-medium",
        appleGreen:
          "border border-emerald-200/70 bg-emerald-50/60 text-emerald-800 font-medium",
        appleOrange:
          "border border-amber-200/70 bg-amber-50/60 text-amber-800 font-medium",
        appleRed:
          "border border-rose-200/70 bg-rose-50/60 text-rose-800 font-medium",
        applePurple:
          "border border-zinc-200/80 bg-zinc-100/60 text-zinc-700 font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
