// /src/services/api.js

import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Road Conditions API
export const roadConditionsAPI = {
  getAll: () => api.get('/road-conditions/'),
  getNearby: (latitude, longitude, radius = 5) => 
    api.get(`/road-conditions/nearby/?latitude=${latitude}&longitude=${longitude}&radius=${radius}`),
  create: (data) => api.post('/road-conditions/', data),
  verify: (id) => api.post(`/road-conditions/${id}/verify/`),
}

// Routes API
export const routesAPI = {
  getAll: () => api.get('/routes/'),
  planRoute: (data) => api.post('/routes/plan_route/', data),
}

// Transport Options API
export const transportAPI = {
  getAll: () => api.get('/transport-options/'),
  getAvailable: (routeId = null) => {
    const url = routeId 
      ? `/transport-options/available/?route_id=${routeId}`
      : '/transport-options/available/'
    return api.get(url)
  },
}

// Weather Alerts API
export const weatherAPI = {
  getAll: () => api.get('/weather-alerts/'),
  getActive: () => api.get('/weather-alerts/active/'),
}

// NEW: Geocoding API using OpenStreetMap
export const geocodeAPI = {
  /**
   * Converts geographic coordinates into a human-readable address.
   
    @param {number} latitude 
    @param {number} longitude 
    @returns {Promise} 
   */
  reverseGeocode: (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    // We use axios.get() here because this is an external URL, 
    return axios.get(url);
  }
};

export default api