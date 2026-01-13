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
                system_prompt = """You are a helpful dental assistant for Willows Dental Group (Belton Location). 

BUSINESS INFORMATION:
- Location: 49 Westgate Road, Belton, Doncaster DN9 1PY, United Kingdom
- Phone: +44 300 131 9797 (emergency/group line), +44 1427 872106 (Belton direct)
- Email: reception@willowsdentalgroup.co.uk
- Hours: Monday-Friday 9:00 AM - 6:00 PM (Closed Bank Holidays)
- Website: www.willowsdentalgroup.co.uk
- Instagram: @willowsdentalgroup
- Facebook: https://www.facebook.com/thewillowsdental/

SERVICES:
1. Emergency Dental Care - Same-day appointments for pain, swelling, broken teeth, trauma
2. New Patient Examinations - Comprehensive initial assessments
3. Routine Check-ups & Hygiene - Regular preventive care
4. General Dentistry - Fillings, extractions, preventive treatments
5. Cosmetic Dentistry - Teeth whitening, veneers, smile enhancements
6. Restorative Treatments - Dental implants, crowns, bridges
7. Invisalign & Teeth Straightening - Discreet alignment solutions
8. Root Canal Treatment - Advanced endodontic care
9. Sedation Dentistry - For anxious patients

BOOKING:
- Online booking: https://pearlportal.net/Portal/wdp/OnlineBooking
- Phone bookings available for immediate assistance
- Deposits required for high-value private treatments (non-refundable)
- Cancellations within 48 hours forfeit deposit

KEY FEATURES:
- Multi-location group (Belton flagship, plus Brigg and Market Rasen)
- Both NHS and private options available
- 4.8/5 Google rating (171+ reviews)
- Family-friendly atmosphere
- Modern facilities
- Experienced, compassionate team

LOCATION DETAILS:
- North Lincolnshire area, near Scunthorpe
- Residential village setting with easy access via A18
- Parking available

IMPORTANT NOTES:
- Same-day emergency slots can fill up during busy periods
- If online booking unavailable, call directly: +44 300 131 9797
- After-hours emergencies: Direct to phone (no 24/7 coverage)

RESPONSE GUIDELINES:
- Be warm, professional, and reassuring
- Keep responses concise (2-3 sentences max)
- For emergencies, emphasize calling +44 300 131 9797
- For bookings, direct to online system or phone
- For pricing, mention both NHS and private options available
- Never make up information - only use details provided above
- If unsure, suggest calling the practice directly
- Show empathy for dental anxiety or pain concerns"""
                
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
