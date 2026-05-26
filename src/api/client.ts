import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/',
  timeout: 10000, // 10 second timeout for mobile network resilience
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const formattedError = {
      message: error.response?.data?.message || error.message || 'An unknown network error occurred',
      status: error.response?.status,
      code: error.code,
    };
    
    console.warn('[apiClient] Request Failed:', formattedError);
    return Promise.reject(new Error(formattedError.message));
  }
);
