const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: any;
}

interface RequestOptions {
  headers?: Record<string, string>;
}

class HttpService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private getHeaders(auth: boolean = true): Record<string, string> {
    if (auth) {
      return this.getAuthHeaders();
    }
    return {
      "Content-Type": "application/json",
    };
  }

  private async makeRequest<T = any>(
    endPoint: string,
    method: string,
    body?: any,
    auth: boolean = true,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${BASE_URL}/${endPoint}`;
      const headers = {
        ...this.getHeaders(auth),
        ...options?.headers,
      };
      const config: RequestInit = {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) }),
      };

      const response = await fetch(url, config);
      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP ${response.status}:${response.statusText}`
        );
      }

      return data;
    } catch (error: any) {
      console.error(`Api Error: [${method} ${endPoint}]:`, error);
      throw error;
    }
  }

  async getWithAuth<T = any>(
    endPoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endPoint, "GET", null, true, options);
  }

  async postWithAuth<T = any>(
    endPoint: string,
    body: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endPoint, "POST", body, true, options);
  }

  async putWithAuth<T = any>(
    endPoint: string,
    body: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endPoint, "PUT", body, true, options);
  }

  async DeleteWithAuth<T = any>(
    endPoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endPoint, "DELETE", null, true, options);
  }

  async postWithoutAuth<T = any>(
    endPoint: string,
    body: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endPoint, "POST", body, false, options);
  }

  async getWithoutAuth<T = any>(
    endPoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endPoint, "GET", null, false, options);
  }

  async putWithoutAuth<T = any>(
    endPoint: string,
    body: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endPoint, "PUT", body, false, options);
  }

  async DeleteWithoutAuth<T = any>(
    endPoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endPoint, "DELETE", null, false, options);
  }
}

// Export the singletone instance
export const httpService = new HttpService();

// Bind create a new function where this is permently set to the instance of HttpService

export const getWithAuth = httpService.getWithAuth.bind(httpService);
export const postWithAuth = httpService.postWithAuth.bind(httpService);
export const putWithAuth = httpService.putWithAuth.bind(httpService);
export const DeleteWithAuth = httpService.DeleteWithAuth.bind(httpService);
export const postWithoutAuth = httpService.postWithoutAuth.bind(httpService);
export const getWithoutAuth = httpService.getWithoutAuth.bind(httpService);
