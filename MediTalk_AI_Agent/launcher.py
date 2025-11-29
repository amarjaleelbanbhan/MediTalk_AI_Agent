#!/usr/bin/env python3
"""
MediTalk AI - Quick Launch Script
Easily launch different versions of the MediTalk AI platform
"""

import subprocess
import sys
import os
import time
import webbrowser
from typing import Dict, List

def print_banner():
    """Print professional banner"""
    print("=" * 70)
    print("🏥 MEDITALK AI - PROFESSIONAL MEDICAL PLATFORM")
    print("=" * 70)
    print("🚀 Advanced AI-Powered Medical Consultation System")
    print("👥 Developed by: Azhar Ali, Amar Jaleel, Hariz Zafar")
    print("=" * 70)

def check_requirements():
    """Check if required files exist"""
    print("🔍 Checking system requirements...")
    
    required_files = [
        'src/app_professional.py',
        'src/app_enterprise.py', 
        'src/app.py',
        'src/disease_predictor.py',
        'data/dataset.csv',
        'models/disease_model.pkl'
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if missing_files:
        print(f"❌ Missing files: {', '.join(missing_files)}")
        if 'models/disease_model.pkl' in missing_files:
            print("   📋 Run: python src/model_trainer.py")
        return False
    
    print("✅ All requirements satisfied!")
    return True

def launch_application(app_name: str, port: int, auto_open: bool = True):
    """Launch a Streamlit application"""
    print(f"🚀 Launching {app_name}...")
    
    try:
        # Start Streamlit in background
        cmd = [sys.executable, "-m", "streamlit", "run", f"src/{app_name}.py", "--server.port", str(port)]
        
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Wait a moment for startup
        time.sleep(3)
        
        # Check if process is still running
        if process.poll() is None:
            url = f"http://localhost:{port}"
            print(f"✅ {app_name} running at: {url}")
            
            if auto_open:
                print("🌐 Opening browser...")
                webbrowser.open(url)
            
            return process, url
        else:
            stdout, stderr = process.communicate()
            print(f"❌ Failed to start {app_name}")
            print(f"Error: {stderr}")
            return None, None
            
    except Exception as e:
        print(f"❌ Error launching {app_name}: {e}")
        return None, None

def main():
    """Main launcher interface"""
    print_banner()
    
    # Check requirements
    if not check_requirements():
        print("\n❌ System requirements not met. Please fix issues above.")
        return
    
    # Application options
    apps = {
        "1": {
            "name": "app_professional",
            "title": "Professional Medical Platform (RECOMMENDED)",
            "description": "Full-featured interface with working tabs and navigation",
            "port": 8521
        },
        "2": {
            "name": "app", 
            "title": "Premium UI Version", 
            "description": "Enhanced version with premium design and voice features",
            "port": 8522
        },
        "3": {
            "name": "app_enterprise",
            "title": "Enterprise Clinical Interface",
            "description": "Clean, hospital-grade interface for medical professionals",
            "port": 8512
        }
    }
    
    print("\n📋 AVAILABLE APPLICATIONS:")
    print("-" * 50)
    
    for key, app in apps.items():
        print(f"{key}. {app['title']}")
        print(f"   📝 {app['description']}")
        print(f"   🌐 Port: {app['port']}")
        print()
    
    print("4. Launch All Versions")
    print("5. System Test")
    print("6. Train Model") 
    print("0. Exit")
    
    while True:
        try:
            choice = input("\n👉 Select an option (0-6): ").strip()
            
            if choice == "0":
                print("👋 Goodbye!")
                break
                
            elif choice in ["1", "2", "3"]:
                app = apps[choice]
                print(f"\n🚀 Starting {app['title']}...")
                
                process, url = launch_application(app['name'], app['port'])
                
                if process:
                    print(f"\n✅ {app['title']} is running!")
                    print(f"🌐 URL: {url}")
                    print("📋 Credentials: username='admin', password='meditalk'")
                    print("\n⏹️  Press Ctrl+C to stop the application")
                    
                    try:
                        process.wait()
                    except KeyboardInterrupt:
                        print("\n🛑 Stopping application...")
                        process.terminate()
                        print("✅ Application stopped.")
                
            elif choice == "4":
                print("\n🚀 Launching all versions...")
                
                processes = []
                for key, app in apps.items():
                    process, url = launch_application(app['name'], app['port'], auto_open=False)
                    if process:
                        processes.append((process, app['title'], url))
                        time.sleep(2)  # Stagger launches
                
                if processes:
                    print(f"\n✅ Successfully launched {len(processes)} applications:")
                    for _, title, url in processes:
                        print(f"   🌐 {title}: {url}")
                    
                    print("📋 Credentials for all apps: username='admin', password='meditalk'")
                    print("\n⏹️  Press Ctrl+C to stop all applications")
                    
                    try:
                        # Wait for all processes
                        for process, _, _ in processes:
                            process.wait()
                    except KeyboardInterrupt:
                        print("\n🛑 Stopping all applications...")
                        for process, title, _ in processes:
                            process.terminate()
                            print(f"✅ Stopped {title}")
                
            elif choice == "5":
                print("\n🔍 Running comprehensive system test...")
                result = subprocess.run([sys.executable, "test_system.py"], capture_output=True, text=True)
                print(result.stdout)
                if result.stderr:
                    print("Errors:", result.stderr)
                
            elif choice == "6":
                print("\n🧠 Training machine learning model...")
                result = subprocess.run([sys.executable, "src/model_trainer.py"], capture_output=True, text=True)
                print(result.stdout)
                if result.stderr:
                    print("Errors:", result.stderr)
                
            else:
                print("❌ Invalid choice. Please select 0-6.")
                
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()