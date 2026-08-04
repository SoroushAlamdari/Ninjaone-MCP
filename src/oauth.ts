import axios from "axios";
import { OAuthToken, NinjaOneConfig } from "./types.js";

export class OAuthManager {
  private config: NinjaOneConfig;
  private token: OAuthToken | null = null;

  constructor(config: NinjaOneConfig) {
    this.config = config;
  }

  async getAccessToken(code: string): Promise<OAuthToken> {
    try {
      const response = await axios.post<OAuthToken>(
        `${this.config.apiBaseUrl}/ws/oauth/token`,
        {
          grant_type: "authorization_code",
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          code,
          redirect_uri: this.config.redirectUri,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      this.token = response.data;
      if (this.token.expires_in) {
        this.token.expires_at = Date.now() + this.token.expires_in * 1000;
      }

      return this.token;
    } catch (error) {
      throw new Error(
        `Failed to obtain access token: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthToken> {
    try {
      const response = await axios.post<OAuthToken>(
        `${this.config.apiBaseUrl}/ws/oauth/token`,
        {
          grant_type: "refresh_token",
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          refresh_token: refreshToken,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      this.token = response.data;
      if (this.token.expires_in) {
        this.token.expires_at = Date.now() + this.token.expires_in * 1000;
      }

      return this.token;
    } catch (error) {
      throw new Error(
        `Failed to refresh access token: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  getToken(): OAuthToken | null {
    return this.token;
  }

  setToken(token: OAuthToken): void {
    this.token = token;
    if (token.expires_in) {
      token.expires_at = Date.now() + token.expires_in * 1000;
    }
  }

  isTokenExpired(): boolean {
    if (!this.token || !this.token.expires_at) {
      return true;
    }
    return Date.now() >= this.token.expires_at - 60000; // 1 minute buffer
  }

  getAuthHeader(): string {
    if (!this.token) {
      throw new Error("No access token available");
    }
    return `Bearer ${this.token.access_token}`;
  }
}
