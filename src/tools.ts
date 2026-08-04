import { Tool } from "@anthropic-ai/sdk/resources/messages.js";

export const tools: Tool[] = [
  // ============ DEVICES ============
  {
    name: "list_devices",
    description:
      "List all devices in the NinjaOne system with optional pagination and filtering",
    input_schema: {
      type: "object" as const,
      properties: {
        pageNo: { type: "number", description: "Page number for pagination" },
        pageSize: { type: "number", description: "Number of devices per page" },
        filter: { type: "string", description: "Device filter query" },
      },
    },
  },
  {
    name: "get_device",
    description: "Get detailed information about a specific device",
    input_schema: {
      type: "object" as const,
      properties: {
        device_id: {
          type: "string",
          description: "The device ID from NinjaOne",
        },
      },
      required: ["device_id"],
    },
  },
  {
    name: "search_devices",
    description: "Search for devices using filter syntax",
    input_schema: {
      type: "object" as const,
      properties: {
        filter: {
          type: "string",
          description:
            "Device filter query (e.g., 'nodeName=DESKTOP-XYZ' or 'status=online')",
        },
      },
      required: ["filter"],
    },
  },
  {
    name: "get_device_alerts",
    description: "Get active alerts for a specific device",
    input_schema: {
      type: "object" as const,
      properties: {
        device_id: {
          type: "string",
          description: "The device ID",
        },
      },
      required: ["device_id"],
    },
  },
  {
    name: "get_all_alerts",
    description: "Get all active alerts across all devices",
    input_schema: {
      type: "object" as const,
      properties: {
        pageNo: { type: "number", description: "Page number for pagination" },
        pageSize: { type: "number", description: "Number of alerts per page" },
      },
    },
  },
  {
    name: "reboot_device",
    description: "Reboot a device",
    input_schema: {
      type: "object" as const,
      properties: {
        device_id: {
          type: "string",
          description: "The device ID to reboot",
        },
        mode: {
          type: "string",
          enum: ["force", "graceful"],
          description: "Reboot mode: force or graceful",
        },
      },
      required: ["device_id"],
    },
  },
  {
    name: "run_script",
    description: "Run a script or built-in action on a device",
    input_schema: {
      type: "object" as const,
      properties: {
        device_id: {
          type: "string",
          description: "The device ID",
        },
        script_id: {
          type: "string",
          description: "Script ID or built-in action name",
        },
        parameters: {
          type: "object",
          description: "Script parameters",
        },
      },
      required: ["device_id", "script_id"],
    },
  },
  {
    name: "get_os_patches",
    description: "Get OS patches status for a device",
    input_schema: {
      type: "object" as const,
      properties: {
        device_id: {
          type: "string",
          description: "The device ID",
        },
      },
      required: ["device_id"],
    },
  },
  {
    name: "get_software_patches",
    description: "Get software patches status for a device",
    input_schema: {
      type: "object" as const,
      properties: {
        device_id: {
          type: "string",
          description: "The device ID",
        },
      },
      required: ["device_id"],
    },
  },
  {
    name: "get_device_software",
    description: "Get software inventory for a device",
    input_schema: {
      type: "object" as const,
      properties: {
        device_id: {
          type: "string",
          description: "The device ID",
        },
      },
      required: ["device_id"],
    },
  },
  {
    name: "create_ticket",
    description: "Create a new support ticket",
    input_schema: {
      type: "object" as const,
      properties: {
        title: {
          type: "string",
          description: "Ticket title",
        },
        description: {
          type: "string",
          description: "Ticket description",
        },
        priority: {
          type: "string",
          description: "Ticket priority",
        },
      },
      required: ["title"],
    },
  },
  {
    name: "get_ticket",
    description: "Get ticket details",
    input_schema: {
      type: "object" as const,
      properties: {
        ticket_id: {
          type: "string",
          description: "The ticket ID",
        },
      },
      required: ["ticket_id"],
    },
  },
  {
    name: "update_ticket",
    description: "Update a ticket",
    input_schema: {
      type: "object" as const,
      properties: {
        ticket_id: {
          type: "string",
          description: "The ticket ID",
        },
        title: { type: "string", description: "New title" },
        description: { type: "string", description: "New description" },
        status: { type: "string", description: "New status" },
      },
      required: ["ticket_id"],
    },
  },
  {
    name: "add_ticket_comment",
    description: "Add a comment to a ticket",
    input_schema: {
      type: "object" as const,
      properties: {
        ticket_id: {
          type: "string",
          description: "The ticket ID",
        },
        comment: {
          type: "string",
          description: "Comment text",
        },
      },
      required: ["ticket_id", "comment"],
    },
  },
  {
    name: "list_organizations",
    description: "List all organizations",
    input_schema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "get_organization",
    description: "Get organization details",
    input_schema: {
      type: "object" as const,
      properties: {
        org_id: {
          type: "string",
          description: "The organization ID",
        },
      },
      required: ["org_id"],
    },
  },
  {
    name: "get_device_health",
    description: "Get device health report",
    input_schema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "get_antivirus_status",
    description: "Get antivirus status report",
    input_schema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "list_contacts",
    description: "List all contacts",
    input_schema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "api_get",
    description:
      "Make a generic GET request to any NinjaOne API endpoint",
    input_schema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description: "API endpoint path (e.g., /v2/devices)",
        },
      },
      required: ["path"],
    },
  },
  {
    name: "api_post",
    description:
      "Make a generic POST request to any NinjaOne API endpoint",
    input_schema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description: "API endpoint path",
        },
        data: {
          type: "object",
          description: "Request body",
        },
      },
      required: ["path", "data"],
    },
  },
];
