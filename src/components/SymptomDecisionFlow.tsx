import { useState } from "react";
import { motion } from "framer-motion";

interface DecisionNode {
  id: string;
  type: "question" | "result";
  question?: string;
  symptom?: string;
  result?: string;
  yesPath?: string;
  noPath?: string;
  x: number;
  y: number;
  level: number;
}

interface PatientCase {
  id: number;
  name: string;
  symptoms: string[];
  actualDisease: string;
  description: string;
}

// Realistic medical decision tree nodes based on actual symptoms
const decisionTree: DecisionNode[] = [
  {
    id: "root",
    type: "question",
    question: "Does patient have Fever?",
    symptom: "Fever",
    yesPath: "fever_yes",
    noPath: "fever_no",
    x: 50,
    y: 8,
    level: 0,
  },
  {
    id: "fever_yes",
    type: "question",
    question: "Does patient have Cough?",
    symptom: "Cough",
    yesPath: "fever_cough_yes",
    noPath: "fever_cough_no",
    x: 25,
    y: 22,
    level: 1,
  },
  {
    id: "fever_no",
    type: "question",
    question: "Does patient have Joint Pain?",
    symptom: "Joint Pain",
    yesPath: "no_fever_joint_yes",
    noPath: "no_fever_joint_no",
    x: 75,
    y: 22,
    level: 1,
  },
  {
    id: "fever_cough_yes",
    type: "question",
    question: "Does patient have Chills?",
    symptom: "Chills",
    yesPath: "result_malaria",
    noPath: "fever_cough_nochills",
    x: 15,
    y: 38,
    level: 2,
  },
  {
    id: "fever_cough_no",
    type: "question",
    question: "Does patient have Rash?",
    symptom: "Rash",
    yesPath: "result_measles",
    noPath: "fever_no_cough_rash",
    x: 35,
    y: 38,
    level: 2,
  },
  {
    id: "no_fever_joint_yes",
    type: "question",
    question: "Does patient have Muscle Pain?",
    symptom: "Muscle Pain",
    yesPath: "result_arthritis",
    noPath: "result_sprain",
    x: 65,
    y: 38,
    level: 2,
  },
  {
    id: "no_fever_joint_no",
    type: "question",
    question: "Does patient have Headache?",
    symptom: "Headache",
    yesPath: "result_migraine",
    noPath: "result_healthy",
    x: 85,
    y: 38,
    level: 2,
  },
  {
    id: "fever_cough_nochills",
    type: "question",
    question: "Does patient have Fatigue?",
    symptom: "Fatigue",
    yesPath: "result_flu",
    noPath: "result_cold",
    x: 10,
    y: 60,
    level: 3,
  },
  {
    id: "fever_no_cough_rash",
    type: "question",
    question: "Does patient have Headache?",
    symptom: "Headache",
    yesPath: "result_dengue",
    noPath: "result_viral_fever",
    x: 30,
    y: 60,
    level: 3,
  },
  // Results
  {
    id: "result_malaria",
    type: "result",
    result: "Malaria",
    x: 20,
    y: 60,
    level: 3,
  },
  {
    id: "result_flu",
    type: "result",
    result: "Flu",
    x: 7,
    y: 82,
    level: 4,
  },
  {
    id: "result_cold",
    type: "result",
    result: "Common Cold",
    x: 13,
    y: 82,
    level: 4,
  },
  {
    id: "result_measles",
    type: "result",
    result: "Measles",
    x: 40,
    y: 60,
    level: 3,
  },
  {
    id: "result_dengue",
    type: "result",
    result: "Dengue",
    x: 27,
    y: 82,
    level: 4,
  },
  {
    id: "result_viral_fever",
    type: "result",
    result: "Viral Fever",
    x: 33,
    y: 82,
    level: 4,
  },
  {
    id: "result_arthritis",
    type: "result",
    result: "Arthritis",
    x: 60,
    y: 60,
    level: 3,
  },
  {
    id: "result_sprain",
    type: "result",
    result: "Sprain",
    x: 70,
    y: 60,
    level: 3,
  },
  {
    id: "result_migraine",
    type: "result",
    result: "Migraine",
    x: 80,
    y: 60,
    level: 3,
  },
  {
    id: "result_healthy",
    type: "result",
    result: "Healthy",
    x: 90,
    y: 60,
    level: 3,
  },
];

