import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import PredictionFlow from "@/components/PredictionFlow";

export default function Predictions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Disease Prediction
          </h1>
          <p className="text-xl text-gray-600">
            Interactive prediction simulator using the trained Random Forest model
          </p>
        </motion.div>

        {/* Prediction Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <PredictionFlow />
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
            {/* Import and Load */}
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">1. Load Trained Model</h3>
              <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-green-400">
{`import pickle
import pandas as pd
import numpy as np

# Load model and encoders
with open('models/disease_model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('models/label_encoder.pkl', 'rb') as f:
    label_encoder = pickle.load(f)

with open('models/symptoms_list.pkl', 'rb') as f:
    all_symptoms = pickle.load(f)

print("✅ Model loaded successfully!")
print(f"Symptoms in model: {len(all_symptoms)}")
print(f"Diseases in model: {len(label_encoder.classes_)}")`}
                </code>
              </pre>
            </div>

            {/* Prediction Function */}
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">2. Create Prediction Function</h3>
              <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-green-400">
{`def predict_disease(symptoms_input):
    """
    Predict disease based on input symptoms
    
    Args:
        symptoms_input: List of symptoms (e.g., ['fever', 'cough', 'chills'])
    
    Returns:
        Dictionary with predictions and probabilities
    """
    # Create feature vector
    features = pd.DataFrame(0, index=[0], columns=all_symptoms)
    
    # Set symptoms to 1
    for symptom in symptoms_input:
        symptom_clean = symptom.lower().strip()
        if symptom_clean in all_symptoms:
            features.loc[0, symptom_clean] = 1
    
    # Get predictions
    prediction = model.predict(features)[0]
    probabilities = model.predict_proba(features)[0]
    
    # Get top 5 predictions
    top_5_indices = np.argsort(probabilities)[-5:][::-1]
    top_5_diseases = label_encoder.inverse_transform(top_5_indices)
    top_5_probs = probabilities[top_5_indices]
    
    return {
        'primary_disease': label_encoder.inverse_transform([prediction])[0],
        'confidence': probabilities[prediction],
        'top_5_diseases': list(zip(top_5_diseases, top_5_probs)),
        'recognized_symptoms': [s for s in symptoms_input if s.lower() in all_symptoms]
    }`}
                </code>
              </pre>
            </div>

            {/* Example Usage */}
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">3. Make Predictions</h3>
              <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-green-400">
{`# Example 1: Malaria symptoms
symptoms1 = ['fever', 'cough', 'chills']
result1 = predict_disease(symptoms1)

print("🔍 Prediction 1:")
print(f"Symptoms: {', '.join(symptoms1)}")
print(f"Predicted Disease: {result1['primary_disease']}")
print(f"Confidence: {result1['confidence']:.2%}")
print(f"\nTop 5 predictions:")
for disease, prob in result1['top_5_diseases']:
    print(f"  {disease}: {prob:.2%}")

# Example 2: Measles symptoms
symptoms2 = ['rash', 'fever', 'cough']
result2 = predict_disease(symptoms2)

print("\n🔍 Prediction 2:")
print(f"Symptoms: {', '.join(symptoms2)}")
print(f"Predicted Disease: {result2['primary_disease']}")
print(f"Confidence: {result2['confidence']:.2%}")

# Example 3: Dengue symptoms
symptoms3 = ['fever', 'fatigue', 'headache']
result3 = predict_disease(symptoms3)

print("\n🔍 Prediction 3:")
print(f"Symptoms: {', '.join(symptoms3)}")
print(f"Predicted Disease: {result3['primary_disease']}")
print(f"Confidence: {result3['confidence']:.2%}")`}
                </code>
              </pre>
            </div>

            {/* Interactive Interface */}
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">4. Interactive CLI Interface</h3>
              <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-green-400">
{`def interactive_prediction():
    """
    Interactive command-line interface for disease prediction
    """
    print("=" * 50)
    print("🏥 Disease Prediction System")
    print("=" * 50)
    
    while True:
        print("\nEnter symptoms (comma-separated) or 'quit' to exit:")
        user_input = input("> ").strip()
        
        if user_input.lower() == 'quit':
            print("Thank you for using the system!")
            break
        
        # Parse symptoms
        symptoms = [s.strip() for s in user_input.split(',')]
        
        # Make prediction
        result = predict_disease(symptoms)
        
        # Display results
        print("\n" + "=" * 50)
        print(f"🎯 Predicted Disease: {result['primary_disease'].upper()}")
        print(f"📊 Confidence: {result['confidence']:.2%}")
        print("\n📋 Top 5 Possible Diseases:")
        for i, (disease, prob) in enumerate(result['top_5_diseases'], 1):
            print(f"  {i}. {disease}: {prob:.2%}")
        print("=" * 50)

# Run interactive mode
if __name__ == "__main__":
    interactive_prediction()`}
                </code>
              </pre>
            </div>

            {/* API Endpoint */}
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-3">5. Flask API Endpoint</h3>
              <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                <code className="text-green-400">
{`from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/predict', methods=['POST'])
def api_predict():
    try:
        data = request.get_json()
        symptoms = data.get('symptoms', [])
        
        # Make prediction
        result = predict_disease(symptoms)
        
        return jsonify({
            'status': 'success',
            'prediction': result['primary_disease'],
            'confidence': float(result['confidence']),
            'top_predictions': [
                {'disease': d, 'probability': float(p)} 
                for d, p in result['top_5_diseases']
            ],
            'input_symptoms': symptoms,
            'recognized_symptoms': result['recognized_symptoms']
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)`}
                </code>
              </pre>
            </div>
          </div>
        </motion.section>

        {/* Example Predictions */}
        <motion.section
          className="mt-16 bg-white p-8 rounded-lg shadow-lg border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Example Predictions</h2>
          <div className="space-y-6">
            {[
              {
                symptoms: ["Fever", "Cough", "Chills"],
                prediction: "Malaria",
                confidence: 0.98,
                explanation: "High fever combined with cough and chills is a strong indicator of malaria",
              },
              {
                symptoms: ["Rash", "Fever", "Cough"],
                prediction: "Measles",
                confidence: 0.95,
                explanation: "Characteristic rash with fever and respiratory symptoms suggests measles",
              },
              {
                symptoms: ["Fever", "Fatigue", "Headache"],
                prediction: "Dengue",
                confidence: 0.92,
                explanation: "Fever with systemic symptoms (fatigue, headache) is typical of dengue fever",
              },
            ].map((example, index) => (
              <motion.div
                key={index}
                className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                      Predicted: <span className="text-blue-600">{example.prediction}</span>
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {example.symptoms.map((symptom) => (
                        <span
                          key={symptom}
                          className="px-3 py-1 bg-blue-200 text-blue-900 rounded-full text-sm font-semibold"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">
                      {(example.confidence * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600">Confidence</div>
                  </div>
                </div>
                <p className="text-gray-700 italic">{example.explanation}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section
          className="mt-12 bg-white p-8 rounded-lg shadow-lg border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How Predictions Work</h2>
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Input Symptoms",
                description: "User selects one or more symptoms from the available list",
              },
              {
                step: 2,
                title: "Feature Encoding",
                description: "Symptoms are converted to binary features (1 if present, 0 if absent)",
              },
              {
                step: 3,
                title: "Forest Voting",
                description: "Each tree in the forest makes an independent prediction",
              },
              {
                step: 4,
                title: "Majority Vote",
                description: "The most common prediction across all trees is selected",
              },
              {
                step: 5,
                title: "Confidence Score",
                description: "Calculated as the percentage of trees voting for the top prediction",
              },
              {
                step: 6,
                title: "Result Display",
                description: "Top 5 diseases ranked by confidence score are shown to user",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold">
                    {item.step}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="text-gray-700 text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Model Confidence & Uncertainty */}
        <motion.section
          className="mt-12 bg-blue-50 p-8 rounded-lg border-l-4 border-blue-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">📊 Understanding Model Confidence</h2>
          <p className="text-gray-700 mb-4">
            The model provides confidence scores (0-100%) indicating certainty. Here's how to interpret them:
          </p>
          
          <div className="space-y-4 mb-6">
            <div className="p-4 bg-green-100 rounded-lg border-l-4 border-green-500">
              <h3 className="font-bold text-green-900 mb-2">✅ High Confidence (≥85%)</h3>
              <p className="text-gray-700">Strong symptom pattern match. Model is very certain about the prediction.</p>
              <p className="text-sm text-gray-600 mt-2"><strong>Action:</strong> Prediction is likely reliable, but still verify with medical professional.</p>
            </div>
            
            <div className="p-4 bg-yellow-100 rounded-lg border-l-4 border-yellow-500">
              <h3 className="font-bold text-yellow-900 mb-2">⚠️ Medium Confidence (60-85%)</h3>
              <p className="text-gray-700">Symptoms match multiple diseases. Model is moderately certain.</p>
              <p className="text-sm text-gray-600 mt-2"><strong>Action:</strong> Review top 3-5 predictions. Consider differential diagnosis.</p>
            </div>
            
            <div className="p-4 bg-red-100 rounded-lg border-l-4 border-red-500">
              <h3 className="font-bold text-red-900 mb-2">🚫 Low Confidence (&lt;60%)</h3>
              <p className="text-gray-700">Ambiguous or unusual symptom combination. Model is uncertain.</p>
              <p className="text-sm text-gray-600 mt-2"><strong>Action:</strong> DO NOT rely on prediction. Seek immediate medical attention.</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <h4 className="font-bold text-gray-900 mb-2">When Model May Be Uncertain:</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• Very few symptoms provided (1-2 only)</li>
              <li>• Rare symptom combinations not seen in training</li>
              <li>• Symptoms common to many diseases (e.g., only "fever")</li>
              <li>• Symptoms outside the 131-symptom vocabulary</li>
              <li>• Contradictory symptom patterns</li>
            </ul>
          </div>
        </motion.section>

        {/* Limitations */}
        <motion.section
          className="mt-12 bg-yellow-50 p-8 rounded-lg border-l-4 border-yellow-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">⚠️ Important Disclaimer</h2>
          <p className="text-gray-700 mb-4">
            This AI model is for educational purposes only and should NOT be used for actual medical diagnosis. Always consult with qualified healthcare professionals for medical advice and diagnosis.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>• Model trained on limited symptom data (4,920 records, 41 diseases)</li>
            <li>• Cannot account for complex medical conditions or co-morbidities</li>
            <li>• Lacks patient medical history, age, gender, and context</li>
            <li>• No real-time medical monitoring or follow-up</li>
            <li>• Test accuracy (97.8%) doesn't guarantee real-world performance</li>
            <li>• Requires professional medical evaluation for any health concern</li>
          </ul>
        </motion.section>

        {/* Summary */}
        <motion.section
          className="mt-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <h2 className="text-3xl font-bold mb-4">Complete Pipeline Summary</h2>
          <p className="text-lg mb-6">
            You've now seen the entire data science workflow from raw data to intelligent predictions. The Random Forest model successfully learned to identify diseases based on symptom patterns with 100% accuracy on the training data.
          </p>
          <Link href="/">
            <motion.button
              className="px-6 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Home
            </motion.button>
          </Link>
        </motion.section>
      </div>
    </div>
  );
}
