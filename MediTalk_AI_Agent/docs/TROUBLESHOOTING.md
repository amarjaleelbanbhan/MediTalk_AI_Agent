# MediTalk Troubleshooting Guide

Common issues and solutions for MediTalk AI Agent.

## Installation Issues

### Issue: Python Not Found

**Error:**
```
'python' is not recognized as an internal or external command
```

**Solution:**
1. Ensure Python is installed: https://www.python.org/downloads/
2. During installation, check "Add Python to PATH"
3. Restart your terminal/command prompt
4. Verify installation:
   ```bash
   python --version
   ```

### Issue: pip Not Found

**Error:**
```
'pip' is not recognized as an internal or external command
```

**Solution:**
1. Python 3.4+ includes pip by default
2. Try using `pip3` instead:
   ```bash
   pip3 install -r requirements.txt
   ```
3. Or use Python module syntax:
   ```bash
   python -m pip install -r requirements.txt
   ```

### Issue: Virtual Environment Creation Failed

**Error:**
```
Error: Command '[...] -m venv venv' failed with exit code 1
```

**Solution:**
1. Ensure venv module is installed:
   ```bash
   # Windows
   python -m pip install virtualenv
   virtualenv venv
   
   # macOS/Linux
   python3 -m pip install virtualenv
   virtualenv venv
   ```

2. Or use conda:
   ```bash
   conda create -n meditalk python=3.9
   conda activate meditalk
   ```

### Issue: Permission Denied During Installation

**Error:**
```
Permission denied: /usr/local/lib/python3.x/site-packages
```

