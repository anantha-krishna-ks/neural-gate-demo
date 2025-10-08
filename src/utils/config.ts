// src/utils/config.ts
export const getApiBaseUrl = () => {
    if (import.meta.env.DEV) {
      return 'http://localhost:5000/api'; // Local proxy
    }
    return 'https://ai.excelsoftcorp.com';
  };