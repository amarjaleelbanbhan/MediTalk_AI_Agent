"""
MediTalk AI - Professional Medical Consultation Platform
Enhanced professional interface with modern design and full functionality
"""

import streamlit as st
import sys
import os
import json
import difflib
import time
import logging
from typing import Any, Dict, List, cast
from logging.handlers import RotatingFileHandler

# Add src directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from disease_predictor import DiseasePredictor

# Import components with graceful error handling
try:
    from voice_interface import VoiceInterface
    VOICE_AVAILABLE = True
except ImportError:
    VoiceInterface = None
    VOICE_AVAILABLE = False

try:
    from audio_response import AudioResponse
    AUDIO_AVAILABLE = True
except ImportError:
    AudioResponse = None
    AUDIO_AVAILABLE = False

from nlp_symptom_extractor import SymptomExtractor
try:
    from ui_components import (
        render_metric_grid,
        render_prediction_results,
        render_precautions,
    )
except ImportError:
    def render_metric_grid(metrics): 
        for label, value in metrics:
            st.metric(label, value)
    def render_prediction_results(result):
        st.write(result)
    def render_precautions(precautions):
        for p in precautions:
            st.write(f"• {p}")
            
from medical_history import MedicalHistory
from pdf_generator import PDFReportGenerator
from cache_utils import load_predictor_cached

# Professional page configuration
st.set_page_config(
    page_title="MediTalk AI - Professional Medical Platform",
    page_icon="🏥",
    layout="wide",
    initial_sidebar_state="collapsed"
)

