# MediTalk - Quick Start Guide

Get MediTalk running in 5 minutes!

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- 4GB RAM minimum
- 500MB disk space

## Installation & Setup

### 1. Extract the Project

```bash
unzip MediTalk_AI_Agent.zip
cd MediTalk_AI_Agent
```

### 2. Create Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Train the Model (One-time setup)

```bash
cd src
python model_trainer.py
cd ..
```

This will take 2-5 minutes depending on your system.

### 5. Run the Application

```bash
streamlit run src/app.py
```

The application will open automatically in your browser at `http://localhost:8501`

## Usage

### Web Interface

1. **Home Tab**: View overview and statistics
2. **Symptom Checker Tab**: 
   - Enter symptoms (comma-separated)
   - Click "Analyze Symptoms"
   - View disease prediction and recommendations
3. **Disease Database Tab**: Browse all diseases
4. **About Tab**: Learn more about the project

### Example Symptoms

Try these symptom combinations:

- `high_fever, cough, fatigue` → Bronchial Asthma
- `headache, chest_pain, dizziness` → Hypertension
- `itching, skin_rash, nodal_skin_eruptions` → Fungal Infection
- `vomiting, diarrhoea, dehydration` → Gastroenteritis

## API Usage (Optional)

Run the API server in a separate terminal:

```bash
python src/api_server.py
```

Test with curl:

```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"symptoms": ["high_fever", "cough"]}'
```

## Troubleshooting

### Model not found?
```bash
cd src
python model_trainer.py
cd ..
```

### Port 8501 already in use?
```bash
streamlit run src/app.py --server.port 8502
```

### Virtual environment not activating?
- **Windows**: Try `venv\Scripts\activate.bat`
- **macOS/Linux**: Try `source venv/bin/activate`

## Next Steps

- Read `README.md` for detailed documentation
- Check `docs/DEPLOYMENT_GUIDE.md` for deployment options
- Review `docs/API_GUIDE.md` for API details

## Important Disclaimer

⚠️ This tool is for **educational purposes only**. Always consult with a healthcare professional for proper medical diagnosis and treatment.

---

**Enjoy using MediTalk!** 🏥
