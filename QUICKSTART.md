# Quick Start Guide

## Setup

1. **Clone and install:**
```bash
git clone https://github.com/yourusername/ninjaone-mcp.git
cd ninjaone-mcp
npm install
```

2. **Create `.env` file:**
```bash
cp .env.example .env
```

3. **Add your credentials:**
```
NINJA_CLIENT_ID=57L3LC9K7C7H61NBF7QO
NINJA_CLIENT_SECRET=your_secret_key_here
NINJA_REDIRECT_URI=https://bec.rmmservice.ca/
```

4. **Build:**
```bash
npm run build
```

## Usage with Claude

Start the server and Claude will automatically detect the available tools.

## Common Tasks

- "List all devices"
- "Get details for device abc123"
- "Create a ticket for device offline"
- "Show patch status for device"
- "Get antivirus status report"

See README.md for complete documentation.
