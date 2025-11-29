# 🎯 MediTalk AI - Quick Reference Guide

## ⚡ Quick Start (3 Steps)

### Step 1: Launch Application
```powershell
cd U:\Semester_5\DS\Project\MediTalk_AI_Agent\MediTalk_AI_Agent
python -m streamlit run src/app_final.py --server.port 8550
```

### Step 2: Open Browser
```
http://localhost:8550
```

### Step 3: Login
```
Username: admin
Password: meditalk123
```

---

## 📋 Main Features

### 1️⃣ Dashboard
- View system statistics
- Recent activity
- Quick actions

### 2️⃣ Symptom Analysis
**Three Input Methods:**
- **Natural Language**: Type symptoms in plain English
- **Database Selection**: Select from 132 symptoms
- **Voice Input**: Speak your symptoms (optional)

**Complete Workflow:**
1. Enter symptoms → 2. Click "Analyze" → 3. View results → 4. Export reports

### 3️⃣ Disease Database
- Search 41 diseases
- View descriptions
- Check precautions

### 4️⃣ Medical History
- View all consultations
- Export history
- Track progress

### 5️⃣ Model Performance
- Accuracy: 85.2%
- Technical specs
- Training metrics

### 6️⃣ Settings
- Adjust confidence threshold (5%-50%)
- Toggle audio features
- Clear cache

### 7️⃣ About
- Project information
- Team details
- Medical disclaimer

---

## 🎨 Interface Guide

### Navigation
**Sidebar Menu** (left side):
- Blue gradient background
- Click any page to navigate
- Active page highlighted

### Page Layout
**Header**: Page title and description
**Content Area**: Main functionality
**Footer**: Credits and version info

---

## 💡 Usage Tips

### For Best Results:
1. **Be Specific**: Use medical terminology when possible
2. **Multiple Symptoms**: Add 3-5 symptoms for accuracy
3. **Check Alternatives**: Review all suggested diagnoses
4. **Adjust Threshold**: Lower for more results (Settings page)
5. **Save History**: Auto-saved after each analysis

### Common Workflows:

**Quick Analysis:**
```
Dashboard → Symptom Analysis → Natural Language → Type symptoms → Analyze → View results
```

**Voice Analysis:**
```
Dashboard → Symptom Analysis → Voice Input → Start Recording → Speak → Analyze
```

**Browse Diseases:**
```
Dashboard → Disease Database → Search → Select disease → View info
```

**Review History:**
```
Dashboard → Medical History → Expand consultation → View details
```

---

## 🔧 Troubleshooting

### Port Already in Use
```powershell
# Use different port
python -m streamlit run src/app_final.py --server.port 8552
```

### Model Not Found
```powershell
# Train model first
python src/model_trainer.py
```

### Login Issues
- Check credentials: admin / meditalk123
- Case sensitive
- No spaces

### Voice Not Working
```powershell
# Install optional dependencies
pip install pyttsx3 SpeechRecognition
```

### Low Confidence Results
1. Go to Settings
2. Lower confidence threshold to 10%
3. Try again

---

## 📤 Export Options

### Available Formats:
- **JSON**: Machine-readable data
- **Text**: Human-readable report
- **PDF**: Professional medical report

### How to Export:
1. Complete analysis
2. Scroll to "Export Results"
3. Click desired format
4. File downloads automatically

---

## 🔐 Security

### Authentication:
- Required for all features
- Session-based
- Logout button in sidebar

### Data Privacy:
- Local processing only
- No external API calls
- In-memory storage

---

## 📊 System Requirements

### Minimum:
- Python 3.8+
- 4GB RAM
- Windows/Linux/Mac

### Required Packages:
- streamlit
- pandas
- numpy
- scikit-learn
- joblib

### Optional:
- pyttsx3 (voice output)
- SpeechRecognition (voice input)
- reportlab (PDF export)

---

## 🎯 Key Shortcuts

### Navigation:
- **Dashboard**: System overview
- **Ctrl + R**: Refresh page
- **F5**: Reload application

### Analysis:
- **Enter**: Submit form
- **Esc**: Clear selection
- **Tab**: Navigate fields

---

## 📞 Support

### Issues?
1. Check `logs/meditalk.log`
2. Review `PRODUCTION_GUIDE.md`
3. Contact development team

### Development Team:
- Azhar Ali (023-23-0314)
- Amar Jaleel (023-23-0362)
- Hariz Zafar (023-23-0439)

---

## 🚀 Advanced Usage

### Custom Credentials:
```powershell
$env:MEDITALK_USER="your_username"
$env:MEDITALK_PASS="your_password"
python -m streamlit run src/app_final.py
```

### Background Mode:
```powershell
# Windows
Start-Process python -ArgumentList "-m streamlit run src/app_final.py" -WindowStyle Hidden
```

### Multiple Instances:
```powershell
# Instance 1
python -m streamlit run src/app_final.py --server.port 8551

# Instance 2
python -m streamlit run src/app_final.py --server.port 8552
```

---

## ⚠️ Important Notes

### Medical Disclaimer:
**This application is for educational purposes only.**
- Not for medical diagnosis
- Consult healthcare professionals
- Emergency? Call 911

### Data Handling:
- History stored in session
- Cleared on logout
- No persistent storage

### Performance:
- First prediction: ~3s
- Subsequent: <1s (cached)
- Voice input: 3-5s

---

## 📈 Version Information

**Current Version**: 2.0.0 (Production)
**Release Date**: November 2025
**Architecture**: MVC Pattern
**Framework**: Streamlit
**Model**: Random Forest (85.2% accuracy)

---

## 🎉 Quick Tips

✅ **Start with Dashboard** - Get familiar with system
✅ **Use Natural Language** - Easiest input method
✅ **Check Alternatives** - Review all suggestions
✅ **Export Reports** - Save important analyses
✅ **Adjust Settings** - Customize experience
✅ **Review History** - Track consultations
✅ **Read Precautions** - Important recommendations

---

## 🔗 Related Documentation

- **Complete Guide**: `PRODUCTION_GUIDE.md`
- **Improvements**: `IMPROVEMENTS.md`
- **Architecture**: `MODEL_ARCHITECTURE.md`
- **Troubleshooting**: `TROUBLESHOOTING.md`

---

**© 2025 MediTalk AI - Professional Medical Platform**
*For Educational Use Only*

**Current Session:** http://localhost:8550
**Status:** ✅ Running

---

**Happy Analyzing! 🏥**
