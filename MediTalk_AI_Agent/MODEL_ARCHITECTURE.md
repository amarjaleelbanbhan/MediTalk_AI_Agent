# MediTalk AI Agent - Model Architecture & Training Guide

## 📋 Table of Contents
- [Overview](#overview)
- [Model Selection](#model-selection)
- [Architecture Details](#architecture-details)
- [Data Processing Pipeline](#data-processing-pipeline)
- [Training Process](#training-process)
- [Model Performance](#model-performance)
- [Prediction Workflow](#prediction-workflow)
- [Advanced Features](#advanced-features)

---

## 🎯 Overview

MediTalk AI Agent uses a **Random Forest Classifier** from scikit-learn to predict diseases based on patient symptoms. The model is trained on a comprehensive medical dataset containing symptom-disease relationships, achieving near-perfect accuracy in disease classification.

### Key Statistics
- **Model Type**: Random Forest Classifier (Ensemble Learning)
- **Training Accuracy**: 100% (after hyperparameter tuning)
- **Number of Features**: 131 unique symptoms
- **Number of Classes**: 41 different diseases
- **Training Samples**: ~4,920 disease-symptom combinations

---

## 🤖 Model Selection

### Why Random Forest?

**Random Forest Classifier** was chosen for the following reasons:

1. **Ensemble Learning Power**
   - Combines multiple decision trees to improve prediction accuracy
   - Reduces overfitting through bagging (bootstrap aggregating)
   - Robust to noise in training data

2. **Feature Importance**
   - Can identify which symptoms are most important for disease prediction
   - Provides interpretability through feature ranking
   - Handles multi-dimensional symptom data effectively

3. **Scalability**
   - Efficient training with parallel processing (n_jobs=-1)
   - Can handle large datasets with many features
   - Fast prediction time for real-time applications

4. **No Feature Scaling Required**
   - Works well with binary features (symptom present/absent)
   - Doesn't require normalization or standardization
   - Ideal for categorical medical data

5. **Multi-class Classification**
   - Naturally handles multiple disease classes
   - Provides probability estimates for each disease
   - Supports top-N predictions for differential diagnosis

---

## 🏗️ Architecture Details

### Model Configuration

#### Baseline Model (Default)
```python
RandomForestClassifier(
    n_estimators=100,        # Number of decision trees
    max_depth=20,            # Maximum depth of each tree
    min_samples_split=5,     # Minimum samples to split node
    min_samples_leaf=2,      # Minimum samples in leaf node
    random_state=42,         # Reproducibility
    n_jobs=-1,              # Use all CPU cores
    verbose=1               # Show training progress
)
```

#### Tuned Model (Optimized via RandomizedSearchCV)
```python
RandomForestClassifier(
    n_estimators=200,        # Optimized: More trees for stability
    max_depth=10,            # Optimized: Prevents overfitting
    min_samples_split=10,    # Optimized: Better generalization
    min_samples_leaf=8,      # Optimized: Smoother decision boundaries
    max_features='log2',     # Optimized: Feature selection strategy
    bootstrap=True,          # Optimized: Use bootstrap sampling
    class_weight=None,       # Optimized: No class balancing needed
    random_state=42,
    n_jobs=-1
)
```

### Hyperparameter Tuning

The model uses **RandomizedSearchCV** for efficient hyperparameter optimization:

```python
param_dist = {
    'n_estimators': [100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600],
    'max_depth': [None, 10, 20, 30, 40, 50, 60],
    'min_samples_split': [2, 5, 10, 20],
    'min_samples_leaf': [1, 2, 4, 8],
    'max_features': ['sqrt', 'log2', None],
    'bootstrap': [True, False],
    'class_weight': [None, 'balanced']
}

# Search Configuration
- n_iter: 30 (30 random combinations tested)
- cv: 3-fold cross-validation
- scoring: 'f1_weighted' (weighted F1-score)
```

---

## 📊 Data Processing Pipeline

### 1. Data Loading (`DataProcessor.load_data()`)

The system loads four CSV files:

```
data/
├── dataset.csv                 # Main symptom-disease dataset
├── symptom_Description.csv     # Disease descriptions
├── symptom_precaution.csv      # Treatment precautions
└── Symptom-severity.csv        # Symptom severity weights
```

**dataset.csv Structure:**
```
| Disease      | Symptom_1  | Symptom_2      | Symptom_3  | ... | Symptom_17 |
|--------------|------------|----------------|------------|-----|------------|
| Fungal inf.. | itching    | skin_rash      | nodal_ski..| ... | NULL       |
| Diabetes     | fatigue    | weight_loss    | restlessn..| ... | NULL       |
```

### 2. Data Preprocessing (`DataProcessor.preprocess_data()`)

**Steps:**
1. Extract all unique symptoms from symptom columns (Symptom_1 to Symptom_17)
2. Clean symptom names (remove whitespace, standardize format)
3. Create comprehensive symptom vocabulary (131 unique symptoms)
4. Extract all unique disease labels (41 diseases)
5. Sort symptoms and diseases alphabetically for consistency

**Output:**
- `all_symptoms`: ['abdominal_pain', 'abnormal_menstruation', ..., 'yellow_urine']
- `diseases`: ['(vertigo) Paroymsal  Positional Vertigo', 'AIDS', ..., 'Varicose veins']

### 3. Feature Matrix Creation (`DataProcessor.create_feature_matrix()`)

**Binary Feature Encoding:**
```python
# For each patient record:
# Create a vector of length 131 (one for each symptom)
symptom_vector = [0, 0, 0, ..., 0]  # All zeros initially

# Mark present symptoms with 1
for symptom in patient_symptoms:
    if symptom in all_symptoms:
        idx = all_symptoms.index(symptom)
        symptom_vector[idx] = 1
```

**Example:**
```python
Patient has: ['high_fever', 'cough', 'fatigue']

Feature Vector: [0, 0, 0, ..., 1, 0, ..., 1, 0, ..., 1, ..., 0]
                                 ↑           ↑           ↑
                            high_fever    cough      fatigue
```

**Optional Severity Weighting:**
```python
# Instead of binary 0/1, use severity weights
symptom_vector[idx] = severity_weight  # e.g., 0.5, 1.0, 1.5
```

### 4. Label Encoding

Disease names are converted to numeric labels:
```python
from sklearn.preprocessing import LabelEncoder

le = LabelEncoder()
y_encoded = le.fit_transform(['Diabetes', 'Flu', 'Diabetes', 'Malaria'])
# Output: [0, 1, 0, 2]
```

---

## 🎓 Training Process

### Standard Training Workflow

```python
from src.model_trainer import ModelTrainer

# Initialize trainer
trainer = ModelTrainer(data_dir='data', model_dir='models')

# Run complete pipeline
trainer.run_training_pipeline(tune=False)
```

**Pipeline Steps:**
1. **Data Preparation** (`prepare_data()`)
   - Load CSV files
   - Preprocess symptoms and diseases
   - Create feature matrix (X) and target vector (y)
   - Encode disease labels

2. **Data Splitting** (`train_test_split`)
   - Training set: 80% (stratified by disease)
   - Test set: 20%
   - Random state: 42 (reproducibility)

3. **Model Training** (`train_model()`)
   - Initialize Random Forest with default parameters
   - Fit model on training data
   - Generate predictions on test set

4. **Model Evaluation**
   - Calculate metrics: accuracy, precision, recall, F1-score
   - Generate confusion matrix
   - Create detailed classification report

5. **Model Saving** (`save_model()`)
   - Save trained model: `models/disease_model.pkl`
   - Save label encoder: `models/label_encoder.pkl`
   - Save symptom list: `models/symptoms_list.pkl`
   - Save disease list: `models/diseases_list.pkl`

6. **Metrics Logging** (`save_metrics()`)
   - Save performance metrics: `models/training_metrics.json`

### Advanced Training with Hyperparameter Tuning

```bash
# Command line
python src/model_trainer.py --tune --iters 30 --cv 3 --scoring f1_weighted

# Python code
trainer.run_training_pipeline(
    tune=True, 
    n_iter=30,      # Test 30 random parameter combinations
    cv=3,           # 3-fold cross-validation
    scoring='f1_weighted'
)
```

**Tuning Process:**
1. Define hyperparameter search space
2. Use RandomizedSearchCV to explore combinations
3. Evaluate each combination using cross-validation
4. Select best parameters based on F1-score
5. Retrain model with best parameters
6. Evaluate on holdout test set

---

## 📈 Model Performance

### Current Performance Metrics

Based on `models/training_metrics.json`:

```json
{
  "mode": "tuned",
  "accuracy": 1.0,
  "precision": 1.0,
  "recall": 1.0,
  "f1": 1.0,
  "best_cv_score": 1.0
}
```

**Interpretation:**
- **Accuracy: 100%** - All predictions are correct
- **Precision: 100%** - No false positives
- **Recall: 100%** - No false negatives
- **F1-Score: 100%** - Perfect balance of precision and recall

### Performance Metrics Explained

1. **Accuracy**: `(TP + TN) / Total`
   - Percentage of correct predictions

2. **Precision**: `TP / (TP + FP)`
   - Of all positive predictions, how many were correct?
   - Important for avoiding false alarms

3. **Recall**: `TP / (TP + FN)`
   - Of all actual positives, how many did we catch?
   - Important for avoiding missed diagnoses

4. **F1-Score**: `2 × (Precision × Recall) / (Precision + Recall)`
   - Harmonic mean of precision and recall
   - Balanced metric for imbalanced datasets

### Confusion Matrix

Perfect diagonal matrix (simplified):
```
                Predicted
              D1  D2  D3  ...
Actual  D1  [ 24   0   0  ...]
        D2  [  0  19   0  ...]
        D3  [  0   0  22  ...]
        ... 
```

---

## 🔮 Prediction Workflow

### 1. Input Processing

```python
from src.disease_predictor import DiseasePredictor

predictor = DiseasePredictor(model_dir='models', data_dir='data')

# User input
user_symptoms = ['high fever', 'cough', 'fatigue', 'body ache']

# Clean and normalize
symptoms_clean = [s.strip().lower().replace(' ', '_') for s in user_symptoms]
# Result: ['high_fever', 'cough', 'fatigue', 'body_ache']
```

### 2. Feature Vector Creation

```python
# Create binary feature vector
feature_vector = [0] * 131  # All symptoms initialized to 0

for symptom in symptoms_clean:
    if symptom in symptoms_list:
        idx = symptoms_list.index(symptom)
        feature_vector[idx] = 1

feature_vector = np.array(feature_vector).reshape(1, -1)
```

### 3. Model Prediction

```python
# Get prediction
prediction = model.predict(feature_vector)[0]
# Result: Disease label (e.g., 0 for 'Fungal infection')

# Get probability distribution
probabilities = model.predict_proba(feature_vector)[0]
# Result: [0.05, 0.02, 0.85, 0.01, ...]  # Probability for each disease
```

### 4. Top-N Predictions

```python
# Get top 3 most likely diseases
top_indices = np.argsort(probabilities)[::-1][:3]
top_diseases = [label_encoder.classes_[idx] for idx in top_indices]
top_probabilities = [probabilities[idx] for idx in top_indices]

# Result:
# ['Influenza', 'Common Cold', 'Pneumonia']
# [0.85, 0.10, 0.03]
```

### 5. Result Enrichment

```python
# Add disease description and precautions
result = {
    'primary_disease': 'Influenza',
    'confidence': 0.85,
    'alternative_diseases': ['Common Cold', 'Pneumonia'],
    'alternative_probabilities': [0.10, 0.03],
    'description': 'Viral infection affecting respiratory system...',
    'precautions': ['Rest', 'Drink fluids', 'Take fever medication', 'Isolate'],
    'input_symptoms': user_symptoms,
    'recognized_symptoms': ['high_fever', 'cough', 'fatigue']
}
```

---

## 🚀 Advanced Features

### 1. Symptom Validation

```python
validation = predictor.validate_symptoms(user_symptoms)

{
    'valid_symptoms': ['high_fever', 'cough', 'fatigue'],
    'invalid_symptoms': ['weird_feeling'],
    'all_valid': False
}
```

### 2. Severity Weighting (Optional)

```python
# Train model with severity weights
X, y = processor.create_feature_matrix(use_severity_weighting=True)

# Symptoms weighted by medical importance:
# - Critical symptoms (e.g., chest_pain): weight = 1.5
# - Moderate symptoms (e.g., headache): weight = 1.0
# - Minor symptoms (e.g., mild_fever): weight = 0.5
```

### 3. Feature Importance Analysis

```python
# Get most important symptoms for predictions
importances = model.feature_importances_
feature_importance = sorted(
    zip(symptoms_list, importances), 
    key=lambda x: x[1], 
    reverse=True
)

# Top 5 most important symptoms
print(feature_importance[:5])
# [('chest_pain', 0.15), ('high_fever', 0.12), ...]
```

### 4. Model Comparison

```python
# Compare baseline vs tuned model
baseline_metrics = trainer.train_model(X, y)
tuned_metrics = trainer.tune_model(X, y)

print(f"Baseline F1: {baseline_metrics['f1']:.4f}")
print(f"Tuned F1: {tuned_metrics['f1']:.4f}")
```

### 5. Batch Prediction

```python
# Predict multiple cases simultaneously
patients = [
    ['fever', 'cough', 'fatigue'],
    ['skin_rash', 'itching', 'redness'],
    ['abdominal_pain', 'vomiting', 'diarrhea']
]

results = [predictor.predict_disease(symptoms) for symptoms in patients]
```

---

## 🛠️ Training Commands

### Basic Training
```bash
# Standard training (no tuning)
python src/model_trainer.py
```

### Advanced Training
```bash
# With hyperparameter tuning
python src/model_trainer.py --tune

# Custom tuning parameters
python src/model_trainer.py --tune --iters 50 --cv 5 --scoring accuracy

# Using environment variable
set MEDITALK_TUNING=1
python src/model_trainer.py
```

---

## 📁 Model Files

After training, the following files are created:

```
models/
├── disease_model.pkl          # Trained Random Forest model
├── label_encoder.pkl          # Disease label encoder
├── symptoms_list.pkl          # List of 131 symptoms
├── diseases_list.pkl          # List of 41 diseases
└── training_metrics.json      # Performance metrics
```

---

## 🔬 Technical Details

### Algorithm: Random Forest

**How it Works:**
1. **Bootstrap Sampling**: Create N random subsets of training data
2. **Tree Building**: Build a decision tree for each subset
3. **Feature Randomness**: Each tree uses random subset of features
4. **Voting**: Combine predictions from all trees (majority voting)
5. **Probability Estimation**: Average probabilities across trees

**Decision Tree Example:**
```
                    [Root: Has fever?]
                    /              \
                Yes                 No
                /                    \
        [Has cough?]           [Has rash?]
        /         \            /         \
      Yes         No         Yes         No
      /            \          |           |
  Influenza    Malaria   Measles    Allergy
```

### Memory & Speed

- **Model Size**: ~5-10 MB (depending on n_estimators)
- **Training Time**: 
  - Baseline: ~30-60 seconds
  - Tuned: ~5-15 minutes (30 iterations)
- **Prediction Time**: <10ms per prediction
- **RAM Usage**: ~500 MB during training

---

## 🎯 Best Practices

1. **Data Quality**
   - Ensure clean, consistent symptom naming
   - Remove duplicate entries
   - Handle missing values appropriately

2. **Model Selection**
   - Use tuned model for production
   - Retrain periodically with new data
   - Monitor prediction confidence

3. **Validation**
   - Always validate input symptoms
   - Check confidence scores
   - Provide alternative diagnoses

4. **Performance Monitoring**
   - Track prediction accuracy over time
   - Log misclassifications for review
   - Update model when accuracy drops

---

## 📚 References

- **scikit-learn Documentation**: https://scikit-learn.org/stable/modules/ensemble.html#forest
- **Random Forest Paper**: Breiman, L. (2001). "Random Forests". Machine Learning.
- **Medical Dataset**: Kaggle Disease Symptom Prediction Dataset

---

## 🆘 Troubleshooting

### Model Not Found
```python
FileNotFoundError: disease_model.pkl not found
```
**Solution**: Run `python src/model_trainer.py` to train the model first.

### Low Accuracy
```python
Accuracy < 90%
```
**Solution**: Run hyperparameter tuning with `python src/model_trainer.py --tune`

### Memory Error
```python
MemoryError during training
```
**Solution**: Reduce `n_estimators` or use `max_samples` parameter to limit tree size.

---

**Created by**: MediTalk AI Team  
**Last Updated**: November 19, 2025  
**Version**: 1.0
