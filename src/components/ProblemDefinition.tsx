import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProblemDefinition() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Problem Definition</h1>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>The Challenge</CardTitle>
              <CardDescription>Understanding the Healthcare Problem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Healthcare accessibility remains a critical challenge globally. Many individuals lack immediate access to medical professionals for preliminary symptom assessment, leading to delayed diagnosis and treatment.
              </p>
              <p className="text-gray-700">
                <strong>Project Goal:</strong> Develop an AI-powered medical consultation assistant that analyzes patient symptoms and provides preliminary disease predictions, democratizing healthcare access.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span className="text-gray-700"><strong>Accurate Prediction:</strong> Build a machine learning model that accurately predicts diseases based on symptom combinations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span className="text-gray-700"><strong>Multiple Interfaces:</strong> Provide web, API, and voice interfaces for accessibility</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span className="text-gray-700"><strong>Comprehensive Information:</strong> Return disease descriptions, precautions, and severity assessments</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span className="text-gray-700"><strong>Production Ready:</strong> Deploy a robust system with proper error handling and monitoring</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Scope</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">In Scope</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>✓ Disease prediction from symptoms</li>
                    <li>✓ 41 different diseases</li>
                    <li>✓ 131 unique symptoms</li>
                    <li>✓ Confidence scores</li>
                    <li>✓ Alternative predictions</li>
                    <li>✓ Medical information retrieval</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Out of Scope</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>✗ Professional medical diagnosis</li>
                    <li>✗ Treatment prescription</li>
                    <li>✗ Emergency medical services</li>
                    <li>✗ Patient data storage</li>
                    <li>✗ Real-time doctor consultation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technical Approach</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We use a <strong>Random Forest Classifier</strong> trained on a comprehensive medical dataset containing disease-symptom relationships. This ensemble learning approach provides:
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>High Accuracy:</strong> Combines multiple decision trees for robust predictions</li>
                <li>• <strong>Feature Importance:</strong> Identifies which symptoms are most indicative of diseases</li>
                <li>• <strong>Scalability:</strong> Efficient training and fast prediction times</li>
                <li>• <strong>No Scaling Required:</strong> Works well with binary symptom features</li>
                <li>• <strong>Multi-class Support:</strong> Naturally handles multiple disease classes</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Important Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-gray-800 font-semibold mb-2">⚠️ Educational Purpose Only</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• NOT a substitute for professional medical advice</li>
                <li>• Results are preliminary and should be verified by healthcare professionals</li>
                <li>• Always consult qualified doctors for proper diagnosis and treatment</li>
                <li>• In case of medical emergencies, call emergency services immediately</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
