import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Deployment() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Deployment & Production</h1>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Overview</CardTitle>
              <CardDescription>Moving the model from development to production</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                The trained model can be deployed in multiple ways to serve predictions to end users. Each deployment option has different trade-offs in terms of scalability, cost, and complexity.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deployment Architecture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                The MediTalk system is deployed with multiple interfaces:
              </p>
              <div className="bg-gray-100 p-6 rounded-lg space-y-4">
                <div className="flex items-start gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                      1
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Web Interface</h4>
                    <p className="text-sm text-gray-600">Streamlit application for user-friendly symptom input and result display</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                      2
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">REST API</h4>
                    <p className="text-sm text-gray-600">Flask API for programmatic access and integration with other applications</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                      3
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Voice Interface</h4>
                    <p className="text-sm text-gray-600">Speech-to-text and text-to-speech for voice-based consultation</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
                      4
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">Command Line</h4>
                    <p className="text-sm text-gray-600">Direct Python interface for developers and system integration</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Local Deployment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Run the application locally on a developer machine or internal server:
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`# 1. Clone or extract the project
git clone <repository-url>
cd MediTalk_AI_Agent

# 2. Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run web interface
streamlit run src/app.py
# Access at: http://localhost:8501

# 5. Run API server (in another terminal)
python src/api_server.py
# Access at: http://localhost:5000`}</pre>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <h4 className="font-semibold text-gray-900 mb-2">System Requirements</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Python 3.8 or higher</li>
                  <li>• 4 GB RAM minimum (8 GB recommended)</li>
                  <li>• 500 MB disk space</li>
                  <li>• Windows 10+, macOS 10.14+, or Linux</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Docker Deployment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Containerize the application for consistent deployment across environments:
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{`# Build Docker image
docker build -t meditalk:latest .

# Run container
docker run -p 8501:8501 -p 5000:5000 meditalk:latest

# Or use docker-compose
docker-compose up -d

# Access services
# Web: http://localhost:8501
# API: http://localhost:5000`}</pre>
              </div>
              <div className="bg-green-50 p-4 rounded-lg mt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Docker Benefits</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✓ Consistent environment across machines</li>
                  <li>✓ Easy scaling with container orchestration</li>
                  <li>✓ Simplified dependency management</li>
                  <li>✓ Microservices architecture support</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cloud Platform Deployment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Deploy to major cloud platforms for scalability and reliability:
              </p>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">Heroku</h4>
                  <p className="text-sm text-gray-600">Free tier available, easy deployment, suitable for small to medium applications</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">AWS EC2</h4>
                  <p className="text-sm text-gray-600">Full control, scalable, suitable for production deployments with high traffic</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">Google Cloud Run</h4>
                  <p className="text-sm text-gray-600">Serverless, auto-scaling, pay-per-use pricing, ideal for variable workloads</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">Azure App Service</h4>
                  <p className="text-sm text-gray-600">Enterprise-grade, integrated with Microsoft ecosystem, suitable for large organizations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Production Setup Best Practices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Recommended configuration for production environments:
              </p>
              <div className="space-y-3">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Reverse Proxy</h4>
                  <p className="text-sm text-gray-600">Use Nginx or Apache to handle incoming requests, load balancing, and SSL termination</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">SSL/TLS Encryption</h4>
                  <p className="text-sm text-gray-600">Enable HTTPS with valid certificates to protect user data in transit</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Load Balancing</h4>
                  <p className="text-sm text-gray-600">Distribute traffic across multiple instances for high availability and fault tolerance</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Monitoring & Logging</h4>
                  <p className="text-sm text-gray-600">Implement comprehensive logging and monitoring for performance tracking and debugging</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Error Handling</h4>
                  <p className="text-sm text-gray-600">Implement graceful error handling and user-friendly error messages</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                The REST API provides the following endpoints for integration:
              </p>
              <div className="space-y-3">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">POST /api/predict</h4>
                  <p className="text-sm text-gray-600 mb-2">Make a disease prediction</p>
                  <p className="text-xs font-mono text-gray-700">Request: {"{ \"symptoms\": [\"high_fever\", \"cough\"] }"}</p>
                  <p className="text-xs font-mono text-gray-700">Response: {"{ \"disease\": \"Malaria\", \"confidence\": 0.95, \"alternatives\": [...] }"}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">GET /api/health</h4>
                  <p className="text-sm text-gray-600 mb-2">Health check endpoint</p>
                  <p className="text-xs font-mono text-gray-700">Response: {"{ \"status\": \"healthy\", \"model_loaded\": true }"}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">GET /api/diseases</h4>
                  <p className="text-sm text-gray-600 mb-2">Get list of supported diseases</p>
                  <p className="text-xs font-mono text-gray-700">Response: {"{ \"diseases\": [\"AIDS\", \"Acne\", ...] }"}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">GET /api/symptoms</h4>
                  <p className="text-sm text-gray-600 mb-2">Get list of supported symptoms</p>
                  <p className="text-xs font-mono text-gray-700">Response: {"{ \"symptoms\": [\"high_fever\", \"cough\", ...] }"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Considerations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Prediction Speed</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Single prediction: &lt;100ms</li>
                    <li>• Batch predictions: ~10ms per sample</li>
                    <li>• Model loading: ~2-3 seconds</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Resource Usage</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Model size: 3.0 MB</li>
                    <li>• Memory usage: ~500 MB</li>
                    <li>• CPU: Minimal (single core sufficient)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monitoring & Maintenance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Key aspects of production monitoring:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">→</span>
                  <span className="text-gray-700"><strong>Prediction Accuracy:</strong> Monitor model performance on real-world data</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">→</span>
                  <span className="text-gray-700"><strong>API Response Time:</strong> Track latency and identify bottlenecks</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">→</span>
                  <span className="text-gray-700"><strong>Error Rates:</strong> Monitor for prediction failures or invalid inputs</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">→</span>
                  <span className="text-gray-700"><strong>User Feedback:</strong> Collect feedback to identify model weaknesses</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">→</span>
                  <span className="text-gray-700"><strong>Model Retraining:</strong> Periodically retrain with new data to maintain accuracy</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compliance & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Data Privacy</h4>
                  <p className="text-sm text-gray-700">Do not store user health data. Process predictions in-memory and discard after response.</p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">HIPAA Compliance</h4>
                  <p className="text-sm text-gray-700">If handling protected health information, implement HIPAA-compliant infrastructure and audit logging.</p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Input Validation</h4>
                  <p className="text-sm text-gray-700">Validate all user inputs to prevent injection attacks and malicious requests.</p>
                </div>
                <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Legal Disclaimer</h4>
                  <p className="text-sm text-gray-700">Display clear disclaimers that predictions are not professional medical advice.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Future Enhancements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Potential improvements for production systems:
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Multilingual support (Spanish, Hindi, Arabic, Chinese)</li>
                <li>✓ Mobile applications (iOS and Android)</li>
                <li>✓ Telemedicine integration with real doctors</li>
                <li>✓ Patient history tracking and consultation records</li>
                <li>✓ EHR (Electronic Health Records) integration</li>
                <li>✓ Advanced analytics and symptom trend analysis</li>
                <li>✓ Personalized health recommendations</li>
                <li>✓ Real-time consultation with healthcare providers</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
