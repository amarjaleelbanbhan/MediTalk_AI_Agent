# MediTalk API Guide

Complete reference for the MediTalk REST API.

## Getting Started

### Start the API Server

```bash
python src/api_server.py
```

The API will be available at `http://localhost:5000`

### Base URL

```
http://localhost:5000
```

### Response Format

All responses are in JSON format.

**Success Response (200):**
```json
{
  "data": {...}
}
```

**Error Response (4xx/5xx):**
```json
{
  "error": "Error message"
}
```

---

## Endpoints

### 1. Health Check

Check if the API is running.

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

**Example:**
```bash
curl http://localhost:5000/api/health
```

---

### 2. Predict Disease

Get disease prediction based on symptoms.

```
POST /api/predict
```

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "symptoms": [
    "high_fever",
    "cough",
    "fatigue"
  ]
}
```

**Response:**
```json
{
  "primary_disease": "Bronchial Asthma",
  "confidence": 0.8523,
  "description": "Bronchial asthma is a medical condition which causes the airway path of the lungs to swell and narrow...",
  "precautions": [
    "switch to loose clothing",
    "take deep breaths",
    "get away from trigger",
    "seek help"
  ],
  "alternative_diseases": [
    "Pneumonia",
    "Common Cold"
  ],
  "alternative_probabilities": [
    0.0892,
    0.0585
  ],
  "input_symptoms": [
    "high_fever",
    "cough",
    "fatigue"
  ],
  "recognized_symptoms": [
    "high_fever",
    "cough",
    "fatigue"
  ]
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": ["high_fever", "cough", "fatigue"]
  }'
```

**Python Example:**
```python
import requests

url = "http://localhost:5000/api/predict"
data = {
    "symptoms": ["high_fever", "cough", "fatigue"]
}

response = requests.post(url, json=data)
result = response.json()

print(f"Disease: {result['primary_disease']}")
print(f"Confidence: {result['confidence']:.2%}")
print(f"Precautions: {', '.join(result['precautions'])}")
```

**JavaScript Example:**
```javascript
const url = "http://localhost:5000/api/predict";
const data = {
    symptoms: ["high_fever", "cough", "fatigue"]
};

fetch(url, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
})
.then(response => response.json())
.then(result => {
    console.log(`Disease: ${result.primary_disease}`);
    console.log(`Confidence: ${(result.confidence * 100).toFixed(2)}%`);
});
```

---

### 3. Validate Symptoms

Check if symptoms are recognized by the system.

```
POST /api/validate-symptoms
```

**Request Body:**
```json
{
  "symptoms": [
    "high_fever",
    "unknown_symptom",
    "cough"
  ]
}
```

**Response:**
```json
{
  "valid_symptoms": [
    "high_fever",
    "cough"
  ],
  "invalid_symptoms": [
    "unknown_symptom"
  ],
  "all_valid": false
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/validate-symptoms \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": ["high_fever", "unknown_symptom"]
  }'
```

---

### 4. Get All Symptoms

Retrieve list of all available symptoms.

```
GET /api/symptoms
```

**Response:**
```json
{
  "symptoms": [
    "high_fever",
    "cough",
    "fatigue",
    "headache",
    ...
  ]
}
```

**Example:**
```bash
curl http://localhost:5000/api/symptoms
```

**Pagination (Optional):**
```bash
curl "http://localhost:5000/api/symptoms?limit=10&offset=0"
```

---

### 5. Get All Diseases

Retrieve list of all available diseases.

```
GET /api/diseases
```

**Response:**
```json
{
  "diseases": [
    "Bronchial Asthma",
    "Pneumonia",
    "Common Cold",
    "Diabetes",
    ...
  ]
}
```

**Example:**
```bash
curl http://localhost:5000/api/diseases
```

---

### 6. Get Disease Information

Get detailed information about a specific disease.

```
GET /api/disease/<disease_name>
```

**Parameters:**
- `disease_name` (string, required): Name of the disease

**Response:**
```json
{
  "disease": "Bronchial Asthma",
  "description": "Bronchial asthma is a medical condition which causes the airway path of the lungs to swell and narrow...",
  "precautions": [
    "switch to loose clothing",
    "take deep breaths",
    "get away from trigger",
    "seek help"
  ]
}
```

**Example:**
```bash
curl "http://localhost:5000/api/disease/Bronchial%20Asthma"
```

**Python Example:**
```python
import requests
import urllib.parse

disease_name = "Bronchial Asthma"
encoded_name = urllib.parse.quote(disease_name)
url = f"http://localhost:5000/api/disease/{encoded_name}"

response = requests.get(url)
result = response.json()

