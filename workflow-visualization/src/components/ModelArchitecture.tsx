import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ModelArchitecture() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Model Architecture</h1>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Random Forest Classifier Architecture</CardTitle>
              <CardDescription>Deep dive into our disease prediction model</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Our model uses a Random Forest Classifier with carefully tuned hyperparameters to achieve optimal performance on the disease prediction task.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Baseline Model Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                The initial model configuration before hyperparameter tuning:
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`RandomForestClassifier(
    n_estimators=100,        # 100 decision trees
    max_depth=20,            # Max depth of 20 levels
    min_samples_split=5,     # Min 5 samples to split
    min_samples_leaf=2,      # Min 2 samples in leaf
    random_state=42,         # Reproducibility seed
    n_jobs=-1,              # Use all CPU cores
    verbose=1               # Show progress
)`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Optimized Model Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                After hyperparameter tuning with RandomizedSearchCV, we achieved these optimized parameters:
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`RandomForestClassifier(
    n_estimators=200,        # More trees for stability
    max_depth=10,            # Shallower trees prevent overfitting
    min_samples_split=10,    # Better generalization
    min_samples_leaf=8,      # Smoother decision boundaries
    max_features='log2',     # Feature selection strategy
    bootstrap=True,          # Use bootstrap sampling
    class_weight=None,       # No class balancing needed
    random_state=42,
    n_jobs=-1
)`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model Input/Output Specification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Input Features</h4>
                <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm text-gray-700"><strong>Shape:</strong> (n_samples, 131)</p>
                  <p className="text-sm text-gray-700"><strong>Type:</strong> Binary features (0 or 1)</p>
                  <p className="text-sm text-gray-700"><strong>Meaning:</strong> Each feature represents a symptom (present=1, absent=0)</p>
                  <p className="text-sm text-gray-700"><strong>Example:</strong> [0, 0, 1, 0, 1, ..., 0] (131 dimensions)</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Output Predictions</h4>
                <div className="bg-green-50 p-4 rounded-lg space-y-2">
                  <p className="text-sm text-gray-700"><strong>Predicted Class:</strong> One of 41 diseases</p>
                  <p className="text-sm text-gray-700"><strong>Confidence Score:</strong> Probability (0.0 to 1.0)</p>
                  <p className="text-sm text-gray-700"><strong>Alternative Predictions:</strong> Top 3 disease probabilities</p>
                  <p className="text-sm text-gray-700"><strong>Example Output:</strong> {'{disease: "Malaria", confidence: 0.95, alternatives: [...]}'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hyperparameter Tuning Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We used RandomizedSearchCV to optimize hyperparameters:
              </p>
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Search Configuration</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <strong>n_iter:</strong> 30 random combinations tested</li>
                    <li>• <strong>cv:</strong> 3-fold cross-validation</li>
                    <li>• <strong>scoring:</strong> f1_weighted (handles multi-class imbalance)</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Search Space</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• n_estimators: [100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600]</li>
                    <li>• max_depth: [None, 10, 20, 30, 40, 50, 60]</li>
                    <li>• min_samples_split: [2, 5, 10, 20]</li>
                    <li>• min_samples_leaf: [1, 2, 4, 8]</li>
                    <li>• max_features: ['sqrt', 'log2', None]</li>
                    <li>• bootstrap: [True, False]</li>
                    <li>• class_weight: [None, 'balanced']</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model Training Pipeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                The complete training workflow:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span className="text-gray-700"><strong>Data Preparation:</strong> Load and preprocess 4,920 disease-symptom records</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span className="text-gray-700"><strong>Feature Engineering:</strong> Convert symptoms to 131-dimensional binary vectors</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span className="text-gray-700"><strong>Label Encoding:</strong> Encode 41 diseases as integers (0-40)</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span className="text-gray-700"><strong>Train/Test Split:</strong> 80% training, 20% testing (stratified)</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">5.</span>
                  <span className="text-gray-700"><strong>Hyperparameter Tuning:</strong> RandomizedSearchCV with 3-fold CV</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">6.</span>
                  <span className="text-gray-700"><strong>Model Training:</strong> Train final model with best parameters</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">7.</span>
                  <span className="text-gray-700"><strong>Evaluation:</strong> Assess performance on test set</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">8.</span>
                  <span className="text-gray-700"><strong>Model Serialization:</strong> Save model and artifacts for deployment</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model Artifacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                The following files are saved after training:
              </p>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">disease_model.pkl (3.0 MB)</h4>
                  <p className="text-sm text-gray-600">Trained Random Forest classifier with all 200 trees</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">label_encoder.pkl</h4>
                  <p className="text-sm text-gray-600">Encoder for converting disease names to numeric labels</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">symptoms_list.pkl</h4>
                  <p className="text-sm text-gray-600">Ordered list of 131 symptoms for feature vector construction</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">diseases_list.pkl</h4>
                  <p className="text-sm text-gray-600">Ordered list of 41 diseases for label decoding</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">training_metrics.json</h4>
                  <p className="text-sm text-gray-600">Performance metrics (accuracy, precision, recall, F1)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Design Decisions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">→</span>
                  <span className="text-gray-700"><strong>Binary Features:</strong> Chose binary encoding (0/1) over severity weights for simplicity and interpretability</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">→</span>
                  <span className="text-gray-700"><strong>No Scaling:</strong> Random Forest doesn't require feature scaling, simplifying the pipeline</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">→</span>
                  <span className="text-gray-700"><strong>Ensemble Approach:</strong> 200 trees provide robust predictions with reduced variance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">→</span>
                  <span className="text-gray-700"><strong>Shallow Trees:</strong> max_depth=10 prevents overfitting while maintaining expressiveness</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">→</span>
                  <span className="text-gray-700"><strong>Probability Outputs:</strong> Model provides confidence scores for each prediction</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
