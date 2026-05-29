const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * List available Gemini models (for debugging)
 */
async function listAvailableModels() {
  try {
    const models = await genAI.listModels();
    console.log('Available models:', models);
    return models;
  } catch (error) {
    console.error('Error listing models:', error);
    return null;
  }
}

/**
 * Analyze cloth image using Gemini AI to determine condition
 * @param {string} imagePath - Path to the uploaded image file
 * @returns {Promise<{condition: string, status: string, analysis: string}>}
 */
async function analyzeClothImage(imagePath) {
  try {
    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    // Get file extension to determine MIME type
    const ext = path.extname(imagePath).toLowerCase();
    let mimeType = 'image/jpeg';
    if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.webp') mimeType = 'image/webp';
    else if (ext === '.gif') mimeType = 'image/gif';

    // Create the prompt for condition analysis
    const prompt = `Analyze this image of a piece of clothing and determine its condition. 
    
    Look for:
    - Visible stains, tears, holes, or damage
    - Fading, discoloration, or wear
    - Overall cleanliness and appearance
    - Fabric integrity
    
    Based on your analysis, classify the condition as one of these EXACT categories:
    - "excellent" - Like new, no visible wear, stains, or damage
    - "good" - Minor wear, small stains, or light fading but still in good usable condition
    - "bad" - Significant wear, large stains, tears, holes, or major damage that makes it unsuitable for donation
    
    Respond in JSON format ONLY with this exact structure:
    {
      "condition": "excellent" | "good" | "bad",
      "confidence": "high" | "medium" | "low",
      "analysis": "Brief explanation of what you observed"
    }`;

    // Try different model names in order of preference
    // Based on available models from API, these are the working model names
    const modelNames = [
      'gemini-2.5-flash',           // Latest stable flash model
      'gemini-2.5-pro',             // Latest stable pro model
      'gemini-2.0-flash',           // Stable 2.0 flash
      'gemini-flash-latest',        // Latest flash (auto-updates)
      'gemini-pro-latest',          // Latest pro (auto-updates)
      'gemini-2.5-flash-lite',      // Lite version
      'gemini-2.0-flash-001'        // Specific version
    ];
    let result;
    let lastError;

    for (const modelName of modelNames) {
      try {
        console.log(`Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Generate content with image
        result = await model.generateContent([
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType
            }
          },
          prompt
        ]);
        console.log(`Successfully used model: ${modelName}`);
        break; // Success, exit loop
      } catch (modelError) {
        console.log(`Model ${modelName} failed:`, modelError.message);
        lastError = modelError;
        continue; // Try next model
      }
    }

    if (!result) {
      // If all models failed, check if API key is set
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not set in environment variables');
      }
      throw lastError || new Error('All Gemini models failed. Please check your API key and model availability.');
    }

    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    let analysisResult;
    try {
      // Try to extract JSON from the response (might have markdown formatting)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.log('Raw response:', text);
      // Fallback: try to extract condition from text
      const lowerText = text.toLowerCase();
      if (lowerText.includes('excellent') || lowerText.includes('like new')) {
        analysisResult = { condition: 'excellent', confidence: 'medium', analysis: text };
      } else if (lowerText.includes('bad') || lowerText.includes('damage') || lowerText.includes('tear') || lowerText.includes('stain')) {
        analysisResult = { condition: 'bad', confidence: 'medium', analysis: text };
      } else {
        analysisResult = { condition: 'good', confidence: 'medium', analysis: text };
      }
    }

    // Determine status based on condition
    let status;
    if (analysisResult.condition === 'bad') {
      status = 'rejected';
    } else {
      status = 'approved';
    }

    return {
      condition: analysisResult.condition,
      status: status,
      confidence: analysisResult.confidence || 'medium',
      analysis: analysisResult.analysis || text
    };

  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    // Default to approved if analysis fails (manual review)
    return {
      condition: 'good',
      status: 'pending',
      confidence: 'low',
      analysis: 'AI analysis failed. Manual review required.'
    };
  }
}

module.exports = {
  analyzeClothImage,
  listAvailableModels
};

