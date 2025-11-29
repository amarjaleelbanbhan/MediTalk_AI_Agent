"""
Input validation and sanitization utilities for MediTalk
"""
import re
from typing import List, Dict, Any


class InputValidator:
    """Validates and sanitizes user inputs."""
    
    # Maximum lengths for inputs
    MAX_SYMPTOM_LENGTH = 100
    MAX_SYMPTOMS_COUNT = 20
    MAX_TEXT_LENGTH = 1000
    
    # Allowed characters in symptom names
    SYMPTOM_PATTERN = re.compile(r'^[a-zA-Z0-9_\s\-]+$')
    
    @staticmethod
    def sanitize_symptom(symptom: str) -> str:
        """
        Sanitize a single symptom string.
        
        Args:
            symptom: Raw symptom string
            
        Returns:
            Sanitized symptom string
            
        Raises:
            ValueError: If symptom is invalid
        """
        if not symptom or not isinstance(symptom, str):
            raise ValueError("Symptom must be a non-empty string")
        
        # Trim whitespace
        symptom = symptom.strip()
        
        # Check length
        if len(symptom) > InputValidator.MAX_SYMPTOM_LENGTH:
            raise ValueError(f"Symptom exceeds maximum length of {InputValidator.MAX_SYMPTOM_LENGTH}")
        
        # Check for valid characters
        if not InputValidator.SYMPTOM_PATTERN.match(symptom):
            raise ValueError("Symptom contains invalid characters")
        
        # Normalize: lowercase and replace spaces with underscores
        symptom = symptom.lower().replace(' ', '_')
        
        # Remove multiple consecutive underscores
        symptom = re.sub(r'_+', '_', symptom)
        
        # Remove leading/trailing underscores
        symptom = symptom.strip('_')
        
        return symptom
    
    @staticmethod
    def validate_symptoms_list(symptoms: List[str]) -> List[str]:
        """
        Validate and sanitize a list of symptoms.
        
        Args:
            symptoms: List of symptom strings
            
        Returns:
            List of sanitized symptoms
            
        Raises:
            ValueError: If input is invalid
        """
        if not isinstance(symptoms, list):
            raise ValueError("Symptoms must be a list")
        
        if len(symptoms) > InputValidator.MAX_SYMPTOMS_COUNT:
            raise ValueError(f"Too many symptoms. Maximum is {InputValidator.MAX_SYMPTOMS_COUNT}")
        
        sanitized = []
        for symptom in symptoms:
            try:
                clean = InputValidator.sanitize_symptom(symptom)
                if clean:  # Only add non-empty
                    sanitized.append(clean)
            except ValueError:
                # Skip invalid symptoms
                continue
        
        # Remove duplicates while preserving order
        seen = set()
        unique = []
        for s in sanitized:
            if s not in seen:
                seen.add(s)
                unique.append(s)
        
        return unique
    
    @staticmethod
    def validate_json_payload(payload: Dict[str, Any], required_fields: List[str]) -> Dict[str, Any]:
        """
        Validate JSON payload structure.
        
        Args:
            payload: JSON payload dictionary
            required_fields: List of required field names
            
        Returns:
            Validated payload
            
        Raises:
            ValueError: If payload is invalid
        """
        if not isinstance(payload, dict):
            raise ValueError("Payload must be a dictionary")
        
        # Check required fields
        missing = [field for field in required_fields if field not in payload]
        if missing:
            raise ValueError(f"Missing required fields: {', '.join(missing)}")
        
        return payload
    
    @staticmethod
    def sanitize_text(text: str) -> str:
        """
        Sanitize general text input.
        
        Args:
            text: Raw text string
            
        Returns:
            Sanitized text
            
        Raises:
            ValueError: If text is invalid
        """
        if not isinstance(text, str):
            raise ValueError("Text must be a string")
        
        # Trim whitespace
        text = text.strip()
        
        # Check length
        if len(text) > InputValidator.MAX_TEXT_LENGTH:
            raise ValueError(f"Text exceeds maximum length of {InputValidator.MAX_TEXT_LENGTH}")
        
        # Remove potential XSS patterns (basic protection)
        text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.IGNORECASE | re.DOTALL)
        text = re.sub(r'javascript:', '', text, flags=re.IGNORECASE)
        text = re.sub(r'on\w+\s*=', '', text, flags=re.IGNORECASE)
        
        return text


class RateLimiter:
    """Simple in-memory rate limiter."""
    
    def __init__(self, max_requests: int = 100, window_seconds: int = 60):
        """
        Initialize rate limiter.
        
        Args:
            max_requests: Maximum requests per window
            window_seconds: Time window in seconds
        """
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, List[float]] = {}
    
    def is_allowed(self, identifier: str) -> bool:
        """
        Check if request is allowed.
        
        Args:
            identifier: Unique identifier (e.g., IP address)
            
        Returns:
            True if allowed, False if rate limit exceeded
        """
        import time
        
        current_time = time.time()
        
        # Get request history for this identifier
        if identifier not in self.requests:
            self.requests[identifier] = []
        
        # Remove old requests outside the window
        self.requests[identifier] = [
            req_time for req_time in self.requests[identifier]
            if current_time - req_time < self.window_seconds
        ]
        
        # Check if limit exceeded
        if len(self.requests[identifier]) >= self.max_requests:
            return False
        
        # Add current request
        self.requests[identifier].append(current_time)
        return True
    
    def cleanup(self):
        """Remove old entries to free memory."""
        import time
        current_time = time.time()
        
        for identifier in list(self.requests.keys()):
            self.requests[identifier] = [
                req_time for req_time in self.requests[identifier]
                if current_time - req_time < self.window_seconds
            ]
            
            # Remove if empty
            if not self.requests[identifier]:
                del self.requests[identifier]
