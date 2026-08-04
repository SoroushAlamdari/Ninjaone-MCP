export interface NinjaOneConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  apiBaseUrl: string;
}

export interface OAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
  expires_at?: number;
}

export interface PaginatedResponse<T> {
  data?: T[];
  pageDetails?: {
    pageNo: number;
    pageSize: number;
    totalRecords: number;
  };
}

export interface NinjaDevice {
  id: string;
  nodeId: string;
  nodeName: string;
  nodeType: string;
  operatingSystem?: string;
  status?: string;
  lastScan?: string;
  organizationId?: string;
  organizationName?: string;
  locationId?: string;
  locationName?: string;
  [key: string]: any;
}

export interface NinjaAlert {
  uid: string;
  nodeId: string;
  nodeName?: string;
  conditionName: string;
  triggerTime: string;
  severity?: string;
  status?: string;
  [key: string]: any;
}

export interface NinjaTicket {
  ticketId: string;
  ticketNumber: string;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  createdTime?: string;
  lastModified?: string;
  [key: string]: any;
}

export interface NinjaOrganization {
  id: string;
  organizationName: string;
  nodeRoles?: string[];
  [key: string]: any;
}

export interface MCPToolResult {
  type: "text" | "error";
  text?: string;
  error?: string;
}