// Realistic patient cases
const patientCases: PatientCase[] = [
  {
    id: 1,
    name: "Patient A",
    symptoms: ["Fever", "Cough", "Chills", "Body Ache"],
    actualDisease: "Malaria",
    description: "35-year-old with high fever and chills for 3 days",
  },
  {
    id: 2,
    name: "Patient B",
    symptoms: ["Fever", "Rash", "Red Eyes", "Runny Nose"],
    actualDisease: "Measles",
    description: "8-year-old child with fever and skin rash",
  },
  {
    id: 3,
    name: "Patient C",
    symptoms: ["Fever", "Cough", "Fatigue", "Sore Throat"],
    actualDisease: "Influenza (Flu)",
    description: "42-year-old with respiratory symptoms and fatigue",
  },
  {
    id: 4,
    name: "Patient D",
    symptoms: ["Joint Pain", "Muscle Pain", "Stiffness"],
    actualDisease: "Arthritis",
    description: "60-year-old with chronic joint pain",
  },
  {
    id: 5,
    name: "Patient E",
    symptoms: ["Headache", "Sensitivity to Light", "Nausea"],
    actualDisease: "Migraine",
    description: "28-year-old with severe recurring headaches",
  },
];

export default function SymptomDecisionFlow() {
  const [selectedPatient, setSelectedPatient] = useState<PatientCase>(patientCases[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState<string>("root");
  const [traversedPath, setTraversedPath] = useState<string[]>([]);
  const [decisionHistory, setDecisionHistory] = useState<
    Array<{ nodeId: string; question: string; answer: boolean; symptom: string }>
  >([]);
  const [finalResult, setFinalResult] = useState<string>("");
  const [animationSpeed, setAnimationSpeed] = useState<number>(1500);

  const hasSymptom = (symptom: string): boolean => {
    return selectedPatient.symptoms.some(
      (s) => s.toLowerCase() === symptom.toLowerCase()
    );
  };

  const startDiagnosis = () => {
    setIsAnimating(true);
    setCurrentNodeId("root");
    setTraversedPath(["root"]);
    setDecisionHistory([]);
    setFinalResult("");

    traverseTree("root");
  };

  const traverseTree = (nodeId: string) => {
    const node = decisionTree.find((n) => n.id === nodeId);
    if (!node) return;

    if (node.type === "result") {
      // Reached final result
      setTimeout(() => {
        setFinalResult(node.result || "");
        setIsAnimating(false);
      }, animationSpeed);
      return;
    }

    if (node.type === "question" && node.symptom) {
      const answer = hasSymptom(node.symptom);
      const nextNodeId = answer ? node.yesPath : node.noPath;

      setTimeout(() => {
        // Record decision
        setDecisionHistory((prev) => [
          ...prev,
          {
            nodeId: node.id,
            question: node.question || "",
            answer,
            symptom: node.symptom || "",
          },
        ]);

        // Move to next node
        if (nextNodeId) {
          setCurrentNodeId(nextNodeId);
          setTraversedPath((prev) => [...prev, nextNodeId]);
          traverseTree(nextNodeId);
        }
      }, animationSpeed);
    }
  };

  const reset = () => {
    setIsAnimating(false);
    setCurrentNodeId("root");
    setTraversedPath([]);
    setDecisionHistory([]);
    setFinalResult("");
  };

  const isNodeActive = (nodeId: string): boolean => {
    return currentNodeId === nodeId;
  };

  const isNodeTraversed = (nodeId: string): boolean => {
    return traversedPath.includes(nodeId);
  };

  const isPathActive = (fromId: string, toId: string): boolean => {
    const fromIndex = traversedPath.indexOf(fromId);
    const toIndex = traversedPath.indexOf(toId);
    return fromIndex !== -1 && toIndex === fromIndex + 1;
  };

  return (
    <div className="w-full bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 sm:p-6 lg:p-8 rounded-xl border-2 border-purple-200 shadow-xl">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2 sm:gap-3">
          <span className="text-2xl sm:text-3xl lg:text-4xl">🏥</span>
          <span className="break-words">Medical Decision Tree: Symptom-Based Diagnosis</span>
        </h3>
        <p className="text-gray-700 text-sm sm:text-base lg:text-lg">
          Watch how a decision tree analyzes symptoms step-by-step to reach a diagnosis
        </p>
      </div>

      {/* Patient Selection */}
      <div className="bg-white p-4 sm:p-6 rounded-xl mb-6 border-2 border-gray-200 shadow-lg">
        <h4 className="font-bold text-gray-900 mb-4 text-lg sm:text-xl flex items-center gap-2">
          <span className="text-xl sm:text-2xl">👤</span>
          Select a Patient Case
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          {patientCases.map((patient) => (
            <motion.div
              key={patient.id}
              onClick={() => !isAnimating && setSelectedPatient(patient)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedPatient.id === patient.id
                  ? "border-purple-500 bg-purple-50 shadow-xl scale-105"
                  : "border-gray-300 hover:border-purple-300 hover:shadow-md"
              }`}
              whileHover={{ scale: isAnimating ? 1 : 1.02 }}
              whileTap={{ scale: isAnimating ? 1 : 0.98 }}
            >
              <div className="font-bold text-gray-900 mb-2 text-center">
                {patient.name}
              </div>
              <div className="text-xs text-gray-600 mb-3 text-center">
                {patient.description}
              </div>
              <div className="space-y-1">
                {patient.symptoms.slice(0, 3).map((symptom, idx) => (
                  <div
                    key={idx}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded text-center font-semibold"
                  >
                    {symptom}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Selected Patient Info */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 sm:p-6 rounded-xl mb-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h5 className="text-white font-bold text-base sm:text-lg mb-2">
              Current Patient: {selectedPatient.name}
            </h5>
            <p className="text-purple-100 text-xs sm:text-sm mb-3">{selectedPatient.description}</p>
            <div className="flex flex-wrap gap-2">
              {selectedPatient.symptoms.map((symptom, idx) => (
                <span
                  key={idx}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 bg-white text-purple-700 rounded-full text-xs sm:text-sm font-bold shadow-md"
                >
                  ✓ {symptom}
                </span>
              ))}
            </div>
          </div>
          <div className="text-left lg:text-right text-white">
            <div className="text-xs sm:text-sm opacity-90 mb-1">Actual Diagnosis:</div>
            <div className="text-xl sm:text-2xl font-bold">{selectedPatient.actualDisease}</div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white p-4 sm:p-6 rounded-xl mb-6 border-2 border-gray-200 shadow-lg">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <motion.button
              onClick={startDiagnosis}
              disabled={isAnimating}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
              whileHover={{ scale: isAnimating ? 1 : 1.05 }}
              whileTap={{ scale: isAnimating ? 1 : 0.95 }}
            >
              {isAnimating ? "🔄 Analyzing..." : "▶ Start Diagnosis"}
            </motion.button>
            <motion.button
              onClick={reset}
              disabled={isAnimating}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-500 text-white rounded-lg font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
              whileHover={{ scale: isAnimating ? 1 : 1.05 }}
              whileTap={{ scale: isAnimating ? 1 : 0.95 }}
            >
              ↺ Reset
            </motion.button>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <label className="text-xs sm:text-sm font-semibold text-gray-700">Animation Speed:</label>
            <select
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              disabled={isAnimating}
              className="w-full sm:w-auto px-3 py-2 border-2 border-gray-300 rounded-lg font-semibold disabled:opacity-50 text-sm"
            >
              <option value={2500}>Slow</option>
              <option value={1500}>Normal</option>
              <option value={800}>Fast</option>
            </select>
          </div>
        </div>
      </div>

      {/* Decision History */}
      {decisionHistory.length > 0 && (
        <motion.div
          className="bg-blue-50 p-4 sm:p-6 rounded-xl mb-6 border-2 border-blue-300 shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h5 className="font-bold text-gray-900 mb-4 text-base sm:text-lg flex items-center gap-2">
            <span className="text-xl sm:text-2xl">📋</span>
            Decision Path (Step-by-Step Analysis)
          </h5>
          <div className="space-y-3">
            {decisionHistory.map((item, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-lg shadow-md border-l-4 border-purple-500"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-base sm:text-lg">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 mb-1 text-sm sm:text-base">{item.question}</div>
                  <div className="text-xs sm:text-sm text-gray-600 break-words">
                    Checking for: <span className="font-semibold text-purple-700">{item.symptom}</span>
                  </div>
                </div>
                <div
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-sm sm:text-lg shadow-md whitespace-nowrap ${
                    item.answer
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {item.answer ? "✓ YES" : "✗ NO"}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Decision Tree Visualization */}
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8 rounded-xl shadow-inner border-2 border-purple-200">
        <div className="text-center mb-4 sm:mb-6">
          <h5 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            🌳 Decision Tree Visualization
          </h5>
          <p className="text-sm sm:text-base text-gray-600">
            Follow the path from symptoms to diagnosis
          </p>
        </div>

        <div className="relative bg-white rounded-xl p-6 overflow-x-auto overflow-y-hidden" style={{ minHeight: "700px", height: "750px" }}>
          {/* SVG for connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#8b5cf6" />
              </marker>
              <marker
                id="arrowheadInactive"
                markerWidth="10"
                markerHeight="10"
                refX="8"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#d1d5db" />
              </marker>
            </defs>

            {decisionTree.map((node) => {
              if (node.yesPath) {
                const targetNode = decisionTree.find((n) => n.id === node.yesPath);
                if (targetNode) {
                  const isActive = isPathActive(node.id, node.yesPath);
                  const midX = (node.x + targetNode.x) / 2;
                  const midY = (node.y + targetNode.y) / 2;
                  return (
                    <g key={`${node.id}-yes`}>
                      <motion.line
                        x1={`${node.x}%`}
                        y1={`${node.y + 2}%`}
                        x2={`${targetNode.x}%`}
                        y2={`${targetNode.y - 2}%`}
                        stroke={isActive ? "#8b5cf6" : "#d1d5db"}
                        strokeWidth={isActive ? "4" : "2"}
                        markerEnd={isActive ? "url(#arrowhead)" : "url(#arrowheadInactive)"}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1, opacity: isActive ? 1 : 0.3 }}
                        transition={{ duration: 0.5 }}
                      />
                      <text
                        x={`${midX - 2}%`}
                        y={`${midY}%`}
                        fill={isActive ? "#16a34a" : "#9ca3af"}
                        fontSize="11"
                        fontWeight="bold"
                      >
                        YES ✓
                      </text>
                    </g>
                  );
                }
              }
              if (node.noPath) {
                const targetNode = decisionTree.find((n) => n.id === node.noPath);
                if (targetNode) {
                  const isActive = isPathActive(node.id, node.noPath);
                  const midX = (node.x + targetNode.x) / 2;
                  const midY = (node.y + targetNode.y) / 2;
                  return (
                    <g key={`${node.id}-no`}>
                      <motion.line
                        x1={`${node.x}%`}
                        y1={`${node.y + 2}%`}
                        x2={`${targetNode.x}%`}
                        y2={`${targetNode.y - 2}%`}
                        stroke={isActive ? "#8b5cf6" : "#d1d5db"}
                        strokeWidth={isActive ? "4" : "2"}
                        markerEnd={isActive ? "url(#arrowhead)" : "url(#arrowheadInactive)"}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1, opacity: isActive ? 1 : 0.3 }}
                        transition={{ duration: 0.5 }}
                      />
                      <text
                        x={`${midX + 2}%`}
                        y={`${midY}%`}
                        fill={isActive ? "#dc2626" : "#9ca3af"}
                        fontSize="11"
                        fontWeight="bold"
                      >
                        NO ✗
                      </text>
                    </g>
                  );
                }
              }
              return null;
            })}
          </svg>

          {/* Nodes */}
          {decisionTree.map((node) => {
            const isActive = isNodeActive(node.id);
            const isTraversed = isNodeTraversed(node.id);
            const isResult = node.type === "result";

            return (
              <motion.div
                key={node.id}
                className="absolute"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: "translate(-50%, -50%)",
                  zIndex: isActive ? 30 : isTraversed ? 20 : 10,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isActive ? 1.15 : 1,
                  opacity: 1,
                }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                <motion.div
                  className={`px-3 py-2 rounded-xl font-bold text-center shadow-xl border-3 ${
                    isResult
                      ? isActive || isTraversed
                        ? "bg-gradient-to-br from-green-400 to-emerald-600 text-white border-green-300"
                        : "bg-white border-gray-300 text-gray-600"
                      : isActive
                      ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-purple-300 ring-4 ring-purple-300"
                      : isTraversed
                      ? "bg-gradient-to-br from-purple-300 to-indigo-400 text-white border-purple-200"
                      : "bg-white border-gray-300 text-gray-700"
                  }`}
                  animate={
                    isActive
                      ? {
                          boxShadow: [
                            "0 4px 6px rgba(0,0,0,0.1)",
                            "0 15px 30px rgba(139,92,246,0.6)",
                            "0 4px 6px rgba(0,0,0,0.1)",
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                  style={{ width: isResult ? "85px" : "120px", minHeight: "60px" }}
                >
                  {isActive && !isResult && (
                    <motion.div
                      className="absolute -top-1.5 sm:-top-2 -right-1.5 sm:-right-2 w-5 h-5 sm:w-7 sm:h-7 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center shadow-lg"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <span className="text-xs sm:text-sm">⚡</span>
                    </motion.div>
                  )}

                  <div className="text-xs mb-0.5 sm:mb-1 opacity-90">
                    {isResult ? "🎯" : "❓"}
                  </div>
                  <div className="text-[10px] sm:text-xs leading-tight break-words">
                    {node.question || node.result}
                  </div>
                </motion.div>

                {isActive && !isResult && (
                  <motion.div
                    className="mt-1.5 sm:mt-2 text-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div
                      className={`inline-block px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg ${
                        node.symptom && hasSymptom(node.symptom)
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {node.symptom && hasSymptom(node.symptom) ? "✓ YES" : "✗ NO"}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Final Result */}
      {finalResult && (
        <motion.div
          className={`mt-6 p-4 sm:p-6 lg:p-8 rounded-xl border-3 shadow-2xl ${
            finalResult === selectedPatient.actualDisease
              ? "bg-gradient-to-r from-green-400 to-emerald-500 border-green-300"
              : "bg-gradient-to-r from-orange-400 to-red-500 border-orange-300"
          }`}
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div className="text-center">
            <h4 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4">
              🎯 Final Diagnosis Result
            </h4>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 sm:p-6 rounded-xl mb-4">
              <div className="text-white text-xs sm:text-sm mb-2 opacity-90">Model Prediction:</div>
              <div className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">{finalResult}</div>
              <div className="text-white text-xs sm:text-sm mb-2 opacity-90">Actual Disease:</div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">{selectedPatient.actualDisease}</div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
              {finalResult === selectedPatient.actualDisease ? (
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
                  <span className="text-3xl sm:text-4xl lg:text-5xl">✅</span>
                  <span className="break-words">CORRECT PREDICTION!</span>
                </div>
              ) : (
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
                  <span className="text-3xl sm:text-4xl lg:text-5xl">⚠️</span>
                  <span className="break-words">DIFFERENT DIAGNOSIS</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Educational Info */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 sm:p-6 rounded-xl border-2 border-blue-300 shadow-lg">
        <h5 className="font-bold text-gray-900 mb-4 text-base sm:text-lg flex items-center gap-2">
          <span className="text-xl sm:text-2xl">💡</span>
          How This Decision Tree Works
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
            <div className="font-bold text-purple-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
              <span className="w-6 h-6 sm:w-7 sm:h-7 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm flex-shrink-0">
                1
              </span>
              Root Node
            </div>
            <p className="text-xs sm:text-sm text-gray-700">
              Starts with the most important symptom (Fever) that splits cases effectively
            </p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
            <div className="font-bold text-purple-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
              <span className="w-6 h-6 sm:w-7 sm:h-7 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm flex-shrink-0">
                2
              </span>
              Binary Questions
            </div>
            <p className="text-xs sm:text-sm text-gray-700">
              Each node asks YES/NO question about a specific symptom
            </p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
            <div className="font-bold text-green-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
              <span className="w-6 h-6 sm:w-7 sm:h-7 bg-green-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm flex-shrink-0">
                3
              </span>
              Path Following
            </div>
            <p className="text-xs sm:text-sm text-gray-700">
              Tree follows YES (left) or NO (right) path based on patient symptoms
            </p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
            <div className="font-bold text-green-700 mb-2 flex items-center gap-2 text-sm sm:text-base">
              <span className="w-6 h-6 sm:w-7 sm:h-7 bg-green-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm flex-shrink-0">
                4
              </span>
              Leaf Nodes
            </div>
            <p className="text-xs sm:text-sm text-gray-700">
              Terminal nodes contain final diagnosis predictions
            </p>
          </div>
        </div>
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg">
          <p className="text-xs sm:text-sm text-gray-800">
            <strong>🔑 Key Insight:</strong> Decision trees are interpretable! You can see exactly how the model makes decisions by following the path from symptoms to diagnosis. In Random Forest, many such trees vote together for the final prediction.
          </p>
        </div>
      </div>
    </div>
  );
}
