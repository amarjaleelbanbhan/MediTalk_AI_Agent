"""
Flask API Server for MediTalk AI Agent
Provides REST API endpoints for disease prediction and information
"""

import os
import sys
import json
from flask import Flask, request, jsonify
from werkzeug.exceptions import BadRequest
from flask_cors import CORS
from flask_restx import Api, Resource, fields, Namespace

# Add src directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from disease_predictor import DiseasePredictor
from input_validator import InputValidator, RateLimiter

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize Flask-RESTX API with documentation
api = Api(
    app,
    version='1.0.0',
    title='MediTalk AI API',
    description='AI-powered medical consultation API for disease prediction based on symptoms',
    doc='/api/docs',
    prefix='/api'
)

# Create namespace
ns = api.namespace('', description='Disease prediction operations')

# Define request/response models for Swagger documentation
symptom_input = api.model('SymptomInput', {
    'symptoms': fields.List(
        fields.String,
        required=True,
        description='List of symptoms (e.g., ["fever", "cough", "headache"])',
        example=["fever", "cough", "headache"]
    )
})

prediction_output = api.model('PredictionOutput', {
    'primary_disease': fields.String(description='Most likely disease'),
    'confidence': fields.Float(description='Confidence score (0-1)'),
    'description': fields.String(description='Disease description'),
    'precautions': fields.List(fields.String, description='Recommended precautions'),
    'alternative_diseases': fields.List(fields.String, description='Alternative diagnoses'),
    'alternative_probabilities': fields.List(fields.Float, description='Alternative disease probabilities')
})

health_output = api.model('HealthOutput', {
    'status': fields.String(description='Service status'),
    'service': fields.String(description='Service name'),
    'version': fields.String(description='API version')
})

symptoms_list_output = api.model('SymptomsListOutput', {
    'symptoms': fields.List(fields.String, description='All available symptoms'),
    'count': fields.Integer(description='Total number of symptoms')
})

diseases_list_output = api.model('DiseasesListOutput', {
    'diseases': fields.List(fields.String, description='All available diseases'),
    'count': fields.Integer(description='Total number of diseases')
})

error_output = api.model('ErrorOutput', {
    'error': fields.String(description='Error message'),
    'details': fields.String(description='Error details')
})

# Initialize rate limiter (100 requests per minute)
rate_limiter = RateLimiter(max_requests=100, window_seconds=60)

# Initialize disease predictor
try:
    predictor = DiseasePredictor(model_dir='models', data_dir='data')
except Exception as e:
    print(f"Error initializing predictor: {e}")
    predictor = None


def check_rate_limit():
    """Check rate limit for current request."""
    identifier = request.remote_addr or 'unknown'
    
    if not rate_limiter.is_allowed(identifier):
        return jsonify({'error': 'Rate limit exceeded', 'details': 'Too many requests. Please try again later.'}), 429
    return None

# API Resources

@ns.route('/health')
class Health(Resource):
    """Health check endpoint"""
    
    @ns.doc('health_check')
    @ns.marshal_with(health_output)
    def get(self):
        """Check API health status"""
        return {
            'status': 'healthy',
            'service': 'MediTalk API',
            'version': '1.0.0'
        }

