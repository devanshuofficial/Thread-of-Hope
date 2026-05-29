# Gemini AI Setup Guide

This application uses Google's Gemini AI to automatically analyze clothing images and determine their condition for donation acceptance.

## Setup Instructions

1. **Get a Gemini API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy your API key

2. **Add API Key to Environment Variables**
   - Create a `.env` file in the `backend` directory (if it doesn't exist)
   - Add the following line:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Restart the Backend Server**
   - Stop the current server (Ctrl+C)
   - Start it again with `npm start` or `npm run dev`

## Model Information

The service automatically tries multiple Gemini models in this order:
1. `gemini-2.5-flash` - Latest stable flash model (fast, efficient)
2. `gemini-2.5-pro` - Latest stable pro model (more capable)
3. `gemini-2.0-flash` - Stable 2.0 flash model
4. `gemini-flash-latest` - Auto-updating latest flash
5. `gemini-pro-latest` - Auto-updating latest pro
6. Additional fallback models

If one model fails, it automatically tries the next one. All these models support image analysis (vision capabilities).

## How It Works

When a donor submits a donation with an image:
1. The image is uploaded to the server
2. Gemini AI analyzes the image for:
   - Visible stains, tears, holes, or damage
   - Fading, discoloration, or wear
   - Overall cleanliness and appearance
   - Fabric integrity

3. Based on the analysis, the condition is classified as:
   - **excellent** - Like new, no visible wear, stains, or damage → Status: **approved**
   - **good** - Minor wear, small stains, or light fading but still usable → Status: **approved**
   - **bad** - Significant wear, large stains, tears, holes, or major damage → Status: **rejected**

4. The donation status is automatically set based on the AI analysis result.

## Error Handling

If the Gemini API is unavailable or returns an error:
- The donation will be set to "pending" status
- Manual review will be required
- The system will continue to function normally

