const SUPABASE_URL = "https://zieqeknyzporeqdkqhqb.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZXFla255enBvcmVxZGtxaHFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MjIxODgsImV4cCI6MjA4NTk5ODE4OH0.EyAmLujuco19xau28w9zDBuz0JR1H0F-cZ-HRPFygsc";

async function testInvite() {
  console.log("Sending invite request...");

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/invite-employee`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ANON_KEY}`
      },
      body: JSON.stringify({
        email: "test-invite@aegis-cert.com",
        firstName: "Test",
        lastName: "Associate",
        role: "Associate",
        department: "Field Ops",
        phone: "555-555-5555",
        organization_id: "d09be8fc-932e-4cf5-abf7-f9ca1c0b95cf" // Hardcoded test org id from DB
      })
    });

    const data = await response.json();
    console.log("Status Code:", response.status);
    console.log("Response Body:", data);
  } catch (error) {
    console.error("Fetch failed:", error);
  }
}

testInvite();
