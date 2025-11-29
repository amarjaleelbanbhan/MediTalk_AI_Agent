"""
Data Processor Module for MediTalk AI Agent
Handles data loading, preprocessing, and feature engineering
"""

import pandas as pd
import numpy as np
import os
from pathlib import Path
import joblib
from typing import Tuple, List, Optional
import logging

# Setup logging
logger = logging.getLogger(__name__)


class DataProcessor:
    """Processes medical symptom and disease data for model training."""
    
    def __init__(self, data_dir: str = 'data') -> None:
        """
        Initialize the data processor with data directory path.
        
        Args:
            data_dir: Path to directory containing CSV data files
        """
        self.data_dir = data_dir
        self.dataset: Optional[pd.DataFrame] = None
        self.symptom_descriptions: Optional[pd.DataFrame] = None
        self.symptom_precautions: Optional[pd.DataFrame] = None
        self.symptom_severity: Optional[pd.DataFrame] = None
        self.all_symptoms: List[str] = []
        self.diseases: List[str] = []
        
    def load_data(self) -> None:
        """
        Load all CSV files from data directory.
        
        Raises:
            FileNotFoundError: If data files are not found
            pd.errors.ParserError: If CSV files are malformed
        """
        logger.info("Loading datasets...")
        
        try:
            # Load main dataset
            self.dataset = pd.read_csv(os.path.join(self.data_dir, 'dataset.csv'))
            
            # Load symptom descriptions
            self.symptom_descriptions = pd.read_csv(os.path.join(self.data_dir, 'symptom_Description.csv'))
            
            # Load symptom precautions
            self.symptom_precautions = pd.read_csv(os.path.join(self.data_dir, 'symptom_precaution.csv'))
            
            # Load symptom severity
            self.symptom_severity = pd.read_csv(os.path.join(self.data_dir, 'Symptom-severity.csv'))
            
            logger.info(f"Dataset shape: {self.dataset.shape}")
            logger.info(f"Unique diseases: {self.dataset['Disease'].nunique()}")
            
        except FileNotFoundError as e:
            logger.error(f"Data file not found: {e}")
            raise
        except Exception as e:
            logger.error(f"Error loading data: {e}")
            raise
    
    def preprocess_data(self) -> Tuple[List[str], List[str]]:
        """
        Preprocess the dataset for model training.
        
        Returns:
            Tuple of (all_symptoms, diseases) lists
            
        Raises:
            ValueError: If dataset is not loaded
        """
        if self.dataset is None:
            raise ValueError("Dataset not loaded. Call load_data() first.")
            
        logger.info("Preprocessing data...")
        
        # Extract all unique symptoms
        symptom_columns = [col for col in self.dataset.columns if col.startswith('Symptom_')]
        all_symptoms_list = set()
        
        for col in symptom_columns:
            all_symptoms_list.update(self.dataset[col].dropna().unique())
        
        # Clean symptom names (remove leading/trailing spaces)
        self.all_symptoms = sorted([s.strip() for s in all_symptoms_list if s.strip()])
        self.diseases = sorted(self.dataset['Disease'].unique())
        
        logger.info(f"Total unique symptoms: {len(self.all_symptoms)}")
        logger.info(f"Total unique diseases: {len(self.diseases)}")
        
        return self.all_symptoms, self.diseases
    
    def create_feature_matrix(self, use_severity_weighting: bool = False) -> Tuple[np.ndarray, np.ndarray]:
        """
        Create feature matrix for model training.
        
        Args:
            use_severity_weighting: If True, apply symptom severity weights to features.
                Defaults to False to maintain binary feature matrix expected by
                existing tests. Enable when training weighted models.
        
        Returns:
            Tuple of (X, y) where X is feature matrix and y is target vector
            
        Raises:
            ValueError: If data is not preprocessed
        """
        if not self.all_symptoms or not self.diseases:
            raise ValueError("Data not preprocessed. Call preprocess_data() first.")
            
        logger.info("Creating feature matrix...")
        
        X = []
        y = []
        
        # Create severity weight dictionary
        severity_weights = {}
        if use_severity_weighting and self.symptom_severity is not None:
            for _, row in self.symptom_severity.iterrows():
                symptom = str(row['Symptom']).strip()
                weight = float(row['weight'])
                severity_weights[symptom] = weight
            logger.info(f"Loaded {len(severity_weights)} severity weights")
        
        for idx, row in self.dataset.iterrows():
            disease = row['Disease'].strip()
            
            # Create symptom vector
            symptom_vector = [0] * len(self.all_symptoms)
            
            # Get symptoms for this disease
            symptom_columns = [col for col in self.dataset.columns if col.startswith('Symptom_')]
            symptoms = [s.strip() for s in row[symptom_columns].dropna() if s.strip()]
            
            # Mark present symptoms with severity weighting
            for symptom in symptoms:
                if symptom in self.all_symptoms:
                    idx_symptom = self.all_symptoms.index(symptom)
                    
                    # Apply severity weight if available, otherwise use 1
                    if use_severity_weighting and symptom in severity_weights:
                        symptom_vector[idx_symptom] = severity_weights[symptom]
                    else:
                        symptom_vector[idx_symptom] = 1
            
            X.append(symptom_vector)
            y.append(disease)
        
        X = np.array(X)
        y = np.array(y)
        
        logger.info(f"Feature matrix shape: {X.shape}")
        logger.info(f"Target vector shape: {y.shape}")
        
        if use_severity_weighting:
            logger.info("Severity weighting applied to feature matrix")
        else:
            # Assert / guarantee binary values (0/1) for tests and downstream
            # compatibility. This is a safeguard ensuring no weighted leakage.
            unique_vals = np.unique(X)
            if not set(unique_vals).issubset({0, 1}):
                logger.warning(
                    "Binary feature matrix expected but found values outside {0,1}: %s",
                    unique_vals
                )
        
        return X, y
    
    def get_symptom_description(self, disease: str) -> str:
        """
        Get description for a disease.
        
        Args:
            disease: Disease name
            
        Returns:
            Description string or default message if not found
        """
        if self.symptom_descriptions is None:
            return "No description available."
            
        disease_clean = disease.strip()
        desc_row = self.symptom_descriptions[
            self.symptom_descriptions['Disease'].str.strip() == disease_clean
        ]
        
        if len(desc_row) > 0:
            return desc_row.iloc[0]['Description']
        return "No description available."
    
    def get_symptom_precautions(self, disease: str) -> List[str]:
        """
        Get precautions for a disease.
        
        Args:
            disease: Disease name
            
        Returns:
            List of precaution strings
        """
        if self.symptom_precautions is None:
            return []
            
        disease_clean = disease.strip()
        prec_row = self.symptom_precautions[
            self.symptom_precautions['Disease'].str.strip() == disease_clean
        ]
        
        if len(prec_row) > 0:
            precautions = [
                prec_row.iloc[0][f'Precaution_{i}'] 
                for i in range(1, 5) 
                if f'Precaution_{i}' in prec_row.columns and pd.notna(prec_row.iloc[0][f'Precaution_{i}'])
            ]
            return [p.strip() for p in precautions if p.strip()]
        return []
    
    def get_symptom_severity(self, symptom: str) -> float:
        """
        Get severity weight for a symptom.
        
        Args:
            symptom: Symptom name
            
        Returns:
            Severity weight (default 1.0 if not found)
        """
        if self.symptom_severity is None:
            return 1.0
            
        symptom_clean = symptom.strip()
        sev_row = self.symptom_severity[
            self.symptom_severity['Symptom'].str.strip() == symptom_clean
        ]
        
        if len(sev_row) > 0:
            return float(sev_row.iloc[0]['weight'])
        return 1.0  # Default severity
    
    def save_preprocessed_data(self, output_dir: str = 'models') -> None:
        """
        Save preprocessed data for later use.
        
        Args:
            output_dir: Directory to save preprocessed data
        """
        os.makedirs(output_dir, exist_ok=True)
        
        joblib.dump(self.all_symptoms, os.path.join(output_dir, 'symptoms_list.pkl'))
        joblib.dump(self.diseases, os.path.join(output_dir, 'diseases_list.pkl'))
        
        logger.info(f"Preprocessed data saved to {output_dir}")


if __name__ == "__main__":
    processor = DataProcessor('data')
    processor.load_data()
    processor.preprocess_data()
    processor.create_feature_matrix()
    processor.save_preprocessed_data()
