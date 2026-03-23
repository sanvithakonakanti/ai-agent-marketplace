# Quick Gemini API Setup Guide

## Get Your FREE API Key in 3 Steps:

### Step 1: Visit Google AI Studio
- Go to: https://makersuite.google.com/app/apikey

### Step 2: Create API Key
- Click "Create API Key"
- Choose "Create API key in new Google Cloud project"
- Copy the generated key (starts with `AIza...`)

### Step 3: Add to Backend
1. Open: `backend/.env`
2. Find: `GEMINI_API_KEY=your_gemini_api_key_here`
3. Replace with: `GEMINI_API_KEY=AIza...your_actual_key...`
4. Save file

### Step 4: Restart Backend
```bash
cd backend
npm start
```

### Step 5: Verify
```bash
curl http://localhost:5000/api/ai/health
```

Expected Response:
```json
{
  "success": true,
  "data": {
    "aiServiceConfigured": true,
    "status": "ready"
  }
}
```

## Free Tier Benefits:
✓ 60 requests per minute
✓ Text, image, and multimodal AI
✓ No credit card required
✓ Perfect for development

That's it! Your AI service will be live.
