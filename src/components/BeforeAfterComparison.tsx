import { useState } from "react";

interface BeforeAfterProps {
  title: string;
  beforeTitle: string;
  afterTitle: string;
  beforeContent: React.ReactNode;
  afterContent: React.ReactNode;
  description?: string;
}

export default function BeforeAfterComparison({
  title,
  beforeTitle,
  afterTitle,
  beforeContent,
  afterContent,
  description,
}: BeforeAfterProps) {
  const [showAfter, setShowAfter] = useState(false);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        {description && <p className="text-gray-600">{description}</p>}
      </div>

      {/* Desktop View - Side by Side */}
      <div className="hidden md:grid md:grid-cols-2 gap-6 mb-6">
        {/* Before */}
        <div className="animate-fade-in duration-500">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <h4 className="font-semibold text-gray-900">{beforeTitle}</h4>
            </div>
            <div className="bg-white rounded p-4 border border-red-100">
              {beforeContent}
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center animate-bounce-in duration-700 delay-300">
          <div className="text-4xl text-blue-500 font-bold">→</div>
        </div>

        {/* After */}
        <div className="md:col-span-2 animate-fade-in duration-500 delay-500">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <h4 className="font-semibold text-gray-900">{afterTitle}</h4>
            </div>
            <div className="bg-white rounded p-4 border border-green-100">
              {afterContent}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View - Toggle */}
      <div className="md:hidden">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShowAfter(false)}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              !showAfter
                ? "bg-red-500 text-white shadow-lg"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {beforeTitle}
          </button>
          <button
            onClick={() => setShowAfter(true)}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              showAfter
                ? "bg-green-500 text-white shadow-lg"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {afterTitle}
          </button>
        </div>

        <div
          className={`${
            showAfter
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          } border-2 rounded-lg p-6 animate-fade-in duration-300`}
        >
          <div className="bg-white rounded p-4 border border-gray-100">
            {showAfter ? afterContent : beforeContent}
          </div>
        </div>
      </div>
    </div>
  );
}
