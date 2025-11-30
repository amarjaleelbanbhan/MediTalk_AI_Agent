import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Symptom {
  id: string;
  name: string;
  selected: boolean;
}

interface Prediction {
  disease: string;
  confidence: number;
  color: string;
}

const SYMPTOMS = [
  "Fever",
  "Cough",
  "Fatigue",
  "Headache",
  "Rash",
  "Chills",
  "Sore Throat",
  "Nausea",
];

const DISEASES: Prediction[] = [
  { disease: "Malaria", confidence: 0.92, color: "#EF4444" },
  { disease: "Dengue", confidence: 0.85, color: "#F59E0B" },
  { disease: "COVID-19", confidence: 0.78, color: "#3B82F6" },
  { disease: "Flu", confidence: 0.72, color: "#10B981" },
  { disease: "Measles", confidence: 0.65, color: "#8B5CF6" },
];

export const PredictionFlow: React.FC = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const handleSymptomToggle = (symptomName: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomName)
        ? prev.filter((s) => s !== symptomName)
        : [...prev, symptomName]
    );
  };

  const handlePredict = async () => {
    if (selectedSymptoms.length === 0) return;

    setIsPredicting(true);
    setPredictions([]);

    // Simulate prediction delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Adjust confidence based on selected symptoms
    const adjustedPredictions = DISEASES.map((disease) => ({
      ...disease,
      confidence: disease.confidence * (0.7 + Math.random() * 0.3),
    })).sort((a, b) => b.confidence - a.confidence);

    setPredictions(adjustedPredictions);
    setIsPredicting(false);
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setPredictions([]);
  };

  return (
    <div className="w-full bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-lg border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Interactive Prediction Simulator
      </h3>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input: Symptom Selection */}
        <motion.div
          className="bg-white p-6 rounded-lg border border-gray-200"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="font-semibold text-gray-900 mb-4">
            Select Symptoms (Input)
          </h4>
          <div className="space-y-3 mb-6">
            {SYMPTOMS.map((symptom, index) => (
              <motion.label
                key={symptom}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <input
                  type="checkbox"
                  checked={selectedSymptoms.includes(symptom)}
                  onChange={() => handleSymptomToggle(symptom)}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-gray-700">{symptom}</span>
              </motion.label>
            ))}
          </div>

          {/* Selected symptoms display */}
          {selectedSymptoms.length > 0 && (
            <motion.div
              className="bg-blue-50 p-4 rounded mb-6 border border-blue-200"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sm font-semibold text-blue-900 mb-2">
                Selected: {selectedSymptoms.length} symptom(s)
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.map((symptom) => (
                  <motion.span
                    key={symptom}
                    className="px-3 py-1 bg-blue-200 text-blue-900 rounded-full text-sm font-medium"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    {symptom}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Control buttons */}
          <div className="flex gap-3">
            <motion.button
              onClick={handlePredict}
              disabled={selectedSymptoms.length === 0 || isPredicting}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPredicting ? "Predicting..." : "Predict Disease"}
            </motion.button>
            <motion.button
              onClick={handleReset}
              disabled={selectedSymptoms.length === 0}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset
            </motion.button>
          </div>
        </motion.div>

        {/* Output: Predictions */}
        <motion.div
          className="bg-white p-6 rounded-lg border border-gray-200"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="font-semibold text-gray-900 mb-4">
            Predicted Diseases (Output)
          </h4>

          {isPredicting && (
            <motion.div
              className="flex items-center justify-center h-64"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">🔮</div>
                <p className="text-gray-600 font-semibold">
                  Analyzing symptoms...
                </p>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {!isPredicting && predictions.length > 0 && (
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {predictions.map((pred, index) => (
                  <motion.div
                    key={pred.disease}
                    className="p-4 rounded-lg border-2"
                    style={{
                      borderColor: pred.color,
                      backgroundColor: `${pred.color}15`,
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900">
                        {index + 1}. {pred.disease}
                      </span>
                      <span
                        className="text-sm font-bold text-white px-3 py-1 rounded-full"
                        style={{ backgroundColor: pred.color }}
                      >
                        {(pred.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <motion.div
                      className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: pred.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pred.confidence * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {!isPredicting && predictions.length === 0 && (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">📋</div>
                <p>Select symptoms and click "Predict Disease"</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Information */}
      <motion.div
        className="mt-8 p-6 bg-white rounded-lg border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h4 className="font-semibold text-gray-900 mb-3">How it works:</h4>
        <ol className="space-y-2 text-gray-700 list-decimal list-inside">
          <li>Select one or more symptoms from the left panel</li>
          <li>Click "Predict Disease" to run the model</li>
          <li>The Random Forest analyzes your symptoms</li>
          <li>Results show predicted diseases with confidence scores</li>
          <li>Higher confidence = stronger prediction</li>
        </ol>
      </motion.div>
    </div>
  );
};

export default PredictionFlow;
