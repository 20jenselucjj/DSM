import { forwardRef } from "react";
import { animations } from "@/lib/animations";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "accent" | "muted";
  className?: string;
  text?: string;
}

const LoadingSpinner = forwardRef<HTMLDivElement, LoadingSpinnerProps>(({
  size = "md",
  variant = "primary",
  className = "",
  text,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
    xl: "h-12 w-12 border-4",
  };

  const variantClasses = {
    primary: "border-primary border-t-transparent",
    secondary: "border-secondary border-t-transparent", 
    accent: "border-accent border-t-transparent",
    muted: "border-muted-foreground border-t-transparent",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  return (
    <div 
      ref={ref}
      className={`flex flex-col items-center justify-center gap-3 ${animations.fadeIn} ${className}`}
      role="status"
      aria-label={text || "Loading"}
      {...props}
    >
      <div 
        className={`animate-spin rounded-full ${sizeClasses[size]} ${variantClasses[variant]}`}
        aria-hidden="true"
      />
      {text && (
        <span className={`${textSizeClasses[size]} text-muted-foreground font-medium`}>
          {text}
        </span>
      )}
      <span className="sr-only">{text || "Loading content, please wait..."}</span>
    </div>
  );
});

LoadingSpinner.displayName = "LoadingSpinner";

export default LoadingSpinner;