async function run() {
  try {
    const res = await fetch("http://localhost:4000/api/ai/intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "Open my cart" })
    });
    const status = res.status;
    const json = await res.json();
    console.log("Status:", status);
    console.log("Response:", JSON.stringify(json, null, 2));
  } catch (e) {
    console.error("Error:", e.message);
  }
}
run();
