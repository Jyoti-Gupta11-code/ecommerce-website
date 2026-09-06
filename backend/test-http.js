const testCases = [
  { name: "A. Open my cart", payload: { text: "Open my cart" } },
  { name: "B. Cart kholo", payload: { text: "Cart kholo" } },
  { name: "C. Show me men's shirts under 3000 rupees", payload: { text: "Show me men's shirts under 3000 rupees" } },
  { name: "D. Mujhe 2000 ke under shoes dikhao", payload: { text: "Mujhe 2000 ke under shoes dikhao" } },
  { name: "E. Tell me a joke about dogs", payload: { text: "Tell me a joke about dogs" } },
  { name: "F. Empty input", payload: { text: "" } },
  { name: "G. Unsupported navigation route", payload: { text: "Go to /invented-route" } },
];

async function runTests() {
  console.log("Starting Real Live Verification against http://localhost:4001/api/ai/intent...\n");
  
  for (const test of testCases) {
    console.log(`--- Test ${test.name} ---`);
    console.log("Request Body:", JSON.stringify(test.payload));
    
    try {
      const response = await fetch("http://localhost:4001/api/ai/intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(test.payload)
      });
      
      const status = response.status;
      const json = await response.json();
      
      console.log("Actual HTTP Status:", status);
      console.log("Actual Raw JSON Response:", JSON.stringify(json, null, 2));
      
      // Determine if Gemini was called by checking if it returned 400 (validation failed before calling Gemini)
      if (status === 400) {
        console.log("Gemini API was called: No (Failed server-side validation)");
      } else {
        console.log("Gemini API was called: Yes");
      }
      
    } catch (e) {
      console.error("Test Failed with error:", e.message);
    }
    console.log("\n");
  }
}

runTests();
