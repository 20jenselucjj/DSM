import { forwardRef, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { animations, combineAnimations } from "@/lib/animations";
import { LucideIcon, ArrowRight } from "lucide-react";

interface PortalButtonProps {
  children: ReactNode;
  variant?: "default" | "primary" | "secondary" | "accent" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  showArrow?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
}

const PortalButton = forwardRef<HTMLButtonElement, PortalButtonProps>(({
  children,
  variant = "default",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  showArrow = false,
  loading = false,
  disabled = false,
  onClick,
  className = "",
  type = "button",
  ariaLabel,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base"
  };

  const variantClasses = {
    default: "bg-background text-foreground border-2 border-background hover:bg-primary hover:text-primary-foreground hover:border-primary",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90", 
    accent: "bg-accent text-accent-foreground hover:bg-accent/90",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground",
    ghost: "text-primary hover:bg-primary/10"
  };

  const buttonClasses = combineAnimations(
    variantClasses[variant],
    sizeClasses[size],
    animations.buttonPress,
    animations.focusRing,
    "rounded-full tracking-widest font-semibold transition-all motion-safe:duration-300",
    loading ? "opacity-50 cursor-not-allowed" : "",
    className
  );

  const renderIcon = (position: "left" | "right") => {
    if (position === "left" && Icon && iconPosition === "left") {
      return <Icon className="h-4 w-4 mr-2" />;
    }
    if (position === "right" && Icon && iconPosition === "right") {
      return <Icon className="h-4 w-4 ml-2" />;
    }
    if (position === "right" && showArrow) {
      return <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />;
    }
    return null;
  };

  return (
    <Button
      ref={ref}
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      {...props}
    >
      <div className="flex items-center justify-center group">
        {renderIcon("left")}
        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
            Loading...
          </div>
        ) : (
          children
        )}
        {renderIcon("right")}
      </div>
    </Button>
  );
});

PortalButton.displayName = "PortalButton";

export default PortalButton;