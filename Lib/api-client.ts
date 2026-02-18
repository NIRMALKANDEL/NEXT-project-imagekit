import { IVideo } from "../Models/Video";

export type VideoData = Omit<IVideo, "_id">;

type RequestOptions = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

class ApiClient {
  private baseUrl = "/api";

  private async request<T>(
    endpoint: string,
    options: RequestOptions
  ): Promise<T> {
    const { method, body, headers } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async getVideos() {
    return this.request<IVideo[]>("/videos", {
      method: "GET",
    });
  }

  async createVideo(videoData: VideoData) {
    return this.request<IVideo>("/videos", {
      method: "POST",
      body: videoData,
    });
  }
}

export const apiClient = new ApiClient();
