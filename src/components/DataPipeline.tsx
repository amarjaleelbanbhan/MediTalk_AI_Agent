import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PIPELINE_STAGES, BUBBLE_COLORS } from "@/lib/animationConfig";

interface PipelineStage {
  id: string;
  label: string;
  color: string;
  icon: string;
}

interface DataPipelineProps {
  stages?: PipelineStage[];
  bubbleCount?: number;
  animationSpeed?: number;
}

interface AnimatedBubble {
  id: string;
  stageIndex: number;
  progress: number;
  color: string;
}

export const DataPipeline: React.FC<DataPipelineProps> = ({
  stages = PIPELINE_STAGES,
  bubbleCount = 20,
  animationSpeed = 2,
}) => {
  const [bubbles, setBubbles] = useState<AnimatedBubble[]>([]);

  // Initialize bubbles
  useEffect(() => {
    const initialBubbles: AnimatedBubble[] = Array.from(
      { length: bubbleCount },
      (_, i) => ({
        id: `bubble-${i}`,
        stageIndex: 0,
        progress: (i / bubbleCount) * 100,
        color: Object.values(BUBBLE_COLORS)[i % Object.values(BUBBLE_COLORS).length],
      })
    );
    setBubbles(initialBubbles);
  }, [bubbleCount]);

  // Animate bubbles through pipeline
  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles((prev) =>
        prev.map((bubble) => {
          let newProgress = bubble.progress + animationSpeed;
          let newStageIndex = bubble.stageIndex;

          if (newProgress >= 100) {
            newProgress = 0;
            newStageIndex = (bubble.stageIndex + 1) % stages.length;
          }

          return {
            ...bubble,
            progress: newProgress,
            stageIndex: newStageIndex,
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [stages.length, animationSpeed]);

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-8 rounded-lg border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">Data Pipeline</h3>

      {/* Pipeline stages */}
      <div className="flex justify-between items-center mb-12 relative">
        {stages.map((stage, index) => (
          <motion.div
            key={stage.id}
            className="flex flex-col items-center z-10"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg mb-2"
              style={{ backgroundColor: stage.color }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {stage.icon}
            </motion.div>
            <span className="text-sm font-semibold text-gray-700 text-center">
              {stage.label}
            </span>
          </motion.div>
        ))}

        {/* Connection lines */}
        <svg
          className="absolute top-8 left-0 right-0 w-full h-2 pointer-events-none"
          style={{ height: "4px" }}
        >
          {stages.map((_, index) => {
            if (index === stages.length - 1) return null;
            const stageWidth = 100 / (stages.length - 1);
            const x1 = (stageWidth * index + stageWidth / 2) + "%";
            const x2 = (stageWidth * (index + 1) + stageWidth / 2) + "%";
            return (
              <line
                key={`line-${index}`}
                x1={x1}
                y1="50%"
                x2={x2}
                y2="50%"
                stroke="#E5E7EB"
                strokeWidth="2"
              />
            );
          })}
        </svg>
      </div>

      {/* Animated bubbles flowing through pipeline */}
      <div className="relative h-32 bg-white bg-opacity-50 rounded-lg overflow-hidden border border-gray-200">
        {bubbles.map((bubble) => {
          const stageWidth = 100 / stages.length;
          const bubbleX = bubble.stageIndex * stageWidth + (bubble.progress / 100) * stageWidth;

          return (
            <motion.div
              key={bubble.id}
              className="absolute w-6 h-6 rounded-full shadow-lg"
              style={{
                backgroundColor: bubble.color,
                left: `${bubbleX}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
              animate={{
                boxShadow: [
                  `0 0 10px ${bubble.color}40`,
                  `0 0 20px ${bubble.color}60`,
                  `0 0 10px ${bubble.color}40`,
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Stage labels */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-between text-xs text-gray-500 px-4">
          {stages.map((stage) => (
            <span key={stage.id}>{stage.label}</span>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        <motion.div
          className="bg-blue-100 p-4 rounded-lg text-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-2xl font-bold text-blue-600">{bubbleCount}</div>
          <div className="text-sm text-gray-600">Data Points</div>
        </motion.div>
        <motion.div
          className="bg-purple-100 p-4 rounded-lg text-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-2xl font-bold text-purple-600">{stages.length}</div>
          <div className="text-sm text-gray-600">Pipeline Stages</div>
        </motion.div>
        <motion.div
          className="bg-pink-100 p-4 rounded-lg text-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-2xl font-bold text-pink-600">100%</div>
          <div className="text-sm text-gray-600">Flow Rate</div>
        </motion.div>
      </div>
    </div>
  );
};

export default DataPipeline;
