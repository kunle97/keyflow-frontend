
export async function apiClient(url, options = {}) {
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  export async function loginPost(url, body = {}, options = {}) {
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        ...options,
      };
  
      return await apiClient(url, requestOptions);
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  }
  
  export async function authPost(url, authToken, body = {}, options = {}) {
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`,
        },
        body: JSON.stringify(body),
        ...options,
      };
  
      return await apiClient(url, requestOptions);
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  }
  
  export default {
    get: apiClient,
    authPost,
  };