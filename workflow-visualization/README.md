# MediTalk AI Agent - Data Science Workflow Visualization

An interactive web application that visualizes the complete data science workflow for medical disease prediction, featuring a symptom-based decision tree and comprehensive analysis pipeline.

**Contributors**: 
- **Azhar Ali Dayo** - [@AzharDayo](https://github.com/AzharDayo) - azharalidayo10@gmail.com
- **Amar Jaleel Banbhan** - [@amarjaleelbanbhan](https://github.com/amarjaleelbanbhan)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Disclaimer](#disclaimer)
- [Team](#team)

## 🎯 Overview

This project demonstrates a complete data science workflow for a medical diagnosis system, from data collection through model deployment. It features interactive visualizations and animations to help understand each step of the machine learning pipeline.

### Key Highlights

- **Interactive Visualizations**: Real-time charts and animations for each workflow step
- **Symptom-Based Decision Tree**: Visual representation of diagnostic logic
- **Patient Case Studies**: 5 real-world scenarios with step-by-step diagnosis
- **10 Disease Classifications**: Comprehensive disease prediction system
- **Responsive Design**: Works seamlessly on all devices
- **Educational Focus**: Perfect for learning data science concepts

## ✨ Features

### 📊 Interactive Workflow Stages
- **Exploratory Data Analysis (EDA)**: Interactive charts showing symptom distributions and correlations
- **Data Cleaning**: Animated visualization of data preprocessing steps
- **Feature Engineering**: Dynamic representation of feature creation and selection
- **Model Training**: Visual Random Forest algorithm training process
- **Decision Tree Flow**: Interactive symptom-based decision tree with real-time path traversal

### 🏥 Medical Decision System
- **10 Disease Classifications**: Malaria, Measles, Flu, Common Cold, Dengue, Viral Fever, Arthritis, Sprain, Migraine, and Healthy
- **5 Patient Case Studies**: Real-world symptom scenarios with step-by-step diagnosis
- **Interactive Tree Navigation**: Visual YES/NO decision paths
- **Real-time Predictions**: Watch how symptoms lead to diagnoses

### 🎨 Modern UI/UX
- Fully responsive design (mobile, tablet, desktop)
- Smooth animations using Framer Motion
- Dark/Light theme support
- Interactive tooltips and notifications
- Beautiful gradient backgrounds

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: D3.js
- **Routing**: Wouter
- **UI Components**: Custom components with Radix UI primitives

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/amarjaleelbanbhan/MediTalk_AI_Agent.git
cd MediTalk_AI_Agent
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── AnimatedChart.tsx
│   ├── DataCleaning.tsx
│   ├── EDAVisualizer.tsx
│   ├── FeatureEngineering.tsx
│   ├── ModelTraining.tsx
│   ├── SymptomDecisionFlow.tsx
│   └── ui/              # UI component library
├── pages/               # Application pages
│   ├── Home.tsx
│   ├── EDA.tsx
│   ├── Cleaning.tsx
│   ├── FeatureEngineering.tsx
│   ├── Modeling.tsx
│   └── Predictions.tsx
├── contexts/            # React contexts
├── hooks/              # Custom React hooks
└── lib/                # Utility functions
```

## 🎓 Data Science Workflow Steps

### 1. **Problem Definition**
Understanding the medical diagnosis challenge and defining success metrics.

### 2. **Data Collection**
Gathering patient symptom data and disease information.

### 3. **Exploratory Data Analysis (EDA)**
- Analyzing symptom distributions
- Identifying correlations
- Visualizing data patterns

### 4. **Data Cleaning**
- Handling missing values
- Removing duplicates
- Standardizing data formats

### 5. **Feature Engineering**
- Creating symptom indicators
- Encoding categorical variables
- Feature scaling

### 6. **Model Selection & Training**
- Random Forest Classifier
- Cross-validation
- Hyperparameter tuning

### 7. **Model Evaluation**
- Accuracy metrics
- Confusion matrix
- Feature importance analysis

### 8. **Deployment & Predictions**
- Interactive decision tree
- Real-time symptom analysis
- Patient case studies

## 🏥 Decision Tree Diseases

The system can diagnose the following conditions:

1. **Malaria** - Fever, Cough, Chills, Body Ache
2. **Measles** - Fever, Rash, Red Eyes, Runny Nose
3. **Influenza (Flu)** - Fever, Cough, Fatigue, Body Ache
4. **Common Cold** - Cough, Runny Nose, Sore Throat
5. **Dengue** - Fever, Rash, Headache, Joint Pain
6. **Viral Fever** - Fever, Fatigue, Body Ache
7. **Arthritis** - Joint Pain, Muscle Pain, Stiffness
8. **Muscle Sprain** - Joint Pain, Muscle Pain
9. **Migraine** - Headache, Nausea, Light Sensitivity
10. **Healthy** - No significant symptoms

## 🎮 Interactive Features

- **Patient Case Selection**: Choose from 5 different patient scenarios
- **Decision Tree Traversal**: Watch the algorithm make decisions
- **YES/NO Path Highlighting**: Visual feedback on decision paths
- **Step-by-Step History**: Track the diagnostic journey
- **Responsive Design**: Works on all screen sizes

## 🖥️ System Requirements

### Minimum Requirements

- **OS**: Windows 10/11, macOS 10.14+, or Linux (Ubuntu 18.04+)
- **Python**: 3.8 or higher
- **RAM**: 4 GB minimum (8 GB recommended)
- **Disk Space**: 500 MB for installation and models
- **Internet**: Required for initial setup (optional for runtime)

### Software Dependencies

All dependencies are listed in `requirements.txt` and will be installed automatically.

## 📦 Installation

### Step 1: Clone or Extract the Project

```bash
# If you have a zip file, extract it first
unzip MediTalk_AI_Agent.zip
cd MediTalk_AI_Agent
```

### Step 2: Create a Virtual Environment (Recommended)

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- Streamlit (web interface)
- pandas & numpy (data processing)
- scikit-learn (machine learning)
- pyttsx3 & SpeechRecognition (voice processing)
- Flask & Flask-CORS (API server)
- And other required packages

### Step 4: Train the Model

Before running the application, you need to train the machine learning model:

```bash
cd src
python model_trainer.py
```

This process will:
1. Load and preprocess the medical datasets
2. Create feature vectors from symptoms
3. Train a Random Forest classifier
4. Save the trained model to the `models/` directory
5. Display model performance metrics

**Expected Output:**
```
Loading datasets...
Dataset shape: (4922, 18)
Unique diseases: 41

Preprocessing data...
Total unique symptoms: 131
Total unique diseases: 41

Preparing data for training...
Creating feature matrix...
Feature matrix shape: (4922, 131)

Training model...
[Parallel(n_jobs=-1)]: Using backend ThreadingBackend with 8 workers.

Model Performance:
Accuracy:  0.8523
Precision: 0.8456
Recall:    0.8523
F1 Score:  0.8489

Model saved to models
Training pipeline completed successfully!
```

## 🚀 Usage

### Option 1: Web Interface (Recommended)

Run the Streamlit web application:

```bash
streamlit run src/app.py
```

The application will open in your default browser at `http://localhost:8501`

**Features:**
- **Home**: Overview and statistics
- **Symptom Checker**: Input symptoms and get predictions
- **Disease Database**: Browse all diseases and their information
- **About**: Project information and disclaimer

### Option 2: REST API Server

Run the Flask API server:

```bash
python src/api_server.py
```

The API will be available at `http://localhost:5000`

**Example API Call:**
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"symptoms": ["high_fever", "cough", "fatigue"]}'
```

### Option 3: Command Line Interface

Run the voice interface directly:

```bash
python src/voice_interface.py
```

Or use the disease predictor programmatically:

```python
from disease_predictor import DiseasePredictor

# Initialize predictor
predictor = DiseasePredictor('models', 'data')

# Make prediction
result = predictor.predict_disease(['high_fever', 'cough', 'fatigue'])

print(f"Disease: {result['primary_disease']}")
print(f"Confidence: {result['confidence']:.2%}")
print(f"Description: {result['description']}")
print(f"Precautions: {', '.join(result['precautions'])}")
```

## 📡 API Documentation

### Base URL
```
http://localhost:5000
```

### Endpoints

#### 1. Health Check
```
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "MediTalk API",
  "version": "1.0.0"
}
```

#### 2. Predict Disease
```
POST /api/predict
```

**Request Body:**
```json
{
  "symptoms": ["high_fever", "cough", "fatigue"]
}
```

**Response:**
```json
{
  "primary_disease": "Bronchial Asthma",
  "confidence": 0.85,
  "description": "Bronchial asthma is a medical condition...",
  "precautions": ["switch to loose clothing", "take deep breaths", ...],
  "alternative_diseases": ["Pneumonia", "Common Cold"],
  "alternative_probabilities": [0.12, 0.03],
  "input_symptoms": ["high_fever", "cough", "fatigue"],
  "recognized_symptoms": ["high_fever", "cough", "fatigue"]
}
```

#### 3. Validate Symptoms
```
POST /api/validate-symptoms
```

**Request Body:**
```json
{
  "symptoms": ["high_fever", "unknown_symptom"]
}
```

**Response:**
```json
{
  "valid_symptoms": ["high_fever"],
  "invalid_symptoms": ["unknown_symptom"],
  "all_valid": false
}
```

#### 4. Get All Symptoms
```
GET /api/symptoms
```

**Response:**
```json
{
  "symptoms": ["high_fever", "cough", "fatigue", ...]
}
```

#### 5. Get All Diseases
```
GET /api/diseases
```

**Response:**
```json
{
  "diseases": ["Bronchial Asthma", "Pneumonia", "Common Cold", ...]
}
```

#### 6. Get Disease Information
```
GET /api/disease/<disease_name>
```

**Response:**
```json
{
  "disease": "Bronchial Asthma",
  "description": "Bronchial asthma is a medical condition...",
  "precautions": ["switch to loose clothing", "take deep breaths", ...]
}
```

#### 7. Get Statistics
```
GET /api/stats
```

**Response:**
```json
{
  "total_diseases": 41,
  "total_symptoms": 131,
  "model_type": "Random Forest Classifier",
  "framework": "scikit-learn"
}
```

## 🌐 Deployment

### Local Deployment

The application is ready to run on your local machine:

1. **Install dependencies**: `pip install -r requirements.txt`
2. **Train model**: `python src/model_trainer.py`
3. **Run web app**: `streamlit run src/app.py`
4. **Access**: Open `http://localhost:8501` in your browser

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8501 5000

CMD ["streamlit", "run", "src/app.py", "--server.port=8501", "--server.address=0.0.0.0"]
```

Build and run:

```bash
docker build -t meditalk .
docker run -p 8501:8501 -p 5000:5000 meditalk
```

### Cloud Deployment (Heroku Example)

1. Create `Procfile`:
```
web: streamlit run src/app.py --server.port=$PORT --server.address=0.0.0.0
```

2. Deploy:
```bash
heroku create meditalk
git push heroku main
```

### Cloud Deployment (AWS/GCP/Azure)

1. **Containerize**: Use Docker as shown above
2. **Push to Registry**: Push Docker image to ECR/GCR/ACR
3. **Deploy**: Use ECS/Cloud Run/App Service
4. **Configure**: Set environment variables and resource limits

## 📁 Project Structure

```
MediTalk_AI_Agent/
├── data/                          # Medical datasets
│   ├── dataset.csv               # Disease-symptom mappings
│   ├── symptom_Description.csv   # Disease descriptions
│   ├── symptom_precaution.csv    # Precautions for diseases
│   └── Symptom-severity.csv      # Symptom severity weights
│
├── models/                        # Trained models (generated after training)
│   ├── disease_model.pkl         # Trained Random Forest model
│   ├── label_encoder.pkl         # Disease label encoder
│   ├── symptoms_list.pkl         # List of all symptoms
│   └── diseases_list.pkl         # List of all diseases
│
├── src/                          # Source code
│   ├── app.py                   # Streamlit web application
│   ├── api_server.py            # Flask REST API server
│   ├── data_processor.py        # Data loading and preprocessing
│   ├── disease_predictor.py     # Disease prediction logic
│   ├── model_trainer.py         # Model training script
│   └── voice_interface.py       # Voice interface (STT/TTS)
│
├── docs/                         # Documentation
│   ├── API_GUIDE.md             # Detailed API documentation
│   ├── DEPLOYMENT_GUIDE.md      # Deployment instructions
│   └── TROUBLESHOOTING.md       # Troubleshooting guide
│
├── tests/                        # Unit tests
│   └── test_predictor.py        # Tests for disease predictor
│
├── requirements.txt              # Python dependencies
├── README.md                     # This file
└── .env.example                 # Environment variables template
```

## 🔧 Troubleshooting

### Issue: Model Not Found

**Error**: `FileNotFoundError: disease_model.pkl not found`

**Solution**:
1. Ensure you've run `python src/model_trainer.py`
2. Check that the `models/` directory exists
3. Verify all model files are present:
   - `disease_model.pkl`
   - `label_encoder.pkl`
   - `symptoms_list.pkl`
   - `diseases_list.pkl`

### Issue: Streamlit Port Already in Use

**Error**: `Address already in use`

**Solution**:
```bash
# Use a different port
streamlit run src/app.py --server.port 8502
```

### Issue: Voice Interface Not Working

**Error**: `pyttsx3 initialization failed` or `microphone not detected`

**Solution**:
1. **For text-to-speech**: Install system dependencies:
   - **Windows**: Usually works out of the box
   - **macOS**: May require `brew install espeak`
   - **Linux**: `sudo apt-get install espeak`

2. **For speech-to-text**: Ensure microphone is connected and working

3. **Alternative**: Use the web interface which doesn't require voice

### Issue: Low Prediction Accuracy

**Possible Causes**:
- Symptoms not in the training dataset
- Unusual symptom combinations
- Multiple diseases with similar symptoms

**Solutions**:
1. Verify symptoms are correctly spelled
2. Use symptoms from the disease database
3. Provide more specific symptoms
4. Always consult a healthcare professional

### Issue: Memory Error During Training

**Error**: `MemoryError` or `Out of memory`

**Solution**:
1. Close other applications
2. Use a machine with more RAM
3. Reduce batch size in `model_trainer.py`

## ⚠️ Disclaimer

**IMPORTANT**: This application is for **educational and informational purposes only**. It should NOT be used as a substitute for professional medical advice, diagnosis, or treatment.

- This tool provides preliminary diagnosis based on symptom analysis
- Results are not guaranteed to be accurate
- Always consult with a qualified healthcare professional for proper diagnosis and treatment
- In case of medical emergencies, call emergency services immediately
- The developers are not responsible for any health decisions made based on this tool

## 👥 Team

- **Azhar Ali** (023-23-0314)
- **Amar Jaleel** (023-23-0362)
- **Hariz Zafar** (023-23-0439)

## 📚 Technologies Used

- **Machine Learning**: scikit-learn (Random Forest Classifier)
- **Frontend**: Streamlit
- **Backend**: Flask
- **Data Processing**: Pandas, NumPy
- **Voice Processing**: pyttsx3, SpeechRecognition
- **Database**: CSV-based (SQLite optional)

## 🚀 Future Enhancements

- Multilingual support (Spanish, Hindi, Arabic, etc.)
- Telemedicine integration with real doctors
- Enhanced medical dataset with rare diseases
- Mobile app development (iOS/Android)
- Real-time doctor consultation
- Symptom severity assessment
- Patient history tracking
- Integration with electronic health records (EHR)

## 📞 Support

For issues, questions, or suggestions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check the logs in the console output
4. Refer to the project documentation in `docs/` folder

## 📄 License

This project is provided as-is for educational purposes.

---

**Last Updated**: November 2024
**Version**: 1.0.0
