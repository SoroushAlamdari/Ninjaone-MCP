#!/usr/bin/env node
import axios from "axios";
import http from "http";
import { URL } from "url";

const config = {
  clientId: process.env.NINJA_CLIENT_ID,
  clientSecret: process.env.NINJA_CLIENT_SECRET,
  redirectUri: process.env.NINJA_REDIRECT_URI || "http://localhost:3000/callback",
  apiBaseUrl: process.env.NINJA_API_BASE_URL || "https://api.ninjarmm.com",
};

if (!config.clientId || !config.clientSecret) {
  console.error("Error: NINJA_CLIENT_ID and NINJA_CLIENT_SECRET are required");
  process.exit(1);
}

console.log("🔐 Starting OAuth flow...\n");
console.log(`Redirect URI: ${config.redirectUri}\n`);

const authUrl = `${config.apiBaseUrl}/ws/oauth/authorize?client_id=${config.clientId}&response_type=code&redirect_uri=${encodeURIComponent(config.redirectUri)}`;

console.log("📱 Open this URL in your browser to authorize:\n");
console.log(authUrl);
console.log("\n");

// Start local server to capture the redirect
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, config.redirectUri);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end(`<h1>Error</h1><p>${error}</p>`);
    console.error("❌ Authorization failed:", error);
    process.exit(1);
  }

  if (code) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>✅ Authorized!</h1><p>You can close this window.</p>");

    try {
      console.log("🔄 Exchanging code for token...\n");
      const response = await axios.post(
        `${config.apiBaseUrl}/ws/oauth/token`,
        {
          grant_type: "authorization_code",
          client_id: config.clientId,
          client_secret: config.clientSecret,
          code,
          redirect_uri: config.redirectUri,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const token = response.data;
      console.log("✅ Token obtained successfully!\n");
      console.log("💾 Set this environment variable:\n");
      console.log(`export NINJA_ACCESS_TOKEN='${JSON.stringify(token)}'`);
      console.log("\n📝 Then restart Claude Desktop.\n");

      process.exit(0);
    } catch (error) {
      console.error("❌ Token exchange failed:", error.message);
      process.exit(1);
    }
  }
});

server.listen(3000, () => {
  console.log("⏳ Waiting for authorization...\n");
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error("❌ Port 3000 is already in use. Close other apps or use: set NINJA_REDIRECT_URI=http://localhost:3001/callback");
  } else {
    console.error("❌ Server error:", error.message);
  }
  process.exit(1);
});
