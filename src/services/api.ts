// API URL handling - environment-based configuration
import { clearSessionData, validateSession } from '@/utils/sessionUtils';

const getApiUrl = (): string => {
  debugger;
  // Check if we're in the browser environment
  if (typeof window !== 'undefined') {
    // In production, use the environment variable set by Next.js
    return 'https://whnqrgiusg5oq5ynz5gjkrpzwu0kwwlz.lambda-url.eu-north-1.on.aws';
  }
  // Server-side fallback
  return process.env.API_BASE_URL || 'https://whnqrgiusg5oq5ynz5gjkrpzwu0kwwlz.lambda-url.eu-north-1.on.aws';
};

// const getApiUrl = (): string => {
//   // Check if we're in the browser environment
//   if (typeof window !== 'undefined') {
//     // For development/testing, use local backend
//     return 'http://localhost:8000';
//   }
//   // Server-side fallback to local backend for testing
//   return process.env.API_BASE_URL || 'http://localhost:8000';
// };

const API_URL = getApiUrl();
const API_V1 = '/api/v1';

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  provider?: string;
  is_active: boolean;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
}

// Types
export interface Item {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  total_price?: number;
}

export interface ContractCreate {
  supplier_name: string;
  items: Item[];
}

export interface Contract {
  id: string;
  supplier_name: string;
  items: Item[];
  created_at: string;
  updated_at?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  total_price?: number;
}

export interface InvoiceData {
  id: string;
  invoice_number: string;
  supplier_name: string;
  issue_date: string;
  due_date?: string;
  items: InvoiceItem[];
  subtotal?: number;
  tax?: number;
  total: number;
  raw_text?: string;
  created_at: string;
}

export interface PriceComparisonDetail {
  service_name: string;
  contract_price: number | null;
  invoice_price: number;
  match: boolean;
  note?: string;
}

export interface ComparisonResult {
  contract_id: string;
  invoice_data: InvoiceData;
  matches: {
    prices_match: boolean;
    all_services_in_contract: boolean;
  };
  issues: Array<{
    type: string;
    service_name?: string;
    contract_value?: number | string;
    invoice_value?: number | string;
  }>;
  overall_match: boolean;
  price_comparison_details: PriceComparisonDetail[];
}

// Authentication helper functions
const getAuthHeaders = (): HeadersInit => {
  // Validate session before returning headers
  if (!validateSession()) {
    console.log('Session invalid, clearing and redirecting to login');
    return {};
  }
  
  const token = localStorage.getItem('access_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const getAuthenticatedHeaders = (additionalHeaders?: HeadersInit): HeadersInit => {
  return {
    ...getAuthHeaders(),
    ...additionalHeaders,
  };
};

// Helper function to handle errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error:', response.status, errorText);
    
    // Handle authentication errors
    if (response.status === 401) {
      // Token expired or invalid, clear all application data and redirect to login
      console.log('401 error received, clearing session and redirecting');
      clearSessionData();
      window.location.href = '/';
    }
    
    throw new Error(`API request failed with status ${response.status}: ${errorText}`);
  }
  return response.json();
};

// Debug function
const debugFetch = async (url: string, options?: RequestInit) => {
  console.log(`Fetching ${url}`, options);
  
  // Ensure CORS headers for production
  const defaultOptions: RequestInit = {
    mode: 'cors',
    credentials: 'omit',
    ...options,
  };
  
  // Add additional headers for production compatibility
  if (options?.headers) {
    defaultOptions.headers = {
      ...options.headers,
      'Accept': 'application/json',
    };
  }
  
  try {
    const response = await fetch(url, defaultOptions);
    console.log(`Response for ${url}:`, response.status, response.statusText);
    
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorMessage = `HTTP ${response.status} - ${response.statusText}`;
      
      if (contentType?.includes('application/json')) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.detail || errorMessage;
        } catch (e) {
          console.warn('Could not parse error response as JSON');
        }
      } else {
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage = errorText;
          }
        } catch (e) {
          console.warn('Could not read error response text');
        }
      }
      
      console.error(`Fetch error for ${url}:`, errorMessage);
      throw new Error(errorMessage);
    }
    
    return response;
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
};