print(f"Disease: {result['disease']}")
print(f"Description: {result['description']}")
print(f"Precautions: {', '.join(result['precautions'])}")
```

---

### 7. Get Statistics

Get statistics about the model and dataset.

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

**Example:**
```bash
curl http://localhost:5000/api/stats
```

---

## Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "error": "Missing symptoms in request"
}
```

**404 Not Found:**
```json
{
  "error": "Endpoint not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

### Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently, there is no rate limiting. For production deployment, consider implementing:

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/api/predict', methods=['POST'])
@limiter.limit("10 per minute")
def predict():
    ...
```

---

## Authentication

Currently, the API is open. For production, add authentication:

```python
from functools import wraps
import jwt

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return {'error': 'Token missing'}, 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = data['user']
        except:
            return {'error': 'Token invalid'}, 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

@app.route('/api/predict', methods=['POST'])
@token_required
def predict(current_user):
    ...
```

---

## CORS Configuration

The API has CORS enabled for all origins. For production, restrict it:

```python
from flask_cors import CORS

CORS(app, resources={
    r"/api/*": {
        "origins": ["https://yourdomain.com"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})
```

---

## Integration Examples

### Python Integration

```python
import requests

class MediTalkClient:
    def __init__(self, base_url="http://localhost:5000"):
        self.base_url = base_url
    
    def predict(self, symptoms):
        """Get disease prediction"""
        url = f"{self.base_url}/api/predict"
        response = requests.post(url, json={"symptoms": symptoms})
        return response.json()
    
    def get_disease_info(self, disease_name):
        """Get disease information"""
        url = f"{self.base_url}/api/disease/{disease_name}"
        response = requests.get(url)
        return response.json()
    
    def get_all_symptoms(self):
        """Get all symptoms"""
        url = f"{self.base_url}/api/symptoms"
        response = requests.get(url)
        return response.json()['symptoms']

# Usage
client = MediTalkClient()
result = client.predict(["high_fever", "cough"])
print(result)
```

### Node.js Integration

```javascript
const axios = require('axios');

class MediTalkClient {
    constructor(baseUrl = 'http://localhost:5000') {
        this.baseUrl = baseUrl;
    }
    
    async predict(symptoms) {
        const url = `${this.baseUrl}/api/predict`;
        const response = await axios.post(url, { symptoms });
        return response.data;
    }
    
    async getDiseaseInfo(diseaseName) {
        const url = `${this.baseUrl}/api/disease/${diseaseName}`;
        const response = await axios.get(url);
        return response.data;
    }
    
    async getAllSymptoms() {
        const url = `${this.baseUrl}/api/symptoms`;
        const response = await axios.get(url);
        return response.data.symptoms;
    }
}

// Usage
const client = new MediTalkClient();
client.predict(['high_fever', 'cough']).then(result => {
    console.log(result);
});
```

### React Integration

```javascript
import { useState, useEffect } from 'react';

function DiseasePredictor() {
    const [symptoms, setSymptoms] = useState([]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const handlePredict = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symptoms })
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };
    
    return (
        <div>
            <input
                type="text"
                placeholder="Enter symptoms (comma-separated)"
                onChange={(e) => setSymptoms(e.target.value.split(',').map(s => s.trim()))}
            />
            <button onClick={handlePredict} disabled={loading}>
                {loading ? 'Analyzing...' : 'Predict'}
            </button>
            {result && (
                <div>
                    <h2>{result.primary_disease}</h2>
                    <p>Confidence: {(result.confidence * 100).toFixed(2)}%</p>
                    <p>{result.description}</p>
                </div>
            )}
        </div>
    );
}

export default DiseasePredictor;
```

---

## Performance Tips

1. **Batch Requests**: Send multiple predictions in one request if possible
2. **Cache Results**: Cache disease information that doesn't change
3. **Use Compression**: Enable gzip compression for responses
4. **Connection Pooling**: Reuse connections for multiple requests

---

## Troubleshooting

### Connection Refused

```
Error: Connection refused at localhost:5000
```

**Solution**: Ensure the API server is running:
```bash
python src/api_server.py
```

### Invalid Symptom Format

```
Error: Symptoms must be a list
```

**Solution**: Ensure symptoms are sent as an array:
```json
{
  "symptoms": ["symptom1", "symptom2"]
}
```

### CORS Error

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution**: The API has CORS enabled. If using a different domain, update CORS settings in `api_server.py`.

---

## Best Practices

1. **Validate Input**: Always validate symptoms before sending
2. **Handle Errors**: Implement proper error handling in your client
3. **Cache Results**: Cache disease information for better performance
4. **Rate Limiting**: Implement rate limiting in production
5. **Logging**: Log all API calls for debugging
6. **Security**: Use HTTPS in production
7. **Documentation**: Keep API documentation updated

---

**Last Updated**: November 2025
