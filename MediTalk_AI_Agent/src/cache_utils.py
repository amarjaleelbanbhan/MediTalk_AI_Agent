"""
Caching utilities for MediTalk AI
Provides caching decorators and functions for performance optimization
"""
from functools import lru_cache
from typing import List, Dict, Any
import streamlit as st


@lru_cache(maxsize=1)
def get_cached_symptoms_list(predictor) -> List[str]:
    """
    Cache symptoms list to avoid repeated lookups.
    
    Args:
        predictor: DiseasePredictor instance
        
    Returns:
        List of all symptoms
    """
    return predictor.get_all_symptoms()


@lru_cache(maxsize=1)
def get_cached_diseases_list(predictor) -> List[str]:
    """
    Cache diseases list to avoid repeated lookups.
    
    Args:
        predictor: DiseasePredictor instance
        
    Returns:
        List of all diseases
    """
    return predictor.get_all_diseases()


@st.cache_data(ttl=3600)
def cache_symptom_descriptions(_processor, disease: str) -> str:
    """
    Cache symptom descriptions for faster retrieval.
    
    Args:
        _processor: DataProcessor instance (prefixed with _ to avoid hashing)
        disease: Disease name
        
    Returns:
        Disease description
    """
    return _processor.get_symptom_description(disease)


@st.cache_data(ttl=3600)
def cache_precautions(_processor, disease: str) -> List[str]:
    """
    Cache precautions for faster retrieval.
    
    Args:
        _processor: DataProcessor instance (prefixed with _ to avoid hashing)
        disease: Disease name
        
    Returns:
        List of precautions
    """
    return _processor.get_symptom_precautions(disease)


@st.cache_resource
def load_predictor_cached(model_dir: str = 'models', data_dir: str = 'data'):
    """
    Cache the predictor instance to avoid reloading model on every interaction.
    
    Args:
        model_dir: Model directory path
        data_dir: Data directory path
        
    Returns:
        DiseasePredictor instance
    """
    from disease_predictor import DiseasePredictor
    return DiseasePredictor(model_dir, data_dir)
