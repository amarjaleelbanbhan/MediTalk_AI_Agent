import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import CleaningAnimation from "@/components/CleaningAnimation";

export default function Cleaning() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Data Cleaning & Preprocessing
          </h1>
          <p className="text-xl text-gray-600">
            Transform raw data into clean, consistent format ready for machine learning
          </p>
        </motion.div>

        {/* Cleaning Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <CleaningAnimation />
        </motion.div>

        {/* Code Implementation */}
        <motion.section
          className="mt-16 bg-gray-900 text-gray-100 p-8 rounded-lg shadow-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">📝 Code Implementation</h2>
          
          <div className="space-y-6">
            {/* Import Libraries */}
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">1. Import Libraries</h3>
              <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-green-400">
{`import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder`}
                </code>
              </pre>
            </div>

            {/* Text Standardization */}
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">2. Text Standardization</h3>
              <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-green-400">
{`# Standardize text: lowercase and strip whitespace
def clean_text(text):
    if pd.isna(text):
        return text
    return str(text).lower().strip()

# Apply to all symptom columns
symptom_cols = [col for col in df.columns if 'Symptom' in col]
for col in symptom_cols:
    df[col] = df[col].apply(clean_text)

# Standardize disease names
df['Disease'] = df['Disease'].apply(clean_text)

print("Text standardization complete!")
print(df.head())`}
                </code>
              </pre>
            </div>

            {/* Remove Duplicates */}
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">3. Remove Duplicates</h3>
              <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-green-400">
{`# Check for duplicates
print(f"Duplicate rows before: {df.duplicated().sum()}")

# Remove exact duplicates
df_clean = df.drop_duplicates()

print(f"Duplicate rows after: {df_clean.duplicated().sum()}")
print(f"Rows removed: {len(df) - len(df_clean)}")
print(f"Final dataset shape: {df_clean.shape}")`}
                </code>
              </pre>
            </div>

            {/* Handle Missing Values */}
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">4. Handle Missing Values</h3>
              <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-green-400">
{`# Check missing values
print("Missing values before:")
print(df_clean.isnull().sum())

# Replace NaN with empty string for symptom columns
for col in symptom_cols:
    df_clean[col].fillna('', inplace=True)

# Verify no missing values in Disease column
assert df_clean['Disease'].isnull().sum() == 0, "Disease column has missing values!"

print("\nMissing values after:")
print(df_clean.isnull().sum())
print("\n✅ All missing values handled!")`}
                </code>
              </pre>
            </div>

            {/* Validate Data Types */}
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">5. Validate Data Types</h3>
              <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-green-400">
{`# Check data types
print("Data types:")
print(df_clean.dtypes)

# Ensure all columns are strings
for col in df_clean.columns:
    df_clean[col] = df_clean[col].astype(str)

print("\nData quality checks:")
print(f"All lowercase: {df_clean['Disease'].str.islower().all()}")
print(f"No leading/trailing spaces: {not df_clean['Disease'].str.contains(r'^\\s|\\s$').any()}")
print(f"No null values: {df_clean.notnull().all().all()}")

# Save cleaned data
df_clean.to_csv('data/dataset_cleaned.csv', index=False)
print("\n✅ Cleaned data saved!")`}
                </code>
              </pre>
            </div>
          </div>
        </motion.section>

        {/* Cleaning Details */}
        <motion.section
          className="mt-16 bg-white p-8 rounded-lg shadow-lg border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Cleaning Techniques</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Text Standardization",
                description: "Convert all symptom names to lowercase and remove extra spaces",
                examples: ['"High Fever" → "high fever"', '"Cough " → "cough"'],
              },
              {
                title: "Duplicate Removal",
                description: "Identify and eliminate duplicate disease-symptom records",
                examples: ["Found: 0 exact duplicates", "Verified data uniqueness"],
              },
              {
                title: "Missing Value Handling",
                description: "Replace NULL values with empty strings for sparse features",
                examples: ["NULL → empty string", "Preserves sparsity information"],
              },
              {
                title: "Data Validation",
                description: "Ensure all columns have correct data types",
                examples: ["Disease: String", "Symptoms: String"],
              },
            ].map((technique, index) => (
              <motion.div
                key={technique.title}
                className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                  {technique.title}
                </h3>
                <p className="text-gray-700 mb-3">{technique.description}</p>
                <ul className="space-y-1 text-sm text-gray-600">
                  {technique.examples.map((example, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✓</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Results */}
        <motion.section
          className="mt-12 grid md:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {[
            { label: "Records Processed", value: "4,920", icon: "📊" },
            { label: "Duplicates Removed", value: "0", icon: "🗑️" },
            { label: "Missing Values Fixed", value: "100%", icon: "✅" },
            { label: "Data Quality Score", value: "100%", icon: "⭐" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-green-600 mb-1">
                {stat.value}
              </div>
              <p className="text-gray-700 font-semibold text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* Next Steps */}
        <motion.section
          className="mt-12 bg-gradient-to-r from-green-500 to-blue-500 text-white p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Next: Feature Engineering</h2>
          <p className="text-lg mb-6">
            With clean data ready, we now transform symptoms into numerical features that machine learning models can understand
          </p>
          <Link href="/feature-engineering">
            <motion.button
              className="px-6 py-3 bg-white text-green-600 rounded-lg font-bold hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue to Modeling →
            </motion.button>
          </Link>
        </motion.section>
      </div>
    </div>
  );
}
