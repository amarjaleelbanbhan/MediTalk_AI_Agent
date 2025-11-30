import { useEffect, useRef, useState } from "react";

interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: string;
  duration?: string;
  delay?: string;
  className?: string;
  threshold?: number;
}

export default function AnimatedSection({
  children,
  animation = "animate-fade-in",
  duration = "duration-700",
  delay = "delay-0",
  className = "",
  threshold = 0.1,
}: AnimatedSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`${
        isVisible ? `${animation} ${duration} ${delay}` : "opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}
