"""
Model Trainer Module for MediTalk AI Agent
Trains the disease prediction model using scikit-learn, with optional hyperparameter tuning.
"""

import os
import json
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, classification_report
from data_processor import DataProcessor

class ModelTrainer:
    def __init__(self, data_dir='data', model_dir='models'):
        """Initialize the model trainer."""
        self.data_dir = data_dir
        self.model_dir = model_dir
        self.processor = DataProcessor(data_dir)
        self.model = None
        self.label_encoder = None
        
    def prepare_data(self):
        """Prepare data for training."""
        print("Preparing data for training...")
        
        self.processor.load_data()
        self.processor.preprocess_data()
        X, y = self.processor.create_feature_matrix()
        
        # Encode labels
        self.label_encoder = LabelEncoder()
        y_encoded = self.label_encoder.fit_transform(y)
        
        print(f"Data prepared. X shape: {X.shape}, y shape: {y_encoded.shape}")
        
        return X, y_encoded
    
    def train_model(self, X, y, test_size=0.2, random_state=42):
        """Train the Random Forest model."""
        print("Training model...")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state, stratify=y
        )
        
        # Train Random Forest
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=20,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=random_state,
            n_jobs=-1,
            verbose=1
        )
        
        self.model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = self.model.predict(X_test)

        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred, average='weighted', zero_division=0)
        recall = recall_score(y_test, y_pred, average='weighted', zero_division=0)
        f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)
        cm = confusion_matrix(y_test, y_pred)
        report = classification_report(y_test, y_pred, zero_division=0)
        
        print(f"\nModel Performance:")
        print(f"Accuracy:  {accuracy:.4f}")
        print(f"Precision: {precision:.4f}")
        print(f"Recall:    {recall:.4f}")
        print(f"F1 Score:  {f1:.4f}")
        
        return self.model, {
            'mode': 'baseline',
            'accuracy': float(accuracy),
            'precision': float(precision),
            'recall': float(recall),
            'f1': float(f1),
            'confusion_matrix': cm.tolist(),
            'classification_report': report,
        }

    def tune_model(self, X, y, test_size=0.2, random_state=42, n_iter=30, cv=3, scoring='f1_weighted'):
        """Tune Random Forest hyperparameters using RandomizedSearchCV and train the best model.

        Returns the best model and a metrics dict including best params and scores.
        """
        print("Tuning model with RandomizedSearchCV...")

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state, stratify=y
        )

        rf = RandomForestClassifier(random_state=random_state, n_jobs=-1)
        param_dist = {
            'n_estimators': np.arange(100, 601, 50),
            'max_depth': [None] + list(np.arange(10, 61, 10)),
            'min_samples_split': [2, 5, 10, 20],
            'min_samples_leaf': [1, 2, 4, 8],
            'max_features': ['sqrt', 'log2', None],
            'bootstrap': [True, False],
            'class_weight': [None, 'balanced']
        }

        search = RandomizedSearchCV(
            rf,
            param_distributions=param_dist,
            n_iter=n_iter,
            cv=cv,
            scoring=scoring,
            random_state=random_state,
            n_jobs=-1,
            verbose=1,
            refit=True
        )

        search.fit(X_train, y_train)
        self.model = search.best_estimator_

        # Evaluate best model
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred, average='weighted', zero_division=0)
        recall = recall_score(y_test, y_pred, average='weighted', zero_division=0)
        f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)
        cm = confusion_matrix(y_test, y_pred)
        report = classification_report(y_test, y_pred, zero_division=0)

        print("\nTuning complete. Best parameters:")
        print(search.best_params_)
        print(f"Best CV score ({scoring}): {search.best_score_:.4f}")
        print(f"Holdout Accuracy:  {accuracy:.4f}")
        print(f"Holdout Precision: {precision:.4f}")
        print(f"Holdout Recall:    {recall:.4f}")
        print(f"Holdout F1 Score:  {f1:.4f}")

        return self.model, {
            'mode': 'tuned',
            'best_params': search.best_params_,
            'best_cv_score': float(search.best_score_),
            'scoring': scoring,
            'accuracy': float(accuracy),
            'precision': float(precision),
            'recall': float(recall),
            'f1': float(f1),
            'confusion_matrix': cm.tolist(),
            'classification_report': report,
        }
    
    def save_model(self):
        """Save trained model and encoder."""
        os.makedirs(self.model_dir, exist_ok=True)
        
        joblib.dump(self.model, os.path.join(self.model_dir, 'disease_model.pkl'))
        joblib.dump(self.label_encoder, os.path.join(self.model_dir, 'label_encoder.pkl'))
        joblib.dump(self.processor.all_symptoms, os.path.join(self.model_dir, 'symptoms_list.pkl'))
        joblib.dump(self.processor.diseases, os.path.join(self.model_dir, 'diseases_list.pkl'))
        
        print(f"Model saved to {self.model_dir}")

    def save_metrics(self, metrics: dict):
        """Save training metrics to JSON for later inspection/UI display."""
        os.makedirs(self.model_dir, exist_ok=True)
        metrics_path = os.path.join(self.model_dir, 'training_metrics.json')
        def _to_builtin(obj):
            """Recursively convert numpy / non-JSON-serializable types to Python builtins."""
            import numpy as _np
            if isinstance(obj, (_np.integer,)):
                return int(obj)
            if isinstance(obj, (_np.floating,)):
                return float(obj)
            if isinstance(obj, _np.ndarray):
                return obj.tolist()
            if isinstance(obj, dict):
                return {str(k): _to_builtin(v) for k, v in obj.items()}
            if isinstance(obj, (list, tuple, set)):
                return [_to_builtin(v) for v in obj]
            return obj

        cleaned = _to_builtin(metrics)
        with open(metrics_path, 'w', encoding='utf-8') as f:
            json.dump(cleaned, f, indent=2)
        print(f"Metrics saved to {metrics_path}")
    
    def run_training_pipeline(self, *, tune: bool = False, n_iter: int = 30, cv: int = 3, scoring: str = 'f1_weighted'):
        """Run complete training pipeline.

        If tune is True, perform hyperparameter tuning before saving the best model.
        """
        X, y = self.prepare_data()
        if tune:
            model, metrics = self.tune_model(X, y, n_iter=n_iter, cv=cv, scoring=scoring)
        else:
            model, metrics = self.train_model(X, y)
        self.save_model()
        self.save_metrics(metrics)
        print("\nTraining pipeline completed successfully!")

if __name__ == "__main__":
    import sys
    # Simple CLI flags: --tune [--iters N] [--cv K] [--scoring metric]
    args = sys.argv[1:]
    tune = '--tune' in args or os.getenv('MEDITALK_TUNING', '0') in ('1', 'true', 'TRUE')
    def _get_arg_value(flag: str, default: str):
        if flag in args:
            idx = args.index(flag)
            if idx + 1 < len(args):
                return args[idx + 1]
        return default

    n_iter = int(_get_arg_value('--iters', '30'))
    cv = int(_get_arg_value('--cv', '3'))
    scoring = _get_arg_value('--scoring', 'f1_weighted')

    trainer = ModelTrainer('data', 'models')
    trainer.run_training_pipeline(tune=tune, n_iter=n_iter, cv=cv, scoring=scoring)
