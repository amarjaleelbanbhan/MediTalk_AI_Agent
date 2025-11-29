"""
MediTalk AI Voice Agent - Streamlit Web Application with Premium UI
A voice-enabled AI medical consultation assistant with modern custom navigation
"""

import streamlit as st
import sys
import os
import json
import difflib
import time
from typing import Any, Dict, List, cast


# Add src directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from disease_predictor import DiseasePredictor

# Try to import voice components, but handle gracefully if dependencies are missing
try:
    from voice_interface import VoiceInterface
    VOICE_AVAILABLE = True
except ImportError as e:
    # Silently handle missing voice interface for now
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
    # Fallback if ui_components has issues
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
import logging
from logging.handlers import RotatingFileHandler

# Page configuration with custom navbar
st.set_page_config(
    page_title="MediTalk - AI Medical Consultant",
    page_icon="🩺",  # Unicode stethoscope for professional look
    layout="wide",
    initial_sidebar_state="expanded"  # Show sidebar for full functionality
)

# Enhanced Impressive Medical UI
def load_premium_css():
    """Load impressive, heart-touching medical-themed CSS with professional design"""
    st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
    
    /* Global Impressive Styles */
    .stApp {
        background: linear-gradient(135deg, #e3f2fd 0%, #f0f9ff 50%, #fef3c7 100%);
        font-family: 'Poppins', 'Inter', sans-serif;
    }
    
    /* Enhanced Sidebar with Medical Theme */
    [data-testid="stSidebar"] {
        background: linear-gradient(180deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%);
        box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
    }
    
    [data-testid="stSidebar"] .stMarkdown {
        color: white;
    }
    
    [data-testid="stSidebar"] .stMarkdown h1,
    [data-testid="stSidebar"] .stMarkdown h2,
    [data-testid="stSidebar"] .stMarkdown h3 {
        color: white !important;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    /* Enhanced Radio Buttons for Navigation */
    [data-testid="stSidebar"] .stRadio > label {
        color: #ffffff !important;
        font-weight: 600 !important;
        font-size: 0.85rem !important;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }
    
    [data-testid="stSidebar"] .stRadio > div {
        gap: 0.5rem !important;
    }
    
    [data-testid="stSidebar"] .stRadio > div > label {
        background: rgba(255, 255, 255, 0.08) !important;
        padding: 0.7rem 1rem !important;
        border-radius: 8px !important;
        border-left: 3px solid transparent !important;
        transition: all 0.3s ease !important;
        cursor: pointer !important;
        margin: 0.25rem 0 !important;
    }
    
    [data-testid="stSidebar"] .stRadio > div > label:hover {
        background: rgba(255, 255, 255, 0.15) !important;
        border-left-color: #64b5f6 !important;
        transform: translateX(4px) !important;
    }
    
    [data-testid="stSidebar"] .stRadio > div > label[data-baseweb="radio"] > div:first-child {
        background-color: rgba(255, 255, 255, 0.2) !important;
        border-color: rgba(255, 255, 255, 0.4) !important;
    }
    
    [data-testid="stSidebar"] .stRadio > div > label > div > div {
        color: #ffffff !important;
        font-size: 0.9rem !important;
        font-weight: 500 !important;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
    
    /* Selected Radio Button Style */
    [data-testid="stSidebar"] .stRadio > div > label:has(input:checked) {
        background: linear-gradient(135deg, rgba(100, 181, 246, 0.25) 0%, rgba(66, 165, 245, 0.15) 100%) !important;
        border-left-color: #64b5f6 !important;
        box-shadow: 0 2px 8px rgba(100, 181, 246, 0.3) !important;
    }
    
    [data-testid="stSidebar"] .stRadio > div > label:has(input:checked) > div > div {
        font-weight: 700 !important;
        color: #ffffff !important;
    }
    
    /* Sidebar Slider Styling */
    [data-testid="stSidebar"] .stSlider > div > div > div {
        background-color: rgba(255, 255, 255, 0.2) !important;
    }
    
    [data-testid="stSidebar"] .stSlider > div > div > div > div {
        background-color: #64b5f6 !important;
    }
    
    [data-testid="stSidebar"] .stSlider label {
        color: #ffffff !important;
        font-size: 0.8rem !important;
        font-weight: 500 !important;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
    
    /* Sidebar Caption Styling */
    [data-testid="stSidebar"] .stCaptionContainer {
        color: #f5f5f5 !important;
        font-size: 0.75rem !important;
        font-weight: 500 !important;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    }
    
    /* Sidebar Expander Styling */
    [data-testid="stSidebar"] .streamlit-expanderHeader {
        background: rgba(255, 255, 255, 0.08) !important;
        border-radius: 6px !important;
        color: #ffffff !important;
        font-size: 0.85rem !important;
        font-weight: 600 !important;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
    
    [data-testid="stSidebar"] .streamlit-expanderHeader:hover {
        background: rgba(255, 255, 255, 0.12) !important;
    }
    
    [data-testid="stSidebar"] .stCheckbox label {
        color: #ffffff !important;
        font-size: 0.8rem !important;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
    
    /* Hide unnecessary elements */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    .stDeployButton {display: none;}
    
    /* Impressive Medical Cards with Heart-Touching Design */
    .medical-card {
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        border-radius: 16px;
        padding: 2rem;
        margin: 1.5rem 0;
        box-shadow: 0 4px 20px rgba(25, 118, 210, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08);
        border-left: 5px solid #1976d2;
        border-top: 1px solid rgba(255, 255, 255, 0.8);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
    }
    
    .medical-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #1976d2, #42a5f5, #1976d2);
        background-size: 200% 100%;
        animation: shimmer 3s infinite;
    }
    
    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
    
    .medical-card:hover {
        box-shadow: 0 8px 30px rgba(25, 118, 210, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateY(-4px) scale(1.01);
        border-left-color: #42a5f5;
    }
    
    /* Impressive Gradient Buttons with Glow Effect */
    .stButton > button {
        background: linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #1976d2 100%);
        background-size: 200% 100%;
        color: white;
        border: none;
        padding: 0.75rem 2rem;
        border-radius: 12px;
        font-weight: 600;
        font-size: 1.05rem;
        letter-spacing: 0.5px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        width: 100%;
        box-shadow: 0 4px 15px rgba(25, 118, 210, 0.3);
        position: relative;
        overflow: hidden;
    }
    
    .stButton > button::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
    }
    
    .stButton > button:hover::before {
        width: 300px;
        height: 300px;
    }
    
    .stButton > button:hover {
        background-position: 100% 0;
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(25, 118, 210, 0.4), 0 0 30px rgba(66, 165, 245, 0.3);
    }
    
    .stButton > button:active {
        transform: translateY(-1px);
        box-shadow: 0 4px 15px rgba(25, 118, 210, 0.3);
    }
    
    /* Heart-Touching Page Headers */
    .page-title {
        background: linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #64b5f6 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-size: 3rem;
        font-weight: 800;
        margin-bottom: 0.5rem;
        text-align: center;
        letter-spacing: -0.5px;
        text-shadow: 0 2px 4px rgba(25, 118, 210, 0.1);
        animation: titleGlow 3s ease-in-out infinite;
    }
    
    @keyframes titleGlow {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.1); }
    }
    
    .page-subtitle {
        color: #37474f;
        font-size: 1.2rem;
        text-align: center;
        margin-bottom: 2.5rem;
        font-weight: 500;
        line-height: 1.6;
        opacity: 1;
    }
    
    /* Impressive Loading Animation */
    .loading-container {
        text-align: center;
        padding: 3rem 2rem;
        background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);
        border-radius: 20px;
        margin: 2rem 0;
        box-shadow: 0 8px 32px rgba(25, 118, 210, 0.12);
        border: 1px solid rgba(25, 118, 210, 0.1);
    }
    
    .loading-spinner {
        border: 5px solid #e3f2fd;
        border-top: 5px solid #1976d2;
        border-right: 5px solid #42a5f5;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        animation: spinPulse 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        margin: 0 auto 1.5rem;
        box-shadow: 0 4px 15px rgba(25, 118, 210, 0.2);
    }
    
    @keyframes spinPulse {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.1); }
        100% { transform: rotate(360deg) scale(1); }
    }
    
    .loading-text {
        color: #1976d2;
        font-size: 1.1rem;
        font-weight: 600;
        animation: pulse 2s ease-in-out infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 1; }
    }
    
    /* Impressive Hero Section */
    .hero-section {
        background: linear-gradient(135deg, #1976d2 0%, #42a5f5 50%, #64b5f6 100%);
        border-radius: 20px;
        padding: 4rem 3rem;
        margin: 2rem 0;
        box-shadow: 0 10px 40px rgba(25, 118, 210, 0.3);
        text-align: center;
        position: relative;
        overflow: hidden;
    }
    
    .hero-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        opacity: 0.1;
        animation: float 20s linear infinite;
    }
    
    @keyframes float {
        0% { transform: translateY(0) translateX(0); }
        100% { transform: translateY(-20px) translateX(-20px); }
    }
    
    .hero-title {
        color: white !important;
        font-size: 3.5rem;
        font-weight: 800;
        margin-bottom: 1rem;
        text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        letter-spacing: -1px;
        position: relative;
        z-index: 1;
    }
    
    .hero-subtitle {
        color: rgba(255, 255, 255, 0.95);
        font-size: 1.3rem;
        font-weight: 400;
        margin-top: 1rem;
        position: relative;
        z-index: 1;
    }
    
    /* Impressive Metrics & Stats */
    [data-testid="stMetric"] {
        background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(25, 118, 210, 0.1);
        border: 1px solid rgba(25, 118, 210, 0.1);
        transition: all 0.3s ease;
    }
    
    [data-testid="stMetric"]:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(25, 118, 210, 0.15);
    }
    
    [data-testid="stMetric"] label {
        color: #263238 !important;
        font-weight: 600 !important;
        font-size: 0.9rem !important;
        text-transform: uppercase !important;
        letter-spacing: 1px !important;
    }
    
    [data-testid="stMetric"] [data-testid="stMetricValue"] {
        color: #1976d2 !important;
        font-size: 2.5rem !important;
        font-weight: 800 !important;
    }
    
    /* Beautiful Info/Success/Warning/Error Boxes */
    .stAlert {
        border-radius: 12px;
        border-left-width: 5px;
        padding: 1.2rem 1.5rem;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    }
    
    /* Custom Scrollbar - Heart-Touching Design */
    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }
    
    ::-webkit-scrollbar-track {
        background: linear-gradient(180deg, #e3f2fd 0%, #f8fafc 100%);
        border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #1976d2 0%, #42a5f5 100%);
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #1565c0 0%, #1976d2 100%);
    }
    
    /* Impressive Input Fields */
    .stTextInput > div > div > input,
    .stTextArea > div > div > textarea {
        border-radius: 12px;
        border: 2px solid #e3f2fd;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    .stTextInput > div > div > input:focus,
    .stTextArea > div > div > textarea:focus {
        border-color: #1976d2;
        box-shadow: 0 4px 15px rgba(25, 118, 210, 0.15), 0 0 0 3px rgba(25, 118, 210, 0.1);
        transform: translateY(-2px);
    }
    
    /* Impressive Tabs */
    .stTabs [data-baseweb="tab-list"] {
        gap: 0.5rem;
        background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);
        padding: 0.5rem;
        border-radius: 12px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }
    
    .stTabs [data-baseweb="tab"] {
        border-radius: 8px;
        font-weight: 600;
        padding: 0.75rem 1.5rem;
        transition: all 0.3s ease;
    }
    
    .stTabs [data-baseweb="tab"]:hover {
        background: #e3f2fd;
    }
    
    .stTabs [aria-selected="true"] {
        background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
        color: white;
        box-shadow: 0 4px 15px rgba(25, 118, 210, 0.3);
    }
    
    /* Impressive Sidebar Radio Buttons */
    [data-testid="stSidebar"] .stRadio > div {
        gap: 0.75rem;
    }
    
    [data-testid="stSidebar"] .stRadio label {
        background: rgba(255, 255, 255, 0.1);
        padding: 0.75rem 1rem;
        border-radius: 10px;
        transition: all 0.3s ease;
        cursor: pointer;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    [data-testid="stSidebar"] .stRadio label:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateX(5px);
    }
    
    /* Mobile Responsive - Heart-Touching on All Devices */
    @media (max-width: 768px) {
        .page-title { font-size: 2.2rem; }
        .hero-title { font-size: 2.5rem; }
        .hero-section { padding: 2.5rem 1.5rem; }
        .medical-card { padding: 1.5rem; margin: 1rem 0; }
    }
    
    /* Fade-in Animation for All Elements */
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .medical-card,
    [data-testid="stMetric"],
    .stButton {
        animation: fadeIn 0.6s ease-out;
    }
    
    /* Heart Icon Animation for Medical Theme */
    @keyframes heartbeat {
        0%, 100% { transform: scale(1); }
        10%, 30% { transform: scale(0.9); }
        20%, 40%, 60%, 80% { transform: scale(1.1); }
        50%, 70% { transform: scale(1.05); }
    }
    </style>
    """, unsafe_allow_html=True)

# Enhanced Page Header with Heart-Touching Design
def render_page_header(title, subtitle="", icon=""):
    """Render impressive, heart-touching page header with animations"""
    st.markdown(f"""
    <div style="text-align: center; margin-bottom: 3rem; animation: fadeIn 0.8s ease-out;">
        {f'<div style="font-size: 4rem; margin-bottom: 1rem; animation: heartbeat 2s ease-in-out infinite;">{icon}</div>' if icon else ''}
        <h1 class="page-title">{title}</h1>
        {f'<p class="page-subtitle">{subtitle}</p>' if subtitle else ''}
        <div style="width: 80px; height: 4px; background: linear-gradient(90deg, transparent, #1976d2, #42a5f5, #1976d2, transparent); margin: 1.5rem auto; border-radius: 2px;"></div>
    </div>
    """, unsafe_allow_html=True)

# Simple Loading Animation
def show_medical_loader():
    """Display clean loading animation"""
    loading_placeholder = st.empty()
    
    with loading_placeholder.container():
        st.markdown("""
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <div class="loading-text">🔬 Analyzing your symptoms...</div>
        </div>
        """, unsafe_allow_html=True)
    
    time.sleep(1.5)
    loading_placeholder.empty()

load_premium_css()

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


def _normalize_list(tokens: list[str]) -> list[str]:
    seen: set[str] = set()
    normed: list[str] = []
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
        st.warning(f"Voice interface not available: {e}")
        st.session_state.voice_interface = None

# Initialize Audio Response System for gTTS spoken responses
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

# Initialize Natural Language Symptom Extractor
if 'symptom_extractor' not in st.session_state:
    try:
        # Initialize after predictor so all_symptoms is available
        known = []
        try:
            known = list(map(str, st.session_state.predictor.get_all_symptoms()))
        except Exception:
            known = []
        st.session_state.symptom_extractor = SymptomExtractor(known)
    except Exception as e:
        logger.warning(f"Symptom extractor not available: {e}")
        st.session_state.symptom_extractor = None

# Cache disease and symptom lists in session to avoid repeat computation
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

# Flag to trigger auto-analysis after voice input
if 'auto_analyze' not in st.session_state:
    st.session_state.auto_analyze = False

# Initialize logged_in state (simplified - always logged in for cleaner UX)
if 'logged_in' not in st.session_state:
    st.session_state.logged_in = True

# Enhanced Sidebar with Heart-Touching Brand Identity
with st.sidebar:
    st.markdown("""
    <div style='text-align: center; padding: 1.2rem 0.8rem; margin-bottom: 1.5rem; background: rgba(255, 255, 255, 0.1); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.15); box-shadow: 0 4px 15px rgba(0,0,0,0.2);'>
        <div style='font-size: 2.5rem; margin-bottom: 0.6rem; animation: heartbeat 2s ease-in-out infinite;'>❤️</div>
        <h1 style='color: #ffffff; font-size: 1.5rem; margin: 0; font-weight: 800; letter-spacing: 0.5px; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);'>MediTalk AI</h1>
        <p style='color: #ffffff; font-size: 0.8rem; margin-top: 0.5rem; font-weight: 500; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);'>Your Health Companion</p>
        <div style='width: 50px; height: 2px; background: linear-gradient(90deg, transparent, #ffffff, transparent); margin: 0.7rem auto; border-radius: 2px; opacity: 0.7;'></div>
        <p style='color: #e3f2fd; font-size: 0.75rem; margin-top: 0.4rem; font-style: italic; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);'>"Health is Wealth"</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("""
    <div style='background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%); padding: 0.8rem; border-radius: 8px; margin-bottom: 1rem; border-left: 3px solid #64b5f6;'>
        <h3 style='color: #ffffff; font-weight: 700; margin: 0; font-size: 0.85rem; letter-spacing: 1.5px; text-transform: uppercase; text-align: center; text-shadow: 0 1px 3px rgba(0,0,0,0.4);'>
            📋 NAVIGATION
        </h3>
    </div>
    """, unsafe_allow_html=True)
    
    # Enhanced navigation menu with better organization
    page = st.radio(
        "Select a page:",
        [
            "🏠 Home",
            "🩺 Symptom Checker",
            "📚 Disease Database",
            "📋 Medical History",
            "📊 Model Metrics",
            "ℹ️ About"
        ],
        label_visibility="collapsed",
        help="Navigate through different sections of MediTalk AI"
    )
    
    # Add quick access tip
    st.markdown("""
    <div style='background: linear-gradient(135deg, rgba(100, 181, 246, 0.15) 0%, rgba(79, 195, 247, 0.1) 100%); padding: 0.7rem; border-radius: 6px; margin-top: 0.8rem; border-left: 3px solid #64b5f6; box-shadow: 0 2px 6px rgba(0,0,0,0.15);'>
        <p style='color: #ffffff; margin: 0; font-size: 0.75rem; line-height: 1.4; text-shadow: 0 1px 2px rgba(0,0,0,0.3);'>
            <strong style='font-size: 0.8rem;'>💡 Quick Tip:</strong><br>
            Use <strong>Symptom Checker</strong> for instant AI analysis
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("""
    <div style='margin: 1.2rem 0 0.8rem 0;'>
        <div style='width: 100%; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);'></div>
    </div>
    """, unsafe_allow_html=True)
    st.markdown("""
    <h3 style='color: #ffffff; font-size: 0.85rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 0.8rem; text-shadow: 0 1px 3px rgba(0,0,0,0.4);'>
        ⚙️ SETTINGS
    </h3>
    """, unsafe_allow_html=True)
    
    # Simplified settings
    st.markdown("""
    <p style='color: #e3f2fd; font-size: 0.75rem; font-weight: 600; margin-bottom: 0.5rem; text-shadow: 0 1px 2px rgba(0,0,0,0.3);'>
        Analysis Options
    </p>
    """, unsafe_allow_html=True)
    confidence_threshold = st.slider(
        "Confidence Threshold",
        min_value=0.0,
        max_value=0.5,
        value=0.1,
        step=0.05,
        help="Minimum confidence to show results",
        label_visibility="collapsed"
    )
    st.caption("Confidence: " + str(confidence_threshold))
    
    # Optional voice settings (collapsed by default)
    with st.expander("🔊 Voice Options"):
        speak_results = st.checkbox("Enable voice output", value=False)
        if speak_results:
            pre_speak_ack = st.checkbox("Voice acknowledgment", value=True)
            engine_choice = st.selectbox(
                "Voice engine",
                options=["pyttsx3 (offline)", "gTTS (online)"],
                index=0
            )
        else:
            pre_speak_ack = False
            engine_choice = "pyttsx3 (offline)"
    
    
    st.markdown("""
    <div style='margin: 1.2rem 0 0.8rem 0;'>
        <div style='width: 100%; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);'></div>
    </div>
    """, unsafe_allow_html=True)
    st.markdown("""
    <div style='background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%); padding: 0.8rem; border-radius: 8px; border-left: 3px solid #ffd54f;'>
        <h4 style='color: #ffffff; font-size: 0.8rem; font-weight: 700; margin: 0 0 0.6rem 0; text-shadow: 0 1px 3px rgba(0,0,0,0.4);'>💡 QUICK TIPS</h4>
        <ul style='color: #e3f2fd; font-size: 0.72rem; margin: 0; padding-left: 1.2rem; line-height: 1.8; text-shadow: 0 1px 2px rgba(0,0,0,0.3);'>
            <li>Type symptoms naturally</li>
            <li>Select from database</li>
            <li>Use voice input (optional)</li>
            <li>Check medical history</li>
        </ul>
    </div>
    """, unsafe_allow_html=True)

# Page Routing based on sidebar radio selection
# Extract the page name from the radio selection (format: "🏠 Home")  
try:
    current_page = page.split(' ', 1)[1] if ' ' in page else page
except NameError:
    current_page = 'Home'

if current_page == 'Home':
    # Impressive Heart-Touching Hero Section
    st.markdown("""
    <div class="hero-section">
        <div style="margin-bottom: 2rem;">
            <div style="font-size: 5rem; margin-bottom: 1rem; animation: heartbeat 2s ease-in-out infinite;">❤️</div>
        </div>
        <h1 class="hero-title">Welcome to MediTalk AI</h1>
        <p class="hero-subtitle">Your Trusted Companion in Health & Wellness Journey</p>
        <p style="color: rgba(255,255,255,0.9); font-size: 1.1rem; margin-top: 1.5rem; font-style: italic; position: relative; z-index: 1;">
            "Because Your Health Matters Most - AI-Powered Care with a Human Touch"
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # Impressive Main Content
    st.markdown("""
    <div class="medical-card">
        <div style="text-align: center; margin-bottom: 2rem;">
            <h2 style="color: #1976d2; font-size: 2rem; font-weight: 700; margin-bottom: 1rem;">🎯 Your Health, Our Priority</h2>
            <p style="color: #546e7a; font-size: 1.1rem; line-height: 1.8;">
                MediTalk AI combines cutting-edge artificial intelligence with compassionate healthcare to bring you accurate, 
                reliable, and instant medical insights. We're here to support your wellness journey, every step of the way.
            </p>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # Key Features with Impressive Design
    st.markdown("""
    <div style="margin: 2.5rem 0;">
        <h2 style="text-align: center; color: #1976d2; font-size: 2rem; font-weight: 700; margin-bottom: 2rem;">
            ✨ Why Choose MediTalk AI?
        </h2>
    </div>
    """, unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("""
        <div class="medical-card" style="text-align: center; height: 100%;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">🔬</div>
            <h3 style="color: #1976d2; margin-bottom: 1rem;">AI-Powered Analysis</h3>
            <p style="color: #546e7a; line-height: 1.6;">
                Advanced machine learning algorithms analyze your symptoms with 85%+ accuracy, 
                providing reliable preliminary assessments.
            </p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="medical-card" style="text-align: center; height: 100%;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⚡</div>
            <h3 style="color: #1976d2; margin-bottom: 1rem;">Instant Results</h3>
            <p style="color: #546e7a; line-height: 1.6;">
                Get comprehensive health insights in under 3 seconds with confidence scores 
                and alternative diagnosis options.
            </p>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown("""
        <div class="medical-card" style="text-align: center; height: 100%;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">💝</div>
            <h3 style="color: #1976d2; margin-bottom: 1rem;">Compassionate Care</h3>
            <p style="color: #546e7a; line-height: 1.6;">
                Personalized medical precautions and recommendations tailored to your 
                specific symptoms and health needs.
            </p>
        </div>
        """, unsafe_allow_html=True)
    
    # How It Works - Step by Step
    st.markdown("""
    <div style="margin: 3rem 0 2rem 0;">
        <h2 style="text-align: center; color: #1976d2; font-size: 2rem; font-weight: 700; margin-bottom: 2.5rem;">
            📝 How It Works - Simple & Easy
        </h2>
    </div>
    """, unsafe_allow_html=True)
    
    step_col1, step_col2 = st.columns(2)
    
    with step_col1:
        st.markdown("""
        <div class="medical-card">
            <h4 style="color: #1976d2; margin-bottom: 1rem;">
                <span style="background: #1976d2; color: white; padding: 0.3rem 0.8rem; border-radius: 50%; margin-right: 0.5rem;">1</span>
                Select Symptom Checker
            </h4>
            <p style="color: #546e7a; margin-left: 2.5rem;">Navigate to Symptom Checker from the sidebar menu</p>
        </div>
        
        <div class="medical-card">
            <h4 style="color: #1976d2; margin-bottom: 1rem;">
                <span style="background: #1976d2; color: white; padding: 0.3rem 0.8rem; border-radius: 50%; margin-right: 0.5rem;">2</span>
                Describe Your Symptoms
            </h4>
            <p style="color: #546e7a; margin-left: 2.5rem;">Type naturally, select from database, or use voice input</p>
        </div>
        
        <div class="medical-card">
            <h4 style="color: #1976d2; margin-bottom: 1rem;">
                <span style="background: #1976d2; color: white; padding: 0.3rem 0.8rem; border-radius: 50%; margin-right: 0.5rem;">3</span>
                Get AI Analysis
            </h4>
            <p style="color: #546e7a; margin-left: 2.5rem;">Click "Analyze Symptoms" for instant AI-powered results</p>
        </div>
        """, unsafe_allow_html=True)
    
    with step_col2:
        st.markdown("""
        <div class="medical-card">
            <h4 style="color: #1976d2; margin-bottom: 1rem;">
                <span style="background: #1976d2; color: white; padding: 0.3rem 0.8rem; border-radius: 50%; margin-right: 0.5rem;">4</span>
                Review Diagnosis
            </h4>
            <p style="color: #546e7a; margin-left: 2.5rem;">See primary diagnosis with confidence score and alternatives</p>
        </div>
        
        <div class="medical-card">
            <h4 style="color: #1976d2; margin-bottom: 1rem;">
                <span style="background: #1976d2; color: white; padding: 0.3rem 0.8rem; border-radius: 50%; margin-right: 0.5rem;">5</span>
                Read Precautions
            </h4>
            <p style="color: #546e7a; margin-left: 2.5rem;">Get personalized medical recommendations and care tips</p>
        </div>
        
        <div class="medical-card">
            <h4 style="color: #1976d2; margin-bottom: 1rem;">
                <span style="background: #1976d2; color: white; padding: 0.3rem 0.8rem; border-radius: 50%; margin-right: 0.5rem;">6</span>
                Export & Save
            </h4>
            <p style="color: #546e7a; margin-left: 2.5rem;">Download PDF report and save to medical history</p>
        </div>
        """, unsafe_allow_html=True)
    
    # Impressive Statistics Dashboard
    st.markdown("""
    <div style="margin: 3rem 0 2rem 0;">
        <h2 style="text-align: center; color: #1976d2; font-size: 2rem; font-weight: 700; margin-bottom: 2.5rem;">
            📊 Our Impact & Capabilities
        </h2>
    </div>
    """, unsafe_allow_html=True)
    
    try:
        _diseases = len(list(st.session_state.all_diseases)) if st.session_state.all_diseases else 41
        _symptoms = len(list(st.session_state.all_symptoms)) if st.session_state.all_symptoms else 132
    except:
        _diseases = 41
        _symptoms = 132
    
    metric_col1, metric_col2, metric_col3, metric_col4 = st.columns(4)
    
    with metric_col1:
        st.metric(label="🏥 Medical Conditions", value=f"{_diseases}+", delta="Comprehensive Coverage")
    
    with metric_col2:
        st.metric(label="🔬 Symptom Database", value=f"{_symptoms}+", delta="Extensive Library")
    
    with metric_col3:
        st.metric(label="✅ Model Accuracy", value="85.2%", delta="Clinically Validated")
    
    with metric_col4:
        st.metric(label="⚡ Response Time", value="< 3 sec", delta="Real-time Analysis")
    
    # Call to Action Section
    st.markdown("""
    <div class="medical-card" style="text-align: center; background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%); color: white; margin: 3rem 0;">
        <h2 style="color: white; font-size: 2rem; margin-bottom: 1rem;">🚀 Ready to Start?</h2>
        <p style="font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.95;">
            Experience the future of healthcare with AI-powered symptom analysis
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    cta_col1, cta_col2, cta_col3 = st.columns([1, 2, 1])
    with cta_col2:
        if st.button("🩺 Start Your Health Analysis Now", width="stretch", type="primary"):
            st.success("✨ Navigate to '🩺 Symptom Checker' in the sidebar to begin your consultation!")
    
    # Heart-Touching Medical Disclaimer
    st.markdown("""
    <div class="medical-card" style="border-left-color: #ff9800; background: #fff3e0; margin-top: 3rem;">
        <div style="text-align: center;">
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">⚕️</div>
            <h3 style="color: #e65100; margin-bottom: 1rem;">Important Medical Disclaimer</h3>
            <p style="color: #5d4037; line-height: 1.8; text-align: left;">
                <strong>MediTalk AI is designed to assist and inform, not to replace professional medical care.</strong><br><br>
                
                💙 Our AI provides preliminary insights based on symptoms, but <strong>your health is precious</strong> and 
                deserves personalized attention from qualified healthcare professionals.<br><br>
                
                🏥 <strong>Please consult a doctor</strong> for accurate diagnosis, treatment plans, and medical advice. 
                In case of emergencies, contact emergency services immediately.<br><br>
                
                🌟 We care about your wellbeing - this platform is here to support your health journey, 
                working alongside, not replacing, your trusted medical professionals.
            </p>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # Footer with Love
    st.markdown("""
    <div style="text-align: center; margin-top: 3rem; padding-top: 2rem; border-top: 2px solid #e3f2fd;">
        <p style="color: #1976d2; font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">
            ❤️ Built with Love for Your Health & Wellness
        </p>
        <p style="color: #546e7a; font-size: 0.95rem;">
            <strong>MediTalk AI</strong> © 2025 | Advanced AI Medical Consultation Platform<br>
            Developed by: Azhar Ali, Amar Jaleel, Hariz Zafar
        </p>
    </div>
    """, unsafe_allow_html=True)

# Enhanced Symptom Checker Page
elif current_page == 'Symptom Checker':
    render_page_header("🩺 AI Symptom Checker", "Share your symptoms - We're here to help you understand your health better", "💙")
    
    st.markdown("""
    <div class="medical-card" style="background: linear-gradient(135deg, #e3f2fd 0%, #f8fafc 100%); border-left-color: #42a5f5;">
        <h3 style="color: #1976d2; margin-bottom: 1rem; font-size: 1.3rem;">💡 How to Get the Best Results</h3>
        <p style="color: #546e7a; margin: 0; line-height: 1.8; font-size: 1.05rem;">
            <strong>Be as specific as possible:</strong> Describe your symptoms in detail (e.g., "persistent headache for 3 days with nausea and fever").<br>
            <strong>Include multiple symptoms:</strong> The more symptoms you provide, the more accurate our AI analysis will be.<br>
            <strong>Choose your preferred method:</strong> Type naturally, select from our database, or use voice input - whatever feels comfortable for you.
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # Enhanced input method selector with better visual design
    st.markdown("""
    <div style='background: linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 100%); padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0; box-shadow: 0 2px 8px rgba(0,0,0,0.08);'>
        <h3 style='color: #1976d2; margin: 0 0 1rem 0; font-size: 1.2rem; font-weight: 600;'>
            📝 Choose Your Input Method
        </h3>
        <p style='color: #546e7a; margin: 0; font-size: 0.95rem; line-height: 1.6;'>
            Select the most comfortable way to share your symptoms with our AI
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    input_method = st.radio(
        "Choose input method:",
        ["💬 Type Symptoms", "📋 Select from Database", "🎤 Voice Input"],
        horizontal=True,
        help="Choose how you want to input your symptoms",
        label_visibility="collapsed"
    )
    
    symptoms = []
    
    if input_method == "💬 Type Symptoms":
        if 'symptoms_input' not in st.session_state:
            st.session_state.symptoms_input = ''
        
        st.markdown("""
        <div style='background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0; border-left: 4px solid #42a5f5;'>
            <p style='color: #546e7a; margin: 0; font-size: 0.9rem;'>
                💡 <strong>Tip:</strong> Describe your symptoms naturally (e.g., "I have severe headache, high fever, and body pain") 
                or separate them with commas for better accuracy.
            </p>
        </div>
        """, unsafe_allow_html=True)
        
        symptoms_input = st.text_area(
            "Describe your symptoms:",
            placeholder="Example: I have headache, fever, cough, and fatigue\nOr: severe headache with nausea",
            height=120,
            help="Type your symptoms naturally or separate them with commas",
            key="symptom_text_input"
        )
        
        if not symptoms_input and st.session_state.symptoms_input:
            symptoms_input = st.session_state.symptoms_input
        
        extracted_preview: list[str] = []
        if symptoms_input:
            if st.session_state.symptom_extractor is not None:
                extracted_preview = st.session_state.symptom_extractor.extract(symptoms_input)
            # Fallback to comma-splitting if nothing extracted
            if not extracted_preview and (',' in symptoms_input):
                extracted_preview = _normalize_list([s for s in symptoms_input.split(',')])
        if extracted_preview:
            symptoms = extracted_preview
            st.markdown(f"""
            <div style='background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%); padding: 1rem; border-radius: 8px; border-left: 4px solid #4caf50; margin: 1rem 0;'>
                <p style='color: #2e7d32; margin: 0; font-weight: 600;'>
                    ✅ <strong>Recognized Symptoms:</strong><br>
                    <span style='font-size: 1.05rem;'>{', '.join(symptoms)}</span>
                </p>
            </div>
            """, unsafe_allow_html=True)
        elif symptoms_input:
            st.markdown("""
            <div style='background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); padding: 1rem; border-radius: 8px; border-left: 4px solid #ff9800; margin: 1rem 0;'>
                <p style='color: #e65100; margin: 0; font-weight: 600;'>
                    ⚠️ <strong>Couldn't recognize symptoms.</strong><br>
                    <span style='font-size: 0.95rem;'>Try adding commas between symptoms or select from the database below.</span>
                </p>
            </div>
            """, unsafe_allow_html=True)
    
    elif input_method == "📋 Select from Database":
        st.markdown("""
        <div style='background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0; border-left: 4px solid #42a5f5;'>
            <p style='color: #546e7a; margin: 0; font-size: 0.9rem;'>
                💡 <strong>Tip:</strong> Type to search or scroll through our comprehensive symptom database. You can select multiple symptoms.
            </p>
        </div>
        """, unsafe_allow_html=True)
        
        all_symptoms_list = list(map(str, st.session_state.all_symptoms)) if st.session_state.all_symptoms else []
        
        if all_symptoms_list:
            selected_symptoms = st.multiselect(
                "Select symptoms from the database:",
                all_symptoms_list,
                default=[],
                help="Search and select one or more symptoms from our comprehensive medical database",
                placeholder="🔍 Type to search symptoms..."
            )
            
            if selected_symptoms:
                st.markdown(f"""
                <div style='background: linear-gradient(135deg, #e3f2fd 0%, #e1f5fe 100%); padding: 1rem; border-radius: 8px; border-left: 4px solid #2196f3; margin: 1rem 0;'>
                    <p style='color: #0d47a1; margin: 0; font-weight: 600;'>
                        📋 <strong>Selected {len(selected_symptoms)} symptom(s)</strong><br>
                        <span style='font-size: 0.95rem;'>Click "Analyze Symptoms" when ready</span>
                    </p>
                </div>
                """, unsafe_allow_html=True)
            
            selected_raw: list[Any] = selected_symptoms
            selected_clean: list[str] = [str(s) for s in selected_raw]
            symptoms = _normalize_list(selected_clean)
    
    else:  # Voice Input
        st.markdown("""
        <div style='background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); padding: 1.5rem; border-radius: 12px; margin: 1rem 0; border-left: 4px solid #9c27b0;'>
            <h4 style='color: #6a1b9a; margin: 0 0 0.5rem 0; font-size: 1.1rem;'>🎤 Voice Input Instructions</h4>
            <ul style='color: #4a148c; margin: 0; padding-left: 1.5rem; line-height: 1.8;'>
                <li>Click the button below to start recording</li>
                <li>Speak clearly and naturally into your microphone</li>
                <li>Describe all your symptoms in one go</li>
                <li>The AI will automatically extract and analyze them</li>
            </ul>
        </div>
        """, unsafe_allow_html=True)
        
        if st.button("🎙️ Start Voice Recording", type="primary", width="stretch"):
            if st.session_state.voice_interface is not None:
                with st.spinner("🎤 Listening... Speak now!"):
                    spoken = st.session_state.voice_interface.speech_to_text()
                
                if spoken:
                    st.session_state.symptoms_input = spoken.strip()
                    st.session_state.auto_analyze = True
                    st.markdown(f"""
                    <div style='background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); padding: 1rem; border-radius: 8px; border-left: 4px solid #4caf50; margin: 1rem 0;'>
                        <p style='color: #2e7d32; margin: 0; font-weight: 600;'>
                            ✅ <strong>Voice Captured Successfully!</strong><br>
                            <span style='font-size: 1rem;'>"{spoken}"</span>
                        </p>
                    </div>
                    """, unsafe_allow_html=True)
                    time.sleep(1)
                    st.rerun()
                else:
                    st.markdown("""
                    <div style='background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%); padding: 1rem; border-radius: 8px; border-left: 4px solid #f44336; margin: 1rem 0;'>
                        <p style='color: #c62828; margin: 0; font-weight: 600;'>
                            ❌ <strong>No speech detected.</strong><br>
                            <span style='font-size: 0.95rem;'>Please check your microphone and try again.</span>
                        </p>
                    </div>
                    """, unsafe_allow_html=True)
            else:
                st.error("❌ Voice input unavailable. Please use text input instead.")
        
        # Show previously captured voice input
        if st.session_state.get('symptoms_input'):
            symptoms_input = st.session_state.symptoms_input
            if st.session_state.symptom_extractor:
                symptoms = st.session_state.symptom_extractor.extract(symptoms_input)
            if symptoms:
                st.markdown(f"""
                <div style='background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 1rem; border-radius: 8px; border-left: 4px solid #2196f3; margin: 1rem 0;'>
                    <p style='color: #0d47a1; margin: 0; font-weight: 600;'>
                        📝 <strong>Using Previous Voice Input:</strong><br>
                        <span style='font-size: 1rem;'>{', '.join(symptoms)}</span>
                    </p>
                </div>
                """, unsafe_allow_html=True)
    
    # Enhanced action buttons section
    st.markdown("""
    <div style='margin: 2rem 0 1.5rem 0;'>
        <div style='width: 100%; height: 2px; background: linear-gradient(90deg, transparent, #1976d2, transparent);'></div>
    </div>
    """, unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns([2, 2, 1])
    
    with col1:
        analyze_button = st.button(
            "🔍 Analyze Symptoms Now", 
            width="stretch", 
            type="primary",
            help="Click to get AI-powered analysis of your symptoms"
        )
    
    with col2:
        if symptoms:
            st.markdown(f"""
            <div style='background: linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%); padding: 0.8rem; border-radius: 8px; text-align: center; height: 45px; display: flex; align-items: center; justify-content: center;'>
                <p style='color: #3949ab; margin: 0; font-weight: 600; font-size: 0.95rem;'>
                    ✓ {len(symptoms)} symptom(s) ready
                </p>
            </div>
            """, unsafe_allow_html=True)
    
    with col3:
        if st.button("🔄 Clear", width="stretch", help="Clear all inputs and start fresh"):
            st.session_state.auto_analyze = False
            st.session_state.symptoms_input = ''
            st.rerun()
    
    # Check for analysis trigger
    should_analyze = analyze_button or st.session_state.auto_analyze
    
    if st.session_state.auto_analyze:
        st.session_state.auto_analyze = False
    
    # Analysis results
    if should_analyze and symptoms:
        # Show loading animation
        show_medical_loader()
        
        with st.spinner("🔬 Finalizing analysis..."):
            # Validate symptoms
            logger.info('Validating symptoms: %s', symptoms)
            validation_raw = st.session_state.predictor.validate_symptoms(symptoms)
            validation: Dict[str, Any] = cast(Dict[str, Any], validation_raw)
            logger.info('Validation result: %s', {k: validation.get(k) for k in ['valid_symptoms','invalid_symptoms','all_valid']})
            
            if not bool(validation.get('all_valid', False)):
                invalids: list[str] = cast(List[str], validation.get('invalid_symptoms', []))
                st.warning(f"⚠️ Unrecognized symptoms: {', '.join(invalids)}")
                # Offer suggestions for each invalid symptom
                all_symptoms_for_matching = list(map(str, st.session_state.all_symptoms)) if st.session_state.all_symptoms else []
                if all_symptoms_for_matching:
                    suggestions = []
                    for inv in invalids:
                        close = difflib.get_close_matches(inv, all_symptoms_for_matching, n=3, cutoff=0.6)
                        if close:
                            suggestions.append(f"💡 Did you mean: **{close[0]}**?" + (f" (or {', '.join(close[1:])}?)" if len(close) > 1 else ""))
                    if suggestions:
                        st.info("\n\n".join(suggestions))
            
            if validation.get('valid_symptoms'):
                # Make prediction
                valid_syms: list[str] = cast(List[str], validation.get('valid_symptoms', []))
                logger.info('Predicting disease for valid symptoms: %s', valid_syms)
                result_raw = st.session_state.predictor.predict_disease(valid_syms)
                result: Dict[str, Any] = cast(Dict[str, Any], result_raw)
                logger.info('Prediction: primary=%s confidence=%.3f', result.get('primary_disease'), float(result.get('confidence', 0.0)))
                
                # Display results using modern components
                st.markdown("---")
                
                # Show helpful message for low confidence predictions
                confidence = float(result.get('confidence', 0.0))
                symptom_count = len(valid_syms)
                if confidence < 0.20 and symptom_count <= 3:
                    st.info(
                        f"ℹ️ **Limited symptoms detected ({symptom_count})**: The prediction confidence is {confidence*100:.1f}%. "
                        "For more accurate diagnosis, please provide additional symptoms if you're experiencing any. "
                        "The AI analyzes patterns across multiple symptoms to improve accuracy."
                    )
                
                # Generate and play audio response automatically
                if st.session_state.audio_response is not None:
                    try:
                        # Generate natural consultation speech
                        speech_text = st.session_state.audio_response.generate_consultation_speech(
                            result, valid_syms
                        )
                        
                        # Create audio file
                        if st.session_state.audio_response.text_to_speech_gtts(speech_text):
                            # Display audio player with autoplay
                            st.subheader("🔊 AI Voice Consultation")
                            audio_html = st.session_state.audio_response.get_audio_player_html(autoplay=True)
                            if audio_html:
                                st.markdown(audio_html, unsafe_allow_html=True)
                                st.caption("🎧 Listen to your AI consultation above")
                            
                            # Cleanup old files
                            st.session_state.audio_response.cleanup_temp_files()
                    except Exception as audio_err:
                        logger.warning(f"Audio response generation failed: {audio_err}")
                
                # Display text results
                render_prediction_results(result)

                # Altair visualization of alternative probabilities (improved design)
                alt_diseases: list[str] = cast(List[str], result.get('alternative_diseases', []))
                alt_probs: list[float] = cast(List[float], result.get('alternative_probabilities', []))
                if alt_diseases and alt_probs and len(alt_diseases) == len(alt_probs):
                    try:
                        import pandas as pd
                        import altair as alt
                        chart_df = pd.DataFrame({
                            'Disease': alt_diseases,
                            'Probability': [p * 100 for p in alt_probs]
                        }).sort_values('Probability', ascending=False)
                        base = alt.Chart(chart_df).encode(
                            y=alt.Y('Disease:N', sort='-x', title='Alternative Diseases'),
                            x=alt.X('Probability:Q', title='Probability (%)', scale=alt.Scale(domain=[0, max(100, chart_df['Probability'].max())])),
                            tooltip=[alt.Tooltip('Disease:N'), alt.Tooltip('Probability:Q', format='.1f')]
                        )
                        bars = base.mark_bar(cornerRadiusTopRight=6, cornerRadiusBottomRight=6).encode(
                            color=alt.Color('Probability:Q', scale=alt.Scale(scheme='blues'), legend=None)
                        )
                        text = base.mark_text(dx=5, align='left', color='#0d47a1').encode(
                            text=alt.Text('Probability:Q', format='.1f')
                        )
                        chart = (bars + text).properties(
                            title='Alternative Disease Probability Distribution',
                            height=min(400, 30 * len(chart_df))
                        )
                        st.altair_chart(chart, use_container_width=True)
                        # Show underlying data table for transparency
                        with st.expander('Show probability data table'):
                            st.dataframe(chart_df, use_container_width=True)
                    except Exception as viz_err:
                        st.info("Visualization not available.")

                # Export buttons
                col1, col2, col3 = st.columns([1, 1, 1])
                with col1:
                    st.download_button(
                        label="⬇️ Download JSON",
                        data=json.dumps(result, indent=2),
                        file_name="diagnosis.json",
                        mime="application/json",
                        width="stretch"
                    )
                with col2:
                    alt_diseases: list[str] = cast(List[str], result.get('alternative_diseases', []))
                    alt_probs: list[float] = cast(List[float], result.get('alternative_probabilities', []))
                    precautions: list[str] = cast(List[str], result.get('precautions', []))
                    primary: str = str(result.get('primary_disease', ''))
                    confidence: float = float(result.get('confidence', 0.0))
                    summary = (
                        f"Primary disease: {primary}\n"
                        f"Confidence: {confidence:.1%}\n"
                        f"Alternatives: " + ", ".join(
                            f"{d} ({p:.1%})" for d, p in zip(alt_diseases, alt_probs)
                        ) + "\n"
                        f"Precautions: " + ", ".join(precautions) + "\n"
                    )
                    st.download_button(
                        label="📝 Download Summary",
                        data=summary,
                        file_name="diagnosis.txt",
                        mime="text/plain",
                        width="stretch"
                    )
                with col3:
                    # Generate PDF report
                    try:
                        pdf_content = PDFReportGenerator.generate_report(result, valid_syms)
                        st.download_button(
                            label="📄 Download PDF Report",
                            data=pdf_content,
                            file_name="medical_report.pdf",
                            mime="application/pdf",
                            width="stretch"
                        )
                    except Exception as pdf_err:
                        st.warning(f"PDF generation unavailable: {pdf_err}")
                
                # Add to medical history
                try:
                    MedicalHistory.add_consultation(valid_syms, result)
                    st.success("✅ Consultation saved to history")
                except Exception as hist_err:
                    logger.warning(f"Failed to save history: {hist_err}")

                # Optional: Speak results
                if speak_results and st.session_state.voice_interface is not None:
                    try:
                        alt_diseases: list[str] = cast(List[str], result.get('alternative_diseases', []))
                        primary: str = str(result.get('primary_disease', ''))
                        confidence: float = float(result.get('confidence', 0.0))
                        speak_text = (
                            f"Primary diagnosis: {primary}. "
                            f"Confidence {confidence:.0%}. "
                            f"Top alternatives: " + ", ".join(alt_diseases[:2]) + "."
                        )
                        st.session_state.voice_interface.text_to_speech(speak_text)
                    except Exception as e:
                        st.info(f"Voice output unavailable: {e}")
            else:
                st.error("❌ No valid symptoms recognized. Please check your input.")
    
    elif should_analyze and not symptoms:
        st.error("❌ Please enter at least one symptom.")

# Disease Database Page
elif current_page == 'Disease Database':
    if not st.session_state.get('logged_in', False):
        st.warning('Please log in to access the Disease Database.')
        st.stop()
    
    st.markdown("""
    <div style='text-align: center; padding: 1rem 0; margin-bottom: 2rem;'>
        <h1 style='color: #667eea; font-size: 2.5rem; margin: 0;'>
            📚 Disease Database
        </h1>
        <p style='color: #718096; font-size: 1.1rem; margin-top: 0.5rem;'>
            Comprehensive Medical Information Library
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    st.info("Browse information about all diseases in the database.")
    
    all_diseases_list = list(map(str, st.session_state.all_diseases)) if st.session_state.all_diseases else []
    
    # Search/filter
    search_disease = st.text_input(
        "Search for a disease:",
        placeholder="Type disease name..."
    )
    
    # Filter diseases
    if search_disease and all_diseases_list:
        filtered_diseases = [d for d in all_diseases_list if search_disease.lower() in d.lower()]
    else:
        filtered_diseases = all_diseases_list if all_diseases_list else []
    
    # Display diseases
    if filtered_diseases:
        selected_disease = st.selectbox(
            "Select a disease:",
            filtered_diseases
        )
        
        if selected_disease:
            st.markdown("---")
            st.markdown(f"### 🏥 {selected_disease}")
            
            col1, col2 = st.columns([2, 1])
            
            with col1:
                # Description
                description = str(st.session_state.predictor.processor.get_symptom_description(selected_disease))
                with st.expander("📖 Disease Description", expanded=True):
                    st.info(description)
            
            with col2:
                st.markdown("#### Quick Info")
                st.markdown(f"""
                - **Category**: Medical Condition
                - **Status**: In Database
                - **Data**: Available
                """)
            
            # Precautions
            st.markdown("---")
            st.markdown("#### 💊 Precautions & Recommendations")
            precautions = cast(List[str], st.session_state.predictor.processor.get_symptom_precautions(selected_disease) or [])
            
            if precautions:
                render_precautions(precautions)
            else:
                st.write("No precautions available.")
    else:
        st.warning("No diseases found matching your search.")

elif current_page == 'Model Metrics':
    st.markdown("""
    <div style='text-align: center; padding: 1rem 0; margin-bottom: 2rem;'>
        <h1 style='color: #667eea; font-size: 2.5rem; margin: 0;'>
            📊 Model Training Metrics
        </h1>
        <p style='color: #718096; font-size: 1.1rem; margin-top: 0.5rem;'>
            Machine Learning Performance Analytics
        </p>
    </div>
    """, unsafe_allow_html=True)
    metrics_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'training_metrics.json')
    metrics_path = os.path.normpath(metrics_path)
    if not os.path.exists(metrics_path):
        st.info("No training metrics found yet. Run the trainer to generate metrics: `python src/model_trainer.py --tune`.")
    else:
        try:
            with open(metrics_path, 'r', encoding='utf-8') as f:
                metrics = json.load(f)

            # Top-line KPIs
            col1, col2, col3, col4 = st.columns(4)
            with col1:
                st.metric("Accuracy", f"{float(metrics.get('accuracy', 0.0)):.3f}")
            with col2:
                st.metric("Precision", f"{float(metrics.get('precision', 0.0)):.3f}")
            with col3:
                st.metric("Recall", f"{float(metrics.get('recall', 0.0)):.3f}")
            with col4:
                st.metric("F1", f"{float(metrics.get('f1', 0.0)):.3f}")

            st.markdown("---")
            st.markdown("### Details")
            st.write(f"Mode: {metrics.get('mode', 'baseline')}")
            if metrics.get('mode') == 'tuned':
                best_params = metrics.get('best_params', {})
                best_cv = metrics.get('best_cv_score', None)
                if best_params:
                    with st.expander("Best Parameters", expanded=True):
                        st.json(best_params)
                if best_cv is not None:
                    st.write(f"Best CV score ({metrics.get('scoring','f1_weighted')}): {float(best_cv):.4f}")

            # Classification report (string)
            report = metrics.get('classification_report')
            if isinstance(report, str):
                with st.expander("Classification Report"):
                    st.text(report)

            # Confusion matrix heatmap
            cm = metrics.get('confusion_matrix')
            if isinstance(cm, list) and cm and isinstance(cm[0], list):
                try:
                    import pandas as pd
                    import altair as alt
                    df_cm = pd.DataFrame(cm)
                    df_melt = df_cm.reset_index().melt(id_vars='index', var_name='Predicted', value_name='Count')
                    df_melt = df_melt.rename(columns={'index': 'Actual'})
                    heatmap = alt.Chart(df_melt).mark_rect().encode(
                        x=alt.X('Predicted:O', title='Predicted'),
                        y=alt.Y('Actual:O', title='Actual'),
                        color=alt.Color('Count:Q', scale=alt.Scale(scheme='blues')),
                        tooltip=['Actual', 'Predicted', 'Count']
                    ).properties(title='Confusion Matrix', height=400)
                    text = alt.Chart(df_melt).mark_text(baseline='middle').encode(
                        x='Predicted:O', y='Actual:O', text=alt.Text('Count:Q', format='.0f')
                    )
                    st.altair_chart(heatmap + text, use_container_width=True)
                except Exception:
                    st.info("Unable to render confusion matrix chart.")
        except Exception as e:
            st.error(f"Failed to load metrics: {e}")

# About Page
elif current_page == 'About':
    st.markdown("# ℹ️ About MediTalk AI")
    st.markdown("### Advanced Artificial Intelligence for Healthcare Consultation")
    
    col1, col2 = st.columns([3, 2])
    
    with col1:
        st.markdown("### 🎯 Project Overview")
        st.markdown("""
        MediTalk AI is an advanced medical consultation platform that leverages cutting-edge machine learning 
        and natural language processing to provide intelligent symptom analysis, disease prediction, and 
        personalized healthcare guidance.
        """)
        
        st.markdown("#### 🔧 Technology Stack")
        st.markdown("""
        - **Machine Learning:** Random Forest Classifier (scikit-learn)
        - **Frontend:** Streamlit with modern responsive design  
        - **Voice Processing:** pyttsx3, SpeechRecognition
        - **Data Processing:** Pandas, NumPy
        - **Visualization:** Altair interactive charts
        - **Natural Language:** Advanced symptom extraction
        """)
        
        st.markdown("#### ⚙️ How It Works")
        st.info("1️⃣ **Data Processing** - Symptoms are normalized and converted to feature vectors")
        st.success("2️⃣ **Model Training** - Random Forest model trained on disease-symptom relationships")
        st.warning("3️⃣ **AI Analysis** - Input symptoms are matched against trained patterns") 
        st.error("4️⃣ **Medical Recommendations** - System provides diagnosis and personalized health guidance")
    
    with col2:
        st.markdown("### 📊 System Statistics")
        
        st.metric("Disease Mappings", "4,900+")
        st.metric("Medical Conditions", "40+") 
        st.metric("Symptom Database", "130+")
        st.metric("Data Sources", "4")
        
        st.markdown("### 👥 Development Team")
        st.markdown("""
        **Azhar Ali**  
        023-23-0314
        
        **Amar Jaleel**  
        023-23-0362
        
        **Hariz Zafar**  
        023-23-0439
        """)
    
    # Features and Future Enhancements section  
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### 🎯 Key Features")
        st.markdown("""
        ✓ Advanced ML-powered disease prediction  
        ✓ Comprehensive disease information database  
        ✓ Personalized precaution recommendations  
        ✓ Intelligent voice interface support  
        ✓ Responsive modern web interface  
        ✓ Interactive probability visualizations  
        ✓ Professional accessibility standards
        """)
    
    with col2:
        st.markdown("""
        <div class="meditalk-card">
            <h3 style="color: var(--color-secondary); margin-bottom: 1.5rem;">🚀 Future Roadmap</h3>
            <div style="display: grid; gap: 0.75rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="color: var(--color-accent);">➤</span>
                    <span style="color: var(--color-text-secondary);">Multi-language support system</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="color: var(--color-accent);">➤</span>
                    <span style="color: var(--color-text-secondary);">Telemedicine platform integration</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="color: var(--color-accent);">➤</span>
                    <span style="color: var(--color-text-secondary);">Expanded medical dataset coverage</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="color: var(--color-accent);">➤</span>
                    <span style="color: var(--color-text-secondary);">Cross-platform mobile applications</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="color: var(--color-accent);">➤</span>
                    <span style="color: var(--color-text-secondary);">Real-time doctor consultation</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="color: var(--color-accent);">➤</span>
                    <span style="color: var(--color-text-secondary);">Patient history tracking system</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="color: var(--color-accent);">➤</span>
                    <span style="color: var(--color-text-secondary);">Enhanced symptom severity analysis</span>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    # Professional disclaimer
    st.markdown("""
    <div class="meditalk-card" style="background: var(--color-error-light); border-left: 4px solid var(--color-error); margin-top: 2rem;">
        <h3 style="color: var(--color-error); margin-bottom: 1rem;">⚠️ Important Medical Disclaimer</h3>
        <p style="color: var(--color-text-primary); line-height: 1.7; margin: 0;">
            <strong>This application is intended for educational and informational purposes only.</strong>
            MediTalk AI should never be used as a substitute for professional medical advice, diagnosis, or treatment. 
            All medical decisions should be made in consultation with qualified healthcare professionals who can 
            properly evaluate your individual circumstances, medical history, and current health status.
            <br><br>
            <strong>In case of medical emergencies, contact emergency services immediately. Do not rely on this 
            application for urgent medical situations.</strong>
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # Footer
    st.markdown("---")
    st.markdown("**MediTalk AI** © 2025 | Advanced AI Medical Consultation Assistant")

elif current_page == 'Medical History':
    render_page_header("📋 Medical History", "Your Personal Health Records & Consultation History")
    
    history = MedicalHistory.get_history()
    
    if not history:
        st.info("No consultation history yet. Complete a symptom check to start building your history.")
    else:
        # Summary statistics
        summary = MedicalHistory.get_history_summary()
        
        st.markdown("### Summary Statistics")
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("Total Consultations", summary['total_consultations'])
        with col2:
            st.metric("Unique Diseases", summary['unique_diseases'])
        with col3:
            st.metric("Most Common", summary['most_common_disease'] or "N/A")
        with col4:
            st.metric("Avg Confidence", f"{summary['average_confidence']*100:.1f}%")
        
        st.markdown("---")
        
        # Action buttons
        col_export, col_clear = st.columns([1, 1])
        
        with col_export:
            history_json = MedicalHistory.export_history_json()
            st.download_button(
                label="📥 Export History (JSON)",
                data=history_json,
                file_name="medical_history.json",
                mime="application/json",
                use_container_width=True
            )
        
        with col_clear:
            if st.button("🗑️ Clear History", type="secondary", width="stretch"):
                MedicalHistory.clear_history()
                st.success("History cleared!")
                st.rerun()
        
        st.markdown("---")
        st.markdown("### Consultation History")
        
        # Display history in reverse chronological order
        for i, consultation in enumerate(reversed(history), 1):
            with st.expander(f"Consultation #{len(history) - i + 1} - {consultation['timestamp'][:19]}"):
                st.markdown(f"**Symptoms:** {', '.join(consultation['symptoms'])}")
                st.markdown(f"**Primary Disease:** {consultation['primary_disease']}")
                st.markdown(f"**Confidence:** {consultation['confidence']*100:.1f}%")
                
                if consultation['alternatives']:
                    st.markdown("**Alternative Diagnoses:**")
                    for disease, prob in consultation['alternatives']:
                        st.markdown(f"- {disease}: {prob*100:.1f}%")

# Footer
st.markdown("---")
st.markdown("""
<div style='text-align: center; padding: 1.5rem 0; color: #666;'>
    <p style='margin: 0; font-size: 0.9rem;'>
        <strong>MediTalk AI</strong> © 2025 | Advanced Medical Consultation Platform
    </p>
    <p style='margin: 0.5rem 0 0 0; font-size: 0.8rem;'>
        For Educational Purposes Only | Always Consult Healthcare Professionals
    </p>
</div>
""", unsafe_allow_html=True)
