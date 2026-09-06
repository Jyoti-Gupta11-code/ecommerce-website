import { handleIntent } from './controllers/aiController.js';
import 'dotenv/config';

const testCases = [
  { text: "Open my cart" },
  { text: "Cart kholo" },
  { text: "Show me men's shirts under 3000 rupees" },
  { text: "Mujhe 2000 ke under shoes dikhao" },
  { text: "Add this product in size M to my cart" },
  { text: "Where is my latest order?" },
  { text: "Show Me Man sits in 3000", alternatives: ["Show Me Man sits in 3000", "Show me men's shirts under 3000", "Show me man shirts in 3000"] },
  { text: "Tell me a joke about dogs" },
  { text: "" },
  { text: "Go to /invented-route-that-does-not-exist" }
];

async function runTests() {
  for (let i = 0; i < testCases.length; i++) {
    console.log(`\n--- Test ${i + 1} ---`);
    console.log("Input:", testCases[i]);
    
    let statusCode = 200;
    let responseJson = null;
    
    const req = { body: testCases[i] };
    const res = {
      status: (code) => {
        statusCode = code;
        return res;
      },
      json: (data) => {
        responseJson = data;
      }
    };

    await handleIntent(req, res);
    
    console.log("HTTP Status:", statusCode);
    console.log("Returned JSON:", JSON.stringify(responseJson, null, 2));
    
    // Quick validation check
    const isValidAction = responseJson?.intent ? ['NAVIGATE', 'SEARCH', 'ADD_TO_CART', 'GET_PRODUCT_DETAILS', 'GET_LATEST_ORDER', 'UNKNOWN'].includes(responseJson.intent.action) : false;
    console.log("Server-side validation passed:", statusCode !== 200 || isValidAction);
  }
}

runTests();
