import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 transform hover:scale-[1.02]",
    secondary: "bg-secondary-200 text-secondary-800 hover:bg-secondary-300 focus:ring-secondary-500",
    accent: "bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500 transform hover:scale-[1.02]",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
    ghost: "text-secondary-600 hover:bg-secondary-100 focus:ring-secondary-500",
    success: "bg-success-500 text-white hover:bg-success-600 focus:ring-success-500 transform hover:scale-[1.02]",
    error: "bg-error-500 text-white hover:bg-error-600 focus:ring-error-500",
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && "transform-none hover:scale-100",
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;