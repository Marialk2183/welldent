// API Configuration - Dynamic base URL helper
(function() {
    'use strict';
    
    // Get base URL dynamically
    function getBaseUrl() {
        // In Electron, use localhost:3000
        // In browser, use current origin or localhost:3000
        if (window.location.protocol === 'file:') {
            // Electron environment
            return 'http://localhost:3000';
        } else {
            // Browser environment - use current origin or default to localhost:3000
            const origin = window.location.origin;
            return origin.includes('localhost') || origin.includes('127.0.0.1') 
                ? origin 
                : 'http://localhost:3000';
        }
    }
    
    // Expose globally
    window.API_BASE_URL = getBaseUrl();
    window.getApiUrl = function(endpoint) {
        // Remove leading slash if present to avoid double slashes
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
        return `${window.API_BASE_URL}/${cleanEndpoint}`;
    };
    
    console.log('API Base URL configured:', window.API_BASE_URL);
})();

