import { useEffect, useState } from "react";

interface DataFlowStep {
  id: string;
  label: string;
  icon: string;
  color: string;
}

interface AnimatedDataFlowProps {
  steps: DataFlowStep[];
  title?: string;
  description?: string;
}

export default function AnimatedDataFlow({
  steps,
  title = "Data Pipeline",
  description = "Watch data flow through the entire workflow",
}: AnimatedDataFlowProps) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="w-full py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>

        {/* Desktop Flow */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="relative flex flex-col items-center flex-1">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-500 ${
                      index <= activeStep
                        ? `bg-${step.color}-600 text-white scale-110 shadow-lg`
                        : `bg-gray-200 text-gray-500 scale-100`
                    }`}
                  >
                    {step.icon}
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mt-3 text-center">
                    {step.label}
                  </p>

                  {/* Animated data particle */}
                  {index < activeStep && (
                    <div
                      className="absolute top-8 left-1/2 w-3 h-3 bg-blue-500 rounded-full animate-pulse"
                      style={{
                        animation: `moveRight 1.5s ease-in-out infinite`,
                        left: `${50 + (index * 100) / steps.length}%`,
                      }}
                    />
                  )}
                </div>

                {/* Arrow Connector */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-2 relative">
                    <div
                      className={`h-full transition-all duration-500 ${
                        index < activeStep
                          ? "bg-blue-500"
                          : "bg-gray-300"
                      }`}
                    />
                    {index < activeStep && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 text-blue-500 text-lg"
                        style={{
                          animation: `flowArrow 1s ease-in-out infinite`,
                          left: "50%",
                        }}
                      >
                        →
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Flow */}
        <div className="md:hidden space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-xl flex-shrink-0 transition-all ${
                  index <= activeStep
                    ? `bg-${step.color}-600 text-white scale-110`
                    : `bg-gray-200 text-gray-500`
                }`}
              >
                {step.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{step.label}</p>
                <p className="text-xs text-gray-500">Step {index + 1}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="text-blue-500 text-lg ml-auto">↓</div>
              )}
            </div>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 flex justify-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index <= activeStep ? "bg-blue-600 w-8" : "bg-gray-300 w-2"
              }`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes moveRight {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        @keyframes flowArrow {
          0% { transform: translateX(-10px); }
          50% { transform: translateX(10px); }
          100% { transform: translateX(-10px); }
        }
      `}</style>
    </div>
  );
}
