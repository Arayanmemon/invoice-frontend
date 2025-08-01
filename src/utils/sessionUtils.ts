// Utility functions for managing application state and cache

export const clearApplicationCache = () => {
  try {
    // Clear localStorage items that might persist application data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('app_') || 
          key.startsWith('documents_') || 
          key.startsWith('contracts_') || 
          key.startsWith('invoices_') ||
          key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('Application cache cleared');
  } catch (error) {
    console.error('Error clearing application cache:', error);
  }
};

export const clearSessionData = () => {
  try {
    // Clear session-specific data
    clearApplicationCache();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    console.log('Session data cleared');
  } catch (error) {
    console.error('Error clearing session data:', error);
  }
};

export const isTokenExpired = (token?: string | null): boolean => {
  if (!token) return true;
  
  try {
    // Basic JWT token expiration check
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

export const validateSession = (): boolean => {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (!accessToken || !refreshToken) {
    clearSessionData();
    return false;
  }
  
  if (isTokenExpired(accessToken)) {
    console.log('Access token expired, clearing session');
    clearSessionData();
    return false;
  }
  
  return true;
};

// File validation utilities
export const MAX_FILE_SIZE = 500 * 1024; // 500KB

export const validateFileSize = (file: File, maxSize: number = MAX_FILE_SIZE): boolean => {
  return file.size <= maxSize;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const getFileSizeErrorMessage = (maxSizeKB: number = 500): string => {
  return `File size must be less than ${maxSizeKB}KB. Please compress your PDF or use a smaller file.`;
};
