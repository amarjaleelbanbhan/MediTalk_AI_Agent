// Animation configuration and constants
export const BUBBLE_COLORS = {
  raw: "#3B82F6",        // Blue
  cleaning: "#10B981",   // Green
  eda: "#8B5CF6",        // Purple
  feature: "#F59E0B",    // Amber
  model: "#EF4444",      // Red
  prediction: "#EC4899", // Pink
};

export const BUBBLE_SIZES = {
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
};

export const ANIMATION_TIMING = {
  fast: 0.3,
  normal: 0.5,
  slow: 0.8,
  verySlow: 1.2,
};

export const PHYSICS_CONFIG = {
  gravity: 0.1,
  friction: 0.95,
  bounce: 0.6,
  maxVelocity: 5,
  damping: 0.98,
};

export const PIPELINE_STAGES = [
  { id: "raw", label: "Raw Data", color: BUBBLE_COLORS.raw, icon: "📊" },
  { id: "cleaning", label: "Cleaning", color: BUBBLE_COLORS.cleaning, icon: "🧹" },
  { id: "eda", label: "EDA", color: BUBBLE_COLORS.eda, icon: "🔍" },
  { id: "feature", label: "Features", color: BUBBLE_COLORS.feature, icon: "⚙️" },
  { id: "model", label: "Modeling", color: BUBBLE_COLORS.model, icon: "🤖" },
  { id: "prediction", label: "Prediction", color: BUBBLE_COLORS.prediction, icon: "✨" },
];

export const FRAMER_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  },
  bubble: {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  },
  float: {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
  glow: {
    animate: {
      boxShadow: [
        "0 0 20px rgba(59, 130, 246, 0.5)",
        "0 0 40px rgba(59, 130, 246, 0.8)",
        "0 0 20px rgba(59, 130, 246, 0.5)",
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
};

// Bubble physics simulation
export interface Bubble {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  stage: string;
  confidence?: number;
  isDirty?: boolean;
}

// D3 chart configuration
export const D3_CONFIG = {
  margin: { top: 20, right: 20, bottom: 20, left: 20 },
  animationDuration: 800,
  colors: [
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#F59E0B",
    "#10B981",
    "#EF4444",
  ],
};

// Random Forest animation config
export const FOREST_CONFIG = {
  treeCount: 5,
  maxDepth: 4,
  nodeSize: 20,
  animationDelay: 0.1,
  decisionAnimationDuration: 1.5,
};
