// API utility for version information
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const versionApi = {
  /**
   * Get version information from backend
   */
  getBackendVersion: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/version`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching backend version:', error);
      return {
        name: 'episol-backend',
        version: 'unknown',
        error: error.message
      };
    }
  },

  /**
   * Get frontend version from package.json
   */
  getFrontendVersion: () => {
    // This is imported at build time
    const packageJson = require('../../package.json');
    return {
      name: packageJson.name,
      version: packageJson.version
    };
  },

  /**
   * Get complete version information for both frontend and backend
   */
  getFullVersionInfo: async () => {
    const frontend = versionApi.getFrontendVersion();
    const backend = await versionApi.getBackendVersion();
    
    return {
      frontend,
      backend,
      synchronized: frontend.version === backend.version
    };
  }
};
