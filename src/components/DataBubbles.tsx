import React, { useEffect, useRef, useState, memo } from "react";
import { useBubblePhysics } from "@/hooks/useBubblePhysics";
import { BUBBLE_COLORS } from "@/lib/animationConfig";

interface DataBubblesProps {
  count?: number;
  width?: number;
  height?: number;
  colors?: string[];
  interactive?: boolean;
}

const DataBubblesComponent: React.FC<DataBubblesProps> = ({
  count = 20,
  width = 800,
  height = 600,
  colors = Object.values(BUBBLE_COLORS),
  interactive = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { bubbles } = useBubblePhysics(width, height, count, 6);
  const [hoveredBubble, setHoveredBubble] = useState<string | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationId: number;

    const animate = () => {
      frameRef.current++;
      
      // Throttle to 30fps for better performance
      if (frameRef.current % 2 !== 0) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      // Clear canvas
      ctx.fillStyle = "rgb(249, 250, 251)";
      ctx.fillRect(0, 0, width, height);

      // Draw bubbles (simplified rendering)
      bubbles.forEach((bubble) => {
        const isHovered = hoveredBubble === bubble.id;
        const radius = isHovered ? bubble.radius * 1.3 : bubble.radius;

        // Bubble fill only (removed glow for performance)
        ctx.fillStyle = bubble.color;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Simplified border
        if (isHovered) {
          ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [bubbles, width, height, hoveredBubble]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!interactive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let found = false;
    for (const bubble of bubbles) {
      const distance = Math.sqrt(
        Math.pow(bubble.x - x, 2) + Math.pow(bubble.y - y, 2)
      );
      if (distance < bubble.radius * 2) {
        setHoveredBubble(bubble.id);
        found = true;
        break;
      }
    }

    if (!found) {
      setHoveredBubble(null);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoveredBubble(null)}
      className="w-full border border-gray-200 rounded-lg bg-gray-50"
      style={{ opacity: 1 }}
    />
  );
};

export const DataBubbles = memo(DataBubblesComponent);
export default DataBubbles;
