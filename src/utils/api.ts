const API_BASE_URL = 'https://ai.excelsoftcorp.com';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

export async function apiRequest<T = any>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  isFileUpload: boolean = false,
  authToken?: string
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };

    // Add authorization header if token is provided
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    // Set content type for non-file uploads
    if (!isFileUpload) {
      headers['Content-Type'] = 'application/json';
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
      mode: 'cors',
      credentials: 'include',
      body: data ? (isFileUpload ? data : JSON.stringify(data)) : undefined,
    };

    console.log(`Making ${method} request to:`, url);
    const response = await fetch(url, fetchOptions);
    
    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API request failed:', {
        status: response.status,
        statusText: response.statusText,
        url,
        error: errorText
      });
      
      // Try to parse error as JSON if possible
      try {
        const errorData = JSON.parse(errorText);
        return {
          error: errorData.message || errorData.error || response.statusText,
          status: response.status
        };
      } catch (e) {
        return {
          error: errorText || response.statusText,
          status: response.status
        };
      }
    }

    // Handle empty responses
    const responseText = await response.text();
    if (!responseText) {
      return {
        data: undefined,
        status: response.status
      };
    }

    // Parse JSON response
    try {
      const jsonData = JSON.parse(responseText);
      return {
        data: jsonData,
        status: response.status
      };
    } catch (e) {
      // If response is not JSON, return as text
      return {
        data: responseText as any,
        status: response.status
      };
    }
  } catch (error) {
    console.error('API request failed:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 0
    };
  }
}
