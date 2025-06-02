import apiClient from "../libs/Configs/axiosConfig";

export class ApiMethods {
  static async get<T>(url: string): Promise<T> {
    const response = await apiClient.get<T>(url);
    return response.data;
  }

  static async post<TResponse = unknown, TBody extends object = object>(
    url: string,
    data?: TBody,
    options?: { withCredentials?: boolean }
  ): Promise<TResponse> {
    const response = await apiClient.post<TResponse>(url, data, options);
    return response.data;
  }

  static async postFormData<TResponse = unknown>(
    url: string,
    formData: FormData
  ): Promise<TResponse> {
    const response = await apiClient.post<TResponse>(url, formData, {
      headers: {
        // Let Axios set the correct multipart headers automatically
        // DO NOT set Content-Type manually
      },
    });

    return response.data;
  }

  static async patchFormData<TResponse = unknown>(
    url: string,
    formData: FormData
  ): Promise<TResponse> {
    const response = await apiClient.patch<TResponse>(url, formData, {
      headers: {
        // Let Axios set the correct multipart headers automatically
        // DO NOT set Content-Type manually
      },
    });

    return response.data;
  }

  static async put<TResponse = unknown, TBody extends object = object>(
    url: string,
    data: TBody
  ): Promise<TResponse> {
    const response = await apiClient.put<TResponse>(url, data);
    return response.data;
  }

  static async delete<TResponse>(url: string): Promise<TResponse> {
    const response = await apiClient.delete<TResponse>(url);
    return response.data;
  }

  static async patch<TResponse = unknown, TBody extends object = object>(
    url: string,
    data: TBody
  ): Promise<TResponse> {
    const response = await apiClient.patch<TResponse>(url, data);
    return response.data;
  }
}
