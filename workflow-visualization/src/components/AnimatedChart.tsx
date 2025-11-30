import { useEffect, useState } from "react";

interface BarData {
  label: string;
  value: number;
  color: string;
}

interface AnimatedChartProps {
  title: string;
  data: BarData[];
  maxValue?: number;
  type?: "bar" | "scatter";
  animated?: boolean;
}

export default function AnimatedChart({
  title,
  data,
  maxValue = 100,
  type = "bar",
  animated = true,
}: AnimatedChartProps) {
  const [displayValues, setDisplayValues] = useState<number[]>(
    data.map(() => 0)
  );

  useEffect(() => {
    if (!animated) {
      setDisplayValues(data.map((d) => d.value));
      return;
    }

    const intervals = data.map((_, index) => {
      return setTimeout(() => {
        setDisplayValues((prev) => {
          const newValues = [...prev];
          newValues[index] = data[index].value;
          return newValues;
        });
      }, index * 150);
    });

    return () => intervals.forEach((interval) => clearTimeout(interval));
  }, [data, animated]);

  if (type === "bar") {
    return (
      <div className="w-full bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={item.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {item.label}
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {displayValues[index]}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full bg-${item.color}-500 transition-all duration-500 ease-out`}
                  style={{
                    width: `${(displayValues[index] / maxValue) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Scatter plot style
  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="grid grid-cols-4 gap-4">
        {data.map((item, index) => (
          <div
            key={item.label}
            className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-50 transition-all duration-500"
            style={{
              opacity: displayValues[index] > 0 ? 1 : 0.3,
              transform:
                displayValues[index] > 0
                  ? "scale(1)"
                  : "scale(0.8)",
            }}
          >
            <div
              className={`w-12 h-12 rounded-full bg-${item.color}-500 flex items-center justify-center text-white font-bold mb-2 transition-all duration-500`}
              style={{
                transform: `scale(${(displayValues[index] / maxValue) * 1.5 + 0.5})`,
              }}
            >
              {displayValues[index]}
            </div>
            <p className="text-xs text-gray-600 text-center">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
