import React, { useState } from "react";
import { motion } from "framer-motion";
import { useD3BarChart, useD3ScatterChart, ChartData } from "@/hooks/useD3Chart";

export const EDAVisualizer: React.FC = () => {
  const [chartType, setChartType] = useState<"bar" | "scatter">("bar");

  // Sample data for symptoms frequency (count of occurrences)
  const symptomFrequency: ChartData[] = [
    { label: "Fatigue", value: 523, color: "#EF4444" },
    { label: "Vomiting", value: 498, color: "#F59E0B" },
    { label: "High Fever", value: 471, color: "#3B82F6" },
    { label: "Headache", value: 456, color: "#8B5CF6" },
    { label: "Nausea", value: 423, color: "#10B981" },
    { label: "Loss of Appetite", value: 398, color: "#EC4899" },
  ];

  // Sample data for disease distribution
  const diseaseDistribution: ChartData[] = [
    { label: "Malaria", value: 120, color: "#EF4444" },
    { label: "Dengue", value: 105, color: "#F59E0B" },
    { label: "COVID-19", value: 98, color: "#3B82F6" },
    { label: "Flu", value: 87, color: "#10B981" },
    { label: "Measles", value: 76, color: "#8B5CF6" },
  ];

  const barChartRef = useD3BarChart(symptomFrequency, 600, 400);
  const scatterChartRef = useD3ScatterChart(diseaseDistribution, 600, 400);

  return (
    <div className="w-full bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-lg border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Exploratory Data Analysis (EDA)
      </h3>

      {/* Chart type selector */}
      <div className="flex gap-4 mb-8">
        {[
          { type: "bar" as const, label: "Symptom Frequency", icon: "📊" },
          { type: "scatter" as const, label: "Disease Distribution", icon: "📈" },
        ].map((option) => (
          <motion.button
            key={option.type}
            onClick={() => setChartType(option.type)}
            className={`px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
              chartType === option.type
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 border border-gray-300"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{option.icon}</span>
            {option.label}
          </motion.button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart */}
        <motion.div
          className="bg-white p-6 rounded-lg border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="font-semibold text-gray-900 mb-4">
            Top Symptom Occurrences
          </h4>
          <svg ref={barChartRef} />
          <p className="text-sm text-gray-600 mt-4">
            Count of symptom occurrences across all disease records in the dataset (out of 4,920 total records).
          </p>
        </motion.div>

        {/* Scatter Chart */}
        <motion.div
          className="bg-white p-6 rounded-lg border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h4 className="font-semibold text-gray-900 mb-4">
            Disease Distribution
          </h4>
          <svg ref={scatterChartRef} />
          <p className="text-sm text-gray-600 mt-4">
            Distribution of diseases across the dataset. Malaria is the most
            common disease in our training data.
          </p>
        </motion.div>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Records", value: "4,920", icon: "📊" },
          { label: "Unique Diseases", value: "41", icon: "🦠" },
          { label: "Unique Symptoms", value: "131", icon: "🔍" },
          { label: "Data Quality", value: "100%", icon: "✅" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white p-4 rounded-lg border border-gray-200"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Key Insights */}
      <motion.div
        className="bg-white p-6 rounded-lg border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h4 className="font-semibold text-gray-900 mb-4">Key Insights from Raw Data</h4>
        <ul className="space-y-3">
          {[
            "131 unique symptoms identified across all diseases",
            "41 different diseases in the dataset",
            "Dataset contains 4,920 patient records",
            "Average 5-7 symptoms per patient record",
            "Raw data contains missing values - cleaning needed",
          ].map((insight, index) => (
            <motion.li
              key={index}
              className="flex items-start gap-3 p-3 bg-blue-50 rounded border border-blue-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <span className="text-blue-600 font-bold mt-1">✓</span>
              <span className="text-gray-700">{insight}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default EDAVisualizer;
