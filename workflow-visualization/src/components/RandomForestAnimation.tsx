import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Patient {
  id: number;
  symptoms: string[];
  actualDisease: string;
}

interface TreePrediction {
  treeId: number;
  prediction: string;
  confidence: number;
}

interface TreeNode {
  id: string;
  question: string;
  yesPath?: string;
  noPath?: string;
  prediction?: string;
  level: number;
}

interface RandomForestAnimationProps {
  treeCount?: number;
  maxDepth?: number;
}

const samplePatients: Patient[] = [
  { id: 1, symptoms: ["Fever", "Cough", "Chills"], actualDisease: "Malaria" },
  { id: 2, symptoms: ["Rash", "Fever", "Headache"], actualDisease: "Measles" },
  { id: 3, symptoms: ["Fever", "Fatigue", "Joint Pain"], actualDisease: "Dengue" },
];

// Simple tree structure - same for visualization clarity
const simpleTree: TreeNode[] = [
  { id: "root", question: "Has Fever?", yesPath: "node1", noPath: "cold", level: 0 },
  { id: "node1", question: "Has Cough?", yesPath: "node2", noPath: "dengue", level: 1 },
  { id: "node2", question: "Has Chills?", yesPath: "malaria", noPath: "flu", level: 2 },
  { id: "malaria", prediction: "Malaria", level: 3 },
  { id: "flu", prediction: "Flu", level: 3 },
  { id: "dengue", prediction: "Dengue", level: 2 },
  { id: "cold", prediction: "Common Cold", level: 1 },
];

// Simple node positions
const nodePositions: { [key: string]: { x: number; y: number } } = {
  root: { x: 50, y: 10 },
  node1: { x: 30, y: 35 },
  node2: { x: 15, y: 60 },
  cold: { x: 70, y: 35 },
  dengue: { x: 45, y: 60 },
  malaria: { x: 10, y: 85 },
  flu: { x: 25, y: 85 },
};

