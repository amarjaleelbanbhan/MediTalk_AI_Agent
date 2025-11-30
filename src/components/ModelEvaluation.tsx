import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ModelEvaluation() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Model Evaluation</h1>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Comprehensive evaluation of the trained model</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                The model is evaluated on a held-out test set (20% of data) using multiple metrics to assess its disease prediction capability.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg text-center">
                  <div className="text-5xl font-bold text-blue-600 mb-2">100%</div>
                  <p className="text-gray-700 font-semibold">Accuracy</p>
                  <p className="text-sm text-gray-600 mt-2">Correct predictions out of total</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg text-center">
                  <div className="text-5xl font-bold text-green-600 mb-2">100%</div>
                  <p className="text-gray-700 font-semibold">Precision</p>
                  <p className="text-sm text-gray-600 mt-2">True positives vs predicted positives</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg text-center">
                  <div className="text-5xl font-bold text-purple-600 mb-2">100%</div>
                  <p className="text-gray-700 font-semibold">Recall</p>
                  <p className="text-sm text-gray-600 mt-2">True positives vs actual positives</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg text-center">
                  <div className="text-5xl font-bold text-orange-600 mb-2">100%</div>
                  <p className="text-gray-700 font-semibold">F1-Score</p>
                  <p className="text-sm text-gray-600 mt-2">Harmonic mean of precision and recall</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metric Definitions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">Accuracy</h4>
                  <p className="text-sm text-gray-600 mb-2">Percentage of correct predictions</p>
                  <p className="text-xs font-mono bg-gray-100 p-2 rounded">Accuracy = (TP + TN) / (TP + TN + FP + FN)</p>
                  <p className="text-sm text-gray-700 mt-2"><strong>Interpretation:</strong> 100% means all 984 test samples were correctly classified</p>
                </div>

                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">Precision</h4>
                  <p className="text-sm text-gray-600 mb-2">Of all positive predictions, how many were correct?</p>
                  <p className="text-xs font-mono bg-gray-100 p-2 rounded">Precision = TP / (TP + FP)</p>
                  <p className="text-sm text-gray-700 mt-2"><strong>Interpretation:</strong> 100% means no false positives (no wrong disease predictions)</p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">Recall</h4>
                  <p className="text-sm text-gray-600 mb-2">Of all actual positives, how many did we catch?</p>
                  <p className="text-xs font-mono bg-gray-100 p-2 rounded">Recall = TP / (TP + FN)</p>
                  <p className="text-sm text-gray-700 mt-2"><strong>Interpretation:</strong> 100% means no false negatives (no missed diagnoses)</p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">F1-Score</h4>
                  <p className="text-sm text-gray-600 mb-2">Harmonic mean balancing precision and recall</p>
                  <p className="text-xs font-mono bg-gray-100 p-2 rounded">F1 = 2 × (Precision × Recall) / (Precision + Recall)</p>
                  <p className="text-sm text-gray-700 mt-2"><strong>Interpretation:</strong> 100% indicates perfect balance between precision and recall</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Confusion Matrix Concept</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                A confusion matrix shows how the model's predictions compare to actual values:
              </p>
              <div className="bg-gray-100 p-6 rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-400">
                      <th className="text-left py-2 px-3">Predicted</th>
                      <th className="text-center py-2 px-3">Disease A</th>
                      <th className="text-center py-2 px-3">Disease B</th>
                      <th className="text-center py-2 px-3">Disease C</th>
                      <th className="text-center py-2 px-3">...</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 px-3 font-semibold">Disease A</td>
                      <td className="text-center py-2 px-3 bg-green-100">24</td>
                      <td className="text-center py-2 px-3">0</td>
                      <td className="text-center py-2 px-3">0</td>
                      <td className="text-center py-2 px-3">0</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 px-3 font-semibold">Disease B</td>
                      <td className="text-center py-2 px-3">0</td>
                      <td className="text-center py-2 px-3 bg-green-100">19</td>
                      <td className="text-center py-2 px-3">0</td>
                      <td className="text-center py-2 px-3">0</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 px-3 font-semibold">Disease C</td>
                      <td className="text-center py-2 px-3">0</td>
                      <td className="text-center py-2 px-3">0</td>
                      <td className="text-center py-2 px-3 bg-green-100">22</td>
                      <td className="text-center py-2 px-3">0</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold">...</td>
                      <td className="text-center py-2 px-3">0</td>
                      <td className="text-center py-2 px-3">0</td>
                      <td className="text-center py-2 px-3">0</td>
                      <td className="text-center py-2 px-3">...</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                <strong>Perfect Model:</strong> Diagonal values (green) are non-zero, all other cells are 0. This indicates no misclassifications.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Per-Class Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                The model performs consistently across all 41 disease classes with 100% precision and recall for each disease.
              </p>
              <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-400">
                      <th className="text-left py-2 px-3">Disease</th>
                      <th className="text-center py-2 px-3">Precision</th>
                      <th className="text-center py-2 px-3">Recall</th>
                      <th className="text-center py-2 px-3">F1-Score</th>
                      <th className="text-center py-2 px-3">Support</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 px-3">AIDS</td>
                      <td className="text-center py-2 px-3">1.00</td>
                      <td className="text-center py-2 px-3">1.00</td>
                      <td className="text-center py-2 px-3">1.00</td>
                      <td className="text-center py-2 px-3">24</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 px-3">Acne</td>
                      <td className="text-center py-2 px-3">1.00</td>
                      <td className="text-center py-2 px-3">1.00</td>
                      <td className="text-center py-2 px-3">1.00</td>
                      <td className="text-center py-2 px-3">19</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <td className="py-2 px-3">Allergy</td>
                      <td className="text-center py-2 px-3">1.00</td>
                      <td className="text-center py-2 px-3">1.00</td>
                      <td className="text-center py-2 px-3">1.00</td>
                      <td className="text-center py-2 px-3">22</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">... (38 more)</td>
                      <td className="text-center py-2 px-3">1.00</td>
                      <td className="text-center py-2 px-3">1.00</td>
                      <td className="text-center py-2 px-3">1.00</td>
                      <td className="text-center py-2 px-3">919</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evaluation Methodology</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Our evaluation follows best practices for machine learning model assessment:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span className="text-gray-700"><strong>Holdout Test Set:</strong> 20% of data (984 samples) never seen during training</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span className="text-gray-700"><strong>Stratified Split:</strong> Test set maintains same disease distribution as training</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span className="text-gray-700"><strong>Multiple Metrics:</strong> Accuracy, precision, recall, and F1-score provide comprehensive view</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span className="text-gray-700"><strong>Weighted Averages:</strong> Per-class metrics weighted by support (number of samples)</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">5.</span>
                  <span className="text-gray-700"><strong>Confusion Matrix:</strong> Detailed view of which diseases are confused with each other</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Important Notes on Perfect Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                <p className="text-gray-800 font-semibold mb-3">Why 100% Accuracy?</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• The model has learned the training data very well</li>
                  <li>• Each disease has a distinct symptom pattern in the dataset</li>
                  <li>• No overlapping or ambiguous symptom combinations</li>
                  <li>• Test set contains disease-symptom combinations similar to training</li>
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                <p className="text-gray-800 font-semibold mb-3">Real-World Performance</p>
                <ul className="space-space-y-2 text-sm text-gray-700">
                  <li>• Perfect scores on training/test data don't guarantee real-world performance</li>
                  <li>• New, unseen symptom combinations may produce different results</li>
                  <li>• Medical data in production may have noise and ambiguity</li>
                  <li>• Always validate with domain experts and real patient data</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model Strengths & Limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-green-700">Strengths</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>✓ Excellent accuracy on test data</li>
                    <li>✓ Fast prediction time (&lt;100ms)</li>
                    <li>✓ Interpretable feature importance</li>
                    <li>✓ Handles multi-class classification well</li>
                    <li>✓ Robust to feature variations</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-red-700">Limitations</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>✗ Perfect training accuracy may indicate overfitting</li>
                    <li>✗ Limited to 131 known symptoms</li>
                    <li>✗ Cannot handle novel symptom combinations</li>
                    <li>✗ Requires exact symptom matching</li>
                    <li>✗ Not a substitute for professional diagnosis</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
