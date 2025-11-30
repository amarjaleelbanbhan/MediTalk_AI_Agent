// Performance configuration for animations
export const PERFORMANCE_CONFIG = {
  // Reduce motion for better performance
  reducedMotion: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },

  // Fast transitions
  fast: {
    duration: 0.2,
    ease: "easeOut",
  },

  // Standard transitions
  standard: {
    duration: 0.4,
    ease: "easeInOut",
  },

  // Disable animations on low-end devices
  shouldReduceMotion: () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  },
};

// Optimized variants for common animations
export const optimizedVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  
  slideUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },

  stagger: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
};
