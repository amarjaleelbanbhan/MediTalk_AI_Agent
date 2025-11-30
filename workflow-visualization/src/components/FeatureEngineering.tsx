import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeatureEngineering() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Feature Engineering</h1>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Feature Engineering Overview</CardTitle>
              <CardDescription>Converting symptoms into machine learning features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Feature engineering transforms raw symptom data into numerical features that machine learning models can process. This is a critical step that directly impacts model performance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Binary Encoding Strategy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                We use <strong>binary encoding</strong> where each symptom is represented as either 0 (absent) or 1 (present).
              </p>
              <div className="bg-gray-100 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">0</div>
                    <p className="text-sm text-gray-600">Symptom Absent</p>
                  </div>
                  <div className="text-gray-400">←→</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">1</div>
                    <p className="text-sm text-gray-600">Symptom Present</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                <strong>Why Binary Encoding?</strong> Simple, interpretable, and works well with Random Forest which doesn't require feature scaling.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feature Vector Construction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Each disease record is converted into a feature vector of length 131 (one for each symptom).
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`# Example: Patient with Malaria
Patient Symptoms: ['high_fever', 'chills', 'headache', 'body_ache']

# Create feature vector (131 dimensions)
feature_vector = [
  0,  # abdominal_pain: absent
  0,  # abnormal_menstruation: absent
  1,  # body_ache: PRESENT ✓
  1,  # chills: PRESENT ✓
  0,  # cough: absent
  ...
  1,  # headache: PRESENT ✓
  1,  # high_fever: PRESENT ✓
  ...
  0   # yellow_urine: absent
]

# Result: (131,) vector with 4 ones and 127 zeros`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feature Matrix Dimensions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">4,920</div>
                  <p className="text-sm text-gray-700">Training Records</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600 mb-2">131</div>
                  <p className="text-sm text-gray-700">Features (Symptoms)</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-2">(4920, 131)</div>
                  <p className="text-sm text-gray-700">Feature Matrix Shape</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Example: Step-by-Step Encoding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Step 1: Raw Symptom Data</h4>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2"><strong>Disease:</strong> Diabetes</p>
                  <p className="text-sm text-gray-700 mb-2"><strong>Symptoms:</strong></p>
                  <ul className="text-sm text-gray-700 ml-4 space-y-1">
                    <li>• fatigue</li>
                    <li>• weight_loss</li>
                    <li>• restlessness</li>
                    <li>• lethargy</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Step 2: Symptom Vocabulary Check</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2"><strong>All Symptoms (sorted):</strong></p>
                  <p className="text-sm text-gray-600 font-mono">
                    ['abdominal_pain', 'abnormal_menstruation', ..., 'fatigue' (idx: 45), ..., 'lethargy' (idx: 78), ..., 'weight_loss' (idx: 129)]
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Step 3: Create Binary Vector</h4>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-3"><strong>Feature Vector:</strong></p>
                  <div className="font-mono text-xs text-gray-700 space-y-1">
                    <p>Index 0 (abdominal_pain): 0</p>
                    <p>Index 1 (abnormal_menstruation): 0</p>
                    <p>...</p>
                    <p className="text-green-700 font-bold">Index 45 (fatigue): 1 ✓</p>
                    <p>...</p>
                    <p className="text-green-700 font-bold">Index 78 (lethargy): 1 ✓</p>
                    <p>...</p>
                    <p className="text-green-700 font-bold">Index 129 (weight_loss): 1 ✓</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Step 4: Final Vector</h4>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2"><strong>Result:</strong></p>
                  <p className="text-xs text-gray-600 font-mono break-all">
                    [0, 0, 0, ..., 1, 0, ..., 1, 0, ..., 1, ..., 0]
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    131 dimensions with 4 ones (present symptoms) and 127 zeros (absent symptoms)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why This Approach Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span className="text-gray-700"><strong>Interpretability:</strong> Each feature directly represents a symptom's presence or absence</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span className="text-gray-700"><strong>No Scaling Required:</strong> Binary features don't need normalization</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span className="text-gray-700"><strong>Sparse Representation:</strong> Most features are 0, making computation efficient</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span className="text-gray-700"><strong>Tree-Based Models Love It:</strong> Decision trees naturally handle binary features</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">5.</span>
                  <span className="text-gray-700"><strong>Medical Relevance:</strong> Matches how doctors think about symptoms (present/absent)</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alternative Approaches</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">Severity Weighting</h4>
                  <p className="text-sm text-gray-600">Use severity scores (0.5, 1.0, 1.5) instead of binary 0/1 to capture symptom importance</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">One-Hot Encoding</h4>
                  <p className="text-sm text-gray-600">Create separate columns for each symptom (already done in our binary approach)</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">TF-IDF Weighting</h4>
                  <p className="text-sm text-gray-600">Weight symptoms by their discriminative power across diseases</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">Embedding-Based</h4>
                  <p className="text-sm text-gray-600">Learn dense vector representations of symptoms (advanced approach)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Feature Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Feature Sparsity</h4>
                  <p className="text-sm text-gray-700">Most records have 5-10 symptoms present (1s) out of 131 features</p>
                  <p className="text-xs text-gray-600 mt-2">Sparsity: ~96% zeros, 4% ones</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Feature Importance</h4>
                  <p className="text-sm text-gray-700">Symptoms vary in their predictive power for different diseases</p>
                  <p className="text-xs text-gray-600 mt-2">Random Forest will learn which features matter most</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
