# Willows Dental Group Website

A modern, dynamic, and stylish website for Willows Dental Group (Belton Location) featuring an AI-powered chatbot assistant.

## 🎨 Design Features

- **Color Scheme**: Matches original website
  - Primary Dark Blue: `#1C2B39`
  - Accent Orange: `#D97A3A`
  - Accent Light Blue: `#5FB0DA`
- **Professional Typography**: Playfair Display (headings) + Inter (body)
- **Responsive Design**: Mobile-first approach with smooth animations
- **Premium Aesthetics**: Glassmorphism, hover effects, and modern layouts

## 📁 Project Structure

```
willows-dental/
├── index.html              # Main HTML file
├── style.css               # Complete styling system
├── script.js               # Frontend interactivity & chatbot UI
├── server.py               # Local development server
├── functions/
│   └── api/
│       └── worker.js       # Cloudflare Worker for chatbot API
└── assets/
    ├── logo.jpg            # Willows Dental logo
    ├── hero-image.jpg      # Hero section image
    └── gallery/
        ├── whitening.jpg   # Teeth whitening before/after
        ├── veneers.jpg     # Veneers transformation
        └── implants.jpg    # Dental implants result
```

## 🚀 Quick Start

### Local Development

1. **Navigate to project directory**:
   ```bash
   cd C:\Users\bharath\.gemini\antigravity\scratch\willows-dental
   ```

2. **Set your Gemini API key**:
   ```bash
   # Windows PowerShell
   $env:GEMINI_API_KEY="your_api_key_here"
   
   # Windows CMD
   set GEMINI_API_KEY=your_api_key_here
   ```

3. **Run the server**:
   ```bash
   python server.py
   ```

4. **Open in browser**:
   ```
   http://localhost:8000
   ```

## 🤖 Chatbot Features

- **Smart Greeting System**: Time-based greetings (morning/afternoon/evening)
- **Quick Suggestions**: Pre-defined chips for common questions
- **Typing Indicator**: Visual feedback during AI response
- **Message Timestamps**: Track conversation flow
- **Clear Chat**: Reset conversation anytime
- **Error Handling**: Graceful fallbacks with contact information
- **Mobile Responsive**: Optimized for all screen sizes

## 📋 Business Information Included

- **Location**: 49 Westgate Road, Belton, Doncaster DN9 1PY
- **Phone**: +44 300 131 9797 (Emergency), +44 1427 872106 (Direct)
- **Email**: reception@willowsdentalgroup.co.uk
- **Hours**: Monday-Friday 9:00 AM - 6:00 PM
- **Services**: Emergency care, cosmetic dentistry, general dentistry, restorative treatments, Invisalign, sedation
- **Booking**: Online via https://pearlportal.net/Portal/wdp/OnlineBooking

## 🌐 Deployment

### Cloudflare Pages

1. **Deploy the site** to Cloudflare Pages
2. **Set environment variable** in Cloudflare dashboard:
   - Variable name: `API_KEY_willows`
   - Value: Your Gemini API key
3. The `functions/api/worker.js` will automatically be deployed as a Cloudflare Function

### Environment Variables

- **Local**: `GEMINI_API_KEY`
- **Cloudflare**: `API_KEY_willows`

## 🎯 Key Sections

1. **Hero Section**: Compelling headline with booking CTAs
2. **Services**: 6 service cards with hover animations
3. **Gallery**: Before/after dental transformations
4. **About**: Practice information with statistics
5. **Emergency**: Dedicated emergency care section
6. **Contact**: Location, hours, map, and contact details
7. **Footer**: Multi-column with quick links and social media

## 🔧 Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Python (local), Cloudflare Workers (production)
- **AI**: Google Gemini API (gemini-2.0-flash-exp)
- **Fonts**: Google Fonts (Playfair Display, Inter)
- **Maps**: Google Maps embed

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

## ✨ Premium Features

- Smooth scroll navigation
- Sticky navbar with scroll effects
- Animated service cards on scroll
- Gallery with hover overlays
- Floating chatbot widget
- Mobile hamburger menu
- Intersection Observer animations
- Lazy loading images (optional)

## 🎨 Color Variables

```css
--primary-dark: #1C2B39
--accent-orange: #D97A3A
--accent-blue: #5FB0DA
--white: #FFFFFF
--light-grey: #F5F7FA
--text-dark: #2C3E50
--text-grey: #6B7280
```

## 📞 Support

For questions or issues:
- Email: reception@willowsdentalgroup.co.uk
- Phone: +44 300 131 9797

---

**Built with care for exceptional patient experience** 🦷✨
