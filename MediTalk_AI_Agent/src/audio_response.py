"""
Audio Response System for MediTalk
Generates spoken responses for diagnosis results using gTTS
"""

import os
import base64
from gtts import gTTS
import logging

logger = logging.getLogger(__name__)

class AudioResponse:
    """Handles text-to-speech responses for diagnosis results"""
    
    def __init__(self, temp_dir: str = "temp"):
        """Initialize audio response system with temp directory"""
        self.temp_dir = temp_dir
        os.makedirs(self.temp_dir, exist_ok=True)
        logger.info(f"Audio response system initialized with temp dir: {self.temp_dir}")
    
    def generate_consultation_speech(self, result: dict, symptoms: list) -> str:
        """
        Generate natural spoken consultation response
        
        Args:
            result: Dictionary with disease prediction results
            symptoms: List of symptoms identified
            
        Returns:
            Formatted text for speech synthesis
        """
        disease = result.get('primary_disease', 'Unknown')
        confidence = result.get('confidence', 0.0)
        
        # Build natural consultation speech
        speech_parts = []
        
        # Greeting and symptom confirmation
        if symptoms:
            symptom_list = ", ".join(symptoms[:3])  # Limit to first 3 for brevity
            speech_parts.append(f"Hello. Based on the symptoms you described: {symptom_list}")
        else:
            speech_parts.append("Hello. Based on your symptoms")
        
        # Main diagnosis
        confidence_pct = int(confidence * 100)
        speech_parts.append(f"my preliminary prediction is {disease} with {confidence_pct} percent confidence.")
        
        # Alternative diagnoses
        alt_diseases = result.get('alternative_diseases', [])
        if alt_diseases and len(alt_diseases) > 0:
            top_alts = ", or ".join(alt_diseases[:2])
            speech_parts.append(f"Other possible conditions include {top_alts}.")
        
        # Description if available
        description = result.get('description', '')
        if description and len(description) < 200:
            speech_parts.append(description)
        
        # Quick precaution
        precautions = result.get('precautions', [])
        if precautions:
            first_precaution = precautions[0]
            speech_parts.append(f"My immediate advice is to {first_precaution}.")
        
        # Disclaimer
        speech_parts.append(
            "Please remember this is an AI prediction. "
            "You must consult a qualified medical professional for a definitive diagnosis and treatment plan."
        )
        
        return " ".join(speech_parts)
    
    def text_to_speech_gtts(self, text: str, filename: str = "response.mp3", lang: str = 'en') -> bool:
        """
        Convert text to speech using gTTS and save as MP3
        
        Args:
            text: Text to convert to speech
            filename: Output filename
            lang: Language code (default: 'en')
            
        Returns:
            True if successful, False otherwise
        """
        try:
            filepath = os.path.join(self.temp_dir, filename)
            tts = gTTS(text=text, lang=lang, slow=False)
            tts.save(filepath)
            logger.info(f"Speech generated successfully: {filepath}")
            return True
        except Exception as e:
            logger.error(f"Error generating speech with gTTS: {e}")
            return False
    
    def get_audio_player_html(self, filename: str = "response.mp3", autoplay: bool = True) -> str:
        """
        Generate HTML audio player with base64 encoded audio
        
        Args:
            filename: Audio file to play
            autoplay: Whether to autoplay the audio
            
        Returns:
            HTML string for audio player
        """
        try:
            filepath = os.path.join(self.temp_dir, filename)
            
            if not os.path.exists(filepath):
                logger.warning(f"Audio file not found: {filepath}")
                return ""
            
            with open(filepath, "rb") as f:
                data = f.read()
            
            b64 = base64.b64encode(data).decode()
            autoplay_attr = "autoplay" if autoplay else ""
            
            html = f'''
            <div style="margin: 20px 0;">
                <audio controls {autoplay_attr} style="width: 100%;">
                    <source src="data:audio/mp3;base64,{b64}" type="audio/mp3">
                    Your browser does not support the audio element.
                </audio>
            </div>
            '''
            
            return html
        except Exception as e:
            logger.error(f"Error creating audio player: {e}")
            return ""
    
    def cleanup_temp_files(self, max_files: int = 5):
        """
        Clean up old temporary audio files
        
        Args:
            max_files: Maximum number of files to keep
        """
        try:
            files = [
                os.path.join(self.temp_dir, f) 
                for f in os.listdir(self.temp_dir) 
                if f.endswith('.mp3')
            ]
            
            if len(files) > max_files:
                # Sort by modification time
                files.sort(key=lambda x: os.path.getmtime(x))
                # Remove oldest files
                for f in files[:-max_files]:
                    os.remove(f)
                    logger.info(f"Cleaned up old audio file: {f}")
        except Exception as e:
            logger.warning(f"Error cleaning up temp files: {e}")