@ns.route('/predict')
class Predict(Resource):
    """Disease prediction endpoint"""
    
    @ns.doc('predict_disease')
    @ns.response(200, 'Success', prediction_output)
    @ns.response(400, 'Invalid input', error_output)
    @ns.response(429, 'Rate limit exceeded', error_output)
    @ns.response(500, 'Internal server error', error_output)
    def post(self):
        """Predict disease based on provided symptoms"""
        # Check rate limit
        rl = check_rate_limit()
        if rl:
            return rl
        
        if not predictor:
            return jsonify({'error': 'Model not initialized'}), 500

        try:
            # Strict JSON parsing to catch invalid JSON
            try:
                data = request.get_json(force=True)
            except BadRequest:
                return jsonify({'error': 'Invalid JSON'}), 400

            # Validate payload structure
            try:
                InputValidator.validate_json_payload(data, ['symptoms'])
            except ValueError as e:
                return jsonify({'error': str(e)}), 400

            # Validate and sanitize symptoms
            try:
                symptoms = InputValidator.validate_symptoms_list(data['symptoms'])
            except ValueError as e:
                return jsonify({'error': str(e), 'details': 'Invalid symptoms format'}), 400

            # Allow empty symptoms list; predictor should handle gracefully
            result = predictor.predict_disease(symptoms)
            return jsonify(result), 200

        except Exception as e:
            return jsonify({'error': 'Prediction failed', 'details': str(e)}), 500


@ns.route('/symptoms')
class Symptoms(Resource):
    """Get all available symptoms"""
    
    @ns.doc('get_symptoms')
    @ns.marshal_with(symptoms_list_output)
    @ns.response(500, 'Internal server error', error_output)
    def get(self):
        """Retrieve list of all available symptoms"""
        if not predictor:
            api.abort(500, 'Model not initialized')
        
        try:
            symptoms = predictor.get_all_symptoms()
            return {
                'symptoms': symptoms,
                'count': len(symptoms)
            }
        except Exception as e:
            api.abort(500, str(e))

@ns.route('/diseases')
class Diseases(Resource):
    """Get all available diseases"""
    
    @ns.doc('get_diseases')
    @ns.marshal_with(diseases_list_output)
    @ns.response(500, 'Internal server error', error_output)
    def get(self):
        """Retrieve list of all available diseases"""
        if not predictor:
            api.abort(500, 'Model not initialized')
        
        try:
            diseases = predictor.get_all_diseases()
            return {
                'diseases': diseases,
                'count': len(diseases)
            }
        except Exception as e:
            api.abort(500, str(e))

# Legacy routes for backward compatibility
@app.route('/api/validate-symptoms', methods=['POST'])
def validate_symptoms():
    """
    Validate symptoms against known symptoms.
    
    Request body:
    {
        "symptoms": ["symptom1", "symptom2", ...]
    }
    
    Response:
    {
        "valid_symptoms": [...],
        "invalid_symptoms": [...],
        "all_valid": true/false
    }
    """
    if not predictor:
        return jsonify({'error': 'Model not initialized'}), 500
    
    try:
        data = request.get_json()
        
        if not data or 'symptoms' not in data:
            return jsonify({'error': 'Missing symptoms in request'}), 400
        
        symptoms = data.get('symptoms', [])
        
        if not isinstance(symptoms, list):
            return jsonify({'error': 'Symptoms must be a list'}), 400
        
        # Validate symptoms
        result = predictor.validate_symptoms(symptoms)
        
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/disease/<disease_name>', methods=['GET'])
def get_disease_info(disease_name):
    """
    Get detailed information about a specific disease.
    
    Response:
    {
        "disease": "...",
        "description": "...",
        "precautions": [...]
    }
    """
    if not predictor:
        return jsonify({'error': 'Model not initialized'}), 500
    
    try:
        description = predictor.processor.get_symptom_description(disease_name)
        precautions = predictor.processor.get_symptom_precautions(disease_name)
        
        return jsonify({
            'disease': disease_name,
            'description': description,
            'precautions': precautions
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get statistics about the model."""
    if not predictor:
        return jsonify({'error': 'Model not initialized'}), 500
    
    try:
        stats = {
            'total_diseases': len(predictor.get_all_diseases()),
            'total_symptoms': len(predictor.get_all_symptoms()),
            'model_type': 'Random Forest Classifier',
            'framework': 'scikit-learn'
        }
        
        return jsonify(stats), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Run Flask server
    print("Starting MediTalk API Server...")
    print("Server running on http://localhost:5000")
    print("API Documentation available at http://localhost:5000/api/health")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
