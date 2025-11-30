import { useState, useEffect, useCallback } from "react";
import { Bubble, PHYSICS_CONFIG } from "@/lib/animationConfig";

export const useBubblePhysics = (
  containerWidth: number,
  containerHeight: number,
  bubbleCount: number = 50,
  bubbleRadius: number = 8
) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  // Initialize bubbles
  useEffect(() => {
    const initialBubbles: Bubble[] = Array.from({ length: bubbleCount }, (_, i) => ({
      id: `bubble-${i}`,
      x: Math.random() * containerWidth,
      y: Math.random() * containerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: bubbleRadius,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      stage: "raw",
    }));
    setBubbles(initialBubbles);
  }, [containerWidth, containerHeight, bubbleCount, bubbleRadius]);

  // Physics simulation loop
  useEffect(() => {
    if (!containerWidth || !containerHeight) return;

    const animationId = setInterval(() => {
      setBubbles((prevBubbles) =>
        prevBubbles.map((bubble) => {
          let { x, y, vx, vy } = bubble;

          // Apply gravity
          vy += PHYSICS_CONFIG.gravity;

          // Apply friction
          vx *= PHYSICS_CONFIG.friction;
          vy *= PHYSICS_CONFIG.friction;

          // Limit velocity
          const speed = Math.sqrt(vx * vx + vy * vy);
          if (speed > PHYSICS_CONFIG.maxVelocity) {
            vx = (vx / speed) * PHYSICS_CONFIG.maxVelocity;
            vy = (vy / speed) * PHYSICS_CONFIG.maxVelocity;
          }

          // Update position
          x += vx;
          y += vy;

          // Boundary collision with bounce
          if (x - bubble.radius < 0) {
            x = bubble.radius;
            vx *= -PHYSICS_CONFIG.bounce;
          }
          if (x + bubble.radius > containerWidth) {
            x = containerWidth - bubble.radius;
            vx *= -PHYSICS_CONFIG.bounce;
          }
          if (y - bubble.radius < 0) {
            y = bubble.radius;
            vy *= -PHYSICS_CONFIG.bounce;
          }
          if (y + bubble.radius > containerHeight) {
            y = containerHeight - bubble.radius;
            vy *= -PHYSICS_CONFIG.bounce;
          }

          return { ...bubble, x, y, vx, vy };
        })
      );
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(animationId);
  }, [containerWidth, containerHeight]);

  // Bubble-to-bubble collision detection
  const checkCollisions = useCallback(() => {
    setBubbles((prevBubbles) => {
      const newBubbles = [...prevBubbles];
      for (let i = 0; i < newBubbles.length; i++) {
        for (let j = i + 1; j < newBubbles.length; j++) {
          const dx = newBubbles[j].x - newBubbles[i].x;
          const dy = newBubbles[j].y - newBubbles[i].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = newBubbles[i].radius + newBubbles[j].radius;

          if (distance < minDistance) {
            // Elastic collision
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);

            // Swap velocities along collision axis
            const vx1 = newBubbles[i].vx * cos + newBubbles[i].vy * sin;
            const vy1 = newBubbles[i].vy * cos - newBubbles[i].vx * sin;
            const vx2 = newBubbles[j].vx * cos + newBubbles[j].vy * sin;
            const vy2 = newBubbles[j].vy * cos - newBubbles[j].vx * sin;

            newBubbles[i].vx = vx2 * cos - vy1 * sin;
            newBubbles[i].vy = vy1 * cos + vx2 * sin;
            newBubbles[j].vx = vx1 * cos - vy2 * sin;
            newBubbles[j].vy = vy2 * cos + vx1 * sin;

            // Separate bubbles
            const overlap = minDistance - distance;
            const moveX = (overlap / 2) * cos;
            const moveY = (overlap / 2) * sin;
            newBubbles[i].x -= moveX;
            newBubbles[i].y -= moveY;
            newBubbles[j].x += moveX;
            newBubbles[j].y += moveY;
          }
        }
      }
      return newBubbles;
    });
  }, []);

  // Update bubble stage
  const updateBubbleStage = useCallback((bubbleId: string, newStage: string) => {
    setBubbles((prevBubbles) =>
      prevBubbles.map((bubble) =>
        bubble.id === bubbleId ? { ...bubble, stage: newStage } : bubble
      )
    );
  }, []);

  // Add new bubbles
  const addBubbles = useCallback((count: number, stage: string = "raw") => {
    const newBubbles: Bubble[] = Array.from({ length: count }, (_, i) => ({
      id: `bubble-${Date.now()}-${i}`,
      x: Math.random() * containerWidth,
      y: Math.random() * containerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: bubbleRadius,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      stage,
    }));
    setBubbles((prev) => [...prev, ...newBubbles]);
  }, [containerWidth, containerHeight, bubbleRadius]);

  // Remove bubbles
  const removeBubbles = useCallback((count: number) => {
    setBubbles((prev) => prev.slice(0, Math.max(0, prev.length - count)));
  }, []);

  return {
    bubbles,
    checkCollisions,
    updateBubbleStage,
    addBubbles,
    removeBubbles,
    setBubbles,
  };
};
