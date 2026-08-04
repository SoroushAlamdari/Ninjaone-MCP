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

## Available Tools

### Device Management
- `list_devices` - List all devices
- `get_device` - Get device details
- `search_devices` - Search devices
- `get_device_alerts` - Get device alerts
- `get_all_alerts` - Get all active alerts

### Device Actions
- `reboot_device` - Reboot device
- `run_script` - Run script on device

### Patches
- `get_os_patches` - Get OS patch status
- `get_software_patches` - Get software patch status

### Software & Inventory
- `get_device_software` - Get software inventory

### Ticketing
- `create_ticket` - Create ticket
- `get_ticket` - Get ticket details
- `update_ticket` - Update ticket
- `add_ticket_comment` - Add comment

### Organizations
- `list_organizations` - List organizations
- `get_organization` - Get organization details

### Reports
- `get_device_health` - Device health report
- `get_antivirus_status` - Antivirus report

### Contacts
- `list_contacts` - List contacts

### Generic API
- `api_get` - Generic GET request
- `api_post` - Generic POST request

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
