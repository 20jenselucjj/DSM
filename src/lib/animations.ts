// Animation utilities for consistent motion design across AT Portal
// Provides standardized animation classes and timing functions

export const animations = {
  // Entrance animations
  fadeIn: "motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500",
  slideInFromBottom: "motion-safe:animate-in motion-safe:slide-in-from-bottom-4 motion-safe:fade-in motion-safe:duration-500",
  slideInFromTop: "motion-safe:animate-in motion-safe:slide-in-from-top-4 motion-safe:fade-in motion-safe:duration-500",
  slideInFromLeft: "motion-safe:animate-in motion-safe:slide-in-from-left-4 motion-safe:fade-in motion-safe:duration-500",
  slideInFromRight: "motion-safe:animate-in motion-safe:slide-in-from-right-4 motion-safe:fade-in motion-safe:duration-500",
  slideInUp: "motion-safe:animate-in motion-safe:slide-in-from-bottom-4 motion-safe:fade-in motion-safe:duration-500",
  
  // Hover and interaction animations
  hoverLift: "transition-all motion-safe:duration-300 hover:-translate-y-2",
  hoverScale: "transition-transform motion-safe:duration-200 hover:scale-105",
  hoverGlow: "transition-all motion-safe:duration-300 hover:shadow-xl hover:shadow-primary/20",
  
  // Loading and state animations
  pulse: "animate-pulse",
  spin: "animate-spin",
  bounce: "animate-bounce",
  
  // Staggered animations for lists
  staggerDelay: (index: number) => ({ animationDelay: `${index * 100}ms` }),
  
  // Focus animations for accessibility
  focusRing: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
  
  // Card animations
  cardHover: "group transition-all motion-safe:duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-xl hover:shadow-primary/20",
  
  // Button animations
  buttonPress: "transition-all motion-safe:duration-150 active:scale-95",
  
  // Form animations
  inputFocus: "transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20",
} as const;

// Animation timing functions
export const timing = {
  fast: "150ms",
  normal: "300ms",
  slow: "500ms",
  slower: "700ms",
} as const;

// Easing functions
export const easing = {
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
} as const;

// Helper function to combine animation classes
export const combineAnimations = (...classes: string[]) => classes.join(" ");

// Staggered animation helper for lists
export const getStaggeredAnimation = (index: number, baseAnimation: string = animations.slideInFromBottom) => ({
  className: baseAnimation,
  style: animations.staggerDelay(index),
});