// API services
export const api = {
  // Contract endpoints
  contracts: {
    getAll: async (): Promise<Contract[]> => {
      try {
        const response = await debugFetch(`${API_URL}${API_V1}/contracts/`, {
          headers: getAuthenticatedHeaders(),
        });
        return handleResponse(response);
      } catch (error) {
        console.error('Error in getAll:', error);
        throw new Error('Failed to fetch contracts');
      }
    },
    
    getById: async (id: string): Promise<Contract> => {
      try {
        const response = await debugFetch(`${API_URL}${API_V1}/contracts/${id}`, {
          headers: getAuthenticatedHeaders(),
        });
        return handleResponse(response);
      } catch (error) {
        console.error('Error in getById:', error);
        throw new Error('Failed to fetch contract');
      }
    },
    
    create: async (contractData: ContractCreate): Promise<Contract> => {
      try {
        const response = await debugFetch(`${API_URL}${API_V1}/contracts/`, {
          method: 'POST',
          headers: getAuthenticatedHeaders({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(contractData),
        });
        return handleResponse(response);
      } catch (error) {
        console.error('Error in create:', error);
        throw new Error('Failed to create contract');
      }
    },
    
    upload: async (formData: FormData): Promise<Contract> => {
      try {
        // Log the formData contents for debugging
        console.log('Uploading contract with formData');
        for (const [key, value] of formData.entries()) {
          console.log(`FormData entry: ${key}`, value instanceof File ? `File: ${value.name}, size: ${value.size}, type: ${value.type}` : value);
        }
        
        // Get auth headers but don't set Content-Type for FormData (let browser set it with boundary)
        const authHeaders = getAuthHeaders();
        
        const response = await debugFetch(`${API_URL}${API_V1}/contracts/upload`, {
          method: 'POST',
          headers: authHeaders, // Don't add Content-Type for FormData
          body: formData,
        });
        
        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          let errorText = `HTTP ${response.status} - ${response.statusText}`;
          
          try {
            if (contentType?.includes('application/json')) {
              const errorData = await response.json();
              errorText = errorData.detail || errorData.message || errorText;
            } else {
              errorText = await response.text() || errorText;
            }
          } catch (e) {
            console.warn('Could not parse error response');
          }
          
          console.error('Upload error response:', errorText);
          throw new Error(`Upload failed: ${errorText}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error in upload:', error);
        if (error instanceof Error) {
          throw new Error(`Failed to upload contract: ${error.message}`);
        }
        throw new Error('Failed to upload contract');
      }
    },
    
    delete: async (id: string): Promise<void> => {
      try {
        const response = await debugFetch(`${API_URL}${API_V1}/contracts/${id}`, {
          method: 'DELETE',
          headers: getAuthenticatedHeaders(),
        });
        return handleResponse(response);
      } catch (error) {
        console.error('Error in delete:', error);
        throw new Error('Failed to delete contract');
      }
    },
    
    update: async (id: string, contractData: ContractCreate): Promise<Contract> => {
      try {
        const response = await debugFetch(`${API_URL}${API_V1}/contracts/${id}`, {
          method: 'PUT',
          headers: getAuthenticatedHeaders({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(contractData),
        });
        return handleResponse(response);
      } catch (error) {
        console.error('Error in update:', error);
        throw new Error('Failed to update contract');
      }
    },
    
    clearAll: async (): Promise<void> => {
      try {
        console.log('Calling contracts clear-all endpoint...');
        const url = `${API_URL}${API_V1}/contracts/clear-all`;
        console.log('Clear contracts URL:', url);
        
        const response = await debugFetch(url, {
          method: 'DELETE',
          headers: getAuthenticatedHeaders(),
        });
        return handleResponse(response);
      } catch (error) {
        console.error('Error in clearAll contracts:', error);
        throw new Error('Failed to clear all contracts');
      }
    }
  },
  
  // Invoice endpoints
  invoices: {
    getAll: async (): Promise<InvoiceData[]> => {
      try {
        // Try direct API first for debugging
        const directUrl = `${API_URL}${API_V1}/invoices/`;
        console.log("Trying direct API URL:", directUrl);
        const directResponse = await debugFetch(directUrl, {
          headers: getAuthenticatedHeaders(),
        });
        
        if (directResponse.ok) {
          return await directResponse.json();
        }
        
        // Fall back to relative URL if direct fails
        console.log("Direct API failed, trying relative URL");
        const response = await debugFetch(`${API_URL}${API_V1}/invoices/`, {
          headers: getAuthenticatedHeaders(),
        });
        return handleResponse(response);
      } catch (error) {
        console.error('Error in getAll invoices:', error);
        throw new Error('Failed to fetch invoices');
      }
    },
    
    getById: async (id: string): Promise<InvoiceData> => {
      try {
        const response = await debugFetch(`${API_URL}${API_V1}/invoices/${id}`, {
          headers: getAuthenticatedHeaders(),
        });
        return handleResponse(response);
      } catch (error) {
        console.error('Error in getById invoice:', error);
        throw new Error('Failed to fetch invoice');
      }
    },
    
    processInvoice: async (file: File): Promise<InvoiceData> => {
      try {
        // Read the file as base64
        const fileContent = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            // Extract the base64 content (remove data:application/pdf;base64, prefix)
            const base64String = reader.result as string;
            const base64Content = base64String.split(',')[1];
            resolve(base64Content);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        
        // Get file type from the file extension
        const fileType = file.name.split('.').pop()?.toLowerCase() || '';
        
        // Send request with base64 encoded content
        const response = await debugFetch(`${API_URL}${API_V1}/invoices/process`, {
          method: 'POST',
          headers: getAuthenticatedHeaders({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            file_content: fileContent,
            file_type: fileType
          }),
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Error in processInvoice:', error);
        throw new Error('Failed to process invoice');
      }
    },
    
    deleteById: async (id: string): Promise<void> => {
      try {
        const response = await debugFetch(`${API_URL}${API_V1}/invoices/${id}`, {
          method: 'DELETE',
          headers: getAuthenticatedHeaders(),
        });
        // Check if response is ok, but don't expect JSON for a 200/204 no content
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error deleting invoice:', response.status, errorText);
          throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }
        // No content expected, so just return
        return;
      } catch (error) {
        console.error('Error in deleteById invoice:', error);
        throw new Error('Failed to delete invoice');
      }
    },
    
    clearAll: async (): Promise<void> => {
      try {
        console.log('Calling invoices clear-all endpoint...');
        const url = `${API_URL}${API_V1}/invoices/clear-all`;
        console.log('Clear invoices URL:', url);
        
        const response = await debugFetch(url, {
          method: 'DELETE',
          headers: getAuthenticatedHeaders(),
        });
        return handleResponse(response);
      } catch (error) {
        console.error('Error in clearAll invoices:', error);
        throw new Error('Failed to clear all invoices');
      }
    }
  }
};

// Authentication API
export const authAPI = {
  login: async (email: string, password: string): Promise<TokenResponse> => {
    try {
      const response = await debugFetch(`${API_URL}${API_V1}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error in login:', error);
      throw new Error('Failed to login');
    }
  },

  register: async (email: string, name: string, password: string): Promise<TokenResponse> => {
    try {
      const response = await debugFetch(`${API_URL}${API_V1}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error in register:', error);
      throw new Error('Failed to register');
    }
  },

  logout: async (): Promise<void> => {
    try {
      const response = await debugFetch(`${API_URL}${API_V1}/auth/logout`, {
        method: 'POST',
        headers: getAuthenticatedHeaders(),
      });
      // No need to handle response for logout
    } catch (error) {
      console.error('Error in logout:', error);
      // Don't throw error for logout failures
    }
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    try {
      const response = await debugFetch(`${API_URL}${API_V1}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error in refreshToken:', error);
      throw new Error('Failed to refresh token');
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await debugFetch(`${API_URL}${API_V1}/auth/me`, {
        method: 'GET',
        headers: getAuthenticatedHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      throw new Error('Failed to get current user');
    }
  },

  // OAuth URLs
  getGoogleOAuthUrl: (): string => {
    return `${API_URL}${API_V1}/oauth/google`;
  },

  getLinkedInOAuthUrl: (): string => {
    return `${API_URL}${API_V1}/oauth/linkedin`;
  },

  // Password reset functions
  forgotPassword: async (email: string): Promise<{ message: string; success: boolean }> => {
    try {
      const response = await debugFetch(`${API_URL}${API_V1}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error in forgotPassword:', error);
      throw new Error('Failed to send password reset email');
    }
  },

  verifyResetToken: async (token: string): Promise<{ message: string; success: boolean }> => {
    try {
      const response = await debugFetch(`${API_URL}${API_V1}/auth/verify-reset-token/${token}`, {
        method: 'GET',
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error in verifyResetToken:', error);
      throw new Error('Invalid or expired reset token');
    }
  },

  resetPassword: async (token: string, newPassword: string): Promise<{ message: string; success: boolean }> => {
    try {
      const response = await debugFetch(`${API_URL}${API_V1}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error in resetPassword:', error);
      throw new Error('Failed to reset password');
    }
  },
};

// Profile API
export const profileAPI = {
  updateProfile: async (name: string): Promise<User> => {
    try {
      const response = await debugFetch(`${API_URL}${API_V1}/profile/me`, {
        method: 'PUT',
        headers: getAuthenticatedHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ name }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw new Error('Failed to update profile');
    }
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    try {
      const response = await debugFetch(`${API_URL}${API_V1}/profile/change-password`, {
        method: 'POST',
        headers: getAuthenticatedHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ 
          current_password: currentPassword, 
          new_password: newPassword 
        }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error in changePassword:', error);
      throw new Error('Failed to change password');
    }
  },

  deleteAccount: async (): Promise<{ message: string }> => {
    try {
      const response = await debugFetch(`${API_URL}${API_V1}/profile/me`, {
        method: 'DELETE',
        headers: getAuthenticatedHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error in deleteAccount:', error);
      throw new Error('Failed to delete account');
    }
  },

  exportData: async (): Promise<any> => {
    try {
      const response = await debugFetch(`${API_URL}${API_V1}/profile/export-data`, {
        method: 'POST',
        headers: getAuthenticatedHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error in exportData:', error);
      throw new Error('Failed to export data');
    }
  },
};

// Settings types and API
export interface UserSettings {
  // General Settings
  theme: string;
  language: string;
  timezone: string;
  sound_enabled: boolean;
  auto_save: boolean;
  compact_mode: boolean;
  
  // Processing Settings
  ai_model: string;
  ocr_accuracy: string;
  auto_processing: boolean;
  batch_size: number;
  retry_attempts: number;
  timeout_seconds: number;
  
  // Security Settings
  two_factor_auth: boolean;
  session_timeout: number;
  login_notifications: boolean;
  ip_whitelist?: string;
  data_encryption: boolean;
  audit_log: boolean;
  
  // Storage Settings
  retention_days: number;
  auto_cleanup: boolean;
  compression_enabled: boolean;
  backup_frequency: string;
  
  // Notification Preferences
  email_notifications: boolean;
  processing_alerts: boolean;
  security_alerts: boolean;
  weekly_reports: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface UserSettingsUpdate {
  // General Settings
  theme?: string;
  language?: string;
  timezone?: string;
  sound_enabled?: boolean;
  auto_save?: boolean;
  compact_mode?: boolean;
  
  // Processing Settings
  ai_model?: string;
  ocr_accuracy?: string;
  auto_processing?: boolean;
  batch_size?: number;
  retry_attempts?: number;
  timeout_seconds?: number;
  
  // Security Settings
  two_factor_auth?: boolean;
  session_timeout?: number;
  login_notifications?: boolean;
  ip_whitelist?: string;
  data_encryption?: boolean;
  audit_log?: boolean;
  
  // Storage Settings
  retention_days?: number;
  auto_cleanup?: boolean;
  compression_enabled?: boolean;
  backup_frequency?: string;
  
  // Notification Preferences
  email_notifications?: boolean;
  processing_alerts?: boolean;
  security_alerts?: boolean;
  weekly_reports?: boolean;
}

export const settingsAPI = {
  getSettings: async (): Promise<UserSettings> => {
    try {
      const response = await debugFetch(`${API_URL}${API_V1}/profile/settings`, {
        method: 'GET',
        headers: getAuthenticatedHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error in getSettings:', error);
      throw new Error('Failed to get settings');
    }
  },

  updateSettings: async (settings: UserSettingsUpdate): Promise<UserSettings> => {
    try {
      const response = await debugFetch(`${API_URL}${API_V1}/profile/settings`, {
        method: 'PUT',
        headers: getAuthenticatedHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(settings),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error in updateSettings:', error);
      throw new Error('Failed to update settings');
    }
  },
}; 