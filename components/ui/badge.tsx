import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold capitalize transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "text-foreground",
        critical: "border-red-300 bg-red-100 text-red-950 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
        high: "border-amber-300 bg-amber-100 text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200",
        medium: "border-sky-300 bg-sky-100 text-sky-950 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200",
        low: "border-emerald-300 bg-emerald-100 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
        success: "border-emerald-300 bg-emerald-100 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
        warning: "border-amber-300 bg-amber-100 text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200",
        info: "border-cyan-300 bg-cyan-100 text-cyan-950 dark:border-cyan-900 dark:bg-cyan-950 dark:text-cyan-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
