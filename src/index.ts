#!/usr/bin/env node

import * as dotenv from "dotenv";
import readline from "readline";
import { NinjaOneClient } from "./api-client.js";
import { OAuthManager } from "./oauth.js";
import { NinjaOneConfig } from "./types.js";
import { tools } from "./tools.js";

dotenv.config();

const config: NinjaOneConfig = {
  clientId: process.env.NINJA_CLIENT_ID || "",
  clientSecret: process.env.NINJA_CLIENT_SECRET || "",
  redirectUri: process.env.NINJA_REDIRECT_URI || "",
  apiBaseUrl: process.env.NINJA_API_BASE_URL || "https://api.ninjarmm.com",
};

if (!config.clientId || !config.clientSecret) {
  console.error(
    "Error: NINJA_CLIENT_ID and NINJA_CLIENT_SECRET environment variables are required"
  );
  process.exit(1);
}

const oauth = new OAuthManager(config);
const client = new NinjaOneClient(config, oauth);

// Token handling
let currentToken = process.env.NINJA_ACCESS_TOKEN
  ? JSON.parse(process.env.NINJA_ACCESS_TOKEN)
  : null;

if (currentToken) {
  oauth.setToken(currentToken);
}

async function processToolCall(
  toolName: string,
  toolInput: Record<string, any>
): Promise<string> {
  try {
    let result: any;

    switch (toolName) {
      case "list_devices":
        result = await client.listDevices(toolInput);
        break;
      case "get_device":
        result = await client.getDevice(toolInput.device_id);
        break;
      case "search_devices":
        result = await client.searchDevices(toolInput.filter, toolInput);
        break;
      case "get_device_alerts":
        result = await client.getDeviceAlerts(toolInput.device_id);
        break;
      case "get_all_alerts":
        result = await client.getAlerts(toolInput);
        break;
      case "reboot_device":
        result = await client.rebootDevice(
          toolInput.device_id,
          toolInput.mode || "force"
        );
        break;
      case "run_script":
        result = await client.runScript(toolInput.device_id, toolInput);
        break;
      case "get_os_patches":
        result = await client.getDeviceOSPatches(toolInput.device_id);
        break;
      case "get_software_patches":
        result = await client.getDeviceSoftwarePatches(toolInput.device_id);
        break;
      case "get_device_software":
        result = await client.getDeviceSoftware(toolInput.device_id, toolInput);
        break;
      case "create_ticket":
        result = await client.createTicket(toolInput);
        break;
      case "get_ticket":
        result = await client.getTicket(toolInput.ticket_id);
        break;
      case "update_ticket":
        result = await client.updateTicket(toolInput.ticket_id, toolInput);
        break;
      case "add_ticket_comment":
        result = await client.addTicketComment(
          toolInput.ticket_id,
          toolInput.comment
        );
        break;
      case "list_organizations":
        result = await client.listOrganizations(toolInput);
        break;
      case "get_organization":
        result = await client.getOrganization(toolInput.org_id);
        break;
      case "get_device_health":
        result = await client.getDeviceHealthReport(toolInput);
        break;
      case "get_antivirus_status":
        result = await client.getAntivirusStatus(toolInput);
        break;
      case "list_contacts":
        result = await client.listContacts();
        break;
      case "api_get":
        result = await client.get(toolInput.path, toolInput.params);
        break;
      case "api_post":
        result = await client.post(toolInput.path, toolInput.data);
        break;
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }

    return JSON.stringify(result, null, 2);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    return JSON.stringify({
      error: errorMessage,
      tool: toolName,
    });
  }
}

// Simple stdio-based MCP server implementation
async function handleRequest(line: string): Promise<void> {
  try {
    const request = JSON.parse(line);

    if (request.method === "initialize") {
      const response = {
        jsonrpc: "2.0",
        id: request.id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {
              listChanged: false,
            },
          },
          serverInfo: {
            name: "ninjaone-mcp",
            version: "1.0.0",
          },
        },
      };
      console.log(JSON.stringify(response));
    } else if (request.method === "tools/list") {
      const response = {
        jsonrpc: "2.0",
        id: request.id,
        result: {
          tools,
        },
      };
      console.log(JSON.stringify(response));
    } else if (request.method === "tools/call") {
      const result = await processToolCall(
        request.params.name,
        request.params.arguments
      );
      const response = {
        jsonrpc: "2.0",
        id: request.id,
        result: {
          content: [
            {
              type: "text",
              text: result,
            },
          ],
        },
      };
      console.log(JSON.stringify(response));
    } else {
      const response = {
        jsonrpc: "2.0",
        id: request.id,
        error: {
          code: -32601,
          message: `Unknown method: ${request.method}`,
        },
      };
      console.log(JSON.stringify(response));
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.error(`Error processing request: ${errorMessage}`);
  }
}

async function main() {
  // Log to stderr only in debug mode to avoid interfering with MCP protocol
  if (process.env.DEBUG) {
    console.error(
      "NinjaOne MCP Server started. Waiting for requests from Claude...\n"
    );
    console.error(`API Base URL: ${config.apiBaseUrl}`);
    console.error(`Using OAuth for authentication\n`);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  rl.on("line", (line: string) => {
    if (line.trim()) {
      handleRequest(line);
    }
  });

  rl.on("close", () => {
    process.exit(0);
  });
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