**Solution:**
1. Use a virtual environment (recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. Or use sudo (not recommended):
   ```bash
   sudo pip install -r requirements.txt
   ```

---

## Model Training Issues

### Issue: Model Training Takes Too Long

**Symptoms:**
- Training process is very slow
- High CPU/Memory usage

**Solutions:**
1. Close other applications to free up resources
2. Reduce number of trees in Random Forest:
   ```python
   # In model_trainer.py
   self.model = RandomForestClassifier(
       n_estimators=50,  # Reduce from 100
       ...
   )
   ```

3. Use a machine with more RAM (8GB+ recommended)

### Issue: Out of Memory Error

**Error:**
```
MemoryError: Unable to allocate X.XX GiB for an array
```

**Solutions:**
1. Close other applications
2. Increase virtual memory/swap:
   ```bash
   # Linux
   sudo fallocate -l 4G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

3. Reduce batch size or dataset size

### Issue: Model Files Not Found After Training

**Error:**
```
FileNotFoundError: disease_model.pkl not found
```

**Solutions:**
1. Verify training completed successfully:
   ```bash
   python src/model_trainer.py
   ```

2. Check models directory exists:
   ```bash
   ls -la models/
   ```

3. Ensure all files are present:
   - `disease_model.pkl`
   - `label_encoder.pkl`
   - `symptoms_list.pkl`
   - `diseases_list.pkl`

---

## Application Runtime Issues

### Issue: Streamlit Port Already in Use

**Error:**
```
Address already in use: ('0.0.0.0', 8501)
```

**Solutions:**
1. Use a different port:
   ```bash
   streamlit run src/app.py --server.port 8502
   ```

2. Kill the process using the port:
   ```bash
   # Windows
   netstat -ano | findstr :8501
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -i :8501
   kill -9 <PID>
   ```

3. Wait a few seconds and try again

### Issue: Streamlit Not Starting

**Error:**
```
ModuleNotFoundError: No module named 'streamlit'
```

**Solutions:**
1. Install Streamlit:
   ```bash
   pip install streamlit
   ```

2. Ensure virtual environment is activated:
   ```bash
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. Verify installation:
   ```bash
   streamlit --version
   ```

### Issue: Flask API Server Not Starting

**Error:**
```
Address already in use: ('0.0.0.0', 5000)
```

**Solutions:**
1. Use a different port:
   ```bash
   # Edit api_server.py
   app.run(port=5001)
   ```

2. Kill the process using port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -i :5000
   kill -9 <PID>
   ```

---

## Prediction Issues

### Issue: Low Prediction Accuracy

**Symptoms:**
- Predictions don't match expected diseases
- Confidence scores are very low

**Causes:**
1. Symptoms not in training dataset
2. Unusual symptom combinations
3. Misspelled symptoms

**Solutions:**
1. Check symptom spelling:
   ```bash
   # Get list of valid symptoms
   curl http://localhost:5000/api/symptoms
   ```

2. Use symptoms from the database
3. Provide more specific symptoms
4. Always consult healthcare professional

### Issue: Unrecognized Symptoms

**Error:**
```
Unrecognized symptoms: unknown_symptom
```

**Solutions:**
1. Check valid symptoms:
   ```bash
   curl http://localhost:5000/api/symptoms
   ```

2. Use correct symptom names (with underscores):
   - `high_fever` (not "high fever")
   - `chest_pain` (not "chest pain")

3. Refer to the disease database for valid symptoms

### Issue: No Results Returned

**Symptoms:**
- Prediction returns empty results
- Error message appears

**Solutions:**
1. Ensure at least one valid symptom is provided
2. Check API response:
   ```bash
   curl -X POST http://localhost:5000/api/predict \
     -H "Content-Type: application/json" \
     -d '{"symptoms": ["high_fever"]}'
   ```

3. Check application logs for errors

---

## Voice Interface Issues

### Issue: Microphone Not Detected

**Error:**
```
MicrophoneIndexError: No microphone found
```

**Solutions:**
1. Check microphone is connected
2. Test microphone on system level
3. Grant microphone permissions to Python/application
4. Use USB microphone if built-in mic not working
5. Disable voice features and use text input instead

### Issue: Speech Recognition Not Working

**Error:**
```
RequestError: recognition request failed
```

**Causes:**
1. No internet connection (for Google Speech API)
2. API rate limit exceeded
3. Microphone not working

**Solutions:**
1. Check internet connection
2. Wait a few minutes and try again
3. Test microphone separately
4. Use text input instead of voice

### Issue: Text-to-Speech Not Working

**Error:**
```
pyttsx3 initialization failed
```

**Solutions:**
1. Install system dependencies:
   ```bash
   # macOS
   brew install espeak
   
   # Linux
   sudo apt-get install espeak
   
   # Windows - usually works out of the box
   ```

2. Reinstall pyttsx3:
   ```bash
   pip uninstall pyttsx3
   pip install pyttsx3
   ```

3. Check audio output is working

---

## API Issues

### Issue: API Connection Refused

**Error:**
```
ConnectionRefusedError: [Errno 111] Connection refused
```

**Solutions:**
1. Ensure API server is running:
   ```bash
   python src/api_server.py
   ```

2. Check correct port (default 5000):
   ```bash
   curl http://localhost:5000/api/health
   ```

3. Check firewall isn't blocking port 5000

### Issue: CORS Error

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Causes:**
1. API called from different domain
2. CORS not properly configured

**Solutions:**
1. CORS is enabled by default for all origins
2. For production, restrict CORS in `api_server.py`:
   ```python
   CORS(app, resources={
       r"/api/*": {"origins": ["https://yourdomain.com"]}
   })
   ```

### Issue: API Timeout

**Error:**
```
TimeoutError: Request timed out
```

**Solutions:**
1. Increase timeout:
   ```python
   # In api_server.py
   app.config['JSON_SORT_KEYS'] = False
   app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False
   ```

2. Check server performance
3. Reduce dataset size if needed

---

## Data Issues

### Issue: CSV Files Not Found

**Error:**
```
FileNotFoundError: data/dataset.csv
```

**Solutions:**
1. Verify data files exist:
   ```bash
   ls -la data/
   ```

2. Check file names match exactly:
   - `dataset.csv`
   - `symptom_Description.csv`
   - `symptom_precaution.csv`
   - `Symptom-severity.csv`

3. Ensure files are in `data/` directory

### Issue: Corrupted CSV Files

**Error:**
```
ParserError: Error tokenizing data
```

**Solutions:**
1. Verify file integrity
2. Check file encoding (should be UTF-8)
3. Redownload files from source
4. Check for missing columns

---

## Performance Issues

### Issue: Application Slow

**Symptoms:**
- Slow response times
- High CPU/Memory usage

**Solutions:**
1. Close other applications
2. Check system resources:
   ```bash
   # Linux
   top
   
   # Windows
   tasklist
   ```

3. Optimize model:
   - Reduce number of trees
   - Use simpler model
   - Cache predictions

4. Upgrade hardware (RAM, CPU)

### Issue: High Memory Usage

**Symptoms:**
- Application crashes
- System becomes unresponsive

**Solutions:**
1. Monitor memory:
   ```bash
   # Linux
   free -h
   
   # Windows
   tasklist /v
   ```

2. Reduce model size
3. Implement garbage collection
4. Use streaming for large datasets

---

## Deployment Issues

### Issue: Docker Build Fails

**Error:**
```
ERROR: failed to solve: process "/bin/sh -c pip install..." did not complete successfully
```

**Solutions:**
1. Update Docker:
   ```bash
   docker --version
   ```

2. Clear Docker cache:
   ```bash
   docker system prune -a
   ```

3. Check Dockerfile syntax
4. Verify all files are present

### Issue: Heroku Deployment Fails

**Error:**
```
remote: Build failed
```

**Solutions:**
1. Check Procfile syntax
2. Verify requirements.txt is complete
3. Check logs:
   ```bash
   heroku logs --tail
   ```

4. Ensure no large files in git

### Issue: Cloud Run Deployment Fails

**Error:**
```
Cloud Run error: Container failed to start
```

**Solutions:**
1. Check container logs
2. Verify port is 8080 (Cloud Run requirement)
3. Check memory allocation
4. Verify all dependencies installed

---

## Getting Help

### Debug Mode

Enable debug logging:

```python
# In app.py or api_server.py
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Check Logs

```bash
# View Streamlit logs
streamlit run src/app.py --logger.level=debug

# View Flask logs
export FLASK_ENV=development
python src/api_server.py
```

### Test Individual Components

```python
# Test data processor
python src/data_processor.py

# Test disease predictor
python src/disease_predictor.py

# Test voice interface
python src/voice_interface.py
```

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `ModuleNotFoundError` | Package not installed | Run `pip install -r requirements.txt` |
| `FileNotFoundError` | File missing | Check file path and existence |
| `PermissionError` | Access denied | Check file permissions or use sudo |
| `MemoryError` | Out of RAM | Close apps or increase swap |
| `ConnectionError` | Network issue | Check internet connection |
| `TimeoutError` | Request too slow | Increase timeout or optimize code |

---

## Contact Support

For additional help:
1. Check project documentation
2. Review API documentation
3. Check GitHub issues (if applicable)
4. Contact development team

---

**Last Updated**: November 2025
