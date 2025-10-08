// Centralized base URL picker for API calls
export const getApiBase = (): string => {
  const mode = import.meta.env.MODE;
  const prodBase = import.meta.env.VITE_API_BASE as string | undefined;
  if (mode === 'development') return '/api';
  // In production, we must return an absolute URL. Fallback to known API if env is not set.
  return (prodBase && prodBase.trim().length > 0)
    ? prodBase
    : 'https://ai.excelsoftcorp.com/ai-apps/api';
};
