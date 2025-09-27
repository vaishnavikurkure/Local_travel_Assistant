import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, CloudRain, AlertTriangle, Bus, Navigation, Plus } from 'lucide-react'
import { roadConditionsAPI, weatherAPI } from '../services/api'
import { useWeatherAlerts } from '../services/WeatherAlertContext'

const Dashboard = () => {
  const { alerts: weatherAlerts } = useWeatherAlerts()
  const [recentConditions, setRecentConditions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentConditions = async () => {
      try {
        const response = await roadConditionsAPI.getAll()
        setRecentConditions(response.data.slice(0, 5))
      } catch (error) {
        console.error('Error fetching recent conditions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentConditions()
  }, [])

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
          Welcome to Monsoon Travel Assistant
        </h1>
        <p style={{ fontSize: '18px', color: '#6c757d' }}>
          Plan your safe journey through the city during monsoon season
        </p>
      </div>

      {/* Weather Alerts */}
      {weatherAlerts.length > 0 && (
        <div className="card" style={{ marginBottom: '32px' }}>
          <div className="card-header">
            <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CloudRain size={24} />
              Active Weather Alerts
            </h2>
          </div>
          <div className="grid grid-2">
            {weatherAlerts.map((alert) => (
              <div key={alert.id} className={`alert alert-${alert.severity >= 3 ? 'danger' : 'warning'}`}>
                <h4 style={{ marginBottom: '8px' }}>{alert.title}</h4>
                <p style={{ marginBottom: '8px' }}>{alert.description}</p>
                <small style={{ color: 'inherit', opacity: 0.8 }}>
                  Affected Areas: {alert.affected_areas}
                </small>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <div className="card-header">
          <h2 className="card-title">Quick Actions</h2>
        </div>
        <div className="grid grid-3">
          <Link to="/route-planner" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ textAlign: 'center' }}>
              <Navigation size={48} style={{ color: '#667eea', marginBottom: '16px' }} />
              <h3 style={{ marginBottom: '8px' }}>Plan Route</h3>
              <p style={{ color: '#6c757d', fontSize: '14px' }}>
                Find safe routes avoiding flooded areas
              </p>
            </div>
          </Link>

          <Link to="/road-conditions" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ textAlign: 'center' }}>
              <AlertTriangle size={48} style={{ color: '#ffc107', marginBottom: '16px' }} />
              <h3 style={{ marginBottom: '8px' }}>Report Conditions</h3>
              <p style={{ color: '#6c757d', fontSize: '14px' }}>
                Share road conditions with other travelers
              </p>
            </div>
          </Link>

          <Link to="/transport" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ textAlign: 'center' }}>
              <Bus size={48} style={{ color: '#28a745', marginBottom: '16px' }} />
              <h3 style={{ marginBottom: '8px' }}>Transport Options</h3>
              <p style={{ color: '#6c757d', fontSize: '14px' }}>
                Check available transport services
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Road Conditions */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={24} />
            Recent Road Conditions
          </h2>
          <Link to="/road-conditions" className="btn btn-secondary">
            View All
          </Link>
        </div>
        
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : recentConditions.length > 0 ? (
          <div className="grid grid-2">
            {recentConditions.map((condition) => (
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
                  <p style={{ color: '#6c757d', marginBottom: '8px' }}>
                    {condition.description}
                  </p>
                )}
                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                  Reported {new Date(condition.reported_at).toLocaleString()}
                  {condition.verified && (
                    <span style={{ color: '#28a745', marginLeft: '8px' }}>✓ Verified</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
            <AlertTriangle size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>No recent road condition reports</p>
            <Link to="/road-conditions" className="btn btn-primary" style={{ marginTop: '16px' }}>
              <Plus size={16} />
              Report First Condition
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
