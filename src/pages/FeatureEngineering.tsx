import { motion } from "framer-motion";
import { Link } from "wouter";

export default function FeatureEngineering() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Feature Engineering
          </h1>
          <p className="text-xl text-gray-600">
            Transform cleaned symptoms into numerical features for machine learning
          </p>
        </motion.div>

        {/* Visual Explanation */}
        <motion.section
          className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Feature Engineering?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-red-50 rounded-lg border-l-4 border-red-500">
              <h3 className="font-bold text-red-900 mb-3 text-lg">❌ Machine Learning Can't Process Text</h3>
              <div className="space-y-2 text-gray-700">
                <p className="font-mono text-sm bg-white p-3 rounded">
                  Patient: ["fever", "cough", "chills"]
                </p>
                <p className="text-center">↓</p>
                <p className="font-bold text-red-600">🚫 Models need numbers, not strings!</p>
              </div>
            </div>
            <div className="p-6 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h3 className="font-bold text-green-900 mb-3 text-lg">✅ Convert to Binary Vectors</h3>
              <div className="space-y-2 text-gray-700">
                <p className="font-mono text-sm bg-white p-3 rounded">
                  Vector: [0, 1, 1, 0, 1, 0, 0, ...]
                </p>
                <p className="text-center">↓</p>
                <p className="font-bold text-green-600">✓ 131-dimensional binary feature!</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Code Implementation */}
        <motion.section
          className="mt-16 bg-gray-900 text-gray-100 p-8 rounded-lg shadow-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">📝 Code Implementation</h2>
          
          <div className="space-y-6">
            {/* Step 1: Collect Unique Symptoms */}
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">1. Collect All Unique Symptoms</h3>
              <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-green-400">
{`import pandas as pd
import numpy as np

# Load cleaned data
df = pd.read_csv('data/dataset_cleaned.csv')

# Get all symptom columns
symptom_cols = [col for col in df.columns if 'Symptom' in col]
print(f"Symptom columns: {symptom_cols}")

# Collect all unique symptoms across all columns
all_symptoms = set()
for col in symptom_cols:
    symptoms_in_col = df[col].dropna().unique()
    all_symptoms.update(symptoms_in_col)

# Remove empty strings and sort
all_symptoms = sorted([s for s in all_symptoms if s])

print(f"\\nTotal unique symptoms: {len(all_symptoms)}")
print(f"First 10 symptoms: {all_symptoms[:10]}")

# Output:
# Total unique symptoms: 131
# First 10 symptoms: ['abdominal_pain', 'abnormal_menstruation', 
#                      'acidity', 'acute_liver_failure', ...]`}
                </code>
              </pre>
            </div>

            {/* Step 2: Create Feature Matrix */}
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">2. Create Binary Feature Matrix</h3>
              <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-green-400">
{`# Create empty feature matrix: rows = patients, columns = symptoms
X = pd.DataFrame(0, index=df.index, columns=all_symptoms)

print(f"Feature matrix shape: {X.shape}")
# Output: (4920, 131)
# 4920 patients × 131 possible symptoms

print(f"\\nInitial matrix (all zeros):")
print(X.head())

# Each row represents one patient
# Each column represents one symptom
# Value: 1 if patient has symptom, 0 if not`}
                </code>
              </pre>
            </div>

            {/* Step 3: Fill Feature Matrix */}
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">3. Fill Matrix with Patient Symptoms</h3>
              <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-green-400">
{`# Iterate through each patient
for idx, row in df.iterrows():
    # Check each symptom column
    for col in symptom_cols:
        symptom = row[col]
        
        # If symptom exists and is in our vocabulary
        if symptom and symptom in all_symptoms:
            # Set corresponding feature to 1
            X.loc[idx, symptom] = 1

print("\\nFeature matrix after filling:")
print(X.head())

# Example patient row:
# [0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, ...]
#  └─ No    └─ Has   └─ Has    └─ Has
#     this      fever    cough     chills
#     symptom

print(f"\\nAverage symptoms per patient: {X.sum(axis=1).mean():.2f}")
# Output: ~5-7 symptoms per patient`}
                </code>
              </pre>
            </div>

            {/* Step 4: Verify Encoding */}
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">4. Verify One-Hot Encoding</h3>
              <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-green-400">
{`# Check encoding for a sample patient
sample_idx = 0
sample_symptoms = df.loc[sample_idx, symptom_cols].dropna().values
print(f"Patient {sample_idx} symptoms: {list(sample_symptoms)}")

# Check corresponding feature vector
sample_features = X.loc[sample_idx]
active_features = sample_features[sample_features == 1].index.tolist()
print(f"Active features (1s): {active_features}")

# Verify they match
print(f"\\nMatching: {set(sample_symptoms) == set(active_features)}")
# Output: True ✓

# Statistics
print(f"\\nFeature Matrix Statistics:")
print(f"Shape: {X.shape}")
print(f"Sparsity: {(X == 0).sum().sum() / X.size * 100:.2f}% zeros")
print(f"Data type: {X.dtypes[0]}")
print(f"Memory usage: {X.memory_usage(deep=True).sum() / 1024 / 1024:.2f} MB")`}
                </code>
              </pre>
            </div>

            {/* Step 5: Alternative - Sklearn */}
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">5. Alternative: Using Sklearn MultiLabelBinarizer</h3>
              <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-green-400">
{`from sklearn.preprocessing import MultiLabelBinarizer

# Prepare symptom lists per patient
symptom_lists = []
for idx, row in df.iterrows():
    patient_symptoms = [row[col] for col in symptom_cols 
                       if pd.notna(row[col]) and row[col]]
    symptom_lists.append(patient_symptoms)

# Apply MultiLabelBinarizer
mlb = MultiLabelBinarizer()
X_encoded = mlb.fit_transform(symptom_lists)

print(f"Encoded shape: {X_encoded.shape}")
print(f"Feature names: {mlb.classes_[:10]}...")

# Convert to DataFrame for easier handling
X_df = pd.DataFrame(X_encoded, columns=mlb.classes_)

print("\\n✅ One-hot encoding complete!")
print(f"Ready for model training with {X_df.shape[1]} features")`}
                </code>
              </pre>
            </div>
          </div>
        </motion.section>

        {/* Visual Example */}
        <motion.section
          className="mt-16 bg-white p-8 rounded-lg shadow-lg border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Visual Example</h2>
          
          <div className="space-y-6">
            {/* Before */}
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-4 text-xl">📋 Before: Raw Symptom Data</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border p-2">Disease</th>
                      <th className="border p-2">Symptom_1</th>
                      <th className="border p-2">Symptom_2</th>
                      <th className="border p-2">Symptom_3</th>
                      <th className="border p-2">...</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">Malaria</td>
                      <td className="border p-2">fever</td>
                      <td className="border p-2">cough</td>
                      <td className="border p-2">chills</td>
                      <td className="border p-2">...</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Dengue</td>
                      <td className="border p-2">fever</td>
                      <td className="border p-2">headache</td>
                      <td className="border p-2">fatigue</td>
                      <td className="border p-2">...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-gray-600 italic">Problem: Text strings can't be used in mathematical models</p>
            </div>

            {/* After */}
            <div className="p-6 bg-green-50 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-4 text-xl">✨ After: Binary Feature Matrix</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse font-mono">
                  <thead className="bg-green-200">
                    <tr>
                      <th className="border p-2">fever</th>
                      <th className="border p-2">cough</th>
                      <th className="border p-2">chills</th>
                      <th className="border p-2">headache</th>
                      <th className="border p-2">fatigue</th>
                      <th className="border p-2">rash</th>
                      <th className="border p-2">...</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2 bg-green-100">1</td>
                      <td className="border p-2 bg-green-100">1</td>
                      <td className="border p-2 bg-green-100">1</td>
                      <td className="border p-2">0</td>
                      <td className="border p-2">0</td>
                      <td className="border p-2">0</td>
                      <td className="border p-2">...</td>
                    </tr>
                    <tr>
                      <td className="border p-2 bg-green-100">1</td>
                      <td className="border p-2">0</td>
                      <td className="border p-2">0</td>
                      <td className="border p-2 bg-green-100">1</td>
                      <td className="border p-2 bg-green-100">1</td>
                      <td className="border p-2">0</td>
                      <td className="border p-2">...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-green-700 font-semibold">Solution: Binary vectors (1 = present, 0 = absent)</p>
            </div>
          </div>
        </motion.section>

        {/* Key Concepts */}
        <motion.section
          className="mt-12 bg-white p-8 rounded-lg shadow-lg border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Concepts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "One-Hot Encoding",
                description: "Each symptom becomes a binary feature (0 or 1)",
                example: "'fever' → fever column = 1, all others = 0",
                icon: "🔢",
              },
              {
                title: "Sparse Matrix",
                description: "Most values are 0 (patient doesn't have most symptoms)",
                example: "~95% of feature matrix is zeros",
                icon: "📊",
              },
              {
                title: "Feature Dimensionality",
                description: "131 unique symptoms = 131 features",
                example: "Each patient: 131-dimensional vector",
                icon: "📐",
              },
              {
                title: "Binary Features",
                description: "Simple but effective for symptom presence/absence",
                example: "No need for symptom intensity (yet)",
                icon: "🎯",
              },
            ].map((concept, index) => (
              <motion.div
                key={concept.title}
                className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-3">{concept.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{concept.title}</h3>
                <p className="text-gray-700 mb-2">{concept.description}</p>
                <p className="text-sm text-gray-600 italic">{concept.example}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Statistics */}
        <motion.section
          className="mt-12 grid md:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {[
            { label: "Input Dimensions", value: "131", icon: "📏" },
            { label: "Sparsity", value: "~95%", icon: "🕳️" },
            { label: "Encoding Type", value: "Binary", icon: "💾" },
            { label: "Ready for ML", value: "✓", icon: "✅" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {stat.value}
              </div>
              <p className="text-gray-700 font-semibold text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* Why This Matters */}
        <motion.section
          className="mt-12 bg-blue-50 p-8 rounded-lg border-l-4 border-blue-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">💡 Why This Step Is Critical</h2>
          <div className="space-y-3 text-gray-700">
            <p className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-xl">→</span>
              <span><strong>Machine Learning = Mathematics:</strong> Models work with numbers, not text. Feature engineering bridges the gap between human-readable data and mathematical algorithms.</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-xl">→</span>
              <span><strong>Feature Quality = Model Quality:</strong> Good features lead to good models. This step often determines 70% of model performance.</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-xl">→</span>
              <span><strong>Domain Knowledge Matters:</strong> Understanding medical symptoms helps choose the right encoding (binary works here; intensity might be needed elsewhere).</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-blue-600 font-bold text-xl">→</span>
              <span><strong>Sets Stage for ML:</strong> Once symptoms are numerical vectors, any ML algorithm can learn patterns: Random Forest, SVM, Neural Networks, etc.</span>
            </p>
          </div>
        </motion.section>

        {/* Next Steps */}
        <motion.section
          className="mt-12 bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <h2 className="text-3xl font-bold mb-4">Next: Model Training</h2>
          <p className="text-lg mb-6">
            With features engineered, we're ready to train machine learning models to learn patterns and make predictions
          </p>
          <Link href="/modeling">
            <motion.button
              className="px-6 py-3 bg-white text-orange-600 rounded-lg font-bold hover:bg-gray-50 transition-colors"
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
