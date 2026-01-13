// Cloudflare Worker for Willows Dental Group Chatbot
// This file should be deployed as a Cloudflare Pages Function

export default {
    async fetch(request, env) {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            });
        }

        // Only allow POST requests
        if (request.method !== 'POST') {
            return new Response('Method not allowed', {
                status: 405,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            });
        }

        try {
            const { message } = await request.json();

            if (!message) {
                return new Response(JSON.stringify({ error: 'Message is required' }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                });
            }

            // Get API key from environment variable
            const apiKey = env.API_KEY_willows;

            if (!apiKey) {
                console.error('API key not found in environment variables');
                return new Response(JSON.stringify({
                    response: "I'm currently unavailable. Please call us at +44 300 131 9797 for immediate assistance."
                }), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                });
            }

            // System prompt with comprehensive business information
            const systemPrompt = `You are a helpful dental assistant for Willows Dental Group (Belton Location). 

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
- Show empathy for dental anxiety or pain concerns`;

            // Call Gemini API
            const geminiResponse = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                role: 'user',
                                parts: [{ text: systemPrompt }]
                            },
                            {
                                role: 'model',
                                parts: [{ text: 'I understand. I\'m ready to assist patients with information about Willows Dental Group.' }]
                            },
                            {
                                role: 'user',
                                parts: [{ text: message }]
                            }
                        ],
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 200,
                        }
                    })
                }
            );

            if (!geminiResponse.ok) {
                throw new Error(`Gemini API error: ${geminiResponse.status}`);
            }

            const data = await geminiResponse.json();
            const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text ||
                "I'm here to help! Please call us at +44 300 131 9797 for immediate assistance.";

            return new Response(JSON.stringify({ response: botResponse }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            });

        } catch (error) {
            console.error('Worker error:', error);
            return new Response(JSON.stringify({
                response: "I'm having trouble right now. Please call us at +44 300 131 9797 or email reception@willowsdentalgroup.co.uk for assistance."
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            });
        }
    }
};