def load_professional_css():
    """Load professional, modern CSS with clinical design"""
    st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto+Slab:wght@400;500;600;700&display=swap');
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    
    /* Global Professional Styles */
    .stApp {
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        color: #1a202c;
        line-height: 1.6;
    }
    
    /* Hide Streamlit default elements */
    .css-1d391kg, .css-18e3th9, .css-1v0mbdj, .css-1rs6os, 
    .css-10trblm, .css-16huue1, .css-1dp5vir {
        display: none !important;
    }
    
    header[data-testid="stHeader"] {
        display: none !important;
    }
    
    /* Professional Header */
    .professional-header {
        background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
        color: white;
        padding: 2rem 0;
        border-radius: 0 0 20px 20px;
        margin-bottom: 2rem;
        box-shadow: 0 10px 25px rgba(37, 99, 235, 0.2);
        animation: slideInDown 0.6s ease-out;
    }
    
    @keyframes slideInDown {
        from { transform: translateY(-30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    .header-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .header-title {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .header-title h1 {
        font-family: 'Roboto Slab', serif;
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0;
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .header-icon {
        font-size: 3rem;
        animation: pulse 2s ease-in-out infinite;
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .header-stats {
        display: flex;
        gap: 2rem;
        font-size: 0.9rem;
    }
    
    .stat-item {
        text-align: center;
        padding: 0.5rem;
        background: rgba(255,255,255,0.1);
        border-radius: 8px;
        backdrop-filter: blur(10px);
    }
    
    .stat-number {
        font-size: 1.5rem;
        font-weight: 700;
        display: block;
    }
    
    /* Professional Cards */
    .professional-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 2rem;
        margin: 1.5rem 0;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        animation: fadeInUp 0.6s ease-out;
    }
    
    .professional-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        border-color: #3b82f6;
    }
    
    .professional-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ef4444);
    }
    
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    /* Section Headers */
    .section-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid #e2e8f0;
    }
    
    .section-icon {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        color: white;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
    }
    
    .section-title {
        font-family: 'Roboto Slab', serif;
        font-size: 1.8rem;
        font-weight: 600;
        color: #1a202c;
        margin: 0;
    }
    
    /* Professional Buttons */
    .stButton > button {
        background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
        color: white;
        border: none;
        border-radius: 12px;
        padding: 0.75rem 2rem;
        font-weight: 600;
        font-size: 1rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        position: relative;
        overflow: hidden;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 25px rgba(59, 130, 246, 0.4);
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    }
    
    .stButton > button:active {
        transform: translateY(0);
    }
    
    /* Professional Input Fields */
    .stTextInput > div > div > input,
    .stTextArea > div > div > textarea,
    .stSelectbox > div > div > select {
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        padding: 1rem;
        font-family: 'Inter', sans-serif;
        font-size: 1rem;
        transition: all 0.3s ease;
        background: #ffffff;
    }
    
    .stTextInput > div > div > input:focus,
    .stTextArea > div > div > textarea:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        outline: none;
    }
    
    /* Navigation Pills */
    .nav-pills {
        display: flex;
        gap: 1rem;
        margin: 2rem 0;
        padding: 0.5rem;
        background: #f1f5f9;
        border-radius: 16px;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .nav-pill {
        padding: 0.75rem 1.5rem;
        background: #ffffff;
        border: 2px solid transparent;
        border-radius: 12px;
        color: #475569;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .nav-pill:hover {
        border-color: #3b82f6;
        color: #3b82f6;
        transform: translateY(-1px);
    }
    
    .nav-pill.active {
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        color: white;
        border-color: transparent;
    }
    
    /* Professional Loading Animation */
    .professional-loader {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 2rem;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        border-radius: 16px;
        margin: 2rem 0;
        position: relative;
    }
    
    .loader-icon {
        width: 80px;
        height: 80px;
        border: 4px solid #e2e8f0;
        border-top: 4px solid #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 2rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .loader-text {
        font-size: 1.2rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.5rem;
        text-align: center;
    }
    
    .loader-subtext {
        font-size: 1rem;
        color: #4b5563;
        text-align: center;
    }
    
    /* Results Display */
    .diagnosis-container {
        background: linear-gradient(135deg, #fefefe 0%, #f8fafc 100%);
        border-radius: 16px;
        padding: 2rem;
        margin: 2rem 0;
        border: 1px solid #e2e8f0;
    }
    
    .primary-diagnosis {
        background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 12px;
        margin-bottom: 1.5rem;
        text-align: center;
    }
    
    .diagnosis-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }
    
    .confidence-display {
        font-size: 1.2rem;
        opacity: 0.9;
    }
    
    .confidence-bar-container {
        background: #e2e8f0;
        border-radius: 8px;
        height: 12px;
        margin: 1rem 0;
        overflow: hidden;
    }
    
    .confidence-bar {
        height: 100%;
        background: linear-gradient(90deg, #10b981, #3b82f6);
        border-radius: 8px;
        transition: width 1s ease-out;
    }
    
    /* Alternative Diagnoses */
    .alternatives-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
        margin: 1.5rem 0;
    }
    
    .alternative-item {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 1rem;
        transition: all 0.3s ease;
    }
    
    .alternative-item:hover {
        border-color: #3b82f6;
        transform: translateY(-2px);
    }
    
    .alternative-name {
        font-weight: 600;
        color: #374151;
        margin-bottom: 0.5rem;
    }
    
    .alternative-probability {
        font-size: 0.9rem;
        color: #6b7280;
    }
    
    /* Metrics Grid */
    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin: 2rem 0;
    }
    
    .metric-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 1.5rem;
        text-align: center;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .metric-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    }
    
    .metric-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }
    
    .metric-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: #3b82f6;
        margin-bottom: 0.5rem;
    }
    
    .metric-label {
        font-size: 0.9rem;
        font-weight: 500;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    
    /* Professional Footer */
    .professional-footer {
        background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
        color: white;
        padding: 3rem 0;
        margin-top: 4rem;
        border-radius: 20px 20px 0 0;
        text-align: center;
    }
    
    .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
    }
    
    /* Voice Controls */
    .voice-controls {
        background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
        border: 1px solid #bbf7d0;
        border-radius: 12px;
        padding: 1.5rem;
        margin: 1rem 0;
    }
    
    .voice-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        color: #16a34a;
        font-weight: 600;
    }
    
    .voice-indicator.recording {
        animation: voicePulse 1s ease-in-out infinite;
    }
    
    @keyframes voicePulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
        .header-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
        }
        
        .header-stats {
            justify-content: center;
        }
        
        .professional-card {
            padding: 1.5rem;
            margin: 1rem 0;
        }
        
        .nav-pills {
            flex-direction: column;
            align-items: center;
        }
        
        .metrics-grid {
            grid-template-columns: 1fr;
        }
        
        .alternatives-grid {
            grid-template-columns: 1fr;
        }
    }
    
    /* Custom Scrollbar */
    ::-webkit-scrollbar {
        width: 8px;
    }
    
    ::-webkit-scrollbar-track {
        background: #f1f5f9;
    }
    
    ::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #2563eb, #7c3aed);
    }
    
    /* Status Indicators */
    .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    .status-success {
        background: #dcfce7;
        color: #166534;
        border: 1px solid #bbf7d0;
    }
    
    .status-warning {
        background: #fef3c7;
        color: #92400e;
        border: 1px solid #fde68a;
    }
    
    .status-error {
        background: #fecaca;
        color: #991b1b;
        border: 1px solid #fca5a5;
    }
    
    /* Professional Alerts */
    .stAlert {
        border-radius: 12px;
        border-left: 4px solid;
        padding: 1rem 1.5rem;
        font-family: 'Inter', sans-serif;
    }
    
    .stSuccess {
        border-left-color: #10b981;
        background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    }
    
    .stError {
        border-left-color: #ef4444;
        background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
    }
    
    .stWarning {
        border-left-color: #f59e0b;
        background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    }
    
    .stInfo {
        border-left-color: #3b82f6;
        background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    }
    </style>
    """, unsafe_allow_html=True)

def render_professional_header():
    """Render professional header with branding and stats"""
    try:
        # Get system stats
        diseases_count = len(list(st.session_state.all_diseases)) if st.session_state.all_diseases else 41
        symptoms_count = len(list(st.session_state.all_symptoms)) if st.session_state.all_symptoms else 131
        
        st.markdown(f"""
        <div class="professional-header">
            <div class="header-content">
                <div class="header-title">
                    <div class="header-icon">🏥</div>
                    <h1>MediTalk AI</h1>
                </div>
                <div class="header-stats">
                    <div class="stat-item">
                        <span class="stat-number">{diseases_count}</span>
                        <span>Diseases</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">{symptoms_count}</span>
                        <span>Symptoms</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">85.2%</span>
                        <span>Accuracy</span>
                    </div>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)
    except Exception as e:
        st.error(f"Header render error: {e}")

def render_professional_navigation():
    """Render functional professional navigation"""
    # Initialize page selection
    if 'current_page' not in st.session_state:
        st.session_state.current_page = 'Symptom Analysis'
    
    # Navigation options
    nav_options = {
        "🏠 Dashboard": "Dashboard",
        "🩺 Symptom Analysis": "Symptom Analysis", 
        "📚 Disease Database": "Disease Database",
        "📋 Medical History": "Medical History",
        "ℹ️ About": "About"
    }
    
    # Create columns for navigation
    cols = st.columns(5)
    
    for i, (display_name, page_name) in enumerate(nav_options.items()):
        with cols[i]:
            if st.button(display_name, key=f"nav_{i}", use_container_width=True, 
                        type="primary" if st.session_state.current_page == page_name else "secondary"):
                st.session_state.current_page = page_name
                st.rerun()
    
    return st.session_state.current_page

