# NinjaOne MCP Server

A comprehensive **Model Context Protocol (MCP)** server that integrates NinjaOne RMM with Claude. Manage devices, automate IT tasks, handle ticketing, monitor patch status, and execute remote scripts—all through natural language conversation with Claude AI.

> **What is an MCP?** A Model Context Protocol server extends Claude's capabilities by providing access to external systems and APIs. This server bridges Claude and NinjaOne, enabling AI-powered IT management.

## ✨ Key Features

### 🖥️ Device Management
- List, search, and get detailed information about devices
- Monitor device status, health, and connectivity
- Track active alerts and notifications
- Search devices using NinjaOne filter syntax

### 🚀 Device Actions
- Reboot devices (graceful or forced)
- Execute scripts and built-in actions remotely
- Automate IT tasks across your infrastructure

### 🔧 Patch & Software Management
- View OS and software patch status
- Track patch compliance
- Inventory installed software across devices
- Identify outdated or vulnerable software

### 🎫 Ticketing System
- Create support tickets programmatically
- Query existing tickets
- Update ticket information
- Add comments and notes

### 📊 Reporting & Monitoring
- Device health reports
- Antivirus status across fleet
- Organization-wide reporting
- Custom queries via generic API access

### 🔐 Enterprise Security
- OAuth 2.0 authentication with automatic token refresh
- No credentials in version control (environment variables only)
- Full support for NinjaOne's security model
- TypeScript for type safety

