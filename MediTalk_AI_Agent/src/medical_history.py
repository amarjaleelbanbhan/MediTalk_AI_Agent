"""
Medical history tracking for MediTalk AI
Stores and retrieves consultation history using Streamlit session state
"""
import streamlit as st
from datetime import datetime
from typing import List, Dict, Any
import json


class MedicalHistory:
    """Manages patient consultation history."""
    
    @staticmethod
    def initialize_session():
        """Initialize session state for medical history."""
        if 'consultation_history' not in st.session_state:
            st.session_state.consultation_history = []
    
    @staticmethod
    def add_consultation(symptoms: List[str], result: Dict[str, Any]) -> None:
        """
        Add a consultation to history.
        
        Args:
            symptoms: List of input symptoms
            result: Prediction result dictionary
        """
        MedicalHistory.initialize_session()
        
        consultation = {
            'timestamp': datetime.now().isoformat(),
            'symptoms': symptoms,
            'primary_disease': result['primary_disease'],
            'confidence': result['confidence'],
            'alternatives': list(zip(
                result['alternative_diseases'],
                result['alternative_probabilities']
            ))
        }
        
        st.session_state.consultation_history.append(consultation)
        
        # Keep only last 50 consultations to manage memory
        if len(st.session_state.consultation_history) > 50:
            st.session_state.consultation_history = st.session_state.consultation_history[-50:]
    
    @staticmethod
    def get_history() -> List[Dict[str, Any]]:
        """
        Get consultation history.
        
        Returns:
            List of consultation dictionaries
        """
        MedicalHistory.initialize_session()
        return st.session_state.consultation_history
    
    @staticmethod
    def clear_history() -> None:
        """Clear all consultation history."""
        st.session_state.consultation_history = []
    
    @staticmethod
    def export_history_json() -> str:
        """
        Export history as JSON string.
        
        Returns:
            JSON string of consultation history
        """
        history = MedicalHistory.get_history()
        return json.dumps(history, indent=2)
    
    @staticmethod
    def get_history_summary() -> Dict[str, Any]:
        """
        Get summary statistics of consultation history.
        
        Returns:
            Dictionary with summary stats
        """
        history = MedicalHistory.get_history()
        
        if not history:
            return {
                'total_consultations': 0,
                'most_common_disease': None,
                'average_confidence': 0
            }
        
        # Calculate stats
        total = len(history)
        diseases = [c['primary_disease'] for c in history]
        confidences = [c['confidence'] for c in history]
        
        # Most common disease
        disease_counts = {}
        for disease in diseases:
            disease_counts[disease] = disease_counts.get(disease, 0) + 1
        
        most_common = max(disease_counts.items(), key=lambda x: x[1]) if disease_counts else (None, 0)
        
        return {
            'total_consultations': total,
            'most_common_disease': most_common[0],
            'most_common_count': most_common[1],
            'average_confidence': sum(confidences) / len(confidences) if confidences else 0,
            'unique_diseases': len(disease_counts)
        }
