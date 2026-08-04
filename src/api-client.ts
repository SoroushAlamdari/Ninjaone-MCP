import axios, { AxiosInstance, AxiosError } from "axios";
import { OAuthManager } from "./oauth.js";
import { NinjaOneConfig, PaginatedResponse } from "./types.js";

export class NinjaOneClient {
  private client: AxiosInstance;
  private oauth: OAuthManager;
  private config: NinjaOneConfig;

  constructor(config: NinjaOneConfig, oauth: OAuthManager) {
    this.config = config;
    this.oauth = oauth;

    this.client = axios.create({
      baseURL: config.apiBaseUrl,
      timeout: 30000,
    });

    this.client.interceptors.request.use((config) => {
      if (!config.headers.Authorization) {
        config.headers.Authorization = this.oauth.getAuthHeader();
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401 && this.oauth.getToken()?.refresh_token) {
          try {
            await this.oauth.refreshAccessToken(this.oauth.getToken()!.refresh_token!);
            error.config!.headers.Authorization = this.oauth.getAuthHeader();
            return this.client(error.config!);
          } catch (refreshError) {
            throw new Error(`Token refresh failed: ${refreshError}`);
          }
        }
        throw error;
      }
    );
  }

  // Devices
  async listDevices(
    params?: Record<string, any>
  ): Promise<PaginatedResponse<any>> {
    const response = await this.client.get("/v2/devices", { params });
    return response.data;
  }

  async getDevice(deviceId: string): Promise<any> {
    const response = await this.client.get(`/v2/device/${deviceId}`);
    return response.data;
  }

  async getDeviceDetailed(deviceId: string): Promise<any> {
    const response = await this.client.get(`/v2/device/${deviceId}`);
    return response.data;
  }

  async searchDevices(filter: string, params?: Record<string, any>): Promise<any> {
    const response = await this.client.get("/v2/devices/search", {
      params: { ...params, filter },
    });
    return response.data;
  }

  async getDeviceAlerts(deviceId: string): Promise<any> {
    const response = await this.client.get(`/v2/device/${deviceId}/alerts`);
    return response.data;
  }

  async getAlerts(params?: Record<string, any>): Promise<any> {
    const response = await this.client.get("/v2/alerts", { params });
    return response.data;
  }

  async resetAlert(uid: string, data?: Record<string, any>): Promise<any> {
    const response = await this.client.post(`/v2/alert/${uid}/reset`, data || {});
    return response.data;
  }

  // Device Actions
  async rebootDevice(deviceId: string, mode: string = "force"): Promise<any> {
    const response = await this.client.post(`/v2/device/${deviceId}/reboot/${mode}`, {});
    return response.data;
  }

  async runScript(deviceId: string, scriptData: Record<string, any>): Promise<any> {
    const response = await this.client.post(
      `/v2/device/${deviceId}/script/run`,
      scriptData
    );
    return response.data;
  }

  async scheduleDeviceMaintenance(
    deviceId: string,
    maintenanceData: Record<string, any>
  ): Promise<any> {
    const response = await this.client.put(
      `/v2/device/${deviceId}/maintenance`,
      maintenanceData
    );
    return response.data;
  }

  async cancelDeviceMaintenance(deviceId: string): Promise<any> {
    const response = await this.client.delete(`/v2/device/${deviceId}/maintenance`);
    return response.data;
  }

  // Patches
  async getDeviceOSPatches(deviceId: string): Promise<any> {
    const response = await this.client.get(`/v2/device/${deviceId}/os-patches`);
    return response.data;
  }

  async getDeviceSoftwarePatches(deviceId: string): Promise<any> {
    const response = await this.client.get(`/v2/device/${deviceId}/software-patches`);
    return response.data;
  }

  async applyOSPatches(deviceId: string, patchData: Record<string, any>): Promise<any> {
    const response = await this.client.post(
      `/v2/device/${deviceId}/patch/os/apply`,
      patchData
    );
    return response.data;
  }

  async applySoftwarePatches(
    deviceId: string,
    patchData: Record<string, any>
  ): Promise<any> {
    const response = await this.client.post(
      `/v2/device/${deviceId}/patch/software/apply`,
      patchData
    );
    return response.data;
  }

  // Software and Inventory
  async getDeviceSoftware(deviceId: string, params?: Record<string, any>): Promise<any> {
    const response = await this.client.get(`/v2/device/${deviceId}/software`, {
      params,
    });
    return response.data;
  }

  async getSoftwareInventory(params?: Record<string, any>): Promise<any> {
    const response = await this.client.get("/v2/queries/software", { params });
    return response.data;
  }

  // Windows Services
  async getDeviceServices(deviceId: string): Promise<any> {
    const response = await this.client.get(`/v2/device/${deviceId}/windows-services`);
    return response.data;
  }

