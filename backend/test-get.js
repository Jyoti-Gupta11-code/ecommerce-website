async function run() {
  try {
    const res = await fetch("http://localhost:4000/api/product/list");
    const json = await res.json();
    console.log("Response:", JSON.stringify(json, null, 2));
  } catch (e) {
    console.error("Error:", e.message);
  }
}
run();
