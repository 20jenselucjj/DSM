import { ReactNode, forwardRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { animations, combineAnimations } from "@/lib/animations";
import { LucideIcon } from "lucide-react";

interface PortalCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
  variant?: "default" | "primary" | "secondary" | "accent";
  size?: "sm" | "md" | "lg";
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
  animationDelay?: number;
}

const PortalCard = forwardRef<HTMLDivElement, PortalCardProps>(({
  title,
  description,
  icon: Icon,
  children,
  variant = "default",
  size = "md",
  hoverable = true,
  clickable = false,
  onClick,
  className = "",
  animationDelay = 0,
  ...props
}, ref) => {
  const variantClasses = {
    default: "border-border bg-card",
    primary: "border-primary/20 bg-primary/5",
    secondary: "border-secondary/20 bg-secondary/5", 
    accent: "border-accent/20 bg-accent/5"
  };

  const sizeClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };

  const iconVariantClasses = {
    default: "bg-muted-foreground border-muted-foreground",
    primary: "bg-primary border-primary",
    secondary: "bg-secondary border-secondary",
    accent: "bg-accent border-accent"
  };

  const cardClasses = combineAnimations(
    variantClasses[variant],
    hoverable ? animations.cardHover : "",
    clickable ? "cursor-pointer" : "",
    animations.focusRing,
    className
  );

  const animationStyle = animationDelay > 0 ? { animationDelay: `${animationDelay}ms` } : {};

  return (
    <Card
      ref={ref}
      className={cardClasses}
      onClick={clickable ? onClick : undefined}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? "button" : undefined}
      style={animationStyle}
      {...props}
    >
      <CardHeader className={`${sizeClasses[size]} pb-4`}>
        <div className="flex items-center gap-4">
          {Icon && (
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg border-2 text-white font-semibold transition-all group-hover:scale-110 ${iconVariantClasses[variant]}`}>
              <Icon className="h-6 w-6 transition-transform group-hover:scale-110" />
            </div>
          )}
          <div className="flex-1">
            <CardTitle className="text-base sm:text-lg tracking-wide text-foreground font-semibold group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="mt-1 text-[13px] sm:text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">
                {description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className={`${sizeClasses[size]} pt-0`}>
        {children}
      </CardContent>
    </Card>
  );
});

PortalCard.displayName = "PortalCard";

export default PortalCard;