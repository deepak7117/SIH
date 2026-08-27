import dotenv from 'dotenv';
dotenv.config();

import { generateTouristPlaceWithAI } from '../services/aiPlaceService.js';

const testAI = async () => {
  try {
    console.log('Testing Google Gemini AI with query: "Konark Sun Temple"...');
    const result = await generateTouristPlaceWithAI('Konark Sun Temple');
    console.log('✅ AI Output Successful! Place details:');
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('❌ AI Test Error:', err.message);
    process.exit(1);
  }
};

testAI();
