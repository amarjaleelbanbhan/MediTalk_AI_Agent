# MediTalk Deployment Guide

Complete guide for deploying MediTalk on various platforms and environments.

## Table of Contents

1. [Local Deployment](#local-deployment)
2. [Docker Deployment](#docker-deployment)
3. [Cloud Platforms](#cloud-platforms)
4. [Production Setup](#production-setup)
5. [Performance Optimization](#performance-optimization)
6. [Monitoring and Logging](#monitoring-and-logging)

---

## Local Deployment

### Windows

1. **Download Python**
   - Visit https://www.python.org/downloads/
   - Download Python 3.9 or higher
   - During installation, check "Add Python to PATH"

2. **Extract Project**
   ```bash
   # Extract MediTalk_AI_Agent.zip to desired location
   cd MediTalk_AI_Agent
   ```

3. **Create Virtual Environment**
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

4. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Train Model**
   ```bash
   cd src
   python model_trainer.py
   cd ..
   ```

6. **Run Application**
   ```bash
   # Option 1: Web Interface
   streamlit run src/app.py
   
   # Option 2: API Server
   python src/api_server.py
   ```

7. **Access Application**
   - Web: http://localhost:8501
   - API: http://localhost:5000

### macOS

1. **Install Python**
   ```bash
   # Using Homebrew
   brew install python3
   
   # Or download from https://www.python.org/downloads/
   ```

2. **Extract Project**
   ```bash
   unzip MediTalk_AI_Agent.zip
   cd MediTalk_AI_Agent
   ```

3. **Create Virtual Environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

4. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Install Voice Dependencies (Optional)**
   ```bash
   brew install espeak
   ```

6. **Train Model**
   ```bash
   cd src
   python3 model_trainer.py
   cd ..
   ```

7. **Run Application**
   ```bash
   streamlit run src/app.py
   ```

### Linux (Ubuntu/Debian)

1. **Install Python**
   ```bash
   sudo apt-get update
   sudo apt-get install python3 python3-pip python3-venv
   ```

2. **Install Voice Dependencies**
   ```bash
   sudo apt-get install espeak
   ```

3. **Extract Project**
   ```bash
   unzip MediTalk_AI_Agent.zip
   cd MediTalk_AI_Agent
   ```

4. **Create Virtual Environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

5. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

6. **Train Model**
   ```bash
   cd src
   python3 model_trainer.py
   cd ..
   ```

7. **Run Application**
   ```bash
   streamlit run src/app.py
   ```

---

## Docker Deployment

### Build Docker Image

1. **Create Dockerfile**
   ```dockerfile
   FROM python:3.9-slim
   
   # Set working directory
   WORKDIR /app
   
   # Install system dependencies
   RUN apt-get update && apt-get install -y \
       espeak \
       && rm -rf /var/lib/apt/lists/*
   
   # Copy requirements
   COPY requirements.txt .
   
   # Install Python dependencies
   RUN pip install --no-cache-dir -r requirements.txt
   
   # Copy application code
   COPY . .
   
   # Expose ports
   EXPOSE 8501 5000
   
   # Set environment variables
   ENV PYTHONUNBUFFERED=1
   
   # Run application
   CMD ["streamlit", "run", "src/app.py", "--server.port=8501", "--server.address=0.0.0.0"]
   ```

2. **Build Image**
   ```bash
   docker build -t meditalk:latest .
   ```

3. **Run Container**
   ```bash
   docker run -p 8501:8501 -p 5000:5000 meditalk:latest
   ```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  meditalk:
    build: .
    container_name: meditalk
    ports:
      - "8501:8501"
      - "5000:5000"
    environment:
      - PYTHONUNBUFFERED=1
    volumes:
      - ./data:/app/data
      - ./models:/app/models
    restart: unless-stopped
```

Run with Docker Compose:

```bash
docker-compose up -d
```

---

## Cloud Platforms

### Heroku Deployment

1. **Create Heroku Account**
   - Visit https://www.heroku.com
   - Sign up and install Heroku CLI

2. **Create Procfile**
   ```
   web: streamlit run src/app.py --server.port=$PORT --server.address=0.0.0.0
   ```

3. **Create .gitignore**
   ```
   venv/
   models/
   __pycache__/
   *.pyc
   .env
   ```

4. **Initialize Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

5. **Deploy to Heroku**
   ```bash
   heroku login
   heroku create meditalk
   git push heroku main
   ```

6. **Access Application**
   ```
   https://meditalk.herokuapp.com
   ```

### AWS Deployment (EC2)

1. **Launch EC2 Instance**
   - Choose Ubuntu 20.04 LTS
   - Instance type: t2.medium or larger
   - Configure security group to allow ports 8501 and 5000

2. **Connect to Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. **Install Dependencies**
   ```bash
   sudo apt-get update
   sudo apt-get install python3 python3-pip python3-venv espeak
   ```

4. **Deploy Application**
   ```bash
   git clone <your-repo-url>
   cd MediTalk_AI_Agent
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   cd src
   python3 model_trainer.py
   cd ..
   ```

5. **Run with Systemd**
   
   Create `/etc/systemd/system/meditalk.service`:
   ```ini
   [Unit]
   Description=MediTalk AI Agent
   After=network.target
   
   [Service]
   Type=simple
   User=ubuntu
   WorkingDirectory=/home/ubuntu/MediTalk_AI_Agent
   Environment="PATH=/home/ubuntu/MediTalk_AI_Agent/venv/bin"
   ExecStart=/home/ubuntu/MediTalk_AI_Agent/venv/bin/streamlit run src/app.py --server.port=8501 --server.address=0.0.0.0
   Restart=always
   
   [Install]
   WantedBy=multi-user.target
   ```
   
   Enable and start:
   ```bash
   sudo systemctl enable meditalk
   sudo systemctl start meditalk
   ```

6. **Configure Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:8501;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_set_header Host $host;
       }
   }
   ```

### Google Cloud Run

1. **Create GCP Project**
   - Visit https://console.cloud.google.com
   - Create new project

2. **Create Dockerfile** (as shown above)

3. **Build and Push**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/meditalk
   ```

4. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy meditalk \
     --image gcr.io/PROJECT_ID/meditalk \
     --platform managed \
     --region us-central1 \
     --memory 2Gi \
     --timeout 3600
   ```

### Azure Deployment

1. **Create Azure Account**
   - Visit https://azure.microsoft.com
   - Create new resource group

2. **Create App Service**
   ```bash
   az appservice plan create \
     --name meditalk-plan \
     --resource-group myResourceGroup \
     --sku B2 --is-linux
   
   az webapp create \
     --resource-group myResourceGroup \
     --plan meditalk-plan \
     --name meditalk
   ```

3. **Deploy Application**
   ```bash
   az webapp deployment source config-zip \
     --resource-group myResourceGroup \
     --name meditalk \
     --src meditalk.zip
   ```

---

## Production Setup

### Environment Variables

Create `.env` file:

```env
# Application Settings
APP_NAME=MediTalk
APP_ENV=production
DEBUG=False

# Server Settings
HOST=0.0.0.0
PORT=8501
API_PORT=5000

# Model Settings
MODEL_DIR=models
DATA_DIR=data

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/meditalk.log

# Security
SECRET_KEY=your-secret-key-here
```

### Reverse Proxy Setup (Nginx)

```nginx
upstream streamlit {
    server localhost:8501;
}

upstream api {
    server localhost:5000;
}

server {
    listen 80;
    server_name meditalk.example.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name meditalk.example.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/meditalk.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/meditalk.example.com/privkey.pem;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    
    # Web Interface
    location / {
        proxy_pass http://streamlit;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # API Endpoints
    location /api/ {
        proxy_pass http://api/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### SSL/TLS Certificate (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d meditalk.example.com
```

---

## Performance Optimization

### Model Caching

The application automatically caches the trained model in memory. For better performance:

1. **Increase Model Cache**
   - Edit `disease_predictor.py` to cache predictions
   - Use Redis for distributed caching

2. **Optimize Prediction**
   ```python
   # Use batch predictions
   predictions = predictor.model.predict_proba(feature_vectors)
   ```

### Database Optimization

For production, consider using SQLite or PostgreSQL:

```python
import sqlite3

conn = sqlite3.connect('meditalk.db')
cursor = conn.cursor()

# Cache symptom mappings
cursor.execute('''
    CREATE TABLE IF NOT EXISTS symptom_cache (
        symptom TEXT PRIMARY KEY,
        index INTEGER
    )
''')
```

### Load Balancing

For high traffic, use load balancing:

```nginx
upstream meditalk_backend {
    least_conn;
    server localhost:8501;
    server localhost:8502;
    server localhost:8503;
}
```

---

## Monitoring and Logging

### Application Logging

Create `logging_config.py`:

```python
import logging
import logging.handlers

def setup_logging(log_file='logs/meditalk.log'):
    logger = logging.getLogger('meditalk')
    logger.setLevel(logging.INFO)
    
    # File handler
    fh = logging.handlers.RotatingFileHandler(
        log_file,
        maxBytes=10485760,  # 10MB
        backupCount=5
    )
    
    # Console handler
    ch = logging.StreamHandler()
    
    # Formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    fh.setFormatter(formatter)
    ch.setFormatter(formatter)
    
    logger.addHandler(fh)
    logger.addHandler(ch)
    
    return logger
```

### Health Checks

Implement health check endpoint:

```python
@app.route('/health')
def health_check():
    return {
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'model_loaded': predictor.model is not None
    }
```

### Monitoring Tools

- **Prometheus**: Metrics collection
- **Grafana**: Visualization
- **ELK Stack**: Logging and analysis
- **Datadog**: APM and monitoring

---

## Troubleshooting Deployment

### Port Already in Use

```bash
# Find process using port
lsof -i :8501

# Kill process
kill -9 <PID>
```

### Memory Issues

```bash
# Monitor memory usage
watch -n 1 'free -h'

# Increase swap
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### SSL Certificate Issues

```bash
# Renew certificate
sudo certbot renew

# Check certificate expiry
sudo certbot certificates
```

---

## Backup and Recovery

### Backup Strategy

```bash
# Backup models and data
tar -czf meditalk_backup_$(date +%Y%m%d).tar.gz \
  models/ data/ src/

# Upload to cloud storage
aws s3 cp meditalk_backup_*.tar.gz s3://my-bucket/backups/
```

### Recovery

```bash
# Restore from backup
tar -xzf meditalk_backup_20240101.tar.gz
```

---

**Last Updated**: November 2025
