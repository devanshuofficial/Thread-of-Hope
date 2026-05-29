// Test script to check Gemini API connection and available models
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function testGemini() {
  console.log('Testing Gemini API connection...');
  console.log('API Key present:', !!process.env.GEMINI_API_KEY);
  console.log('API Key length:', process.env.GEMINI_API_KEY?.length || 0);
  
  if (!process.env.GEMINI_API_KEY) {
    console.error('ERROR: GEMINI_API_KEY is not set in .env file');
    return;
  }

  // Try to list models using REST API
  try {
    console.log('\nAttempting to list available models via REST API...');
    const fetch = require('node-fetch');
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    
    if (data.models && data.models.length > 0) {
      console.log('\n✅ Available models:');
      data.models.forEach(model => {
        console.log(`  - ${model.name} (supports: ${model.supportedGenerationMethods?.join(', ') || 'N/A'})`);
      });
      
      // Find models that support generateContent
      const supportedModels = data.models.filter(m => 
        m.supportedGenerationMethods?.includes('generateContent')
      );
      
      if (supportedModels.length > 0) {
        console.log('\n✅ Models supporting generateContent:');
        supportedModels.forEach(model => {
          console.log(`  - ${model.name}`);
        });
        return;
      }
    } else {
      console.log('No models found in response:', data);
    }
  } catch (error) {
    console.log('Could not list models via REST API:', error.message);
    console.log('Trying direct model access...');
  }

  // Try common model names
  const modelNames = [
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro-latest',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro-vision',
    'gemini-pro'
  ];

  console.log('\nTesting model access...');
  for (const modelName of modelNames) {
    try {
      console.log(`\nTrying: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      // Try a simple text generation first (no image)
      const result = await model.generateContent('Say "Hello" in one word.');
      const response = await result.response;
      const text = response.text();
      console.log(`✅ SUCCESS with ${modelName}!`);
      console.log(`Response: ${text}`);
      console.log(`\n🎉 Working model found: ${modelName}`);
      return modelName;
    } catch (error) {
      console.log(`❌ Failed: ${error.message.split('\n')[0]}`);
    }
  }

  console.log('\n❌ All models failed. Please check:');
  console.log('1. Your API key is valid');
  console.log('2. Gemini API is enabled in your Google Cloud project');
  console.log('3. Your API key has the necessary permissions');
}

testGemini().catch(console.error);