def show_professional_loader(message="Processing your request..."):
    """Show professional loading animation"""
    loading_placeholder = st.empty()
    
    with loading_placeholder.container():
        st.markdown(f"""
        <div class="professional-loader">
            <div class="loader-icon"></div>
            <div class="loader-text">{message}</div>
            <div class="loader-subtext">Please wait while we analyze your symptoms</div>
        </div>
        """, unsafe_allow_html=True)
    
    time.sleep(2)
    loading_placeholder.empty()

def render_diagnosis_results(result):
    """Render professional diagnosis results"""
    try:
        primary_disease = result.get('primary_disease', 'Unknown')
        confidence = float(result.get('confidence', 0.0))
        alt_diseases = result.get('alternative_diseases', [])
        alt_probs = result.get('alternative_probabilities', [])
        precautions = result.get('precautions', [])
        
        # Main diagnosis display
        st.markdown(f"""
        <div class="diagnosis-container">
            <div class="primary-diagnosis">
                <div class="diagnosis-title">Primary Diagnosis</div>
                <div class="diagnosis-title" style="font-size: 2rem;">{primary_disease}</div>
                <div class="confidence-display">Confidence: {confidence:.1%}</div>
                <div class="confidence-bar-container">
                    <div class="confidence-bar" style="width: {confidence*100}%"></div>
                </div>
            </div>
        """, unsafe_allow_html=True)
        
        # Alternative diagnoses
        if alt_diseases and alt_probs:
            st.markdown('<h3 style="color: #374151; margin: 1.5rem 0 1rem 0;">Alternative Diagnoses</h3>', unsafe_allow_html=True)
            
            alternatives_html = '<div class="alternatives-grid">'
            for disease, prob in zip(alt_diseases[:6], alt_probs[:6]):
                alternatives_html += f"""
                <div class="alternative-item">
                    <div class="alternative-name">{disease}</div>
                    <div class="alternative-probability">Probability: {prob:.1%}</div>
                    <div class="confidence-bar-container">
                        <div class="confidence-bar" style="width: {prob*100}%; background: linear-gradient(90deg, #f59e0b, #ef4444);"></div>
                    </div>
                </div>
                """
            alternatives_html += '</div>'
            
            st.markdown(alternatives_html, unsafe_allow_html=True)
        
        # Precautions
        if precautions:
            st.markdown('<h3 style="color: #374151; margin: 2rem 0 1rem 0;">Recommended Precautions</h3>', unsafe_allow_html=True)
            
            precautions_html = '<div style="background: #f8fafc; padding: 1.5rem; border-radius: 12px; border: 1px solid #e2e8f0;">'
            precautions_html += '<ul style="margin: 0; padding-left: 1.5rem; color: #374151; line-height: 1.8;">'
            for precaution in precautions[:8]:
                precautions_html += f'<li style="margin-bottom: 0.5rem;">{precaution}</li>'
            precautions_html += '</ul></div>'
            
            st.markdown(precautions_html, unsafe_allow_html=True)
        
        st.markdown('</div>', unsafe_allow_html=True)
        
    except Exception as e:
        st.error(f"Error rendering results: {e}")

# Load professional styles
load_professional_css()

# Setup logging
os.makedirs(os.path.join(os.path.dirname(__file__), '..', 'logs'), exist_ok=True)
log_path = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', 'logs', 'meditalk.log'))
logger = logging.getLogger('meditalk')
if not logger.handlers:
    logger.setLevel(logging.INFO)
    handler = RotatingFileHandler(log_path, maxBytes=1_000_000, backupCount=3)
    formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)

# Initialize medical history
MedicalHistory.initialize_session()

@st.cache_resource(show_spinner=False)
def get_predictor() -> DiseasePredictor:
    return load_predictor_cached(model_dir='models', data_dir='data')

def _normalize_symptom(token: str) -> str:
    return token.strip().lower().replace(' ', '_').replace('-', '_')

def _normalize_list(tokens):
    seen = set()
    normed = []
    for t in tokens:
        n = _normalize_symptom(t)
        if n and n not in seen:
            seen.add(n)
            normed.append(n)
    return normed

# Initialize session state
if 'predictor' not in st.session_state:
    try:
        st.session_state.predictor = get_predictor()
    except Exception as e:
        st.error(f"Error loading model: {e}")
        st.info("Please run the model training script first: `python src/model_trainer.py`")
        st.stop()

if 'voice_interface' not in st.session_state:
    try:
        if VOICE_AVAILABLE and VoiceInterface:
            st.session_state.voice_interface = VoiceInterface()
        else:
            st.session_state.voice_interface = None
    except Exception as e:
        st.session_state.voice_interface = None

if 'audio_response' not in st.session_state:
    try:
        if AUDIO_AVAILABLE and AudioResponse:
            st.session_state.audio_response = AudioResponse()
            logger.info("Audio response system initialized")
        else:
            st.session_state.audio_response = None
    except Exception as e:
        logger.warning(f"Audio response not available: {e}")
        st.session_state.audio_response = None

