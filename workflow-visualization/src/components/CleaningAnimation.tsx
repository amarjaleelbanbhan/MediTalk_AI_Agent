import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DataRecord {
  id: number;
  text: string;
  isDuplicate: boolean;
  hasMissing: boolean;
  hasInconsistency: boolean;
  status: "dirty" | "cleaning" | "clean" | "removed";
}

export const CleaningAnimation: React.FC = () => {
  const [records, setRecords] = useState<DataRecord[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize with realistic dirty data
  useEffect(() => {
    const initialRecords: DataRecord[] = [
      { id: 1, text: "Fever, Cough", isDuplicate: false, hasMissing: false, hasInconsistency: true, status: "dirty" },
      { id: 2, text: "FEVER, headache", isDuplicate: false, hasMissing: false, hasInconsistency: true, status: "dirty" },
      { id: 3, text: "Fever, Cough", isDuplicate: true, hasMissing: false, hasInconsistency: false, status: "dirty" }, // Duplicate of #1
      { id: 4, text: "Rash, NULL, Fatigue", isDuplicate: false, hasMissing: true, hasInconsistency: false, status: "dirty" },
      { id: 5, text: "chills, Fever  ", isDuplicate: false, hasMissing: false, hasInconsistency: true, status: "dirty" },
      { id: 6, text: "Headache, NULL", isDuplicate: false, hasMissing: true, hasInconsistency: false, status: "dirty" },
      { id: 7, text: "cough, FATIGUE", isDuplicate: false, hasMissing: false, hasInconsistency: true, status: "dirty" },
      { id: 8, text: "FEVER, headache", isDuplicate: true, hasMissing: false, hasInconsistency: false, status: "dirty" }, // Duplicate of #2
    ];
    setRecords(initialRecords);
  }, []);

  const cleaningSteps = [
    {
      name: "Raw Data",
      description: "Original messy data with issues",
      action: () => setRecords(prev => prev.map(r => ({ ...r, status: "dirty" as const }))),
    },
    {
      name: "Standardize Text",
      description: "Lowercase & trim whitespace",
      action: () => {
        setRecords(prev => prev.map(r => {
          if (r.hasInconsistency && !r.isDuplicate) {
            return { ...r, text: r.text.toLowerCase().trim(), hasInconsistency: false, status: "cleaning" as const };
          }
          return r;
        }));
        setTimeout(() => {
          setRecords(prev => prev.map(r => r.status === "cleaning" ? { ...r, status: "clean" as const } : r));
        }, 1000);
      },
    },
    {
      name: "Remove Duplicates",
      description: "Delete duplicate records",
      action: () => {
        setRecords(prev => prev.map(r => {
          if (r.isDuplicate) {
            return { ...r, status: "cleaning" as const };
          }
          return r;
        }));
        setTimeout(() => {
          setRecords(prev => prev.map(r => r.isDuplicate ? { ...r, status: "removed" as const } : r));
        }, 1000);
      },
    },
    {
      name: "Handle Missing Values",
      description: "Fill NULL with empty string",
      action: () => {
        setRecords(prev => prev.map(r => {
          if (r.hasMissing && r.status !== "removed") {
            return { ...r, text: r.text.replace("NULL", ""), status: "cleaning" as const };
          }
          return r;
        }));
        setTimeout(() => {
          setRecords(prev => prev.map(r => r.status === "cleaning" ? { ...r, hasMissing: false, status: "clean" as const } : r));
        }, 1000);
      },
    },
    {
      name: "Validation Complete",
      description: "All data is now clean!",
      action: () => {
        setRecords(prev => prev.map(r => r.status !== "removed" ? { ...r, status: "clean" as const } : r));
      },
    },
  ];

  const nextStep = () => {
    if (currentStep < cleaningSteps.length) {
      cleaningSteps[currentStep].action();
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        if (currentStep + 1 >= cleaningSteps.length) {
          setIsPlaying(false);
        }
      }, 1500);
    }
  };

  const autoPlay = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    setRecords(prev => prev.map(r => ({ ...r, status: "dirty" as const })));
    
    let step = 0;
    const interval = setInterval(() => {
      if (step < cleaningSteps.length) {
        cleaningSteps[step].action();
        step++;
      } else {
        clearInterval(interval);
        setIsPlaying(false);
      }
    }, 2000);
  };

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setRecords([
      { id: 1, text: "Fever, Cough", isDuplicate: false, hasMissing: false, hasInconsistency: true, status: "dirty" },
      { id: 2, text: "FEVER, headache", isDuplicate: false, hasMissing: false, hasInconsistency: true, status: "dirty" },
      { id: 3, text: "Fever, Cough", isDuplicate: true, hasMissing: false, hasInconsistency: false, status: "dirty" },
      { id: 4, text: "Rash, NULL, Fatigue", isDuplicate: false, hasMissing: true, hasInconsistency: false, status: "dirty" },
      { id: 5, text: "chills, Fever  ", isDuplicate: false, hasMissing: false, hasInconsistency: true, status: "dirty" },
      { id: 6, text: "Headache, NULL", isDuplicate: false, hasMissing: true, hasInconsistency: false, status: "dirty" },
      { id: 7, text: "cough, FATIGUE", isDuplicate: false, hasMissing: false, hasInconsistency: true, status: "dirty" },
      { id: 8, text: "FEVER, headache", isDuplicate: true, hasMissing: false, hasInconsistency: false, status: "dirty" },
    ]);
  };

  const totalRecords = records.length;
  const cleanRecords = records.filter(r => r.status === "clean").length;
  const removedRecords = records.filter(r => r.status === "removed").length;
  const dirtyRecords = records.filter(r => r.status === "dirty").length;

  return (
    <div className="w-full bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-lg border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">📊 Data Cleaning Process - Step by Step</h3>

      {/* Progress Steps */}
      <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Cleaning Pipeline:</h4>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {cleaningSteps.map((step, index) => (
            <React.Fragment key={index}>
              <motion.div
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  index < currentStep
                    ? "bg-green-500 text-white"
                    : index === currentStep
                    ? "bg-blue-500 text-white animate-pulse"
                    : "bg-gray-200 text-gray-500"
                }`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-2">
                  {index < currentStep && "✓"}
                  {index === currentStep && "⚙️"}
                  <span>{index + 1}. {step.name}</span>
                </div>
              </motion.div>
              {index < cleaningSteps.length - 1 && (
                <span className="text-gray-400">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
        {currentStep < cleaningSteps.length && (
          <motion.p
            className="text-gray-600 text-sm bg-blue-50 p-3 rounded"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <strong>Current Step:</strong> {cleaningSteps[currentStep]?.description}
          </motion.p>
        )}
      </div>

      {/* Data Records Visualization */}
      <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Data Records:</h4>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          <AnimatePresence mode="popLayout">
            {records.map((record) => (
              <motion.div
                key={record.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: record.status === "removed" ? 0 : 1,
                  x: 0,
                  height: record.status === "removed" ? 0 : "auto",
                  scale: record.status === "cleaning" ? 1.02 : 1,
                }}
                exit={{ opacity: 0, x: 100, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-lg border-2 ${
                  record.status === "dirty"
                    ? "bg-red-50 border-red-300"
                    : record.status === "cleaning"
                    ? "bg-yellow-50 border-yellow-400 shadow-lg"
                    : record.status === "clean"
                    ? "bg-green-50 border-green-300"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="font-mono font-bold text-gray-600 text-sm w-8">
                      #{record.id}
                    </span>
                    <span className={`font-mono text-sm flex-1 ${
                      record.status === "removed" ? "line-through text-gray-400" : ""
                    }`}>
                      {record.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {record.isDuplicate && record.status !== "removed" && (
                      <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs font-semibold">
                        Duplicate
                      </span>
                    )}
                    {record.hasMissing && record.status !== "removed" && (
                      <span className="px-2 py-1 bg-purple-200 text-purple-800 rounded text-xs font-semibold">
                        Missing
                      </span>
                    )}
                    {record.hasInconsistency && record.status !== "removed" && (
                      <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded text-xs font-semibold">
                        Inconsistent
                      </span>
                    )}
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      record.status === "dirty"
                        ? "bg-red-500 text-white"
                        : record.status === "cleaning"
                        ? "bg-yellow-500 text-white animate-spin"
                        : record.status === "clean"
                        ? "bg-green-500 text-white"
                        : "bg-gray-400 text-white"
                    }`}>
                      {record.status === "dirty" && "❌"}
                      {record.status === "cleaning" && "⚙️"}
                      {record.status === "clean" && "✓"}
                      {record.status === "removed" && "🗑️"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          className="bg-white p-4 rounded-lg border-l-4 border-blue-500 shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-3xl font-bold text-blue-600">{totalRecords}</div>
          <div className="text-sm text-gray-600">Total Records</div>
        </motion.div>
        <motion.div
          className="bg-white p-4 rounded-lg border-l-4 border-red-500 shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-3xl font-bold text-red-600">{dirtyRecords}</div>
          <div className="text-sm text-gray-600">Dirty Records</div>
        </motion.div>
        <motion.div
          className="bg-white p-4 rounded-lg border-l-4 border-green-500 shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-3xl font-bold text-green-600">{cleanRecords}</div>
          <div className="text-sm text-gray-600">Clean Records</div>
        </motion.div>
        <motion.div
          className="bg-white p-4 rounded-lg border-l-4 border-gray-500 shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-3xl font-bold text-gray-600">{removedRecords}</div>
          <div className="text-sm text-gray-600">Removed</div>
        </motion.div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4 justify-center flex-wrap">
        <motion.button
          onClick={autoPlay}
          disabled={isPlaying}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>▶</span> Auto Play All Steps
        </motion.button>
        <motion.button
          onClick={nextStep}
          disabled={currentStep >= cleaningSteps.length || isPlaying}
          className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Next Step →
        </motion.button>
        <motion.button
          onClick={reset}
          disabled={isPlaying}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ↺ Reset
        </motion.button>
      </div>
    </div>
  );
};

export default CleaningAnimation;
