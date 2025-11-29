"""
Voice Interface Module for MediTalk AI Agent
Handles speech-to-text and text-to-speech conversion
"""

import sys
import logging
import pyttsx3
import speech_recognition as sr
from typing import Optional

# Configure logging
logger = logging.getLogger(__name__)

class VoiceInterface:
    def __init__(self):
        """Initialize voice interface components."""
        self.recognizer = sr.Recognizer()
        
        # Configure speech recognition for better accuracy
        # Use dynamic energy threshold initially, then adjust based on ambient noise
        self.recognizer.dynamic_energy_threshold = False
        # Start with moderate threshold - will be adjusted based on ambient noise
        self.recognizer.energy_threshold = 300
        # Increase pause threshold to allow natural pauses in speech
        self.recognizer.pause_threshold = 1.2
        
        # Initialize COM in current thread for pyttsx3 on Windows
        if sys.platform == 'win32':
            try:
                import pythoncom
                pythoncom.CoInitialize()
            except:
                pass
        
        self.tts_engine = pyttsx3.init()
        self.setup_tts()
    
    def setup_tts(self):
        """Configure text-to-speech engine."""
        try:
            # Set properties for better voice quality
            self.tts_engine.setProperty('rate', 150)  # Speed
            self.tts_engine.setProperty('volume', 0.9)  # Volume
            
            # Try to set a female voice if available (look by gender property)
            voices = self.tts_engine.getProperty('voices')
            if voices and len(voices) > 0:
                # Look for a female voice by checking gender or name
                female_voice = None
                for voice in voices:
                    # Check if voice has gender attribute
                    if hasattr(voice, 'gender') and 'female' in voice.gender.lower():
                        female_voice = voice
                        break
                    # Fallback: check name for common female voice indicators
                    elif hasattr(voice, 'name') and any(indicator in voice.name.lower() 
                        for indicator in ['zira', 'hazel', 'susan', 'female', 'woman']):
                        female_voice = voice
                        break
                
                # If we found a female voice, use it; otherwise use first available
                if female_voice:
                    self.tts_engine.setProperty('voice', female_voice.id)
                    logger.info(f"Using voice: {female_voice.name}")
                else:
                    # Use first voice as fallback
                    self.tts_engine.setProperty('voice', voices[0].id)
                    logger.info(f"Using voice: {voices[0].name}")
        except Exception as e:
            logger.warning(f"Could not configure TTS engine: {e}")
    
    def __del__(self):
        """Cleanup resources."""
        try:
            if hasattr(self, 'tts_engine'):
                self.tts_engine.stop()
            # Uninitialize COM on Windows
            if sys.platform == 'win32':
                try:
                    import pythoncom
                    pythoncom.CoUninitialize()
                except:
                    pass
        except:
            pass
    
    def speech_to_text(self, audio_source: Optional[str] = None) -> Optional[str]:
        """
        Convert speech to text using microphone or audio file.
        
        Args:
            audio_source (str): Path to audio file (optional). If None, uses microphone.
            
        Returns:
            str: Recognized text, or None if recognition failed
        """
        try:
            if audio_source:
                # Load from audio file
                with sr.AudioFile(audio_source) as source:
                    audio = self.recognizer.record(source)
            else:
                # Use microphone with enhanced sensitivity
                logger.info("🎤 Listening for speech input...")
                
                # Use more sensitive settings for better detection
                self.recognizer.energy_threshold = 100  # Lower threshold for quiet speech
                self.recognizer.dynamic_energy_threshold = True  # Auto-adjust
                self.recognizer.pause_threshold = 0.8  # Shorter pause detection
                
                with sr.Microphone() as source:
                    # Quick ambient noise adjustment
                    logger.info("📊 Calibrating microphone (quick)...")
                    self.recognizer.adjust_for_ambient_noise(source, duration=0.5)
                    
                    # Get calibrated value but keep it low for sensitivity
                    calibrated = self.recognizer.energy_threshold
                    optimal_threshold = max(calibrated * 1.5, 100)  # More sensitive multiplier
                    self.recognizer.energy_threshold = optimal_threshold
                    
                    logger.info(f"🎯 Ambient: {calibrated:.1f}, Threshold: {optimal_threshold:.1f}")
                    logger.info("🔊 Speak clearly and loudly now!")
                    
                    # Extended timeout for better user experience
                    audio = self.recognizer.listen(source, timeout=15, phrase_time_limit=30)
            
            # Try Google Speech Recognition (requires internet)
            try:
                text = self.recognizer.recognize_google(audio)
                logger.info(f"✓ Speech recognized: {text}")
                return text
            except sr.RequestError as e:
                logger.error(f"Speech recognition service error: {e}")
                logger.error("Check your internet connection. Google Speech API requires online access.")
                return None
            
        except sr.WaitTimeoutError:
            logger.warning("⏱️ Listening timed out - no speech detected within 15 seconds.")
            logger.info("Tip: Click the button and start speaking immediately.")
            return None
        except sr.UnknownValueError:
            logger.warning("❓ Could not understand the audio.")
            logger.info("Tip: Speak clearly and avoid background noise.")
            return None
        except OSError as e:
            logger.error(f"Microphone error: {e}")
            logger.error("Check that your microphone is connected and not used by another app.")
            return None
        except Exception as e:
            logger.error(f"Unexpected error during speech-to-text: {e}")
            return None
    
    def list_microphones(self) -> list:
        """
        List all available microphones on the system.
        
        Returns:
            list: List of tuples (index, name) for each microphone
        """
        try:
            mic_list = []
            logger.info("Available microphones:")
            for index, name in enumerate(sr.Microphone.list_microphone_names()):
                mic_list.append((index, name))
                logger.info(f"  [{index}] {name}")
            return mic_list
        except Exception as e:
            logger.error(f"Error listing microphones: {e}")
            return []
    
    def speech_to_text_with_device(self, device_index: Optional[int] = None) -> Optional[str]:
        """
        Convert speech to text using a specific microphone device.
        
        Args:
            device_index (int): Microphone device index from list_microphones()
            
        Returns:
            str: Recognized text, or None if recognition failed
        """
        try:
            logger.info(f"🎤 Listening on device {device_index if device_index is not None else 'default'}...")
            with sr.Microphone(device_index=device_index) as source:
                # Adjust for ambient noise
                self.recognizer.adjust_for_ambient_noise(source, duration=1)
                # Re-apply our static threshold
                self.recognizer.energy_threshold = 4000
                # Listen
                audio = self.recognizer.listen(source, timeout=15, phrase_time_limit=30)
            
            # Recognize
            try:
                text = self.recognizer.recognize_google(audio)
                logger.info(f"✓ Recognized: {text}")
                return text
            except sr.RequestError as e:
                logger.error(f"Speech recognition service error: {e}")
                logger.error("Check your internet connection.")
                return None
                
        except sr.WaitTimeoutError:
            logger.warning("⏱️ Listening timed out - no speech detected.")
            return None
        except sr.UnknownValueError:
            logger.warning("❓ Could not understand the audio.")
            return None
        except Exception as e:
            logger.error(f"Error: {e}")
            return None
    
    def test_microphone(self, device_index: Optional[int] = None) -> bool:
        """
        Test if a microphone is working properly.
        
        Args:
            device_index (int): Microphone device index to test
            
        Returns:
            bool: True if microphone is working, False otherwise
        """
        try:
            with sr.Microphone(device_index=device_index) as source:
                logger.info(f"Testing microphone {device_index if device_index is not None else 'default'}...")
                logger.info("Measuring ambient noise level...")
                self.recognizer.adjust_for_ambient_noise(source, duration=2)
                energy = self.recognizer.energy_threshold
                logger.info(f"✓ Microphone working! Ambient noise level: {energy:.0f}")
                return True
        except Exception as e:
            logger.error(f"Microphone test failed: {e}")
            return False

    
    def text_to_speech(self, text: str, save_to_file: Optional[str] = None) -> bool:
        """
        Convert text to speech and play or save to file.
        
        Args:
            text (str): Text to convert to speech
            save_to_file (str): Path to save audio file (optional)
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            if save_to_file:
                self.tts_engine.save_to_file(text, save_to_file)
                self.tts_engine.runAndWait()
                logger.info(f"Audio saved to {save_to_file}")
            else:
                self.tts_engine.say(text)
                self.tts_engine.runAndWait()
            
            return True
            
        except Exception as e:
            logger.error(f"Error during text-to-speech: {e}")
            return False
    
    def interactive_consultation(self, predictor):
        """
        Run an interactive voice-based medical consultation.
        
        Args:
            predictor: DiseasePredictor instance
        """
        print("\n=== MediTalk AI Voice Agent ===")
        print("Welcome to MediTalk - Your AI Medical Consultation Assistant")
        
        # Greeting
        greeting = "Welcome to MediTalk. I am your AI medical assistant. Please describe your symptoms."
        self.text_to_speech(greeting)
        
        # Get symptoms from user
        print("\nPlease describe your symptoms (comma-separated):")
        symptoms_text = input("Symptoms: ")
        
        if not symptoms_text.strip():
            print("No symptoms provided. Exiting.")
            return
        
        # Parse symptoms
        symptoms = [s.strip() for s in symptoms_text.split(',')]
        
        # Validate symptoms
        validation = predictor.validate_symptoms(symptoms)
        
        if not validation['all_valid']:
            message = f"I recognized the following symptoms: {', '.join(validation['valid_symptoms'])}. "
            message += f"I did not recognize: {', '.join(validation['invalid_symptoms'])}. "
            print(message)
            self.text_to_speech(message)
        
        # Make prediction
        result = predictor.predict_disease(validation['valid_symptoms'])
        
        # Generate response
        response = f"Based on your symptoms, I believe you may have {result['primary_disease']}. "
        response += f"This condition has a confidence level of {result['confidence']:.0%}. "
        response += f"Here is a description: {result['description'][:200]}... "
        response += f"Recommended precautions: {', '.join(result['precautions'][:2])}. "
        response += "Please consult with a healthcare professional for proper diagnosis and treatment."
        
        print(f"\n=== Diagnosis Result ===")
        print(f"Disease: {result['primary_disease']}")
        print(f"Confidence: {result['confidence']:.2%}")
        print(f"Description: {result['description']}")
        print(f"Precautions: {', '.join(result['precautions'])}")
        
        # Speak the response
        self.text_to_speech(response)
        
        print("\nConsultation complete. Thank you for using MediTalk!")

if __name__ == "__main__":
    voice = VoiceInterface()
    
    # Test text-to-speech
    print("Testing text-to-speech...")
    voice.text_to_speech("Hello, this is MediTalk, your AI medical assistant.")
    
    # Test speech-to-text (optional)
    # print("\nTesting speech-to-text...")
    # text = voice.speech_to_text()
