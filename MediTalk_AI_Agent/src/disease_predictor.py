"""
Disease Predictor Module for MediTalk AI Agent
Handles disease prediction and recommendation generation
"""

import os
import joblib
import numpy as np
from data_processor import DataProcessor

class DiseasePredictor:
    def __init__(self, model_dir='models', data_dir='data', model_filename: str | None = None):
        """Initialize the disease predictor."""
        self.model_dir = model_dir
        self.data_dir = data_dir
        self.model_filename = model_filename or 'disease_model.pkl'
        self.model = None
        self.label_encoder = None
        self.symptoms_list = None
        self.diseases_list = None
        self.processor = DataProcessor(data_dir)
        
        self.load_model()
        self.processor.load_data()
    
    def load_model(self):
        """Load trained model and components."""
        try:
            model_path = os.path.join(self.model_dir, self.model_filename)
            if not os.path.exists(model_path):
                # Fallbacks: try common names
                for candidate in ('disease_model.pkl', 'random_forest_model.pkl'):
                    p = os.path.join(self.model_dir, candidate)
                    if os.path.exists(p):
                        model_path = p
                        self.model_filename = candidate
                        break
            self.model = joblib.load(model_path)
            self.label_encoder = joblib.load(os.path.join(self.model_dir, 'label_encoder.pkl'))
            self.symptoms_list = joblib.load(os.path.join(self.model_dir, 'symptoms_list.pkl'))
            self.diseases_list = joblib.load(os.path.join(self.model_dir, 'diseases_list.pkl'))

            # Sanity check: ensure model is compatible with symptom vector length
            try:
                import numpy as np
                test_vec = np.zeros((1, len(self.symptoms_list)))
                # Some models require predict_proba to exist; fall back to predict
                if hasattr(self.model, 'predict_proba'):
                    _ = self.model.predict_proba(test_vec)
                else:
                    _ = self.model.predict(test_vec)
            except Exception as compat_err:
                # Try falling back to default disease_model.pkl
                fallback_path = os.path.join(self.model_dir, 'disease_model.pkl')
                if os.path.exists(fallback_path) and os.path.abspath(fallback_path) != os.path.abspath(model_path):
                    self.model = joblib.load(fallback_path)
                    self.model_filename = 'disease_model.pkl'
                    print(f"Selected model incompatible; fell back to disease_model.pkl ({compat_err})")
                else:
                    raise compat_err

            print(f"Model loaded successfully! ({os.path.basename(self.model_filename)})")
        except FileNotFoundError as e:
            print(f"Error loading model: {e}")
            print("Please train the model first using model_trainer.py")
            raise
    
    def predict_disease(self, symptoms):
        """
        Predict disease based on input symptoms.
        
        Args:
            symptoms (list): List of symptom strings
            
        Returns:
            dict: Prediction results with disease, confidence, and recommendations
        """
        # Clean and normalize symptoms
        symptoms_clean = [s.strip().lower().replace(' ', '_') for s in symptoms]
        
        # Create feature vector
        feature_vector = [0] * len(self.symptoms_list)
        
        for symptom in symptoms_clean:
            if symptom in self.symptoms_list:
                idx = self.symptoms_list.index(symptom)
                feature_vector[idx] = 1
        
        feature_vector = np.array(feature_vector).reshape(1, -1)
        
        # Get predictions
        prediction = self.model.predict(feature_vector)[0]
        probabilities = self.model.predict_proba(feature_vector)[0]
        
        # Get top 5 predictions initially to filter better
        top_indices = np.argsort(probabilities)[::-1][:5]
        
        # Filter predictions to only include those with meaningful probability
        # This helps avoid showing diseases with very similar low probabilities
        filtered_indices = []
        for idx in top_indices:
            prob = probabilities[idx]
            # Include if probability is significant (>1%) or if it's in top 3
            if prob > 0.01 or len(filtered_indices) < 3:
                filtered_indices.append(idx)
                if len(filtered_indices) >= 3:
                    break
        
        # Ensure we have at least 3 predictions
        if len(filtered_indices) < 3:
            filtered_indices = top_indices[:3]
        
        top_diseases = [self.label_encoder.classes_[idx] for idx in filtered_indices]
        top_probabilities = [probabilities[idx] for idx in filtered_indices]
        
        # Get recommendations for primary disease
        primary_disease = top_diseases[0]
        description = self.processor.get_symptom_description(primary_disease)
        precautions = self.processor.get_symptom_precautions(primary_disease)
        
        result = {
            'primary_disease': primary_disease,
            'confidence': float(top_probabilities[0]),
            'alternative_diseases': top_diseases[1:],
            'alternative_probabilities': top_probabilities[1:],
            'description': description,
            'precautions': precautions,
            'input_symptoms': symptoms_clean,
            'recognized_symptoms': [s for s in symptoms_clean if s in self.symptoms_list]
        }
        
        return result
    
    def get_all_symptoms(self):
        """Return list of all available symptoms."""
        return self.symptoms_list
    
    def get_all_diseases(self):
        """Return list of all available diseases."""
        return self.diseases_list
    
    def validate_symptoms(self, symptoms):
        """
        Validate input symptoms against known symptoms.
        
        Returns:
            dict: Validation results
        """
        symptoms_clean = [s.strip().lower().replace(' ', '_') for s in symptoms]
        
        valid_symptoms = []
        invalid_symptoms = []
        
        for symptom in symptoms_clean:
            if symptom in self.symptoms_list:
                valid_symptoms.append(symptom)
            else:
                invalid_symptoms.append(symptom)
        
        return {
            'valid_symptoms': valid_symptoms,
            'invalid_symptoms': invalid_symptoms,
            'all_valid': len(invalid_symptoms) == 0
        }

if __name__ == "__main__":
    # Example usage
    predictor = DiseasePredictor('models', 'data')
    
    # Test prediction
    test_symptoms = ['high_fever', 'cough', 'fatigue']
    result = predictor.predict_disease(test_symptoms)
    
    print("\n=== Prediction Result ===")
    print(f"Primary Disease: {result['primary_disease']}")
    print(f"Confidence: {result['confidence']:.2%}")
    print(f"Description: {result['description'][:100]}...")
    print(f"Precautions: {', '.join(result['precautions'][:2])}")
