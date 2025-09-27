import React, { useState, useEffect } from 'react'
import { CloudRain, AlertTriangle, Clock, MapPin } from 'lucide-react'
import { weatherAPI } from '../services/api'

const WeatherAlerts = () => {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      const response = await weatherAPI.getActive()
      setAlerts(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch weather alerts')
      console.error('Error fetching weather alerts:', err)
    } finally {
      setLoading(false)
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

  const getAlertIcon = (alertType) => {
    switch (alertType) {
      case 'heavy_rain':
      case 'flood_warning':
        return <CloudRain size={24} />
      case 'storm':
      case 'visibility_low':
        return <AlertTriangle size={24} />
      default:
        return <AlertTriangle size={24} />
    }
  }

  const isAlertActive = (alert) => {
    const now = new Date()
    const validFrom = new Date(alert.valid_from)
    const validUntil = new Date(alert.valid_until)
    return now >= validFrom && now <= validUntil && alert.is_active
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#212529' }}>
          Weather Alerts
        </h1>
        <p style={{ fontSize: '18px', color: '#6c757d' }}>
          Stay informed about weather conditions that may affect your travel
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CloudRain size={24} />
            Active Weather Alerts
          </h2>
          <button
            onClick={fetchAlerts}
            className="btn btn-secondary"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
                Refreshing...
              </>
            ) : (
              'Refresh'
            )}
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : alerts.length > 0 ? (
          <div className="grid grid-2">
            {alerts.map((alert) => (
              <div key={alert.id} className={`alert ${alert.severity >= 3 ? 'alert-danger' : 'alert-warning'}`}>
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {getAlertIcon(alert.alert_type)}
                    <h4 style={{ margin: 0 }}>{alert.title}</h4>
                  </div>
                  <div className="flex gap-1">
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: getSeverityColor(alert.severity),
                        color: 'white'
                      }}
                    >
                      {alert.severity_display}
                    </span>
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: isAlertActive(alert) ? '#28a745' : '#6c757d',
                        color: 'white'
                      }}
                    >
                      {isAlertActive(alert) ? 'Active' : 'Expired'}
                    </span>
                  </div>
                </div>

                <p style={{ marginBottom: '12px' }}>{alert.description}</p>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <MapPin size={16} />
                    <strong>Affected Areas:</strong>
                  </div>
                  <p style={{ marginLeft: '24px', color: 'inherit', opacity: 0.9 }}>
                    {alert.affected_areas}
                  </p>
                </div>

                <div className="flex-between" style={{ fontSize: '12px', opacity: 0.8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    Valid: {new Date(alert.valid_from).toLocaleString()} - {new Date(alert.valid_until).toLocaleString()}
                  </div>
                  <div>
                    {alert.alert_type_display}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
            <CloudRain size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>No active weather alerts</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Weather conditions are normal. Safe travels!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default WeatherAlerts
