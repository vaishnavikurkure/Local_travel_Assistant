import React, { useState } from 'react';
import { Navigation, MapPin, Clock, Shield, Route } from 'lucide-react';
// CHANGED: Assuming you have a geocoding API service for reverse geocoding
import { routesAPI, geocodeAPI } from '../services/api';

const RoutePlanner = () => {
  // CHANGED: State now holds location names instead of coordinates
  const [formData, setFormData] = useState({
    start_location: '',
    end_location: '',
    transport_preference: '',
    avoid_flooded_areas: true
  });
  const [routes, setRoutes] = useState([]);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // The backend will now handle geocoding the location names
      const response = await routesAPI.planRoute(formData);
      setRoutes(response.data.routes);
      setWeatherAlerts(response.data.weather_alerts);
    } catch (err) {
      setError('Failed to plan route. Please check location names and try again.');
      console.error('Error planning route:', err);
    } finally {
      setLoading(false);
    }
  };

  // CHANGED: Function now performs reverse geocoding
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Step 1: Get coordinates from the browser
            const { latitude, longitude } = position.coords;

            // Step 2: Call a reverse geocoding API to get the address name
            const response = await geocodeAPI.reverseGeocode(latitude, longitude);
            const locationName = response.data.display_name; // Adjust based on your API response

            // Step 3: Set the location name in the form
            setFormData(prev => ({
              ...prev,
              start_location: locationName
            }));
          } catch (error) {
            console.error('Error reverse geocoding:', error);
            setError('Could not determine your location name.');
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to access your location. Please enable location services.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#212529' }}>
          Route Planner
        </h1>
        <p style={{ fontSize: '18px', color: '#6c757d' }}>
          Plan your safe journey avoiding flooded and waterlogged areas
        </p>
      </div>

      <div className="grid grid-2">
        {/* Route Planning Form */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Navigation size={24} />
              Plan Your Route
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            {/* CHANGED: Start Location Input */}
            <div className="form-group">
              <label className="form-label" htmlFor='start_location'>Start Location</label>
              <div className="flex gap-1">
                <input
                  type="text"
                  id='start_location'
                  name="start_location"
                  placeholder="e.g., Chhatrapati Shivaji Terminus"
                  value={formData.start_location}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="btn btn-secondary"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  <MapPin size={16} />
                  Current
                </button>
              </div>
            </div>

            {/* CHANGED: Destination Input */}
            <div className="form-group">
              <label className="form-label" htmlFor='end_location'>Destination</label>
              <div className="flex">
                <input
                  type="text"
                  id='end_location'
                  name="end_location"
                  placeholder="e.g., Bandra Worli Sea Link"
                  value={formData.end_location}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* --- Unchanged Preference and Options --- */}
            <div className="form-group">
              <label className="form-label" htmlFor='transport_preference'>Transport Preference</label>
              <select
                id='transport_preference'
                name="transport_preference"
                value={formData.transport_preference}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">Any</option>
                <option value="bus">Bus</option>
                <option value="metro">Metro</option>
                <option value="auto">Auto Rickshaw</option>
                <option value="taxi">Taxi</option>
                <option value="bike">Bike Taxi</option>
                <option value="walking">Walking</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="avoid_flooded_areas"
                  checked={formData.avoid_flooded_areas}
                  onChange={handleInputChange}
                  style={{ margin: 0 }}
                />
                Avoid flooded and waterlogged areas
              </label>
            </div>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
                  Planning Route...
                </>
              ) : (
                <>
                  <Route size={16} />
                  Plan Route
                </>
              )}
            </button>
          </form>
        </div>

        {/* --- Results Section (Unchanged) --- */}
        <div>
         {/* ... The rest of your JSX for displaying routes and alerts remains the same ... */}
        </div>
      </div>
    </div>
  );
}

export default RoutePlanner;