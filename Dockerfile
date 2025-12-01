FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1

# Install system dependencies (espeak optional, ffmpeg for audio if used)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    ffmpeg \
    espeak \
    libsndfile1 \
    curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps
COPY requirements.txt .
RUN python -m pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Ensure models directory exists (trainer will create files if missing)
RUN mkdir -p models

EXPOSE 8501 5000

# Simple healthcheck (checks API)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://127.0.0.1:5000/api/health || exit 1

# Use the start script (must be executable)
CMD ["./start.sh"]