export const RandomForestAnimation: React.FC<RandomForestAnimationProps> = ({
  treeCount = 5,
  maxDepth = 4,
}) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState<Patient>(samplePatients[0]);
  const [treePredictions, setTreePredictions] = useState<TreePrediction[]>([]);
  const [finalPrediction, setFinalPrediction] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAllTrees, setShowAllTrees] = useState(false);
  const [allTreeResults, setAllTreeResults] = useState<{[key: number]: string}>({});

  const diseases = ["Malaria", "Dengue", "Measles", "Flu", "COVID-19"];





  // Simulate different predictions from different trees (Random Forest diversity)
  const getPredictionFromTree = (treeId: number, patient: Patient): string => {
    const hasFever = patient.symptoms.includes("Fever");
    const hasCough = patient.symptoms.includes("Cough");
    const hasChills = patient.symptoms.includes("Chills");
    const hasRash = patient.symptoms.includes("Rash");
    const hasFatigue = patient.symptoms.includes("Fatigue");
    
    // Different trees use different features (simulating Random Forest behavior)
    if (treeId === 1) {
      if (hasFever && hasCough && hasChills) return "Malaria";
      if (hasFever && hasCough) return "Flu";
      if (hasFever) return "Dengue";
      return "Common Cold";
    } else if (treeId === 2) {
      if (hasCough && hasFever && hasChills) return "Malaria";
      if (hasRash) return "Measles";
      if (hasFever) return "Dengue";
      return "Common Cold";
    } else if (treeId === 3) {
      if (hasChills && hasFever) return "Malaria";
      if (hasFever && hasFatigue) return "Dengue";
      if (hasRash) return "Measles";
      return "Common Cold";
    } else if (treeId === 4) {
      if (hasRash) return "Measles";
      if (hasFever && hasCough && hasChills) return "Malaria";
      if (hasFever) return "Flu";
      return "Common Cold";
    } else {
      if (hasFever && hasFatigue) return "Dengue";
      if (hasFever && hasCough && hasChills) return "Malaria";
      if (hasFever) return "Flu";
      return "Common Cold";
    }
  };

  // Show all trees predictions
  const analyzeWithAllTrees = () => {
    setShowAllTrees(true);
    const results: {[key: number]: string} = {};
    
    for (let i = 1; i <= 5; i++) {
      results[i] = getPredictionFromTree(i, selectedPatient);
    }
    
    setAllTreeResults(results);
  };

  const simulatePrediction = () => {
    setIsAnimating(true);
    setCurrentStage(1);
    setTreePredictions([]);
    setFinalPrediction("");

    // Stage 1: Show patient data
    setTimeout(() => {
      setCurrentStage(2);
      
      // Stage 2: Each tree makes prediction
      const predictions: TreePrediction[] = [];
      
      for (let i = 0; i < treeCount; i++) {
        setTimeout(() => {
          // Simulate each tree making a prediction
          // Trees should mostly agree but with some variation
          let prediction: string;
          if (Math.random() > 0.2) {
            // 80% chance of correct prediction
            prediction = selectedPatient.actualDisease;
          } else {
            // 20% chance of different prediction
            prediction = diseases[Math.floor(Math.random() * diseases.length)];
          }
          
          const confidence = 0.7 + Math.random() * 0.3;
          predictions.push({ treeId: i + 1, prediction, confidence });
          setTreePredictions([...predictions]);
          
          // After all trees predicted, move to voting
          if (i === treeCount - 1) {
            setTimeout(() => {
              setCurrentStage(3);
              
              // Stage 3: Majority voting
              const voteCounts: { [key: string]: number } = {};
              predictions.forEach(p => {
                voteCounts[p.prediction] = (voteCounts[p.prediction] || 0) + 1;
              });
              
              const winner = Object.entries(voteCounts).reduce((a, b) => 
                b[1] > a[1] ? b : a
              )[0];
              
              setTimeout(() => {
                setFinalPrediction(winner);
                setCurrentStage(4);
                setIsAnimating(false);
              }, 1000);
            }, 500);
          }
        }, i * 800);
      }
    }, 1000);
  };

  const reset = () => {
    setCurrentStage(0);
    setTreePredictions([]);
    setFinalPrediction("");
    setIsAnimating(false);
    setShowAllTrees(false);
    setAllTreeResults({});
  };

  const getVoteCounts = () => {
    const counts: { [key: string]: number } = {};
    treePredictions.forEach(p => {
      counts[p.prediction] = (counts[p.prediction] || 0) + 1;
    });
    return counts;
  };

  const voteCounts = getVoteCounts();

  return (
    <div className="w-full bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-lg border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        🌲 Random Forest: How Ensemble Learning Works
      </h3>

      {/* Progress Indicator */}
      <div className="bg-white p-4 rounded-lg mb-6 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          {["Select Patient", "Trees Predict", "Majority Vote", "Final Result"].map((stage, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  currentStage > idx ? "bg-green-500 text-white" :
                  currentStage === idx ? "bg-blue-500 text-white animate-pulse" :
                  "bg-gray-300 text-gray-600"
                }`}>
                  {currentStage > idx ? "✓" : idx + 1}
                </div>
                <span className="text-xs mt-1 text-gray-600">{stage}</span>
              </div>
              {idx < 3 && <div className="flex-1 h-1 bg-gray-300 mx-2"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Patient Selection */}
      <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">👤 Select Patient to Diagnose:</h4>
        <div className="grid md:grid-cols-3 gap-4">
          {samplePatients.map((patient) => (
            <motion.div
              key={patient.id}
              onClick={() => !isAnimating && setSelectedPatient(patient)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedPatient.id === patient.id
                  ? "border-blue-500 bg-blue-50 shadow-lg"
                  : "border-gray-300 hover:border-blue-300"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="font-bold text-gray-900 mb-2">Patient #{patient.id}</div>
              <div className="text-sm text-gray-600 mb-2">Symptoms:</div>
              <div className="flex flex-wrap gap-1">
                {patient.symptoms.map((symptom, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {symptom}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Random Forest Visualization - All Trees */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl mb-6 border-2 border-green-400 shadow-lg">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">🌲 Random Forest = Many Trees Working Together</h3>
          <p className="text-gray-700">Each tree votes for a prediction. The disease with the most votes wins!</p>
        </div>

        <motion.button
          onClick={analyzeWithAllTrees}
          disabled={isAnimating}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ▶ Run Random Forest Prediction
        </motion.button>

        {showAllTrees && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* All 5 Trees Visualization */}
            <div className="bg-white p-6 rounded-xl shadow-xl border-2 border-green-500">
              <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">
                🌳 All 5 Decision Trees Making Predictions
              </h4>
              
              <div className="grid md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((treeId) => {
                  const prediction = allTreeResults[treeId];
                  const isCorrect = prediction === selectedPatient.actualDisease;
                  
                  return (
                    <motion.div
                      key={treeId}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: treeId * 0.2, type: "spring" }}
                      className="relative"
                    >
                      {/* Tree visualization */}
                      <div className="bg-gradient-to-b from-green-100 to-emerald-50 p-4 rounded-xl border-2 border-green-300 shadow-lg">
                        <div className="text-center mb-3">
                          <div className="text-4xl mb-2">🌳</div>
                          <div className="font-bold text-gray-900 text-lg">Tree {treeId}</div>
                        </div>
                        
                        {/* Simple tree structure visual */}
                        <div className="space-y-2 mb-4">
                          <div className="bg-white p-2 rounded text-xs text-center font-semibold text-gray-700 border border-gray-300">
                            ? ? ?
                          </div>
                          <div className="flex justify-center gap-1">
                            <div className="w-px h-4 bg-gray-400"></div>
                          </div>
                          <div className="bg-white p-2 rounded text-xs text-center font-semibold text-gray-700 border border-gray-300">
                            Analyzing...
                          </div>
                        </div>
                        
                        {/* Prediction result */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: treeId * 0.2 + 0.5, type: "spring", stiffness: 200 }}
                          className={`p-3 rounded-lg text-center font-bold ${
                            isCorrect 
                              ? "bg-green-500 text-white" 
                              : "bg-orange-400 text-white"
                          }`}
                        >
                          <div className="text-xs mb-1">Predicts:</div>
                          <div className="text-sm">{prediction}</div>
                        </motion.div>
                        
                        {isCorrect && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: treeId * 0.2 + 0.7 }}
                            className="text-center mt-2 text-green-600 font-bold text-xs"
                          >
                            ✓ Correct!
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Voting Process */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-400 shadow-xl">
              <h4 className="text-xl font-bold text-gray-900 mb-4 text-center flex items-center justify-center gap-2">
                <span className="text-3xl">🗳️</span>
                Step 2: Trees Vote Together
              </h4>
              
              <div className="space-y-4">
                {(() => {
                  const voteCounts: { [key: string]: number } = {};
                  Object.values(allTreeResults).forEach(pred => {
                    voteCounts[pred] = (voteCounts[pred] || 0) + 1;
                  });
                  
                  const sortedVotes = Object.entries(voteCounts).sort(([,a], [,b]) => b - a);
                  const winner = sortedVotes[0]?.[0];
                  
                  return sortedVotes.map(([disease, count]) => (
                    <div key={disease}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-28 font-bold text-gray-900">{disease}:</div>
                        <div className="flex gap-1">
                          {Array.from({ length: count }).map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: i * 0.1 + 1.5 }}
                              className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs"
                            >
                              ✓
                            </motion.div>
                          ))}
                        </div>
                        <div className="font-bold text-gray-700">
                          ({count} vote{count !== 1 ? 's' : ''})
                        </div>
                        {disease === winner && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 2, type: "spring" }}
                            className="px-3 py-1 bg-yellow-400 text-gray-900 rounded-full text-sm font-bold"
                          >
                            🏆 WINNER
                          </motion.span>
                        )}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Final Result */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 2.5, type: "spring" }}
              className="bg-gradient-to-r from-green-400 to-emerald-500 p-8 rounded-xl shadow-2xl text-center"
            >
              <h4 className="text-2xl font-bold text-white mb-4">🎯 Random Forest Final Prediction</h4>
              <div className="bg-white p-6 rounded-xl">
                <div className="text-5xl font-bold text-green-600 mb-3">
                  {(() => {
                    const voteCounts: { [key: string]: number } = {};
                    Object.values(allTreeResults).forEach(pred => {
                      voteCounts[pred] = (voteCounts[pred] || 0) + 1;
                    });
                    return Object.entries(voteCounts).sort(([,a], [,b]) => b - a)[0]?.[0];
                  })()}
                </div>
                <div className="text-gray-700 text-lg mb-4">
                  <strong>Actual Disease:</strong> <span className="text-blue-600 font-bold">{selectedPatient.actualDisease}</span>
                </div>
                {(() => {
                  const voteCounts: { [key: string]: number } = {};
                  Object.values(allTreeResults).forEach(pred => {
                    voteCounts[pred] = (voteCounts[pred] || 0) + 1;
                  });
                  const winner = Object.entries(voteCounts).sort(([,a], [,b]) => b - a)[0]?.[0];
                  return winner === selectedPatient.actualDisease ? (
                    <div className="text-2xl font-bold text-green-600">✅ CORRECT PREDICTION!</div>
                  ) : (
                    <div className="text-2xl font-bold text-red-600">❌ INCORRECT</div>
                  );
                })()}
              </div>
            </motion.div>

            {/* Simple Explanation */}
            <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-400">
              <h5 className="font-bold text-gray-900 mb-3 text-lg">💡 How Random Forest Works (Simple!)</h5>
              <div className="space-y-2 text-gray-700">
                <p>✅ <strong>Step 1:</strong> Create 5 different decision trees</p>
                <p>✅ <strong>Step 2:</strong> Each tree analyzes the patient and makes its own prediction</p>
                <p>✅ <strong>Step 3:</strong> Count the votes - which disease got the most votes?</p>
                <p>✅ <strong>Step 4:</strong> The disease with most votes = Final Prediction!</p>
                <p className="mt-4 p-3 bg-white rounded-lg border-l-4 border-yellow-500">
                  <strong>Why it works:</strong> Even if 1-2 trees make mistakes, the majority of trees usually gets it right! This is called <strong>"Ensemble Learning"</strong>.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Simple explanation of ensemble */}
      {showAllTrees && (
        <div className="bg-white p-6 rounded-lg mb-6 border-2 border-gray-300">
          <h4 className="font-semibold text-gray-900 text-center mb-4">🎓 What You Just Saw</h4>
          <div className="text-gray-700 space-y-2">
            <p>✅ <strong>5 Independent Trees:</strong> Each tree analyzed the patient separately</p>
            <p>✅ <strong>Different Predictions:</strong> Trees may disagree (that's normal!)</p>
            <p>✅ <strong>Democratic Voting:</strong> The disease with most votes wins</p>
            <p>✅ <strong>Better Accuracy:</strong> Combining multiple trees reduces errors</p>
          </div>
        </div>
      )}

      {!showAllTrees && (
        <div className="bg-purple-50 p-8 rounded-lg text-center border-2 border-purple-200">
          <div className="text-4xl mb-4">🌲</div>
          <p className="text-gray-700 font-semibold">Click "Run Random Forest Prediction" button above to see all 5 trees in action!</p>
        </div>
      )}

      {/* Original ensemble section below */}
      {false && (
          <div className="space-y-6 hidden">
            {/* Patient Info Header - REMOVED FOR SIMPLICITY */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 rounded-lg shadow-lg">
              <div className="text-center">
                <div className="text-white text-sm font-semibold mb-2">🔍 Analyzing Patient #{selectedPatient.id}</div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {selectedPatient.symptoms.map((symptom, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-white text-purple-700 rounded-full text-sm font-bold shadow">
                      ✓ {symptom}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Decision Journey - Step by Step */}
            {decisionHistory.length > 0 && (
              <motion.div 
                className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">🔄</span>
                  Decision Journey (Step-by-Step)
                </h5>
                <div className="space-y-2">
                  {decisionHistory.map((item, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.3 }}
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">{item.node}</div>
                        <div className="text-xs text-gray-600">{item.reason}</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.decision === "YES" 
                          ? "bg-green-500 text-white" 
                          : "bg-red-500 text-white"
                      }`}>
                        {item.decision === "YES" ? "✓ YES" : "✗ NO"}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Tree Structure Visualization */}
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 rounded-xl shadow-inner relative border-2 border-purple-200">
              <div className="text-center mb-6">
                <h5 className="text-lg font-bold text-gray-800">🌳 Decision Tree Structure</h5>
                <p className="text-sm text-gray-600">Watch how the algorithm navigates through questions</p>
              </div>
              
              <div className="relative" style={{ height: "580px" }}>
                {/* SVG for connections with clear arrows and labels */}
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                  <defs>
                    <linearGradient id="activeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: "#8b5cf6", stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: "#6366f1", stopOpacity: 1 }} />
                    </linearGradient>
                    <marker
                      id="arrowActive"
                      markerWidth="10"
                      markerHeight="10"
                      refX="8"
                      refY="3"
                      orient="auto"
                      markerUnits="strokeWidth"
                    >
                      <path d="M0,0 L0,6 L9,3 z" fill="#8b5cf6" />
                    </marker>
                    <marker
                      id="arrowInactive"
                      markerWidth="10"
                      markerHeight="10"
                      refX="8"
                      refY="3"
                      orient="auto"
                      markerUnits="strokeWidth"
                    >
                      <path d="M0,0 L0,6 L9,3 z" fill="#d1d5db" />
                    </marker>
                  </defs>
                  
                  {/* Draw all connections with arrows */}
                  {simpleTree.map((node) => {
                    if (node.yesPath && nodePositions[node.id] && nodePositions[node.yesPath]) {
                      const from = nodePositions[node.id];
                      const to = nodePositions[node.yesPath];
                      const isActive = isPathActive(node.id, node.yesPath);
                      const midX = (from.x + to.x) / 2;
                      const midY = (from.y + to.y) / 2;
                      
                      return (
                        <g key={`${node.id}-${node.yesPath}`}>
                          <motion.line
                            x1={`${from.x}%`}
                            y1={`${from.y + 3}%`}
                            x2={`${to.x}%`}
                            y2={`${to.y - 3}%`}
                            stroke={isActive ? "url(#activeGradient)" : "#d1d5db"}
                            strokeWidth={isActive ? "5" : "2.5"}
                            markerEnd={isActive ? "url(#arrowActive)" : "url(#arrowInactive)"}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ 
                              pathLength: 1, 
                              opacity: isActive ? 1 : 0.3,
                            }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                          />
                          {/* YES label with background */}
                          <rect
                            x={`${midX - 3.5}%`}
                            y={`${midY - 2}%`}
                            width="7%"
                            height="4%"
                            fill={isActive ? "#22c55e" : "#f3f4f6"}
                            rx="4"
                            opacity={isActive ? 1 : 0.8}
                          />
                          <text
                            x={`${midX}%`}
                            y={`${midY + 0.8}%`}
                            fill={isActive ? "white" : "#6b7280"}
                            fontSize="12"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            ✓ YES
                          </text>
                        </g>
                      );
                    }
                    if (node.noPath && nodePositions[node.id] && nodePositions[node.noPath]) {
                      const from = nodePositions[node.id];
                      const to = nodePositions[node.noPath];
                      const isActive = isPathActive(node.id, node.noPath);
                      const midX = (from.x + to.x) / 2;
                      const midY = (from.y + to.y) / 2;
                      
                      return (
                        <g key={`${node.id}-${node.noPath}`}>
                          <motion.line
                            x1={`${from.x}%`}
                            y1={`${from.y + 3}%`}
                            x2={`${to.x}%`}
                            y2={`${to.y - 3}%`}
                            stroke={isActive ? "url(#activeGradient)" : "#d1d5db"}
                            strokeWidth={isActive ? "5" : "2.5"}
                            markerEnd={isActive ? "url(#arrowActive)" : "url(#arrowInactive)"}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ 
                              pathLength: 1, 
                              opacity: isActive ? 1 : 0.3,
                            }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                          />
                          {/* NO label with background */}
                          <rect
                            x={`${midX - 3.5}%`}
                            y={`${midY - 2}%`}
                            width="7%"
                            height="4%"
                            fill={isActive ? "#ef4444" : "#f3f4f6"}
                            rx="4"
                            opacity={isActive ? 1 : 0.8}
                          />
                          <text
                            x={`${midX}%`}
                            y={`${midY + 0.8}%`}
                            fill={isActive ? "white" : "#6b7280"}
                            fontSize="12"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            ✗ NO
                          </text>
                        </g>
                      );
                    }
                    return null;
                  })}
                </svg>

                {/* Nodes with improved styling and clarity */}
                {simpleTree.map((node) => {
                  const pos = nodePositions[node.id];
                  if (!pos) return null;
                  
                  const isCurrentNode = currentNode === node.id;
                  const isInPath = traversalPath.includes(node.id);
                  const isPastNode = traversalPath.indexOf(node.id) < traversalPath.indexOf(currentNode);
                  const isLeaf = !!node.prediction;
                  
                  return (
                    <motion.div
                      key={node.id}
                      className="absolute"
                      style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        transform: "translate(-50%, -50%)",
                        zIndex: isCurrentNode ? 20 : isInPath ? 15 : 10,
                      }}
                      initial={{ scale: 0, opacity: 0, y: -20 }}
                      animate={{ 
                        scale: isCurrentNode ? 1.1 : 1, 
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{ 
                        duration: 0.5,
                        scale: { duration: 0.3 },
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                      }}
                    >
                      <motion.div
                        className={`relative px-5 py-3 rounded-2xl font-bold text-center shadow-xl border-3 ${
                          isLeaf
                            ? isCurrentNode || isInPath
                              ? "bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 text-white border-green-300"
                              : "bg-white border-gray-300 text-gray-600"
                            : isCurrentNode
                            ? "bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600 text-white border-purple-300 ring-4 ring-purple-300 ring-opacity-50"
                            : isPastNode
                            ? "bg-gradient-to-br from-purple-300 to-indigo-400 text-white border-purple-200"
                            : "bg-white border-gray-300 text-gray-700"
                        }`}
                        animate={isCurrentNode ? {
                          boxShadow: [
                            "0 4px 6px rgba(0,0,0,0.1)",
                            "0 15px 30px rgba(139,92,246,0.6)",
                            "0 4px 6px rgba(0,0,0,0.1)"
                          ]
                        } : {}}
                        transition={{ duration: 1.5, repeat: isCurrentNode ? Infinity : 0 }}
                        style={{ minWidth: isLeaf ? "110px" : "150px" }}
                      >
                        {/* Status indicator */}
                        {isCurrentNode && (
                          <motion.div
                            className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <span className="text-xs">⚡</span>
                          </motion.div>
                        )}
                        {isPastNode && !isCurrentNode && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-white">✓</span>
                          </div>
                        )}
                        
                        <div className={`text-xs mb-1 ${isInPath ? "opacity-90" : "opacity-60"}`}>
                          {isLeaf ? "🎯 RESULT" : `❓ Question ${node.level + 1}`}
                        </div>
                        <div className={`${isLeaf ? "text-base" : "text-sm"} leading-tight`}>
                          {node.prediction || node.question}
                        </div>
                      </motion.div>
                      
                      {/* Current decision indicator - larger and clearer */}
                      {isCurrentNode && !isLeaf && (
                        <motion.div
                          className="mt-3 text-center"
                          initial={{ opacity: 0, scale: 0.5, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ duration: 0.4, type: "spring" }}
                        >
                          {(() => {
                            const symptomInQuestion = node.question.match(/Has ([\w\s]+)\?/)?.[1] || "";
                            const hasSymptom = selectedPatient.symptoms.some(s => 
                              s.toLowerCase() === symptomInQuestion.toLowerCase()
                            );
                            return (
                              <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                                hasSymptom 
                                  ? "bg-green-500 text-white" 
                                  : "bg-red-500 text-white"
                              }`}>
                                {hasSymptom ? "✓ YES" : "✗ NO"}
                              </div>
                            );
                          })()}
                        </motion.div>
                      )}

                      {/* Final result indicator */}
                      {isCurrentNode && isLeaf && (
                        <motion.div
                          className="mt-3 text-center"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3, type: "spring" }}
                        >
                          <div className="inline-block px-4 py-2 bg-yellow-400 text-gray-900 rounded-full text-sm font-bold shadow-lg">
                            🎉 FINAL ANSWER
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Tree Decision Result */}
            {treePredictionResult && (
              <motion.div
                className="bg-green-50 border-2 border-green-500 p-4 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">This Tree Predicts:</div>
                    <div className="text-2xl font-bold text-green-700">{treePredictionResult}</div>
                  </div>
                  <div className="text-5xl">🌳</div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  <strong>Decision Path:</strong> {traversalPath.map(nodeId => {
                    const node = simpleTree.find(n => n.id === nodeId);
                    return node?.question || node?.prediction;
                  }).join(" → ")}
                </div>
              </motion.div>
            )}

            {/* Clear Explanation Box */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-300 shadow-md">
              <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                <span className="text-2xl">💡</span>
                How This Decision Tree Works
              </h5>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
                    Start at Root
                  </div>
                  <p className="text-sm text-gray-700">Begin at the top node with patient's symptoms</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="font-bold text-purple-700 mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs">2</span>
                    Ask Questions
                  </div>
                  <p className="text-sm text-gray-700">Each node checks if patient has a specific symptom</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="font-bold text-green-700 mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">3</span>
                    Follow Path
                  </div>
                  <p className="text-sm text-gray-700"><span className="font-semibold text-green-600">YES</span> goes left, <span className="font-semibold text-red-600">NO</span> goes right</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="font-bold text-green-700 mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">4</span>
                    Reach Result
                  </div>
                  <p className="text-sm text-gray-700">End at a leaf node showing the predicted disease</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 rounded">
                <p className="text-sm text-gray-800">
                  <strong>Key Insight:</strong> The tree makes ONE prediction. Random Forest combines many trees' predictions through voting!
                </p>
              </div>
            </div>
          </div>
        )}

      {/* Individual Trees for Ensemble Voting */}
      {currentStage >= 2 && (
        <motion.div
          className="bg-white p-6 rounded-lg mb-6 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h4 className="font-semibold text-gray-900 mb-4">🌲 Individual Tree Predictions:</h4>
          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: treeCount }).map((_, idx) => {
              const prediction = treePredictions.find(p => p.treeId === idx + 1);
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.2 }}
                  className={`p-4 rounded-lg border-2 text-center ${
                    prediction
                      ? prediction.prediction === selectedPatient.actualDisease
                        ? "border-green-500 bg-green-50"
                        : "border-orange-500 bg-orange-50"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className="text-3xl mb-2">🌲</div>
                  <div className="font-bold text-sm mb-1">Tree {idx + 1}</div>
                  {prediction ? (
                    <>
                      <div className="text-xs font-semibold text-gray-900">{prediction.prediction}</div>
                      <div className="text-xs text-gray-600">{(prediction.confidence * 100).toFixed(0)}%</div>
                    </>
                  ) : (
                    <div className="text-xs text-gray-400">Waiting...</div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Voting Process */}
      {currentStage >= 3 && (
        <motion.div
          className="bg-white p-6 rounded-lg mb-6 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h4 className="font-semibold text-gray-900 mb-4">🗳️ Majority Voting:</h4>
          <div className="space-y-3">
            {Object.entries(voteCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([disease, count]) => (
                <div key={disease} className="flex items-center gap-4">
                  <div className="w-32 font-semibold text-gray-900">{disease}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                    <motion.div
                      className={`h-full flex items-center justify-end px-3 font-bold text-white ${
                        disease === finalPrediction ? "bg-green-500" : "bg-blue-400"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / treeCount) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    >
                      {count} votes
                    </motion.div>
                  </div>
                  <div className="w-16 text-right text-gray-600">
                    {((count / treeCount) * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Final Result */}
      {currentStage >= 4 && (
        <motion.div
          className={`p-6 rounded-lg mb-6 border-2 ${
            finalPrediction === selectedPatient.actualDisease
              ? "bg-green-50 border-green-500"
              : "bg-red-50 border-red-500"
          }`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h4 className="font-semibold text-gray-900 mb-4 text-xl">🎯 Final Prediction:</h4>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold mb-2">
                {finalPrediction}
              </div>
              <div className="text-sm text-gray-600">
                Confidence: {((voteCounts[finalPrediction] / treeCount) * 100).toFixed(0)}%
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Actual Disease:</div>
              <div className="text-xl font-bold">{selectedPatient.actualDisease}</div>
              {finalPrediction === selectedPatient.actualDisease ? (
                <div className="text-green-600 font-semibold mt-2">✅ Correct!</div>
              ) : (
                <div className="text-red-600 font-semibold mt-2">❌ Incorrect</div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* How It Works */}
      <div className="bg-blue-50 p-6 rounded-lg mb-6 border border-blue-200">
        <h4 className="font-semibold text-gray-900 mb-3">💡 How Random Forest Works:</h4>
        <ol className="space-y-2 text-sm text-gray-700">
          <li><strong>1. Multiple Trees:</strong> Create {treeCount} independent decision trees</li>
          <li><strong>2. Each Decides:</strong> Every tree analyzes symptoms and predicts a disease</li>
          <li><strong>3. Majority Vote:</strong> The disease predicted by most trees wins</li>
          <li><strong>4. Better Accuracy:</strong> Combining trees reduces individual errors</li>
        </ol>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4 justify-center">
        <motion.button
          onClick={simulatePrediction}
          disabled={isAnimating}
          className="px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isAnimating ? "⚙️ Predicting..." : "▶ Start Prediction"}
        </motion.button>
        <motion.button
          onClick={reset}
          disabled={isAnimating || currentStage === 0}
          className="px-8 py-3 bg-gray-500 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ↺ Reset
        </motion.button>
      </div>
    </div>
  );
};

export default RandomForestAnimation;
