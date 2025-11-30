import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import EDAVisualizer from "@/components/EDAVisualizer";

export default function EDA() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Exploratory Data Analysis
          </h1>
          <p className="text-xl text-gray-600">
            Understand the structure, patterns, and relationships in our disease-symptom dataset
          </p>
        </motion.div>

        {/* EDA Visualizer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <EDAVisualizer />
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
{`# Data manipulation and analysis
import pandas as pd
import numpy as np

# Visualization
import matplotlib.pyplot as plt
import seaborn as sns

# Set plot style
sns.set_style('whitegrid')
plt.rcParams['figure.figsize'] = (12, 6)`}
                </code>
              </pre>
            </div>

            {/* Load Data */}
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">2. Load Dataset</h3>
              <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-green-400">
{`# Load the disease-symptom dataset
df = pd.read_csv('data/dataset.csv')

# Display basic information
print(f"Dataset shape: {df.shape}")
print(f"\nFirst 5 rows:")
print(df.head())

# Output:
# Dataset shape: (4920, 18)
# Columns: Disease, Symptom_1, Symptom_2, ..., Symptom_17`}
                </code>
              </pre>
            </div>

            {/* Explore Data */}
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">3. Exploratory Analysis</h3>
              <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-green-400">
{`# Check for missing values
print("Missing values per column:")
print(df.isnull().sum())

# Get unique diseases and symptoms
print(f"\nUnique diseases: {df['Disease'].nunique()}")
print(f"Disease list: {sorted(df['Disease'].unique())}")

# Analyze symptom frequency
symptom_cols = [col for col in df.columns if 'Symptom' in col]
all_symptoms = df[symptom_cols].values.flatten()
all_symptoms = [s for s in all_symptoms if pd.notna(s)]
symptom_freq = pd.Series(all_symptoms).value_counts()

print(f"\nTotal unique symptoms: {len(symptom_freq)}")
print(f"\nTop 10 symptoms:")
print(symptom_freq.head(10))`}
                </code>
              </pre>
            </div>

            {/* Visualizations */}
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">4. Create Visualizations</h3>
              <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-green-400">
{`# Plot disease distribution
plt.figure(figsize=(14, 6))
disease_counts = df['Disease'].value_counts().head(10)
disease_counts.plot(kind='bar', color='skyblue', edgecolor='navy')
plt.title('Top 10 Most Common Diseases in Dataset', fontsize=16, fontweight='bold')
plt.xlabel('Disease', fontsize=12)
plt.ylabel('Frequency (Count)', fontsize=12)
plt.xticks(rotation=45, ha='right')
plt.grid(axis='y', alpha=0.3)
plt.tight_layout()
plt.savefig('disease_distribution.png', dpi=300, bbox_inches='tight')
plt.show()

# Plot symptom frequency
plt.figure(figsize=(14, 8))
top_symptoms = symptom_freq.head(15)
top_symptoms.plot(kind='barh', color='coral', edgecolor='darkred')
plt.title('Top 15 Most Common Symptoms Across All Diseases', fontsize=16, fontweight='bold')
plt.xlabel('Frequency (Count)', fontsize=12)
plt.ylabel('Symptom', fontsize=12)
plt.grid(axis='x', alpha=0.3)
plt.tight_layout()
plt.savefig('symptom_frequency.png', dpi=300, bbox_inches='tight')
plt.show()

# Symptom co-occurrence analysis
print("\\n📊 Creating symptom co-occurrence analysis...")
import itertools
from collections import Counter

# Get symptom pairs for co-occurrence
symptom_pairs = []
for _, row in df.iterrows():
    symptoms = [row[col] for col in symptom_cols if pd.notna(row[col])]
    pairs = list(itertools.combinations(sorted(symptoms), 2))
    symptom_pairs.extend(pairs)

pair_freq = Counter(symptom_pairs).most_common(10)
print("Top 10 symptom pairs that occur together:")
for (s1, s2), count in pair_freq:
    print(f"{s1} + {s2}: {count} times")`}
                </code>
              </pre>
            </div>

            {/* Statistical Summary */}
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">5. Statistical Summary & Data Quality</h3>
              <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-green-400">
{`# Generate comprehensive summary statistics
print("\\n📊 Dataset Statistics:")
print(f"Total records: {len(df):,}")
print(f"Total columns: {len(df.columns)}")
print(f"Unique diseases: {df['Disease'].nunique()}")
print(f"Unique symptoms: {len(symptom_freq)}")
print(f"Avg symptoms per record: {len(all_symptoms) / len(df):.2f}")
print(f"Total symptom columns: {len(symptom_cols)}")

# Data completeness analysis
total_cells = df.size
missing_cells = df.isnull().sum().sum()
filled_cells = total_cells - missing_cells
completeness = (filled_cells / total_cells) * 100

print(f"\\n📈 Data Quality Metrics:")
print(f"Total cells: {total_cells:,}")
print(f"Filled cells: {filled_cells:,}")
print(f"Missing cells: {missing_cells:,}")
print(f"Data completeness: {completeness:.2f}%")

# Check class balance (important for ML)
print("\\n⚖️ Class Balance Analysis:")
disease_counts = df['Disease'].value_counts()
print(disease_counts.describe())
print(f"\\nMost common: {disease_counts.index[0]} ({disease_counts.iloc[0]} cases)")
print(f"Least common: {disease_counts.index[-1]} ({disease_counts.iloc[-1]} cases)")
print(f"Balance ratio: {disease_counts.iloc[0] / disease_counts.iloc[-1]:.2f}x")

# Symptoms per disease analysis
symptoms_per_row = df[symptom_cols].notna().sum(axis=1)
print(f"\\n🔍 Symptoms Distribution:")
print(f"Min symptoms: {symptoms_per_row.min()}")
print(f"Max symptoms: {symptoms_per_row.max()}")
print(f"Median: {symptoms_per_row.median():.0f}")
print(f"Mean: {symptoms_per_row.mean():.2f}")`}
                </code>
              </pre>
            </div>
          </div>
        </motion.section>

        {/* Insights Section */}
        <motion.section
          className="mt-16 bg-white p-8 rounded-lg shadow-lg border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Findings</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Symptom Distribution",
                points: [
                  "131 unique symptoms across 4,920 records",
                  "Average 5-7 symptoms per disease case",
                  "Some records have 1-2 symptoms, others up to 17",
                ],
              },
              {
                title: "Disease Balance",
                points: [
                  "41 unique diseases represented in dataset",
                  "Each disease has ~120 cases on average",
                  "Relatively balanced distribution across classes",
                ],
              },
              {
                title: "Data Quality Issues (Raw Data)",
                points: [
                  "Some missing values in symptom columns",
                  "Text inconsistencies (case, whitespace)",
                  "Requires cleaning before modeling",
                ],
              },
              {
                title: "Key Patterns Discovered",
                points: [
                  "Fever appears in many different diseases",
                  "Symptom combinations are disease-specific",
                  "Co-occurring symptoms provide strong signals",
                ],
              },
            ].map((section, index) => (
              <motion.div
                key={section.title}
                className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="font-bold text-gray-900 mb-3 text-lg">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <span className="text-blue-600 font-bold mt-1">→</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Next Steps */}
        <motion.section
          className="mt-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">Next: Data Cleaning</h2>
          <p className="text-lg mb-6">
            Now that we understand our data, let's clean and prepare it for machine learning
          </p>
          <Link href="/cleaning">
            <motion.button
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue to Cleaning →
            </motion.button>
          </Link>
        </motion.section>
      </div>
    </div>
  );
}
