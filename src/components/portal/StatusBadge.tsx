import { forwardRef } from "react";
import { Badge } from "@/components/ui/badge";
import { animations } from "@/lib/animations";
import { LucideIcon, CheckCircle, AlertCircle, Clock, XCircle, Info } from "lucide-react";

interface StatusBadgeProps {
  status: "success" | "warning" | "error" | "pending" | "info" | "neutral";
  children: React.ReactNode;
  icon?: LucideIcon;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline";
  className?: string;
}

const StatusBadge = forwardRef<HTMLDivElement, StatusBadgeProps>(({
  status,
  children,
  icon: CustomIcon,
  showIcon = true,
  size = "md",
  variant = "default",
  className = "",
  ...props
}, ref) => {
  const statusConfig = {
    success: {
      icon: CheckCircle,
      classes: variant === "outline" 
        ? "border-green-500 text-green-700 bg-green-50" 
        : "bg-green-500 text-white",
    },
    warning: {
      icon: AlertCircle,
      classes: variant === "outline"
        ? "border-yellow-500 text-yellow-700 bg-yellow-50"
        : "bg-yellow-500 text-white",
    },
    error: {
      icon: XCircle,
      classes: variant === "outline"
        ? "border-red-500 text-red-700 bg-red-50"
        : "bg-red-500 text-white",
    },
    pending: {
      icon: Clock,
      classes: variant === "outline"
        ? "border-blue-500 text-blue-700 bg-blue-50"
        : "bg-blue-500 text-white",
    },
    info: {
      icon: Info,
      classes: variant === "outline"
        ? "border-primary text-primary bg-primary/10"
        : "bg-primary text-primary-foreground",
    },
    neutral: {
      icon: Info,
      classes: variant === "outline"
        ? "border-muted-foreground text-muted-foreground bg-muted"
        : "bg-muted text-muted-foreground",
    },
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5",
  };

  const config = statusConfig[status];
  const Icon = CustomIcon || config.icon;

  return (
    <div ref={ref} {...props}>
      <Badge
        className={`${config.classes} ${sizeClasses[size]} ${animations.fadeIn} inline-flex items-center gap-1.5 font-medium ${className}`}
      >
        {showIcon && Icon && (
          <Icon className={`${iconSizes[size]} ${status === 'pending' ? 'animate-spin' : ''}`} />
        )}
        {children}
      </Badge>
    </div>
  );
});

StatusBadge.displayName = "StatusBadge";

export default StatusBadge;