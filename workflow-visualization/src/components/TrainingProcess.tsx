import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TrainingProcess() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Training Process</h1>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Model Training Pipeline</CardTitle>
              <CardDescription>Complete workflow from data to trained model</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                The training process transforms raw medical data into a production-ready disease prediction model through a systematic pipeline.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 1: Data Loading</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Load all medical datasets and merge them into a unified structure.
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`# Load datasets
dataset = pd.read_csv('data/dataset.csv')           # 4,920 records
descriptions = pd.read_csv('data/symptom_Description.csv')
precautions = pd.read_csv('data/symptom_precaution.csv')
severity = pd.read_csv('data/Symptom-severity.csv')

# Inspect structure
print(f"Dataset shape: {dataset.shape}")
print(f"Columns: {dataset.columns.tolist()}")
print(f"Unique diseases: {dataset['Disease'].nunique()}")`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 2: Data Preprocessing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Extract and standardize symptoms and diseases from the raw data.
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`# Extract unique symptoms
all_symptoms = []
for col in ['Symptom_1', 'Symptom_2', ..., 'Symptom_17']:
    symptoms = dataset[col].dropna().unique()
    all_symptoms.extend(symptoms)

# Clean and standardize
all_symptoms = [s.strip().lower().replace(' ', '_') 
                for s in all_symptoms]
all_symptoms = sorted(set(all_symptoms))

print(f"Total unique symptoms: {len(all_symptoms)}")  # 131

# Extract diseases
diseases = sorted(dataset['Disease'].unique())
print(f"Total unique diseases: {len(diseases)}")  # 41`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 3: Feature Matrix Creation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Convert symptom data into binary feature vectors (131 dimensions per record).
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`# Create feature matrix
X = np.zeros((len(dataset), len(all_symptoms)))

for idx, row in dataset.iterrows():
    # Extract symptoms for this disease
    symptoms_present = []
    for col in ['Symptom_1', ..., 'Symptom_17']:
        if pd.notna(row[col]):
            symptom = row[col].strip().lower().replace(' ', '_')
            symptoms_present.append(symptom)
    
    # Mark present symptoms with 1
    for symptom in symptoms_present:
        if symptom in all_symptoms:
            symptom_idx = all_symptoms.index(symptom)
            X[idx, symptom_idx] = 1

print(f"Feature matrix shape: {X.shape}")  # (4920, 131)
print(f"Sparsity: {(X == 0).sum() / X.size:.2%}")  # ~96% zeros`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 4: Label Encoding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Convert disease names to numeric labels for the classifier.
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`from sklearn.preprocessing import LabelEncoder

# Encode disease labels
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(dataset['Disease'])

# Create mapping
disease_mapping = dict(zip(label_encoder.classes_, 
                          label_encoder.transform(label_encoder.classes_)))

print(f"Label encoding examples:")
for disease, label in list(disease_mapping.items())[:5]:
    print(f"  {disease} → {label}")

print(f"Total classes: {len(label_encoder.classes_)}")  # 41`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 5: Train/Test Split</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Split data into training and testing sets with stratification to maintain class distribution.
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`from sklearn.model_selection import train_test_split

# Stratified split (80/20)
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y  # Maintain class distribution
)

print(f"Training set: {X_train.shape}")  # (3936, 131)
print(f"Test set: {X_test.shape}")        # (984, 131)
print(f"Training labels: {len(y_train)}")  # 3936
print(f"Test labels: {len(y_test)}")      # 984`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 6: Model Training</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Train the Random Forest classifier on the training data.
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`from sklearn.ensemble import RandomForestClassifier

# Initialize model
model = RandomForestClassifier(
    n_estimators=100,
    max_depth=20,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1,
    verbose=1
)

# Train model
print("Training model...")
model.fit(X_train, y_train)
print("Training complete!")

# Training time: ~2-5 minutes
# Model size: ~3.0 MB`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 7: Hyperparameter Tuning (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Use RandomizedSearchCV to find optimal hyperparameters.
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`from sklearn.model_selection import RandomizedSearchCV

# Define parameter search space
param_dist = {
    'n_estimators': [100, 150, 200, 250, 300, ...],
    'max_depth': [None, 10, 20, 30, 40, 50],
    'min_samples_split': [2, 5, 10, 20],
    'min_samples_leaf': [1, 2, 4, 8],
    'max_features': ['sqrt', 'log2', None],
    'bootstrap': [True, False],
    'class_weight': [None, 'balanced']
}

# Random search with cross-validation
search = RandomizedSearchCV(
    RandomForestClassifier(random_state=42),
    param_dist,
    n_iter=30,
    cv=3,
    scoring='f1_weighted',
    n_jobs=-1,
    verbose=1
)

print("Searching for best parameters...")
search.fit(X_train, y_train)
print(f"Best parameters: {search.best_params_}")
print(f"Best CV score: {search.best_score_:.4f}")`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 8: Model Evaluation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Evaluate model performance on the test set.
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, 
    f1_score, classification_report
)

# Make predictions
y_pred = model.predict(X_test)

# Calculate metrics
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, average='weighted')
recall = recall_score(y_test, y_pred, average='weighted')
f1 = f1_score(y_test, y_pred, average='weighted')

print(f"Accuracy:  {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall:    {recall:.4f}")
print(f"F1-Score:  {f1:.4f}")

# Detailed report
print(classification_report(y_test, y_pred, 
                          target_names=label_encoder.classes_))`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Step 9: Model Serialization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Save the trained model and supporting artifacts for deployment.
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`import pickle

# Save model
with open('models/disease_model.pkl', 'wb') as f:
    pickle.dump(model, f)

# Save label encoder
with open('models/label_encoder.pkl', 'wb') as f:
    pickle.dump(label_encoder, f)

# Save symptom list
with open('models/symptoms_list.pkl', 'wb') as f:
    pickle.dump(all_symptoms, f)

# Save disease list
with open('models/diseases_list.pkl', 'wb') as f:
    pickle.dump(diseases, f)

# Save metrics
import json
metrics = {
    'accuracy': float(accuracy),
    'precision': float(precision),
    'recall': float(recall),
    'f1': float(f1)
}
with open('models/training_metrics.json', 'w') as f:
    json.dump(metrics, f, indent=2)`}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Training Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Input Data</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 4,920 disease records</li>
                    <li>• 131 unique symptoms</li>
                    <li>• 41 disease classes</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Training Configuration</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• 80% training (3,936 samples)</li>
                    <li>• 20% testing (984 samples)</li>
                    <li>• 200 decision trees</li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Performance</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Accuracy: 100%</li>
                    <li>• Precision: 100%</li>
                    <li>• Recall: 100%</li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Output Artifacts</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Model file: 3.0 MB</li>
                    <li>• Training time: 2-5 min</li>
                    <li>• Prediction time: &lt;100ms</li>
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
