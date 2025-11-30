import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ModelSelection() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Model Selection</h1>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Choosing the Right Algorithm</CardTitle>
              <CardDescription>Comparing classification algorithms for disease prediction</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We evaluated multiple machine learning algorithms to find the best fit for our disease prediction task. The choice of algorithm significantly impacts model performance and interpretability.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Algorithm Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-3 px-2 font-semibold">Algorithm</th>
                      <th className="text-left py-3 px-2 font-semibold">Accuracy</th>
                      <th className="text-left py-3 px-2 font-semibold">Speed</th>
                      <th className="text-left py-3 px-2 font-semibold">Interpretability</th>
                      <th className="text-left py-3 px-2 font-semibold">Scaling</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b bg-blue-50">
                      <td className="py-3 px-2 font-semibold text-blue-700">Random Forest ✓</td>
                      <td className="py-3 px-2">Excellent</td>
                      <td className="py-3 px-2">Fast</td>
                      <td className="py-3 px-2">Good</td>
                      <td className="py-3 px-2">No</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2 font-semibold">Logistic Regression</td>
                      <td className="py-3 px-2">Good</td>
                      <td className="py-3 px-2">Very Fast</td>
                      <td className="py-3 px-2">Excellent</td>
                      <td className="py-3 px-2">Yes</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2 font-semibold">Support Vector Machine</td>
                      <td className="py-3 px-2">Excellent</td>
                      <td className="py-3 px-2">Slow</td>
                      <td className="py-3 px-2">Poor</td>
                      <td className="py-3 px-2">Yes</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2 font-semibold">Gradient Boosting</td>
                      <td className="py-3 px-2">Excellent</td>
                      <td className="py-3 px-2">Medium</td>
                      <td className="py-3 px-2">Good</td>
                      <td className="py-3 px-2">No</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2 font-semibold">K-Nearest Neighbors</td>
                      <td className="py-3 px-2">Good</td>
                      <td className="py-3 px-2">Slow</td>
                      <td className="py-3 px-2">Excellent</td>
                      <td className="py-3 px-2">Yes</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-semibold">Decision Tree</td>
                      <td className="py-3 px-2">Good</td>
                      <td className="py-3 px-2">Very Fast</td>
                      <td className="py-3 px-2">Excellent</td>
                      <td className="py-3 px-2">No</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why Random Forest?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Random Forest was selected as the optimal algorithm for this project based on several key advantages:
              </p>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">1. Ensemble Learning Power</h4>
                  <p className="text-sm text-gray-600">Combines multiple decision trees to improve accuracy and reduce overfitting through bootstrap aggregating (bagging)</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">2. Feature Importance</h4>
                  <p className="text-sm text-gray-600">Naturally provides feature importance scores, helping identify which symptoms are most indicative of diseases</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">3. No Feature Scaling</h4>
                  <p className="text-sm text-gray-600">Works perfectly with binary symptom features without requiring normalization or standardization</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">4. Multi-class Support</h4>
                  <p className="text-sm text-gray-600">Naturally handles 41 disease classes and provides probability estimates for each</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">5. Scalability</h4>
                  <p className="text-sm text-gray-600">Efficient parallel training (n_jobs=-1) and fast prediction times suitable for real-time applications</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">6. Robustness</h4>
                  <p className="text-sm text-gray-600">Robust to noise in training data and handles imbalanced classes reasonably well</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Random Forest Basics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                A Random Forest is an ensemble of decision trees. Here's how it works:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span className="text-gray-700"><strong>Bootstrap Sampling:</strong> Create multiple random subsets of the training data with replacement</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span className="text-gray-700"><strong>Train Trees:</strong> Build a decision tree on each bootstrap sample</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span className="text-gray-700"><strong>Random Features:</strong> At each split, consider only a random subset of features</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span className="text-gray-700"><strong>Aggregate Predictions:</strong> For classification, use majority voting from all trees</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hyperparameter Tuning Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We use RandomizedSearchCV to find optimal hyperparameters:
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`param_dist = {
    'n_estimators': [100, 150, 200, 250, 300, ...],
    'max_depth': [None, 10, 20, 30, 40, 50],
    'min_samples_split': [2, 5, 10, 20],
    'min_samples_leaf': [1, 2, 4, 8],
    'max_features': ['sqrt', 'log2', None],
    'bootstrap': [True, False],
    'class_weight': [None, 'balanced']
}

RandomizedSearchCV(
    estimator=RandomForestClassifier(),
    param_distributions=param_dist,
    n_iter=30,           # Test 30 combinations
    cv=3,                # 3-fold cross-validation
    scoring='f1_weighted'
)`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Hyperparameters Explained</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">n_estimators (Number of Trees)</h4>
                  <p className="text-sm text-gray-600">More trees = better performance but slower training. Default: 100, Optimized: 200</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">max_depth (Tree Depth)</h4>
                  <p className="text-sm text-gray-600">Controls tree complexity. Deeper trees = potential overfitting. Default: None, Optimized: 10</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">min_samples_split</h4>
                  <p className="text-sm text-gray-600">Minimum samples required to split a node. Higher values prevent overfitting. Default: 2, Optimized: 10</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900">min_samples_leaf</h4>
                  <p className="text-sm text-gray-600">Minimum samples required at leaf node. Higher values create smoother decision boundaries. Default: 1, Optimized: 8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model Selection Conclusion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Random Forest is the ideal choice for this medical prediction task because it:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Achieves excellent accuracy on our multi-class disease prediction problem</li>
                <li>✓ Provides interpretable feature importance for understanding symptom relationships</li>
                <li>✓ Requires no feature scaling, simplifying the pipeline</li>
                <li>✓ Trains and predicts quickly, suitable for real-time applications</li>
                <li>✓ Is robust to the characteristics of our medical dataset</li>
                <li>✓ Provides probability estimates for confidence scoring</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
