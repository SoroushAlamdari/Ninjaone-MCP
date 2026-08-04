# NinjaOne MCP Server

A comprehensive Model Context Protocol (MCP) server for NinjaOne RMM API integration with Claude. Enables Claude to manage devices, tickets, patches, organizations, and more across your entire NinjaOne infrastructure.

## Features

✨ **Comprehensive Coverage**
- Device management (list, search, get details, alerts)
- Device actions (reboot, run scripts)
- Patch management (OS and software patches)
- Ticketing system (create, update, comment on tickets)
- Reporting (device health, antivirus)
- Organization management
- Contact management
- Generic API access for advanced use cases

🔐 **Security**
- OAuth 2.0 authentication with automatic token refresh
- Secure credential handling via environment variables
- No secrets in version control

⚙️ **Production Ready**
- TypeScript for type safety
- Comprehensive error handling
- Pagination support

## Installation

### Prerequisites
- Node.js 20 LTS or higher
- npm or yarn
- NinjaOne account with API access

### Setup

1. **Clone the repository:**
```bash
git clone https://github.com/soroushalamdari/ninjaone-mcp.git
cd ninjaone-mcp
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```bash
cp .env.example .env
```

4. **Add your NinjaOne credentials to `.env`:**
```
NINJA_CLIENT_ID=your_access_key_id
NINJA_CLIENT_SECRET=your_secret_access_key
NINJA_REDIRECT_URI=https://yourdomain.com/callback
NINJA_API_BASE_URL=https://api.ninjarmm.com
```

5. **Build the server:**
```bash
npm run build
```

## OAuth Setup

1. **Get your credentials from NinjaOne:**
   - Log into your NinjaOne dashboard
   - Navigate to Settings → API
   - Create a new API application
   - Note your Client ID and Client Secret

2. **Set the redirect URI:**
   - Use the exact URI you configured in `.env`

## Claude Desktop Integration

### Setup Instructions

1. **Build the MCP server:**
```bash
npm run build
```

2. **Add to Claude Desktop config:**

**On macOS:**
```bash
# Edit ~/.claude/claude_desktop_config.json
nano ~/.claude/claude_desktop_config.json
```

**On Windows:**
```
# Edit %APPDATA%\Claude\claude_desktop_config.json
# Open: C:\Users\<YourUsername>\AppData\Roaming\Claude\claude_desktop_config.json
```

3. **Add this to the `mcpServers` section:**

```json
{
  "mcpServers": {
    "ninjaone-mcp": {
      "command": "node",
      "args": [
        "/path/to/ninjaone-mcp/dist/index.js"
      ],
      "env": {
        "NINJA_CLIENT_ID": "your_access_key_id",
        "NINJA_CLIENT_SECRET": "your_secret_access_key",
        "NINJA_REDIRECT_URI": "https://yourdomain.com/callback",
        "NINJA_API_BASE_URL": "https://api.ninjarmm.com"
      }
    }
  }
}
```

**Replace `/path/to/ninjaone-mcp/` with your actual installation path:**
- **macOS:** `/Users/username/ninjaone-mcp`
- **Windows:** `C:\\Users\\username\\ninjaone-mcp`

4. **Restart Claude Desktop:**
   - Close Claude Desktop completely
   - Reopen it
   - The NinjaOne MCP will now be available

### Verify Installation

In Claude Desktop, you should see the NinjaOne tools available. Test with:
```
"List all devices"
"Show me active alerts"
"Get device health report"
```

### Troubleshooting

**"NinjaOne MCP not showing up"**
- Verify the path to `dist/index.js` is correct
- Make sure you've run `npm run build`
- Check that Claude Desktop was completely restarted
- Verify JSON syntax in config file (use [JSON validator](https://jsonlint.com))

**"NINJA_CLIENT_ID or NINJA_CLIENT_SECRET error"**
- Ensure environment variables are in the `env` section
- Verify credentials are correct in NinjaOne settings
- Check for extra spaces or quotes in values

**"node: command not found"**
- Ensure Node.js 20+ is installed: `node --version`
- Use full path to node if needed on Windows

## Available Tools (20+ Tools)

### Device Management
- `list_devices` - List all devices with pagination
- `get_device` - Get detailed device information
- `search_devices` - Search devices using filter syntax
- `get_device_alerts` - Get active alerts for a device
- `get_all_alerts` - Get all active alerts across devices

### Device Actions
- `reboot_device` - Reboot device (graceful or force)
- `run_script` - Run script or built-in action on device

### Patch Management
- `get_os_patches` - Get OS patch status for device
- `get_software_patches` - Get software patch status for device

### Software & Inventory
- `get_device_software` - Get software inventory for device

### Ticketing
- `create_ticket` - Create new support ticket
- `get_ticket` - Get ticket details
- `update_ticket` - Update ticket information
- `add_ticket_comment` - Add comment to ticket
- `get_ticket_forms` - Get available ticket forms

### Organizations
- `list_organizations` - List all organizations
- `get_organization` - Get organization details

### Reports & Queries
- `get_device_health` - Device health report
- `get_antivirus_status` - Antivirus status report

### Contacts
- `list_contacts` - List all contacts

### Advanced/Generic API
- `api_get` - Make generic GET request to any NinjaOne endpoint
- `api_post` - Make generic POST request to any NinjaOne endpoint

### Example Prompts

Ask Claude:
```
"List all devices"
"Show me critical alerts"
"Get patch status for device ABC123"
"Create a ticket for offline device"
"Generate device health report"
"Search for all Windows 10 devices"
"Get antivirus status across all systems"
```

## Development

### Build:
```bash
npm run build
```

### Watch mode:
```bash
npm run dev
```

### Type checking:
```bash
npm run type-check
```

## Security Considerations

⚠️ **Never commit `.env` file**
- Use `.env.example` as template
- Always use environment variables for credentials

## License

MIT License

## Support

For issues or questions, check [NinjaOne API Documentation](https://app.ninjarmm.com/apidocs)
