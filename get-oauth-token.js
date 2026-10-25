#!/usr/bin/env node
// One-time login. Saves a token WITH a refresh token to token.json; the MCP server
// then renews it automatically. Re-run only if the refresh token is revoked.
import axios from "axios";
import fs from "fs";
import http from "http";
import path from "path";
import { URL, fileURLToPath } from "url";
import dotenv from "dotenv";
import readline from "readline";

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(here, ".env") });

// Fall back to the credentials Claude Desktop already passes to this server
// (regular install and Microsoft Store install locations).
function claudeConfigPaths() {
  const out = [];
  if (process.env.APPDATA) out.push(path.join(process.env.APPDATA, "Claude", "claude_desktop_config.json"));
  const pk = process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, "Packages");
  try {
    for (const d of fs.readdirSync(pk)) {
      if (/claude/i.test(d)) out.push(path.join(pk, d, "LocalCache", "Roaming", "Claude", "claude_desktop_config.json"));
    }
  } catch {}
  return out;
}
if (!process.env.NINJA_CLIENT_ID || !process.env.NINJA_CLIENT_SECRET) {
  for (const cfgPath of claudeConfigPaths()) {
    try {
      const servers = JSON.parse(fs.readFileSync(cfgPath, "utf8")).mcpServers || {};
      const entry = Object.values(servers).find((s) => s?.env?.NINJA_CLIENT_ID);
      if (!entry) continue;
      for (const [k, v] of Object.entries(entry.env)) {
        if (k.startsWith("NINJA_") && k !== "NINJA_ACCESS_TOKEN" && !process.env[k]) process.env[k] = v;
      }
      console.log(`Using credentials from ${cfgPath}`);
      break;
    } catch {}
  }
}

// Last resort: .env.example for the non-secret settings, then ask in the terminal.
const example = (() => {
  try { return dotenv.parse(fs.readFileSync(path.join(here, ".env.example"))); } catch { return {}; }
})();
for (const k of ["NINJA_CLIENT_ID", "NINJA_API_BASE_URL", "NINJA_REDIRECT_URI"]) {
  if (!process.env[k] && example[k]) process.env[k] = example[k];
}
if (!process.env.NINJA_CLIENT_SECRET) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise((r) =>
    rl.question(`Paste the NinjaOne client secret for client ${process.env.NINJA_CLIENT_ID} and press Enter: `, r)
  );
  rl.close();
  process.env.NINJA_CLIENT_SECRET = answer.trim();
}

const config = {
  clientId: process.env.NINJA_CLIENT_ID,
  clientSecret: process.env.NINJA_CLIENT_SECRET,
  redirectUri: process.env.NINJA_REDIRECT_URI || "http://localhost:3000/callback",
  apiBaseUrl: process.env.NINJA_API_BASE_URL || "https://api.ninjarmm.com",
};
const TOKEN_FILE = process.env.NINJA_TOKEN_FILE || path.join(here, "token.json");

if (!config.clientId || !config.clientSecret) {
  console.error("Error: NINJA_CLIENT_ID and NINJA_CLIENT_SECRET are required (set them in .env next to this file)");
  process.exit(1);
}

// offline_access is what makes NinjaOne return a refresh token.
const scope = "monitoring management control offline_access";
const authUrl =
  `${config.apiBaseUrl}/ws/oauth/authorize?response_type=code` +
  `&client_id=${encodeURIComponent(config.clientId)}` +
  `&redirect_uri=${encodeURIComponent(config.redirectUri)}` +
  `&scope=${encodeURIComponent(scope)}&state=mcp`;

console.log("Open this URL in your browser and sign in to NinjaOne:\n");
console.log(authUrl + "\n");

const port = Number(new URL(config.redirectUri).port || 80);
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, config.redirectUri);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  if (!code && !error) { res.writeHead(404); res.end(); return; }

  if (error) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end(`<h1>Error</h1><p>${error}</p>`);
    console.error("Authorization failed:", error);
    process.exit(1);
  }

  try {
    const { data: token } = await axios.post(
      `${config.apiBaseUrl}/ws/oauth/token`,
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: config.redirectUri,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    if (token.expires_in) token.expires_at = Date.now() + token.expires_in * 1000;
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(token, null, 2), { mode: 0o600 });

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Authorized</h1><p>You can close this window.</p>");
    console.log(`Token saved to ${TOKEN_FILE}`);
    console.log(token.refresh_token
      ? "Refresh token received - the connector will now renew itself."
      : "WARNING: no refresh token returned. In NinjaOne, enable the 'Refresh token' grant on this client app.");
    console.log("Now fully quit and reopen Claude Desktop.");
    process.exit(0);
  } catch (e) {
    res.writeHead(500); res.end("Token exchange failed - see terminal");
    console.error("Token exchange failed:", e.response ? JSON.stringify(e.response.data) : e.message);
    process.exit(1);
  }
});

server.listen(port, () => console.log(`Waiting for sign-in on port ${port}...`));
server.on("error", (e) => {
  console.error(e.code === "EADDRINUSE" ? `Port ${port} is in use - close the app using it and retry.` : e.message);
  process.exit(1);
});