### ⚙️ Production Ready
- Node.js 20 LTS
- Comprehensive error handling
- Pagination support for large datasets
- 20+ API tools for complete NinjaOne integration

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 20 LTS** or higher ([Download](https://nodejs.org))
- **npm** (included with Node.js)
- **NinjaOne account** with API access
- **Claude Desktop** (for MCP integration)

### Installation (5 minutes)

1. **Clone the repository:**
```bash
git clone https://github.com/SoroushAlamdari/ninjaone-mcp.git
cd ninjaone-mcp
```

2. **Install dependencies:**
```bash
npm install
```

3. **Build the server:**
```bash
npm run build
```

4. **Configure NinjaOne credentials** (see [OAuth Setup](#oauth-setup) below)

---

## 🔐 OAuth Setup (Required)

This server uses **OAuth 2.0 client credentials flow** for secure API access. Follow these steps:

### Step 1: Create OAuth Application in NinjaOne

1. Log into your **NinjaOne Dashboard**
2. Go to **Admin/Settings → API → Client app IDs**
3. Click **+ Create application**
4. Fill in the form:
   - **Application platform:** `API Services (machine-to-machine)`
   - **Name:** `Claude MCP` (or your preferred name)
   - **Redirect URI:** `http://localhost:3000/callback`
   - **Scopes:** Check `Monitoring`, `Management`, `Control`
   - **Allowed grant types:** Check `Client credentials`
5. Click **Create** and copy the generated credentials

### Step 2: Add Credentials to Environment

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
NINJA_CLIENT_ID=<your_client_id_here>
NINJA_CLIENT_SECRET=<your_client_secret_here>
NINJA_REDIRECT_URI=http://localhost:3000/callback
NINJA_API_BASE_URL=https://your-instance.ninjarmm.com
```

> ⚠️ **Security:** Never commit `.env` to version control. The `.gitignore` file protects it automatically.

---

## 🤖 Claude Desktop Integration

### Windows Setup

1. **Edit Claude Desktop config:**
   - Open: `C:\Users\YourUsername\AppData\Roaming\Claude\claude_desktop_config.json`
   - Or use: `%APPDATA%\Claude\claude_desktop_config.json`

2. **Add this to the `mcpServers` section:**
```json
{
  "mcpServers": {
    "ninjaone-mcp": {
      "command": "node",
      "args": [
        "C:\\Users\\YourUsername\\ninjaone-mcp\\dist\\index.js"
      ],
      "env": {
        "NINJA_CLIENT_ID": "<your_client_id>",
        "NINJA_CLIENT_SECRET": "<your_client_secret>",
        "NINJA_REDIRECT_URI": "http://localhost:3000/callback",
        "NINJA_API_BASE_URL": "https://your-instance.ninjarmm.com"
      }
    }
  }
}
```

### macOS Setup

1. **Edit Claude Desktop config:**
   - Run: `nano ~/.claude/claude_desktop_config.json`

2. **Add MCP configuration** (same structure as Windows above, using macOS paths):
```json
{
  "mcpServers": {
    "ninjaone-mcp": {
      "command": "node",
      "args": [
        "/Users/YourUsername/ninjaone-mcp/dist/index.js"
      ],
      "env": {
        "NINJA_CLIENT_ID": "<your_client_id>",
        "NINJA_CLIENT_SECRET": "<your_client_secret>",
        "NINJA_REDIRECT_URI": "http://localhost:3000/callback",
        "NINJA_API_BASE_URL": "https://your-instance.ninjarmm.com"
      }
    }
  }
}
```

### 3. Start Using It

1. **Close and reopen Claude Desktop**
2. **Look for the NinjaOne connector** in the Connectors panel
3. **Start using the tools:**
   ```
   "List all my devices"
   "Show me critical alerts"
   "Get patch status for my servers"
   "Create a ticket for offline devices"
   "Run an inventory scan on all workstations"
   ```

### Verification Checklist

- [ ] NinjaOne MCP appears in Claude Desktop Connectors list
- [ ] All 20+ tools are visible (no "no tools available" message)
- [ ] Test with: `"List my devices"`
- [ ] Devices appear in the response

---

## 📚 Available Tools (20+ API Functions)

### Device Management (5 tools)
| Tool | Purpose |
|------|---------|
| `list_devices` | List all devices with pagination and filtering |
| `get_device` | Get detailed information about a specific device |
| `search_devices` | Search devices using NinjaOne filter syntax |
| `get_device_alerts` | Get active alerts for a device |
| `get_all_alerts` | Get all active alerts across your fleet |

### Device Actions (2 tools)
| Tool | Purpose |
|------|---------|
| `reboot_device` | Reboot a device (graceful or forced shutdown) |
| `run_script` | Execute a script or built-in action on a device |

### Patch Management (2 tools)
| Tool | Purpose |
|------|---------|
| `get_os_patches` | View OS patch status for a device |
| `get_software_patches` | View software patch status for a device |

### Software & Inventory (1 tool)
| Tool | Purpose |
|------|---------|
| `get_device_software` | View installed software on a device |

### Ticketing (4 tools)
| Tool | Purpose |
|------|---------|
| `create_ticket` | Create a new support ticket |
| `get_ticket` | Retrieve ticket details |
| `update_ticket` | Update ticket information and status |
| `add_ticket_comment` | Add a comment to a ticket |

### Organization & Contacts (3 tools)
| Tool | Purpose |
|------|---------|
| `list_organizations` | List all organizations |
| `get_organization` | Get organization details |
| `list_contacts` | List all contacts in your account |

### Reports & Monitoring (2 tools)
| Tool | Purpose |
|------|---------|
| `get_device_health` | Generate a device health report |
| `get_antivirus_status` | Get antivirus status across all devices |

### Advanced/Generic API (2 tools)
| Tool | Purpose |
|------|---------|
| `api_get` | Make a GET request to any NinjaOne API endpoint |
| `api_post` | Make a POST request to any NinjaOne API endpoint |

---

## 💬 Example Use Cases

Ask Claude any of these:

```
"List all my devices and show their status"
"Which devices haven't checked in for more than 24 hours?"
"Show me all critical and high-severity alerts"
"Get patch compliance report for all Windows servers"
"Create a ticket for all offline devices"
"Search for all devices with antivirus disabled"
"Run a compliance script on all workstations in Location XYZ"
"Show me devices running outdated versions of software"
"Get a summary of device health across the organization"
"Which devices need OS updates?"
```

---

## 🛠️ Development

### Build Production Code
```bash
npm run build
```

### Watch Mode (Auto-rebuild on changes)
```bash
npm run dev
```

### Type Checking
```bash
npm run type-check
```

### Run Tests
```bash
npm test
```

### Project Structure
```
ninjaone-mcp/
├── src/
│   ├── index.ts           # MCP server entry point
│   ├── api-client.ts      # NinjaOne API wrapper
│   ├── oauth.ts           # OAuth 2.0 handling
│   ├── tools.ts           # Tool definitions
│   └── types.ts           # TypeScript interfaces
├── dist/                  # Compiled JavaScript (auto-generated)
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔒 Security Best Practices

✅ **Do:**
- ✅ Use `.env` file for credentials (already in `.gitignore`)
- ✅ Rotate OAuth credentials regularly
- ✅ Limit API scopes to what you need
- ✅ Use strong, unique client secrets
- ✅ Monitor API usage in NinjaOne

❌ **Don't:**
- ❌ Commit `.env` file to version control
- ❌ Share credentials or secrets
- ❌ Use credentials in code or logs
- ❌ Store secrets in comments
- ❌ Log sensitive information

---

## 🐛 Troubleshooting

### "NinjaOne MCP connector not appearing in Claude Desktop"
- Verify `dist/index.js` exists: `ls dist/`
- Rebuild: `npm run build`
- Check JSON syntax: Use [jsonlint.com](https://jsonlint.com)
- **Close and fully reopen Claude Desktop** (don't just restart)
- Check file paths match your installation

### "Invalid or missing credentials"
- Verify credentials in `.env` file (not in config file)
- Check for extra spaces or quotes in values
- Regenerate credentials in NinjaOne if unsure
- Ensure API application has correct scopes: Monitoring, Management, Control

### "Cannot find module errors"
- Run: `npm install`
- Delete `node_modules` folder and reinstall: `rm -rf node_modules && npm install`

### "node: command not found"
- Verify Node.js 20+ is installed: `node --version`
- On Windows, use full path or add Node to PATH
- On macOS/Linux, ensure `/usr/local/bin` is in PATH

### Enable Debug Logging
Set environment variable and rebuild:
```bash
export DEBUG=1    # Linux/macOS
set DEBUG=1       # Windows
npm run build
```

---

## 📖 API Documentation

For detailed NinjaOne API documentation:
- [NinjaOne API Docs](https://app.ninjarmm.com/apidocs)
- [API Reference](https://app.ninjarmm.com/apidocs-beta/core-resources)

---

## 📄 License

MIT License - See LICENSE file for details

Free to use, modify, and distribute.

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Test your changes
4. Submit a pull request

---

## 💡 Support

- **Issues:** Use [GitHub Issues](https://github.com/SoroushAlamdari/ninjaone-mcp/issues)
- **API Help:** [NinjaOne Support](https://support.ninjarmm.com)
- **MCP Spec:** [Model Context Protocol](https://modelcontextprotocol.io)

---

## 📊 Project Stats

- **Language:** TypeScript
- **Runtime:** Node.js 20 LTS
- **API Integration:** NinjaOne RMM v2.0
- **Protocol:** Model Context Protocol (MCP)
- **Authentication:** OAuth 2.0
- **Tools:** 20+
