import * as SecureStore from 'expo-secure-store'; // Import SecureStore
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

    // Store token in SecureStore
    await SecureStore.setItemAsync('token', data.token);

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Fetch user by ID
 * @param {String} userId - User ID
 * @returns {Promise} Response from API
 */
export const getUserById = async (userId) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user');
    }

    return data.user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

/**
 * Update user by ID
 * @param {String} userId - User ID
 * @param {Object} userData - User data (name, address, phoneNo)
 * @param {String} avatarUri - Path to user's avatar image
 * @returns {Promise} Response from API
 */
export const updateUser = async (userId, userData, avatarUri) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    const formData = new FormData();

    // Add user data to form
    Object.keys(userData).forEach((key) => {
      formData.append(key, userData[key]);
    });

    // Add avatar if provided
    if (avatarUri) {
      const uriParts = avatarUri.split('.');
      const fileType = uriParts[uriParts.length - 1];

      formData.append('avatar', {
        uri: avatarUri,
        name: `avatar.${fileType}`,
        type: `image/${fileType}`,
      });
    }

    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update user');
    }

    return data.user;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Logout a user by removing the token and making an API call
 * @returns {Promise} Response from API
 */
export const logout = async () => {
  try {
    const token = await SecureStore.getItemAsync('token');
    
    if (token) {
      // Call logout endpoint (will fail silently if server is unavailable)
      try {
        await fetch(`${API_URL}/users/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.log('Server logout failed, continuing with local logout');
      }
    }
    
    // Clear stored credentials regardless of server response
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('userId');
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
