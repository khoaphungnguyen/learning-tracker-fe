import axios from "axios";
import { commitSession, getSession } from "~/sessions";

export type LoginPayload = {
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
};

const Api = class Api {
  baseURL: string;
  token: string | undefined;
  constructor() {
    this.baseURL = process.env.API_BASE_URL as string;
    this.token = "";
  }

  initializeInstance = () => {
    const baseURL = this.baseURL;

    const instance = axios.create({
      baseURL,
      withCredentials: true, // Allow sending cookies
    });

    instance.interceptors.response.use(undefined, async (error) => {
      if (error.response?.status === 401 && !error.config._retry) {
        error.config._retry = true;

        // Refresh the token
        const newToken = await this.refreshToken();

        if (newToken) {
          this.token = newToken;

          error.config.headers["Authorization"] = `Bearer ${newToken}`;
          return instance(error.config);
        }
      }

      return Promise.reject(error);
    });

    return instance;
  };

  publicRequest = (url: string, method: string, data: any) => {
    const instance = this.initializeInstance();
    return instance({
      url,
      method,
      data,
    });
  };

  loginUser = (payload: LoginPayload) => {
    const url = "/auth/login";
    return this.publicRequest(url, "post", payload);
  };

  async setToken(request: Request) {
    const session = await getSession(request.headers.get("Cookie"));
    const token = session.get("token");
    this.token = token || "";
  }

  authClient = (url: string, method: string, data: any) => {
    const instance = this.initializeInstance();
    instance.interceptors.request.use(
      (config: any) => {
        config.headers = {
          Authorization: `Bearer ${this.token}`,
        };

        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    return instance({
      url,
      method,
      data,
    });
  };


  getGoals = () => {
    const url = "/protected/goals";
    return this.authClient(url, "get", {});
  };

  async refreshToken() {
    try {
      const response = await axios.post(`${this.baseURL}/auth/refresh`);

      const newToken = response.data.token;

      // Update the session with the new token
      const session = await getSession(document.cookie);
      session.set("token", newToken);
      const updatedCookie = await commitSession(session);
      document.cookie = updatedCookie;

      return newToken;
    } catch (error) {
      console.error("Error refreshing token", error);
      return null;
    }
  }
};
export default Api;
