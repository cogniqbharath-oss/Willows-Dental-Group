
export default {
    async fetch(request, env, ctx) {
        // CORs headers for all responses
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // Handle CORS preflight requests
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: corsHeaders,
            });
        }

        // Only allow POST requests
        if (request.method !== 'POST') {
            return new Response(JSON.stringify({ error: 'Method not allowed' }), {
                status: 405,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                },
            });
        }

        try {
            const { message } = await request.json();

            if (!message) {
                throw new Error('Message is required');
            }

            const apiKey = env.API_KEY_willows;
            if (!apiKey) {
                throw new Error('API Key not configured');
            }

            // Gemini API endpoint for gemma-3-27b-it
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent?key=${apiKey}`;

            const systemPrompt = `You are a professional assistant for Willows Dental Group.
      Your goal is to provide direct, simple, and concise answers to patient inquiries.
      
      STRICT RULES:
      1. NEVER start an answer with "Hi", "Hello", "Hey", "Greetings", or any other introductory greeting.
      2. Provide the answer immediately without any fluff.
      3. Keep responses extremely brief (ideally 1-2 short sentences).
      
      Key Information:
      - Name: Willows Dental Group
      - Location: 49 Westgate Road, Belton, Doncaster DN9 1PY
      - Phone: +44 300 131 9797 (Emergency), +44 1427 872106 (Direct)
      - Email: reception@willowsdentalgroup.co.uk
      - Hours: Mon-Fri 9am-6pm.
      - Services: Emergency, Cosmetic, General, Restorative, Invisalign, Sedation.
      
      Do NOT provide medical advice. If unsure, tell the user to call the clinic directly.`;

            const payload = {
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: systemPrompt + "\n\nUser: " + message }
                        ]
                    }
                ]
            };

            const aiResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!aiResponse.ok) {
                const errorData = await aiResponse.text();
                throw new Error(`Gemini API Error: ${aiResponse.status} - ${errorData}`);
            }

            const data = await aiResponse.json();

            // Extract the text from the response
            const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, but I couldn't generate a response.";

            return new Response(JSON.stringify({ response: botResponse }), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                },
            });

        } catch (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                },
            });
        }
    },
};