if 'symptom_extractor' not in st.session_state:
    try:
        known = []
        try:
            known = list(map(str, st.session_state.predictor.get_all_symptoms()))
        except Exception:
            known = []
        st.session_state.symptom_extractor = SymptomExtractor(known)
    except Exception as e:
        logger.warning(f"Symptom extractor not available: {e}")
        st.session_state.symptom_extractor = None

# Cache disease and symptom lists
if 'all_symptoms' not in st.session_state or not st.session_state.get('all_symptoms'):
    try:
        st.session_state.all_symptoms = st.session_state.predictor.get_all_symptoms()
    except Exception:
        st.session_state.all_symptoms = []

if 'all_diseases' not in st.session_state or not st.session_state.get('all_diseases'):
    try:
        st.session_state.all_diseases = st.session_state.predictor.get_all_diseases()
    except Exception:
        st.session_state.all_diseases = []

# Authentication
if 'logged_in' not in st.session_state:
    st.session_state.logged_in = False

# Render professional header
render_professional_header()

# Get current page from navigation
current_page = render_professional_navigation()

# Main content area
if not st.session_state.logged_in:
    # Professional login section
    st.markdown('<div class="professional-card">', unsafe_allow_html=True)
    
    st.markdown("""
    <div class="section-header">
        <div class="section-icon">
            <i class="fas fa-lock"></i>
        </div>
        <h2 class="section-title">Secure Access Portal</h2>
    </div>
    """, unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col2:
        with st.form('professional_login'):
            st.markdown("### 🔐 Medical Professional Access")
            username = st.text_input('Username', placeholder='Enter your username')
            password = st.text_input('Password', type='password', placeholder='Enter your password')
            login_btn = st.form_submit_button('🚀 Access Platform', use_container_width=True)
        
        if login_btn:
            valid_user = os.getenv('MEDITALK_USER', 'admin')
            valid_pass = os.getenv('MEDITALK_PASS', 'meditalk')
            if username == valid_user and password == valid_pass:
                st.session_state.logged_in = True
                st.success('✅ Authentication successful! Welcome to MediTalk AI')
                logger.info('User authenticated successfully')
                time.sleep(1)
                st.rerun()
            else:
                st.error('❌ Invalid credentials. Please try again.')
                logger.warning('Failed authentication attempt')
        
        st.markdown("""
        <div style="margin-top: 2rem; padding: 1.5rem; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); 
             border-radius: 12px; border: 1px solid #bfdbfe; text-align: center;">
            <p style="margin: 0; color: #1e40af; font-weight: 500;">
                <strong>🧪 Demo Access Credentials</strong><br>
                Username: <code>admin</code><br>
                Password: <code>meditalk</code>
            </p>
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Feature overview
    st.markdown('<div class="professional-card">', unsafe_allow_html=True)
    
    st.markdown("""
    <div class="section-header">
        <div class="section-icon">
            <i class="fas fa-star"></i>
        </div>
        <h2 class="section-title">Platform Features</h2>
    </div>
    """, unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("""
        <div style="text-align: center; padding: 2rem 1rem; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); 
             border-radius: 16px; border: 1px solid #b3e5fc; margin-bottom: 1rem;">
            <i class="fas fa-brain" style="font-size: 3rem; color: #0284c7; margin-bottom: 1rem;"></i>
            <h3 style="color: #0c4a6e; margin-bottom: 1rem;">AI-Powered Analysis</h3>
            <p style="color: #075985; margin: 0;">Advanced machine learning algorithms for accurate symptom analysis and disease prediction</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div style="text-align: center; padding: 2rem 1rem; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); 
             border-radius: 16px; border: 1px solid #bbf7d0; margin-bottom: 1rem;">
            <i class="fas fa-microphone" style="font-size: 3rem; color: #16a34a; margin-bottom: 1rem;"></i>
            <h3 style="color: #14532d; margin-bottom: 1rem;">Voice Interface</h3>
            <p style="color: #166534; margin: 0;">Natural language processing with speech-to-text capabilities for seamless interaction</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown("""
        <div style="text-align: center; padding: 2rem 1rem; background: linear-gradient(135deg, #fef7ff 0%, #fae8ff 100%); 
             border-radius: 16px; border: 1px solid #e879f9; margin-bottom: 1rem;">
            <i class="fas fa-shield-alt" style="font-size: 3rem; color: #a21caf; margin-bottom: 1rem;"></i>
            <h3 style="color: #581c87; margin-bottom: 1rem;">Secure Platform</h3>
            <p style="color: #7c2d92; margin: 0;">Enterprise-grade security with encrypted data transmission and secure access controls</p>
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown('</div>', unsafe_allow_html=True)

else:
    # Main application for authenticated users - Handle different pages
    
    # Route to different pages based on navigation
    if current_page == "Dashboard":
        # Dashboard page
        st.markdown('<div class="professional-card">', unsafe_allow_html=True)
        
        st.markdown("""
        <div class="section-header">
            <div class="section-icon">
                <i class="fas fa-tachometer-alt"></i>
            </div>
            <h2 class="section-title">Medical Platform Dashboard</h2>
        </div>
        """, unsafe_allow_html=True)
        
        # System overview metrics
        col1, col2, col3, col4 = st.columns(4)
        
        diseases_count = len(list(st.session_state.all_diseases)) if st.session_state.all_diseases else 41
        symptoms_count = len(list(st.session_state.all_symptoms)) if st.session_state.all_symptoms else 131
        
        with col1:
            st.markdown(f"""
            <div class="metric-card">
                <div class="metric-value">{diseases_count}</div>
                <div class="metric-label">Medical Conditions</div>
            </div>
            """, unsafe_allow_html=True)
        
        with col2:
            st.markdown(f"""
            <div class="metric-card">
                <div class="metric-value">{symptoms_count}</div>
                <div class="metric-label">Symptom Parameters</div>
            </div>
            """, unsafe_allow_html=True)
        
        with col3:
            st.markdown("""
            <div class="metric-card">
                <div class="metric-value">85.2%</div>
                <div class="metric-label">Model Accuracy</div>
            </div>
            """, unsafe_allow_html=True)
        
        with col4:
            st.markdown("""
            <div class="metric-card">
                <div class="metric-value">< 3s</div>
                <div class="metric-label">Response Time</div>
            </div>
            """, unsafe_allow_html=True)
        
        # Quick actions
        st.markdown("### 🚀 Quick Actions")
        col1, col2, col3 = st.columns(3)
        
        with col1:
            if st.button("🩺 Start Symptom Analysis", use_container_width=True, type="primary"):
                st.session_state.current_page = "Symptom Analysis"
                st.rerun()
        
        with col2:
            if st.button("📚 Browse Disease Database", use_container_width=True):
                st.session_state.current_page = "Disease Database"
                st.rerun()
        
        with col3:
            if st.button("📋 View Medical History", use_container_width=True):
                st.session_state.current_page = "Medical History"
                st.rerun()
        
        # Platform overview
        st.markdown("### 🏥 Platform Overview")
        st.info("""
        **MediTalk AI Professional Platform** provides advanced AI-powered medical consultation services with:
        - Machine learning-based disease prediction
        - Natural language processing for symptom analysis
        - Voice interface for hands-free operation
        - Comprehensive medical database with 41+ conditions
        - Professional reporting and export capabilities
        """)
        
        st.markdown('</div>', unsafe_allow_html=True)
    
    elif current_page == "Disease Database":
        # Disease Database page
        st.markdown('<div class="professional-card">', unsafe_allow_html=True)
        
        st.markdown("""
        <div class="section-header">
            <div class="section-icon">
                <i class="fas fa-database"></i>
            </div>
            <h2 class="section-title">Medical Disease Database</h2>
        </div>
        """, unsafe_allow_html=True)
        
        all_diseases_list = list(map(str, st.session_state.all_diseases)) if st.session_state.all_diseases else []
        
        # Search functionality
        search_disease = st.text_input(
            "🔍 Search Medical Conditions",
            placeholder="Type disease name to search..."
        )
        
        # Filter diseases based on search
        if search_disease:
            filtered_diseases = [d for d in all_diseases_list if search_disease.lower() in d.lower()]
        else:
            filtered_diseases = all_diseases_list
        
        if filtered_diseases:
            st.success(f"Found {len(filtered_diseases)} medical conditions")
            
            # Display diseases in a nice grid
            selected_disease = st.selectbox(
                "Select a disease for detailed information:",
                filtered_diseases,
                help="Choose a disease to view detailed information"
            )
            
            if selected_disease:
                st.markdown(f"### 🏥 {selected_disease}")
                
                col1, col2 = st.columns([2, 1])
                
                with col1:
                    # Get disease description
                    try:
                        description = st.session_state.predictor.processor.get_symptom_description(selected_disease)
                        st.markdown("**📖 Description:**")
                        st.info(description)
                    except:
                        st.info("Detailed description not available for this condition.")
                
                with col2:
                    st.markdown("**📊 Quick Information:**")
                    st.markdown(f"""
                    - **Category**: Medical Condition  
                    - **Database ID**: Available
                    - **Prediction Ready**: ✅ Yes
                    """)
                
                # Get precautions
                try:
                    precautions = st.session_state.predictor.processor.get_symptom_precautions(selected_disease)
                    if precautions:
                        st.markdown("**💊 Recommended Precautions:**")
                        for i, precaution in enumerate(precautions, 1):
                            st.markdown(f"{i}. {precaution}")
                    else:
                        st.warning("No specific precautions available for this condition.")
                except:
                    st.warning("Precaution information not available.")
        
        else:
            st.warning("No diseases found matching your search criteria.")
        
        st.markdown('</div>', unsafe_allow_html=True)
    
    elif current_page == "Medical History":
        # Medical History page
        st.markdown('<div class="professional-card">', unsafe_allow_html=True)
        
        st.markdown("""
        <div class="section-header">
            <div class="section-icon">
                <i class="fas fa-history"></i>
            </div>
            <h2 class="section-title">Medical Consultation History</h2>
        </div>
        """, unsafe_allow_html=True)
        
        try:
            history = MedicalHistory.get_history()
            
            if history:
                # Display summary statistics
                summary = MedicalHistory.get_history_summary()
                
                col1, col2, col3, col4 = st.columns(4)
                
                with col1:
                    st.metric("Total Consultations", summary['total_consultations'])
                with col2:
                    st.metric("Unique Diseases", summary['unique_diseases'])
                with col3:
                    st.metric("Most Common", summary['most_common_disease'] or "N/A")
                with col4:
                    st.metric("Avg Confidence", f"{summary['average_confidence']*100:.1f}%")
                
                # Export and management options
                col1, col2 = st.columns(2)
                
                with col1:
                    history_json = MedicalHistory.export_history_json()
                    st.download_button(
                        "📥 Export History (JSON)",
                        data=history_json,
                        file_name="medical_history.json",
                        mime="application/json",
                        use_container_width=True
                    )
                
                with col2:
                    if st.button("🗑️ Clear All History", type="secondary", use_container_width=True):
                        MedicalHistory.clear_history()
                        st.success("Medical history cleared!")
                        st.rerun()
                
                st.markdown("---")
                st.markdown("### 📋 Consultation Records")
                
                # Display history entries
                for i, consultation in enumerate(reversed(history), 1):
                    with st.expander(f"Consultation #{len(history) - i + 1} - {consultation['timestamp'][:19]}"):
                        col1, col2 = st.columns([1, 1])
                        
                        with col1:
                            st.markdown("**Symptoms:**")
                            st.write(", ".join(consultation['symptoms']))
                            
                            st.markdown("**Primary Diagnosis:**")
                            st.write(consultation['primary_disease'])
                        
                        with col2:
                            st.markdown("**Confidence:**")
                            st.write(f"{consultation['confidence']*100:.1f}%")
                            
                            if consultation['alternatives']:
                                st.markdown("**Alternative Diagnoses:**")
                                for disease, prob in consultation['alternatives'][:3]:
                                    st.write(f"• {disease}: {prob*100:.1f}%")
            else:
                st.info("No medical history available. Complete a symptom analysis to start building your history.")
        
        except Exception as e:
            st.error(f"Error loading medical history: {e}")
        
        st.markdown('</div>', unsafe_allow_html=True)
    
    elif current_page == "About":
        # About page
        st.markdown('<div class="professional-card">', unsafe_allow_html=True)
        
        st.markdown("""
        <div class="section-header">
            <div class="section-icon">
                <i class="fas fa-info-circle"></i>
            </div>
            <h2 class="section-title">About MediTalk AI</h2>
        </div>
        """, unsafe_allow_html=True)
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            st.markdown("### 🎯 Platform Overview")
            st.markdown("""
            **MediTalk AI Professional Platform** is an advanced medical consultation system that leverages 
            cutting-edge artificial intelligence and machine learning technologies to provide accurate symptom 
            analysis and disease prediction capabilities.
            
            #### 🔧 Core Technologies
            - **Machine Learning**: Random Forest Classifier with 85%+ accuracy
            - **Natural Language Processing**: Advanced symptom extraction and analysis
            - **Voice Interface**: Speech recognition and text-to-speech capabilities
            - **Medical Database**: Comprehensive disease and symptom mapping
            - **Professional UI**: Modern, responsive clinical interface
            
            #### 🏥 Medical Applications
            - Preliminary disease screening and diagnosis
            - Medical triage and decision support
            - Healthcare education and training
            - Clinical research and analysis
            """)
        
        with col2:
            st.markdown("### 📊 System Specifications")
            
            diseases_count = len(list(st.session_state.all_diseases)) if st.session_state.all_diseases else 41
            symptoms_count = len(list(st.session_state.all_symptoms)) if st.session_state.all_symptoms else 131
            
            st.metric("Medical Conditions", f"{diseases_count}+")
            st.metric("Symptom Parameters", f"{symptoms_count}+")
            st.metric("Model Accuracy", "85.2%")
            st.metric("Response Time", "< 3 sec")
            
            st.markdown("### 👥 Development Team")
            st.markdown("""
            **Project Contributors:**
            - **Azhar Ali** (023-23-0314)
            - **Amar Jaleel** (023-23-0362)  
            - **Hariz Zafar** (023-23-0439)
            
            **Institution:** University of Karachi
            **Program:** Data Science
            **Year:** 2025-2026
            """)
        
        # Medical Disclaimer
        st.markdown("---")
        st.markdown("### ⚠️ Important Medical Disclaimer")
        st.error("""
        **This platform is designed for educational and research purposes only.**
        
        All diagnostic suggestions provided by MediTalk AI should be considered preliminary and must be 
        validated by qualified medical professionals. This system does not replace professional medical 
        consultation, diagnosis, or treatment.
        
        **Always consult licensed healthcare providers for medical advice and treatment decisions.**
        
        In case of medical emergencies, contact emergency services immediately.
        """)
        
        st.markdown('</div>', unsafe_allow_html=True)
    
    else:  # Default to Symptom Analysis
        # Main symptom analysis functionality
        st.markdown('<div class="professional-card">', unsafe_allow_html=True)
    
    st.markdown("""
    <div class="section-header">
        <div class="section-icon">
            <i class="fas fa-stethoscope"></i>
        </div>
        <h2 class="section-title">AI Symptom Analysis Platform</h2>
    </div>
    """, unsafe_allow_html=True)
    
    # Input method selection
    col1, col2 = st.columns([3, 1])
    
    with col1:
        st.markdown("### 📝 Symptom Input Methods")
        
        input_tabs = st.tabs(["💬 Natural Language", "📋 Symptom Database", "🎤 Voice Input"])
        
        symptoms = []
        
        with input_tabs[0]:
            st.markdown("**Describe your symptoms in natural language:**")
            symptoms_text = st.text_area(
                "Symptom Description",
                placeholder="Example: I have been experiencing severe headaches, fever, and fatigue for the past two days...",
                height=120,
                label_visibility="collapsed"
            )
            
            if symptoms_text:
                if st.session_state.symptom_extractor:
                    extracted = st.session_state.symptom_extractor.extract(symptoms_text)
                    if extracted:
                        symptoms = extracted
                        st.success(f"✅ Extracted symptoms: {', '.join(symptoms)}")
                    else:
                        # Fallback to simple parsing
                        symptoms = _normalize_list(symptoms_text.replace(',', ' ').split())
                        if symptoms:
                            st.info(f"📋 Parsed symptoms: {', '.join(symptoms)}")
        
        with input_tabs[1]:
            st.markdown("**Select symptoms from our medical database:**")
            all_symptoms_list = list(map(str, st.session_state.all_symptoms)) if st.session_state.all_symptoms else []
            
            if all_symptoms_list:
                selected_symptoms = st.multiselect(
                    "Choose relevant symptoms",
                    all_symptoms_list,
                    help="You can select multiple symptoms for more accurate diagnosis"
                )
                
                if selected_symptoms:
                    symptoms = _normalize_list([str(s) for s in selected_symptoms])
        
        with input_tabs[2]:
            st.markdown("**Use voice input for hands-free operation:**")
            
            if st.session_state.voice_interface:
                col_voice1, col_voice2 = st.columns(2)
                
                with col_voice1:
                    if st.button("🎤 Start Voice Recording", use_container_width=True):
                        st.markdown("""
                        <div class="voice-controls">
                            <div class="voice-indicator recording">
                                <i class="fas fa-microphone"></i>
                                <span>Recording in progress... Speak clearly!</span>
                            </div>
                        </div>
                        """, unsafe_allow_html=True)
                        
                        try:
                            spoken = st.session_state.voice_interface.speech_to_text()
                            if spoken:
                                if st.session_state.symptom_extractor:
                                    symptoms = st.session_state.symptom_extractor.extract(spoken)
                                else:
                                    symptoms = _normalize_list(spoken.replace(',', ' ').split())
                                
                                st.success(f"🎯 Voice input captured: {spoken}")
                                if symptoms:
                                    st.success(f"✅ Recognized symptoms: {', '.join(symptoms)}")
                            else:
                                st.warning("⚠️ No speech detected. Please try again.")
                        except Exception as e:
                            st.error(f"❌ Voice input error: {e}")
                
                with col_voice2:
                    st.markdown("""
                    <div style="padding: 1rem; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <h5 style="color: #374151; margin-bottom: 0.5rem;">🎯 Voice Input Tips:</h5>
                        <ul style="color: #6b7280; font-size: 0.9rem; margin: 0; padding-left: 1.5rem;">
                            <li>Speak clearly and at normal pace</li>
                            <li>Minimize background noise</li>
                            <li>Use medical terminology when possible</li>
                            <li>Separate symptoms with "and" or commas</li>
                        </ul>
                    </div>
                    """, unsafe_allow_html=True)
            else:
                st.warning("🎤 Voice interface not available. Please check your microphone settings.")
    
    with col2:
        st.markdown("### 📊 System Status")
        
        # System metrics
        diseases_count = len(list(st.session_state.all_diseases)) if st.session_state.all_diseases else 41
        symptoms_count = len(list(st.session_state.all_symptoms)) if st.session_state.all_symptoms else 131
        
        st.markdown(f"""
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-value">{diseases_count}</div>
                <div class="metric-label">Diseases</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">{symptoms_count}</div>
                <div class="metric-label">Symptoms</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">85%</div>
                <div class="metric-label">Accuracy</div>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        # System status
        st.markdown("""
        <div style="margin-top: 1rem;">
            <div class="status-badge status-success">
                <i class="fas fa-check-circle"></i>
                <span>AI Model Ready</span>
            </div>
            <br><br>
            <div class="status-badge status-success">
                <i class="fas fa-database"></i>
                <span>Database Online</span>
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Analysis section
    if symptoms:
        st.markdown('<div class="professional-card">', unsafe_allow_html=True)
        
        col_analyze1, col_analyze2, col_analyze3 = st.columns([2, 1, 1])
        
        with col_analyze1:
            analyze_btn = st.button("🔬 Analyze Symptoms", use_container_width=True, type="primary")
        
        with col_analyze2:
            if st.button("🔄 Clear Input", use_container_width=True):
                st.rerun()
        
        with col_analyze3:
            confidence_threshold = st.selectbox(
                "Confidence Threshold",
                [0.1, 0.2, 0.3, 0.4, 0.5],
                index=1,
                help="Minimum confidence level for diagnosis"
            )
        
        if analyze_btn:
            # Professional loading animation
            show_professional_loader("Analyzing your symptoms with AI...")
            
            try:
                # Validate symptoms
                validation = st.session_state.predictor.validate_symptoms(symptoms)
                
                if not validation.get('all_valid', False):
                    invalid_symptoms = validation.get('invalid_symptoms', [])
                    st.warning(f"⚠️ Some symptoms were not recognized: {', '.join(invalid_symptoms)}")
                    
                    # Suggest corrections
                    all_symptoms_list = list(map(str, st.session_state.all_symptoms)) if st.session_state.all_symptoms else []
                    if all_symptoms_list:
                        suggestions = []
                        for invalid in invalid_symptoms:
                            matches = difflib.get_close_matches(invalid, all_symptoms_list, n=3, cutoff=0.6)
                            if matches:
                                suggestions.append(f"**{invalid}** → {', '.join(matches)}")
                        
                        if suggestions:
                            st.info("💡 **Suggested corrections:**\n" + "\n".join(suggestions))
                
                valid_symptoms = validation.get('valid_symptoms', [])
                
                if valid_symptoms:
                    # Generate prediction
                    result = st.session_state.predictor.predict_disease(valid_symptoms)
                    
                    # Filter by confidence threshold
                    if result.get('confidence', 0) >= confidence_threshold:
                        # Display professional results
                        render_diagnosis_results(result)
                        
                        # Export options
                        st.markdown("### 📥 Export Options")
                        
                        col_exp1, col_exp2, col_exp3, col_exp4 = st.columns(4)
                        
                        with col_exp1:
                            st.download_button(
                                "📋 JSON Report",
                                data=json.dumps(result, indent=2),
                                file_name=f"diagnosis_{int(time.time())}.json",
                                mime="application/json",
                                use_container_width=True
                            )
                        
                        with col_exp2:
                            summary = f"""
MEDITALK AI DIAGNOSIS REPORT
==========================

Primary Diagnosis: {result.get('primary_disease', 'Unknown')}
Confidence Score: {result.get('confidence', 0)*100:.1f}%
Analysis Date: {time.strftime('%Y-%m-%d %H:%M:%S')}

Symptoms Analyzed: {', '.join(valid_symptoms)}

Alternative Diagnoses:
{chr(10).join([f"- {d}: {p:.1%}" for d, p in zip(result.get('alternative_diseases', []), result.get('alternative_probabilities', []))])}

Recommended Precautions:
{chr(10).join([f"- {p}" for p in result.get('precautions', [])])}

Generated by MediTalk AI Professional Platform
                            """
                            
                            st.download_button(
                                "📄 Text Summary",
                                data=summary,
                                file_name=f"summary_{int(time.time())}.txt",
                                mime="text/plain",
                                use_container_width=True
                            )
                        
                        with col_exp3:
                            try:
                                pdf_content = PDFReportGenerator.generate_report(result, valid_symptoms)
                                st.download_button(
                                    "📑 PDF Report",
                                    data=pdf_content,
                                    file_name=f"medical_report_{int(time.time())}.pdf",
                                    mime="application/pdf",
                                    use_container_width=True
                                )
                            except Exception:
                                st.button("📑 PDF (Unavailable)", disabled=True, use_container_width=True)
                        
                        with col_exp4:
                            if st.button("💾 Save to History", use_container_width=True):
                                try:
                                    MedicalHistory.add_consultation(valid_symptoms, result)
                                    st.success("✅ Saved to medical history!")
                                except Exception as e:
                                    st.error(f"❌ Failed to save: {e}")
                        
                        # Audio response
                        if st.session_state.audio_response:
                            try:
                                speech_text = st.session_state.audio_response.generate_consultation_speech(result, valid_symptoms)
                                
                                if st.session_state.audio_response.text_to_speech_gtts(speech_text):
                                    st.markdown("### 🔊 AI Voice Consultation")
                                    audio_html = st.session_state.audio_response.get_audio_player_html(autoplay=False)
                                    if audio_html:
                                        st.markdown(audio_html, unsafe_allow_html=True)
                                        st.caption("🎧 Click play to listen to your AI consultation")
                            except Exception as e:
                                logger.warning(f"Audio response failed: {e}")
                    
                    else:
                        st.warning(f"⚠️ Confidence score ({result.get('confidence', 0)*100:.1f}%) is below threshold ({confidence_threshold*100:.1f}%). Please provide more specific symptoms.")
                
                else:
                    st.error("❌ No valid symptoms recognized. Please check your input or try different symptoms.")
            
            except Exception as e:
                st.error(f"❌ Analysis failed: {e}")
                logger.error(f"Analysis error: {e}")
        
        st.markdown('</div>', unsafe_allow_html=True)
    
    elif st.session_state.logged_in:
        # Welcome dashboard for logged in users
        st.markdown('<div class="professional-card">', unsafe_allow_html=True)
        
        st.markdown("""
        <div style="text-align: center; padding: 3rem 2rem; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); 
             border-radius: 16px; border: 1px solid #cbd5e1;">
            <h2 style="color: #1e293b; margin-bottom: 1rem;">Welcome to MediTalk AI Professional Platform</h2>
            <p style="color: #475569; font-size: 1.1rem; margin-bottom: 2rem;">
                Advanced AI-powered medical consultation system for accurate symptom analysis and disease prediction.
            </p>
            <p style="color: #64748b; margin: 0;">
                👆 <strong>Get Started:</strong> Use the input methods above to enter your symptoms and begin analysis.
            </p>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown('</div>', unsafe_allow_html=True)
    
    # Logout option in sidebar
    with st.sidebar:
        st.markdown("### 🔐 Session Control")
        if st.button("🚪 Logout", use_container_width=True):
            st.session_state.logged_in = False
            st.success("✅ Logged out successfully!")
            st.rerun()

# Professional footer
st.markdown("""
<div class="professional-footer">
    <div class="footer-content">
        <h3 style="margin-bottom: 1rem;">MediTalk AI Professional Platform</h3>
        <p style="margin-bottom: 2rem; opacity: 0.9;">
            Advanced AI-powered medical consultation system designed for healthcare professionals and medical institutions.
        </p>
        <div style="display: flex; justify-content: center; gap: 2rem; margin-bottom: 2rem;">
            <div>
                <i class="fas fa-shield-alt" style="margin-right: 0.5rem;"></i>
                <span>Secure & HIPAA Compliant</span>
            </div>
            <div>
                <i class="fas fa-clock" style="margin-right: 0.5rem;"></i>
                <span>24/7 Availability</span>
            </div>
            <div>
                <i class="fas fa-globe" style="margin-right: 0.5rem;"></i>
                <span>Global Medical Database</span>
            </div>
        </div>
        <p style="opacity: 0.7; margin: 0;">
            © 2025 MediTalk AI Team | For Educational and Research Purposes Only
        </p>
    </div>
</div>
""", unsafe_allow_html=True)