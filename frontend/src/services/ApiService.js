import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 300000, // 5 minutes for Instagram scraping
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for logging
    this.api.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging and error handling
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error('❌ API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Scraping endpoint
  async scrapeComplete(username, options = {}) {
    const {
      postsLimit = 12,
      reelsLimit = 5,
      analyzeContent = true
    } = options;

    const response = await this.api.post(`/scraping/complete/${username}`, {}, {
      params: {
        postsLimit,
        reelsLimit,
        analyzeContent
      }
    });
    return response.data;
  }

  handleApiError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Data:', error.response.data);
      console.error('API Error Status:', error.response.status);
      console.error('API Error Headers:', error.response.headers);
      return {
        message: error.response.data.error || `Request failed with status ${error.response.status}`,
        status: error.response.status,
      };
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
      return { message: 'No response from server. Please check your network connection.' };
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Setup Error:', error.message);
      return { message: error.message };
    }
  }
}

const apiServiceInstance = new ApiService();
export default apiServiceInstance;