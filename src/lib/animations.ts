// Animation utilities and configuration
export const animationClasses = {
  // Entrance animations
  fadeIn: "animate-fade-in",
  slideInLeft: "animate-slide-in-left",
  slideInRight: "animate-slide-in-right",
  slideInUp: "animate-slide-in-up",
  slideInDown: "animate-slide-in-down",
  bounceIn: "animate-bounce-in",
  zoomIn: "animate-zoom-in",
  
  // Continuous animations
  pulse: "animate-pulse",
  bounce: "animate-bounce",
  spin: "animate-spin",
  ping: "animate-ping",
  
  // Emphasis animations
  shake: "animate-shake",
  wiggle: "animate-wiggle",
  float: "animate-float",
  
  // Exit animations
  fadeOut: "animate-fade-out",
  slideOutLeft: "animate-slide-out-left",
  slideOutRight: "animate-slide-out-right",
  slideOutUp: "animate-slide-out-up",
  slideOutDown: "animate-slide-out-down",
};

export const animationDelays = {
  none: "delay-0",
  xs: "delay-100",
  sm: "delay-200",
  md: "delay-300",
  lg: "delay-500",
  xl: "delay-700",
  "2xl": "delay-1000",
};

export const animationDurations = {
  fast: "duration-300",
  normal: "duration-500",
  slow: "duration-700",
  slower: "duration-1000",
  slowest: "duration-1500",
};

// SVG animation utilities
export const svgAnimations = {
  pathDraw: `
    @keyframes pathDraw {
      0% {
        stroke-dashoffset: 1000;
      }
      100% {
        stroke-dashoffset: 0;
      }
    }
  `,
  
  flowingArrow: `
    @keyframes flowingArrow {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(10px);
      }
    }
  `,
  
  pulseGlow: `
    @keyframes pulseGlow {
      0%, 100% {
        opacity: 1;
        filter: drop-shadow(0 0 0 rgba(59, 130, 246, 0));
      }
      50% {
        opacity: 0.7;
        filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.6));
      }
    }
  `,
};

// Stagger animation helper
export const getStaggerDelay = (index: number, baseDelay: number = 100): string => {
  return `${index * baseDelay}ms`;
};

// Animation trigger helper - returns classes for intersection observer
export const getAnimationClasses = (
  isVisible: boolean,
  animationClass: string,
  duration: string = "duration-500"
): string => {
  return isVisible ? `${animationClass} ${duration}` : "opacity-0";
};

// Scroll animation trigger helper
export const useScrollAnimation = (threshold: number = 0.1) => {
  return {
    threshold,
    rootMargin: "0px 0px -100px 0px",
  };
};