  async controlWindowsService(
    deviceId: string,
    serviceId: string,
    action: string
  ): Promise<any> {
    const response = await this.client.post(
      `/v2/device/${deviceId}/windows-service/${serviceId}/control`,
      { action }
    );
    return response.data;
  }

  // Organizations
  async listOrganizations(params?: Record<string, any>): Promise<any> {
    const response = await this.client.get("/v2/organizations", { params });
    return response.data;
  }

  async getOrganization(orgId: string): Promise<any> {
    const response = await this.client.get(`/v2/organization/${orgId}`);
    return response.data;
  }

  async getOrganizationDevices(orgId: string, params?: Record<string, any>): Promise<any> {
    const response = await this.client.get(`/v2/organization/${orgId}/devices`, {
      params,
    });
    return response.data;
  }

  // Ticketing
  async createTicket(ticketData: Record<string, any>): Promise<any> {
    const response = await this.client.post("/v2/ticketing/ticket", ticketData);
    return response.data;
  }

  async getTicket(ticketId: string): Promise<any> {
    const response = await this.client.get(`/v2/ticketing/ticket/${ticketId}`);
    return response.data;
  }

  async updateTicket(ticketId: string, ticketData: Record<string, any>): Promise<any> {
    const response = await this.client.put(
      `/v2/ticketing/ticket/${ticketId}`,
      ticketData
    );
    return response.data;
  }

  async addTicketComment(ticketId: string, comment: string): Promise<any> {
    const response = await this.client.post(
      `/v2/ticketing/ticket/${ticketId}/comment`,
      { comment }
    );
    return response.data;
  }

  async getTicketForms(): Promise<any> {
    const response = await this.client.get("/v2/ticketing/ticket-form");
    return response.data;
  }

  // Reports/Queries
  async getDeviceHealthReport(params?: Record<string, any>): Promise<any> {
    const response = await this.client.get("/v2/queries/device-health", { params });
    return response.data;
  }

  async getAntivirusStatus(params?: Record<string, any>): Promise<any> {
    const response = await this.client.get("/v2/queries/antivirus-status", { params });
    return response.data;
  }

  async getOSPatchReport(params?: Record<string, any>): Promise<any> {
    const response = await this.client.get("/v2/queries/os-patches", { params });
    return response.data;
  }

  async getSoftwarePatchReport(params?: Record<string, any>): Promise<any> {
    const response = await this.client.get("/v2/queries/software-patches", { params });
    return response.data;
  }

  async getDisksReport(params?: Record<string, any>): Promise<any> {
    const response = await this.client.get("/v2/queries/disks", { params });
    return response.data;
  }

  // Contacts
  async listContacts(): Promise<any> {
    const response = await this.client.get("/v2/contacts");
    return response.data;
  }

  async getContact(contactId: string): Promise<any> {
    const response = await this.client.get(`/v2/contact/${contactId}`);
    return response.data;
  }

  async createContact(contactData: Record<string, any>): Promise<any> {
    const response = await this.client.post("/v2/contacts", contactData);
    return response.data;
  }

  async updateContact(contactId: string, contactData: Record<string, any>): Promise<any> {
    const response = await this.client.patch(`/v2/contact/${contactId}`, contactData);
    return response.data;
  }

  // Custom Fields
  async getCustomFields(): Promise<any> {
    const response = await this.client.get("/v2/device-custom-fields");
    return response.data;
  }

  async getDeviceCustomFields(deviceId: string): Promise<any> {
    const response = await this.client.get(`/v2/device/${deviceId}/custom-fields`);
    return response.data;
  }

  async updateDeviceCustomFields(
    deviceId: string,
    fields: Record<string, any>
  ): Promise<any> {
    const response = await this.client.patch(
      `/v2/device/${deviceId}/custom-fields`,
      fields
    );
    return response.data;
  }

  // Generic GET request for flexibility
  async get(path: string, params?: Record<string, any>): Promise<any> {
    const response = await this.client.get(path, { params });
    return response.data;
  }

  // Generic POST request for flexibility
  async post(path: string, data: Record<string, any>): Promise<any> {
    const response = await this.client.post(path, data);
    return response.data;
  }

  // Generic PUT request for flexibility
  async put(path: string, data: Record<string, any>): Promise<any> {
    const response = await this.client.put(path, data);
    return response.data;
  }

  // Generic PATCH request for flexibility
  async patch(path: string, data: Record<string, any>): Promise<any> {
    const response = await this.client.patch(path, data);
    return response.data;
  }

  // Generic DELETE request for flexibility
  async delete(path: string): Promise<any> {
    const response = await this.client.delete(path);
    return response.data;
  }
}
