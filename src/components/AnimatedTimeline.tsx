import { useState } from "react";

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  details?: React.ReactNode;
  color: string;
}

interface AnimatedTimelineProps {
  steps: TimelineStep[];
  title?: string;
}

export default function AnimatedTimeline({
  steps,
  title = "Process Timeline",
}: AnimatedTimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(steps[0]?.id);

  return (
    <div className="w-full py-12">
      {title && (
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          {title}
        </h2>
      )}

      {/* Desktop Timeline */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 transform -translate-x-1/2" />

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-8 ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div className="flex-1">
                  <div
                    className={`bg-white p-6 rounded-lg shadow-md border-l-4 border-${step.color}-500 cursor-pointer transition-all hover:shadow-lg`}
                    onClick={() =>
                      setExpandedId(
                        expandedId === step.id ? null : step.id
                      )
                    }
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{step.icon}</span>
                      <h3 className="text-lg font-bold text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {step.description}
                    </p>

                    {/* Expanded Details */}
                    {expandedId === step.id && step.details && (
                      <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
                        {step.details}
                      </div>
                    )}

                    {step.details && (
                      <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors">
                        {expandedId === step.id ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="flex-shrink-0 relative z-10">
                  <div
                    className={`w-12 h-12 rounded-full bg-${step.color}-500 flex items-center justify-center text-white font-bold shadow-lg animate-bounce-in`}
                    style={{
                      animationDelay: `${index * 150}ms`,
                    }}
                  >
                    {index + 1}
                  </div>
                </div>

                {/* Spacer */}
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="md:hidden space-y-6">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="relative pl-8"
            onClick={() =>
              setExpandedId(expandedId === step.id ? null : step.id)
            }
          >
            {/* Timeline Line */}
            {index < steps.length - 1 && (
              <div className="absolute left-3 top-12 bottom-0 w-0.5 bg-blue-300" />
            )}

            {/* Timeline Dot */}
            <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
              {index + 1}
            </div>

            {/* Card */}
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500 cursor-pointer transition-all hover:shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{step.icon}</span>
                <h3 className="font-bold text-gray-900">{step.title}</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">{step.description}</p>

              {/* Expanded Details */}
              {expandedId === step.id && step.details && (
                <div className="mt-3 pt-3 border-t border-gray-200 animate-fade-in text-sm">
                  {step.details}
                </div>
              )}

              {step.details && (
                <button className="text-blue-600 text-xs font-semibold hover:text-blue-700 transition-colors">
                  {expandedId === step.id ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
