import React, { useState, useEffect } from 'react'
import { AlertTriangle, Plus, MapPin, Clock, CheckCircle, Users } from 'lucide-react'
import { roadConditionsAPI } from '../services/api'

const RoadConditions = () => {
  const [conditions, setConditions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    location_name: '',
    latitude: '',
    longitude: '',
    condition: 'clear',
    severity: 1,
    description: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchConditions()
  }, [])

  const fetchConditions = async () => {
    try {
      setLoading(true)
      const response = await roadConditionsAPI.getAll()
      setConditions(response.data)
    } catch (err) {
      console.error('Error fetching conditions:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await roadConditionsAPI.create(formData)
      setFormData({
        location_name: '',
        latitude: '',
        longitude: '',
        condition: 'clear',
        severity: 1,
        description: ''
      })
      setShowForm(false)
      fetchConditions()
    } catch (err) {
      setError('Failed to submit report. Please try again.')
      console.error('Error submitting condition:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleVerify = async (id) => {
    try {
      await roadConditionsAPI.verify(id)
      fetchConditions()
    } catch (err) {
      console.error('Error verifying condition:', err)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }))
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'clear': return '#28a745'
      case 'waterlogged': return '#ffc107'
      case 'flooded': return '#dc3545'
      case 'blocked': return '#dc3545'
      default: return '#6c757d'
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 1: return '#28a745'
      case 2: return '#ffc107'
      case 3: return '#fd7e14'
      case 4: return '#dc3545'
      default: return '#6c757d'
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#212529' }}>
          Road Conditions
        </h1>
        <p style={{ fontSize: '18px', color: '#6c757d' }}>
          Report and view real-time road conditions in your area
        </p>
      </div>

      {/* Report Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '32px' }}>
          <div className="card-header">
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={24} />
              Report Road Condition
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Location Name</label>
              <input
                type="text"
                name="location_name"
                placeholder="e.g., MG Road, Koramangala"
                value={formData.location_name}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Coordinates</label>
              <div className="flex gap-1">
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  placeholder="Latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  placeholder="Longitude"
                  value={formData.longitude}
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

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Condition</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="clear">Clear</option>
                  <option value="waterlogged">Waterlogged</option>
                  <option value="flooded">Flooded</option>
                  <option value="blocked">Blocked</option>
                  <option value="under_construction">Under Construction</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Severity</label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value={1}>Low</option>
                  <option value={2}>Medium</option>
                  <option value={3}>High</option>
                  <option value={4}>Critical</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea
                name="description"
                placeholder="Additional details about the road condition..."
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
              />
            </div>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Submit Report
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Conditions List */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={24} />
            Road Conditions
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            <Plus size={16} />
            Report Condition
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : conditions.length > 0 ? (
          <div className="grid grid-2">
            {conditions.map((condition) => (
              <div key={condition.id} className="card" style={{ marginBottom: '16px' }}>
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                  <h4 style={{ margin: 0 }}>{condition.location_name}</h4>
                  <div className="flex gap-1">
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: getConditionColor(condition.condition),
                        color: 'white'
                      }}
                    >
                      {condition.condition_display}
                    </span>
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: getSeverityColor(condition.severity),
                        color: 'white'
                      }}
                    >
                      Severity {condition.severity}
                    </span>
                  </div>
                </div>

                {condition.description && (
                  <p style={{ color: '#6c757d', marginBottom: '12px' }}>
                    {condition.description}
                  </p>
                )}

                <div className="flex-between" style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      <Clock size={12} />
                      {new Date(condition.reported_at).toLocaleString()}
                    </div>
                    {condition.reported_by_username && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={12} />
                        {condition.reported_by_username}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {condition.verified && (
                      <span style={{ color: '#28a745', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={12} />
                        Verified
                      </span>
                    )}
                    <span style={{ color: '#6c757d', fontSize: '12px' }}>
                      {condition.verification_count} verifications
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleVerify(condition.id)}
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                >
                  <CheckCircle size={16} />
                  Verify This Report
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
            <AlertTriangle size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>No road condition reports yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
              style={{ marginTop: '16px' }}
            >
              <Plus size={16} />
              Report First Condition
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoadConditions
