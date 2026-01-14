#!/usr/bin/env python3
"""
Local development server for Willows Dental Group website
Serves static files and provides API endpoint for chatbot
"""

import http.server
import socketserver
import json
import os
import urllib.request
import urllib.parse
from pathlib import Path

PORT = 8000

class WillowsDentalHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler for serving static files and API endpoints"""
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        """Handle POST requests to API endpoint"""
        if self.path == '/api/worker':
            try:
                # Read request body
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                message = data.get('message', '')
                
                if not message:
                    self.send_error_response('Message is required', 400)
                    return
                
                # Get API key from environment
                api_key = os.environ.get('GEMINI_API_KEY')
                
                if not api_key:
                    print("ERROR: GEMINI_API_KEY environment variable not set")
                    self.send_json_response({
                        'response': "I'm currently unavailable. Please call us at +44 300 131 9797 for immediate assistance."
                    })
                    return
                
                # System prompt with business information
                system_prompt = """You are a professional assistant for Willows Dental Group.
      
STRICT OPERATING RULES - NO EXCEPTIONS:
1. NO GREETINGS: Do not use "Hi", "Hello", "Hey", "Greetings", etc.
2. NO FOLLOW-UP QUESTIONS: Provide the answer and stop. Do NOT ask "How can I help you?" or "Anything else?".
3. DIRECT ANSWERS ONLY: Start the response with the factual information requested. Remove all introductory fluff.
4. EXTREME BREVITY: Keep the total response to 1 short sentence if possible.

Key Information:
- Name: Willows Dental Group
- Location: 49 Westgate Road, Belton, Doncaster DN9 1PY
- Phone: +44 300 131 9797 (Emergency), +44 1427 872106 (Direct)
- Email: reception@willowsdentalgroup.co.uk
- Hours: Mon-Fri 9am-6pm.
- Services: Emergency Care, Cosmetic, General, Restorative, Invisalign, Sedation.

Do NOT provide medical advice. If unsure, state: "Please call the clinic directly at +44 300 131 9797." """
                
                # Call Gemini API
                url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={api_key}'
                
                request_body = {
                    'contents': [
                        {
                            'role': 'user',
                            'parts': [{'text': system_prompt}]
                        },
                        {
                            'role': 'model',
                            'parts': [{'text': "I understand. I'm ready to assist patients with information about Willows Dental Group."}]
                        },
                        {
                            'role': 'user',
                            'parts': [{'text': message}]
                        }
                    ],
                    'generationConfig': {
                        'temperature': 0.7,
                        'topK': 40,
                        'topP': 0.95,
                        'maxOutputTokens': 200,
                    }
                }
                
                req = urllib.request.Request(
                    url,
                    data=json.dumps(request_body).encode('utf-8'),
                    headers={'Content-Type': 'application/json'}
                )
                
                with urllib.request.urlopen(req) as response:
                    result = json.loads(response.read().decode('utf-8'))
                    bot_response = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', 
                        "I'm here to help! Please call us at +44 300 131 9797 for immediate assistance.")
                    
                    self.send_json_response({'response': bot_response})
                    
            except Exception as e:
                print(f"Error processing request: {e}")
                self.send_json_response({
                    'response': "I'm having trouble right now. Please call us at +44 300 131 9797 or email reception@willowsdentalgroup.co.uk for assistance."
                })
        else:
            self.send_error(404)
    
    def send_json_response(self, data, status=200):
        """Send JSON response with CORS headers"""
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))
    
    def send_error_response(self, message, status=400):
        """Send error response"""
        self.send_json_response({'error': message}, status)
    
    def end_headers(self):
        """Add CORS headers to all responses"""
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

def main():
    """Start the server"""
    # Change to script directory
    os.chdir(Path(__file__).parent)
    
    with socketserver.TCPServer(("", PORT), WillowsDentalHandler) as httpd:
        print("=" * 60)
        print("🦷 Willows Dental Group - Local Development Server")
        print("=" * 60)
        print(f"\n✓ Server running at http://localhost:{PORT}")
        print(f"✓ API endpoint: http://localhost:{PORT}/api/worker")
        print("\n📋 Setup Instructions:")
        print("   1. Set your Gemini API key:")
        print("      Windows: set GEMINI_API_KEY=your_api_key_here")
        print("      Linux/Mac: export GEMINI_API_KEY=your_api_key_here")
        print("\n   2. Open http://localhost:8000 in your browser")
        print("\n⚠️  Press Ctrl+C to stop the server")
        print("=" * 60 + "\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n✓ Server stopped successfully")
            print("=" * 60)

if __name__ == '__main__':
    main()
