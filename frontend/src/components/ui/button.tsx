import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-medium transition-all duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:opacity-95 hover:shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground hover:opacity-90 shadow-xs",
        outline:
          "border border-border bg-card text-foreground hover:bg-secondary hover:border-border",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "text-muted-foreground hover:bg-secondary hover:text-foreground",
        link:
          "text-primary underline-offset-4 hover:underline",
        apple:
          "bg-secondary text-foreground hover:bg-secondary/80 border border-border/80 shadow-2xs font-semibold",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-[11px]",
        lg: "h-11 rounded-xl px-6 text-sm",
        icon: "h-8 w-8 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
