import { API_URL } from '../config/apiConfig';

/**
 * Register a new user
 * @param {Object} userData - User data (email, password, name, address, phoneNo)
 * @param {String} profileImageUri - Path to user's profile image 
 * @returns {Promise} Response from API
 */
export const register = async (userData, profileImageUri) => {
  try {
    // Create form data for multi-part request (for image upload)
    const formData = new FormData();
    
    // Add user data to form
    Object.keys(userData).forEach(key => {
      formData.append(key, userData[key]);
    });
    
    // Add image if provided
    if (profileImageUri) {
      const uriParts = profileImageUri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      formData.append('avatar', {
        uri: profileImageUri,
        name: `avatar.${fileType}`,
        type: `image/${fileType}`
      });
    }
    
    // Make the API request
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type when using FormData
        'Accept': 'application/json',
      },
    });
    
    // Parse the response
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Login a user
 * @param {Object} credentials - User credentials (email, password)
 * @returns {Promise} Response from API
 */
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
