import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import DataBubbles from "@/components/DataBubbles";
import DataPipeline from "@/components/DataPipeline";
import { APP_LOGO, APP_TITLE } from "@/const";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated background bubbles */}
        <div className="absolute inset-0 z-0 opacity-60">
          <DataBubbles count={15} width={1200} height={600} interactive={false} />
        </div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <h1 className="text-6xl sm:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              {APP_TITLE}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 font-semibold">
              Data Science Workflow Visualization
            </p>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Explore the complete machine learning pipeline for disease prediction. From raw data to intelligent predictions—see how AI learns to diagnose.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link href="/eda">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold text-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🚀 Start Journey
              </motion.button>
            </Link>
            <motion.button
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg border-2 border-blue-500 shadow-lg hover:bg-blue-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📚 Learn More
            </motion.button>
          </motion.div>

          {/* Scroll indicator */}
          <div className="text-gray-400 animate-bounce">
            ↓ Scroll to explore ↓
          </div>
        </motion.div>
      </motion.section>

      {/* Pipeline Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2
          className="text-4xl font-bold text-gray-900 text-center mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          The Complete Pipeline
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Watch data flow through every stage of the machine learning workflow
        </motion.p>
        <DataPipeline bubbleCount={12} animationSpeed={2} />
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white bg-opacity-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-gray-900 text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            What You'll Learn
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "📊",
                title: "Exploratory Data Analysis",
                description: "Understand data through visualization and statistical analysis",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: "🧹",
                title: "Data Cleaning",
                description: "Transform raw data into clean, usable format",
                color: "from-green-500 to-green-600",
              },
              {
                icon: "⚙️",
                title: "Feature Engineering",
                description: "Create meaningful features for machine learning",
                color: "from-yellow-500 to-yellow-600",
              },
              {
                icon: "🤖",
                title: "Model Training",
                description: "Build and train Random Forest classifier",
                color: "from-red-500 to-red-600",
              },
              {
                icon: "📈",
                title: "Model Evaluation",
                description: "Assess model performance with metrics",
                color: "from-purple-500 to-purple-600",
              },
              {
                icon: "✨",
                title: "Predictions",
                description: "Make intelligent disease predictions",
                color: "from-pink-500 to-pink-600",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className={`p-6 rounded-lg bg-gradient-to-br ${feature.color} text-white shadow-lg hover:shadow-2xl transition-shadow`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-white text-opacity-90">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Statistics Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2
          className="text-4xl font-bold text-gray-900 text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          By The Numbers
        </motion.h2>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { label: "Training Records", value: "4,920", icon: "📊" },
            { label: "Diseases", value: "41", icon: "🦠" },
            { label: "Symptoms", value: "131", icon: "🔍" },
            { label: "Model Accuracy", value: "97.8%", icon: "✅" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-blue-500 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-semibold">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to Explore the Workflow?
          </motion.h2>
          <motion.p
            className="text-xl text-white text-opacity-90 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Dive deep into each stage of the data science pipeline
          </motion.p>
          <Link href="/eda">
            <motion.button
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Exploring →
            </motion.button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
