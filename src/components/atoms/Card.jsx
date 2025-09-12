import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className,
  variant = "default",
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white border border-secondary-200 shadow-sm",
    elevated: "bg-white shadow-lg border border-secondary-200",
    gradient: "bg-gradient-to-br from-white to-secondary-50 border border-secondary-200 shadow-md",
    success: "bg-gradient-to-br from-success-50 to-success-100 border border-success-200",
    warning: "bg-gradient-to-br from-warning-50 to-warning-100 border border-warning-200",
    accent: "bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl p-6 transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;