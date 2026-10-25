import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { OAuthToken, NinjaOneConfig } from "./types.js";

// Tokens are persisted here so a renewed (rotated) refresh token survives restarts.
export const TOKEN_FILE =
  process.env.NINJA_TOKEN_FILE ||
  path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "token.json");

export class OAuthManager {
  private config: NinjaOneConfig;
  private token: OAuthToken | null = null;
  private refreshing: Promise<OAuthToken> | null = null;

  constructor(config: NinjaOneConfig) {
    this.config = config;
  }

  private async requestToken(params: Record<string, string>): Promise<OAuthToken> {
    const response = await axios.post<OAuthToken>(
      `${this.config.apiBaseUrl}/ws/oauth/token`,
      new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        ...params,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    const previousRefresh = this.token?.refresh_token;
    this.token = response.data;
    if (this.token.expires_in) {
      this.token.expires_at = Date.now() + this.token.expires_in * 1000;
    }
    // Some responses omit refresh_token on refresh: keep the old one.
    if (!this.token.refresh_token && previousRefresh) {
      this.token.refresh_token = previousRefresh;
    }
    this.saveToken();
    return this.token;
  }

  async getAccessTokenWithClientCredentials(): Promise<OAuthToken> {
    try {
      return await this.requestToken({
        grant_type: "client_credentials",
        scope: "monitoring management control",
      });
    } catch (error) {
      throw new Error(`Failed to obtain access token: ${errMsg(error)}`);
    }
  }

  async getAccessToken(code: string): Promise<OAuthToken> {
    try {
      return await this.requestToken({
        grant_type: "authorization_code",
        code,
        redirect_uri: this.config.redirectUri,
      });
    } catch (error) {
      throw new Error(`Failed to obtain access token: ${errMsg(error)}`);
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthToken> {
    try {
      return await this.requestToken({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      });
    } catch (error) {
      throw new Error(`Failed to refresh access token: ${errMsg(error)}`);
    }
  }

  /** Get a fresh access token: refresh token if we have one, else client credentials. Single-flight. */
  async renew(): Promise<OAuthToken> {
    if (this.refreshing) return this.refreshing;
    const rt = this.token?.refresh_token;
    this.refreshing = (rt
      ? this.refreshAccessToken(rt)
      : this.getAccessTokenWithClientCredentials()
    ).finally(() => {
      this.refreshing = null;
    });
    return this.refreshing;
  }

  /** Renew ahead of expiry so requests don't hit a 401 at all. */
  async ensureValidToken(): Promise<void> {
    if (this.isTokenExpired()) {
      await this.renew();
    }
  }

  loadSavedToken(): boolean {
    try {
      if (!fs.existsSync(TOKEN_FILE)) return false;
      const saved = JSON.parse(fs.readFileSync(TOKEN_FILE, "utf8")) as OAuthToken;
      if (!saved.access_token && !saved.refresh_token) return false;
      this.token = saved;
      return true;
    } catch {
      return false;
    }
  }

  private saveToken(): void {
    try {
      fs.writeFileSync(TOKEN_FILE, JSON.stringify(this.token, null, 2), { mode: 0o600 });
    } catch (error) {
      if (process.env.DEBUG) console.error(`Could not save token: ${errMsg(error)}`);
    }
  }

  getToken(): OAuthToken | null {
    return this.token;
  }

  setToken(token: OAuthToken): void {
    this.token = token;
    if (token.expires_in && !token.expires_at) {
      token.expires_at = Date.now() + token.expires_in * 1000;
    }
  }

  isTokenExpired(): boolean {
    if (!this.token || !this.token.access_token || !this.token.expires_at) {
      return true;
    }
    return Date.now() >= this.token.expires_at - 60000; // 1 minute buffer
  }

  getAuthHeader(): string {
    if (this.token && this.token.access_token) {
      return `Bearer ${this.token.access_token}`;
    }
    throw new Error("No NinjaOne access token. Run: node get-oauth-token.js");
  }
}

function errMsg(error: unknown): string {
  if (axios.isAxiosError(error) && error.response) {
    return `${error.message} ${JSON.stringify(error.response.data)}`;
  }
  return error instanceof Error ? error.message : String(error);
}
