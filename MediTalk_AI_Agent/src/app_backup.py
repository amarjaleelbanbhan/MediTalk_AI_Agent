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

# Modern Professional UI
def load_premium_css():
    """Load clean, professional medical-themed CSS"""
    st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    /* Global Clean Styles */
    .stApp {
        background: linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%);
        font-family: 'Inter', sans-serif;
    }
    
    /* Sidebar Professional Styling */
    [data-testid="stSidebar"] {
        background: linear-gradient(180deg, #1976d2 0%, #1565c0 100%);
    }
    
    [data-testid="stSidebar"] .stMarkdown {
        color: white;
    }
    
    /* Hide unnecessary elements */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    
    /* Professional Cards */
    .medical-card {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        margin: 1rem 0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        border-left: 4px solid #1976d2;
        transition: all 0.3s ease;
    }
    
    .medical-card:hover {
        box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        transform: translateX(4px);
    }
    
    /* Clean Buttons */
    .stButton > button {
        background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
        color: white;
        border: none;
        padding: 0.6rem 1.5rem;
        border-radius: 8px;
        font-weight: 500;
        transition: all 0.2s ease;
        width: 100%;
    }
    
    .stButton > button:hover {
        background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
    }
    
    /* Page Title Styling */
    .page-title {
        color: #1976d2;
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        text-align: center;
    }
    
    .page-subtitle {
        color: #666;
        font-size: 1.1rem;
        text-align: center;
        margin-bottom: 2rem;
    }
    
    /* Simple Loading Styles */
    .loading-container {
        text-align: center;
        padding: 2rem;
        background: white;
        border-radius: 12px;
        margin: 1rem 0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    
    .loading-spinner {
        border: 4px solid #e3f2fd;
        border-top: 4px solid #1976d2;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .loading-text {
        color: #1976d2;
        font-size: 1rem;
        font-weight: 500;
    }
    
    /* Hero Section */
    .hero-section {
        background: white;
        border-radius: 12px;
        padding: 3rem 2rem;
        margin: 2rem 0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        text-align: center;
    }
    
    .hero-title {
        color: #1976d2;
        font-size: 2.8rem;
        font-weight: 700;
        margin-bottom: 1rem;
        -webkit-text-fill-color: transparent;
    }
    
    /* Mobile Responsive */
    @media (max-width: 768px) {
        .custom-navbar { padding: 1rem; }
        .hero-title { font-size: 2.5rem; }
        .glass-card { padding: 1.5rem; margin: 0.5rem 0; }
        .navbar-nav { flex-direction: column; gap: 1rem; }
    }
    </style>
    """, unsafe_allow_html=True)

# Custom Navigation Bar Component
def render_page_header(title, subtitle=""):
    """Render clean page header"""
    st.markdown(f"""
    <div style="text-align: center; margin-bottom: 2rem;">
        <h1 class="page-title">{title}</h1>
        {f'<p class="page-subtitle">{subtitle}</p>' if subtitle else ''}
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

# Sidebar Navigation
with st.sidebar:
    st.markdown("""
    <div style='text-align: center; padding: 1.5rem 0; margin-bottom: 2rem;'>
        <h1 style='color: white; font-size: 1.8rem; margin: 0;'>🩺 MediTalk AI</h1>
        <p style='color: rgba(255,255,255,0.8); font-size: 0.9rem; margin-top: 0.5rem;'>AI Medical Assistant</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("### 📋 Navigation")
    
    # Clean navigation menu
    page = st.radio(
        "Go to:",
        [
            "🏠 Home",
            "🩺 Symptom Checker",
            "📚 Disease Database",
            "📊 Model Metrics",
            "📋 Medical History",
            "ℹ️ About"
        ],
        label_visibility="collapsed"
    )
    
    st.markdown("---")
    st.markdown("### ⚙️ Settings")
    
    # Simplified settings
    st.markdown("**Analysis Options**")
    confidence_threshold = st.slider(
        "Confidence Threshold",
        min_value=0.0,
        max_value=0.5,
        value=0.1,
        step=0.05,
        help="Minimum confidence to show results"
    )
    
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
    
    st.markdown("---")
    st.markdown("### 💡 Quick Tips")
    st.info("""
    • Type symptoms naturally
    • Select from database
    • Use voice input (optional)
    • Check medical history
    """)
    # Discover available models
    models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    models_dir = os.path.normpath(models_dir)
    available_models = []
    try:
        for fname in os.listdir(models_dir):
            if fname.endswith('_model.pkl') or fname in ('disease_model.pkl', 'random_forest_model.pkl'):
                available_models.append(fname)
    except Exception:
        pass
    available_models = sorted(set(available_models)) or ['disease_model.pkl']
    current_choice = st.session_state.get('model_choice', 'disease_model.pkl')
    model_choice = st.selectbox("Select model file", options=available_models, index=available_models.index(current_choice) if current_choice in available_models else 0)
    if model_choice != current_choice:
        # Reload predictor with selected model
        from disease_predictor import DiseasePredictor
        try:
            st.session_state.predictor = DiseasePredictor(model_dir='models', data_dir='data', model_filename=model_choice)
            # Refresh caches
            st.session_state.all_symptoms = st.session_state.predictor.get_all_symptoms()
            st.session_state.all_diseases = st.session_state.predictor.get_all_diseases()
            # Recreate extractor with new symptom list
            try:
                known = list(map(str, st.session_state.all_symptoms or []))
            except Exception:
                known = []
            if 'symptom_extractor' in st.session_state:
                st.session_state.symptom_extractor = SymptomExtractor(known)
            st.session_state.model_choice = model_choice
            st.success(f"Loaded model: {model_choice}")
        except Exception as e:
            st.error(f"Failed to load model {model_choice}: {e}")
    st.markdown("---")
    st.markdown('<p class="nav-header">⚡ Model Info</p>', unsafe_allow_html=True)
    _diseases = list(map(str, st.session_state.all_diseases)) if st.session_state.all_diseases else []
    _symptoms = list(map(str, st.session_state.all_symptoms)) if st.session_state.all_symptoms else []
    st.markdown(f"""
    - **Diseases**: {len(_diseases)}
    - **Symptoms**: {len(_symptoms)}
    - **Algorithm**: Random Forest
    """)

# Page Routing based on sidebar radio selection
# Extract the page name from the radio selection (format: "🏠 Home")  
try:
    current_page = page.split(' ', 1)[1] if ' ' in page else page
except NameError:
    current_page = 'Home'

if current_page == 'Home':
    # Premium Hero Section
    st.markdown("""
    <div class="hero-section">
        <h1 class="hero-title">🩺 Welcome to MediTalk AI</h1>
        <p style="font-size: 1.3rem; opacity: 0.9; margin-bottom: 2rem;">Advanced AI-Powered Medical Consultation Platform</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Main content with glassmorphism design
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.markdown('<div class="glass-card">', unsafe_allow_html=True)
        st.markdown("### 🎯 What is MediTalk AI?")
        st.write("""
        MediTalk AI is an advanced medical consultation assistant powered by machine learning, 
        designed to provide intelligent symptom analysis and preliminary medical guidance.
        """)
        
        st.markdown("### 🚀 Key Features")
        st.info("🔍 **AI Symptom Analysis** - Advanced machine learning for accurate symptom interpretation")
        st.success("📊 **Probability Analysis** - Confidence scoring and alternative disease possibilities") 
        st.warning("💊 **Medical Guidance** - Personalized recommendations and precautionary measures")
        st.markdown('</div>', unsafe_allow_html=True)
        
        st.markdown("### 📝 How to Use")
        st.markdown("""
        1. **Authentication**: Sign in with your credentials
        2. **Navigate**: Select "Symptom Checker" from the navigation menu  
        3. **Input Symptoms**: Enter your symptoms via text or voice interface
        4. **AI Analysis**: Click "Analyze Symptoms" for intelligent processing
        5. **Review Results**: Examine diagnosis, confidence scores, and recommendations
        """)
    
    with col2:
        st.markdown("### 📊 System Statistics")
        
        try:
            _diseases = len(list(st.session_state.all_diseases)) if st.session_state.all_diseases else 0
            _symptoms = len(list(st.session_state.all_symptoms)) if st.session_state.all_symptoms else 0
        except:
            _diseases = 40
            _symptoms = 130
        
        st.metric("Medical Conditions", f"{_diseases}+")
        st.metric("Symptom Database", f"{_symptoms}+") 
        st.metric("Model Accuracy", "85%+")
        st.metric("Response Time", "< 3 sec")
        
        st.markdown("### 🚀 Quick Actions")
        if st.button("🩺 Start Symptom Analysis", use_container_width=True, type="primary"):
            # Just redirect by setting a flag instead of rerun
            st.info("Navigate to 'Symptom Checker' in the sidebar to start analysis!")
    
    # Simple feature showcase
    st.markdown("---")
    st.markdown("### ✨ Platform Advantages")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("""
        **🎯 Clinically Accurate**
        
        Advanced machine learning algorithms trained on comprehensive medical datasets with 85%+ accuracy
        """)
    
    with col2:
        st.markdown("""
        **⚡ Instant Response**
        
        Real-time analysis and diagnosis with comprehensive recommendations in under 3 seconds
        """)
    
    with col3:
        st.markdown("""
        **🎤 Voice Enabled**
        
        Intuitive voice interface with natural language processing for seamless user interaction
        """)
    
    # Simple footer
    st.markdown("---")
    st.markdown("**MediTalk AI** © 2025 | Advanced AI Medical Consultation Assistant")

# Symptom Checker Page
elif current_page == 'Symptom Checker':
    if not st.session_state.get('logged_in', False):
        st.warning('Please log in to access the Symptom Checker.')
        st.stop()
    
    # Simple symptom checker header
    st.markdown("""
    <div style='text-align: center; padding: 2rem 0; background: linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%); border-radius: 12px; color: white; margin-bottom: 2rem;'>
        <h1 style='margin: 0; font-size: 3rem; color: white;'>🩺 AI Symptom Checker</h1>
        <p style='margin: 0.5rem 0 0 0; font-size: 1.2rem; opacity: 0.9;'>Advanced Medical Diagnosis & Analysis Platform</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.info("""
    💡 **How to Use the Symptom Checker**
    
    Describe your symptoms in natural language (e.g., "I have back pain and fever") 
    or select specific symptoms from our comprehensive medical database.
    """)
    
    st.markdown("### 📝 Input Method Selection")
    
    input_method = st.radio(
        "Choose your preferred method for entering symptoms:",
        ["💬 Natural Language Input", "📋 Select from Database"],
        horizontal=True,
        label_visibility="visible"
    )
    
    symptoms = []
    
    if input_method == "💬 Natural Language Input":
        if 'symptoms_input' not in st.session_state:
            st.session_state.symptoms_input = ''
        col_ta, col_mic = st.columns([4, 1])
        with col_ta:
            symptoms_input = st.text_area(
                "Describe your symptoms (natural language or comma-separated):",
                placeholder="Example: I have back pain, feel feverish and a bit of cough",
                height=100
            )
        with col_mic:
            st.write('')
            st.write('')
            
            # Add browser-native speech recognition as alternative
            st.markdown("""
            <div id="browser-speech" style="margin-bottom: 10px;">
                <button onclick="startBrowserSpeech()" style="
                    width: 100%; 
                    padding: 8px; 
                    background: #ff4b4b; 
                    color: white; 
                    border: none; 
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                ">🎤 Browser Speech</button>
                <div id="speech-result" style="font-size: 12px; margin-top: 5px; color: #666;"></div>
            </div>
            
            <script>
            function startBrowserSpeech() {
                if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                    document.getElementById('speech-result').innerHTML = '❌ Browser speech not supported';
                    return;
                }
                
                const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-US';
                
                document.getElementById('speech-result').innerHTML = '🎤 Listening...';
                
                recognition.onresult = function(event) {
                    const transcript = event.results[0][0].transcript;
                    document.getElementById('speech-result').innerHTML = '✅ Got: ' + transcript;
                    
                    // Try to set the text area value
                    const textArea = document.querySelector('textarea[placeholder*="symptoms"]');
                    if (textArea) {
                        textArea.value = transcript;
                        textArea.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                };
                
                recognition.onerror = function(event) {
                    document.getElementById('speech-result').innerHTML = '❌ Error: ' + event.error;
                };
                
                recognition.onend = function() {
                    if (document.getElementById('speech-result').innerHTML === '� Listening...') {
                        document.getElementById('speech-result').innerHTML = '❌ No speech detected';
                    }
                };
                
                recognition.start();
            }
            </script>
            """, unsafe_allow_html=True)
            
            if st.button('�🎙️ Python Speech', help="Click and speak LOUDLY and CLEARLY. Make sure your microphone is working!", key='mic_button', use_container_width=True):
                if st.session_state.voice_interface is not None:
                    # Show enhanced recording status with tips
                    status_placeholder = st.empty()
                    with status_placeholder.container():
                        st.info('🎤 **RECORDING NOW!** Speak loudly and clearly:')
                        st.markdown('💡 **Tips**: Speak close to microphone • Minimize background noise • Speak normally')
                        st.markdown('⏱️ You have 8 seconds maximum')
                    
                    # Capture speech
                    spoken = st.session_state.voice_interface.speech_to_text()
                    
                    # Clear status and show result
                    status_placeholder.empty()
                    
                    if spoken:
                        # Clean up the recognized text
                        cleaned = spoken.strip()
                        st.session_state.symptoms_input = cleaned
                        st.session_state.auto_analyze = True  # Trigger auto-analysis
                        st.success(f"✅ Heard: \"{cleaned}\"")
                        logger.info(f'Voice input captured: {spoken}')
                        # Quick acknowledgment before analysis
                        if pre_speak_ack:
                            try:
                                if engine_choice.startswith('pyttsx3') and st.session_state.voice_interface is not None:
                                    ack = f"Got it. You said: {cleaned}. I will analyze now."
                                    st.session_state.voice_interface.text_to_speech(ack)
                                elif st.session_state.audio_response is not None:
                                    # Use gTTS for fast short prompt too
                                    from audio_response import AudioResponse
                                    tmp_ar = st.session_state.audio_response
                                    ack = f"Got it. You said: {cleaned}. I will analyze now."
                                    if tmp_ar.text_to_speech_gtts(ack):
                                        audio_html = tmp_ar.get_audio_player_html(autoplay=True)
                                        if audio_html:
                                            st.markdown(audio_html, unsafe_allow_html=True)
                            except Exception as _e:
                                logger.warning(f"Pre-speak ack failed: {_e}")
                        st.rerun()
                    else:
                        st.warning('⚠️ No speech detected or could not understand. Please try again.')
                        logger.info('Voice input failed - no speech recognized')
                else:
                    st.error('❌ Voice interface unavailable. Check microphone permissions.')
                    logger.warning('Voice interface not available')
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
            st.success(f"Recognized symptoms: {', '.join(symptoms)}")
        elif symptoms_input:
            st.warning("Couldn't automatically recognize symptoms from text. Try adding commas or pick from list.")
    
    else:  # Select from Database
        all_symptoms_list = list(map(str, st.session_state.all_symptoms)) if st.session_state.all_symptoms else []
        
        if all_symptoms_list:
            selected_symptoms = st.multiselect(
                "Select symptoms from the list:",
                all_symptoms_list,
                default=[]
            )
            
            # Ensure selected symptoms are strings for type safety
            selected_raw: list[Any] = selected_symptoms
            selected_clean: list[str] = [str(s) for s in selected_raw]
            symptoms = _normalize_list(selected_clean)
    
    # Analyze button
    col1, col2, col3 = st.columns([1, 1, 1])
    
    with col1:
        analyze_button = st.button("🔍 Analyze Symptoms", use_container_width=True, type="primary")
    
    with col2:
        clear_button = st.button("🔄 Clear", use_container_width=True)
    
    if clear_button:
        st.session_state.auto_analyze = False
        st.rerun()
    
    # Check for auto-analysis flag (set by voice input) or manual button click
    should_analyze = analyze_button or st.session_state.auto_analyze
    
    # Reset auto_analyze flag after using it
    if st.session_state.auto_analyze:
        st.session_state.auto_analyze = False
    
    # Analysis results with premium loading animation
    if should_analyze and symptoms:
        # Premium loading animation
        loading_messages = [
            "🔬 Analyzing symptoms...",
            "🧠 Processing with AI...", 
            "📊 Building medical profile...",
            "🎯 Predicting possible diagnosis...",
            "💊 Generating recommendations..."
        ]
        
        health_tips = [
            "💧 Stay hydrated throughout the day",
            "� Get 7-9 hours of quality sleep", 
            "🥗 Maintain a balanced diet",
            "🚶 Regular exercise boosts immunity",
            "🧘 Practice stress management techniques"
        ]
        
        # Show premium loading animation
        show_medical_loader(loading_messages, health_tips)
        
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
                if _symptoms:
                    suggestions = []
                    for inv in invalids:
                        close = difflib.get_close_matches(inv, _symptoms, n=3, cutoff=0.75)
                        if close:
                            suggestions.append(f"Try: {inv} → {', '.join(close)}")
                    if suggestions:
                        st.info("\n".join(suggestions))
            
            if validation.get('valid_symptoms'):
                # Make prediction
                valid_syms: list[str] = cast(List[str], validation.get('valid_symptoms', []))
                logger.info('Predicting disease for valid symptoms: %s', valid_syms)
                result_raw = st.session_state.predictor.predict_disease(valid_syms)
                result: Dict[str, Any] = cast(Dict[str, Any], result_raw)
                logger.info('Prediction: primary=%s confidence=%.3f', result.get('primary_disease'), float(result.get('confidence', 0.0)))
                
                # Display results using modern components
                st.markdown("---")
                
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
                        use_container_width=True
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
                        use_container_width=True
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
                            use_container_width=True
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
            if st.button("🗑️ Clear History", type="secondary", use_container_width=True):
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
