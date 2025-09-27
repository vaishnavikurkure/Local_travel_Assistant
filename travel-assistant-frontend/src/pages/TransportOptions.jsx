import React, { useState, useEffect } from 'react'
import { Bus, Clock, DollarSign, MapPin, RefreshCw } from 'lucide-react'
import { transportAPI } from '../services/api'

const TransportOptions = () => {
  const [transportOptions, setTransportOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRoute, setSelectedRoute] = useState('')

  useEffect(() => {
    fetchTransportOptions()
  }, [selectedRoute])

  const fetchTransportOptions = async () => {
    try {
      setLoading(true)
      const response = await transportAPI.getAvailable(selectedRoute || null)
      setTransportOptions(response.data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch transport options')
      console.error('Error fetching transport options:', err)
    } finally {
      setLoading(false)
    }
  }

  const getTransportIcon = (type) => {
    switch (type) {
      case 'bus':
        return <Bus size={24} />
      case 'metro':
        return <Bus size={24} />
      case 'auto':
        return <Bus size={24} />
      case 'taxi':
        return <Bus size={24} />
      case 'bike':
        return <Bus size={24} />
      case 'walking':
        return <Bus size={24} />
      default:
        return <Bus size={24} />
    }
  }

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'available': return '#28a745'
      case 'limited': return '#ffc107'
      case 'unavailable': return '#dc3545'
      default: return '#6c757d'
    }
  }

  const getTransportColor = (type) => {
    switch (type) {
      case 'bus': return '#007bff'
      case 'metro': return '#6f42c1'
      case 'auto': return '#fd7e14'
      case 'taxi': return '#20c997'
      case 'bike': return '#e83e8c'
      case 'walking': return '#6c757d'
      default: return '#6c757d'
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#212529' }}>
          Transport Options
        </h1>
        <p style={{ fontSize: '18px', color: '#6c757d' }}>
          Check available transport services and their current status
        </p>
      </div>

      <div className="card" style={{ marginBottom: '32px' }}>
        <div className="card-header">
          <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bus size={24} />
            Available Transport
          </h2>
          <button
            onClick={fetchTransportOptions}
            className="btn btn-secondary"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                Refresh
              </>
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
        ) : transportOptions.length > 0 ? (
          <div className="grid grid-3">
            {transportOptions.map((option) => (
              <div key={option.id} className="card" style={{ marginBottom: '16px' }}>
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ color: getTransportColor(option.transport_type) }}>
                      {getTransportIcon(option.transport_type)}
                    </div>
                    <h4 style={{ margin: 0 }}>{option.transport_type_display}</h4>
                  </div>
                  <span 
                    className="status-badge"
                    style={{ 
                      backgroundColor: getAvailabilityColor(option.availability),
                      color: 'white'
                    }}
                  >
                    {option.availability_display}
                  </span>
                </div>

                {option.estimated_fare && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <DollarSign size={16} style={{ color: '#6c757d' }} />
                    <span style={{ color: '#6c757d' }}>
                      ₹{option.estimated_fare}
                    </span>
                  </div>
                )}

                {option.estimated_wait_time && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Clock size={16} style={{ color: '#6c757d' }} />
                    <span style={{ color: '#6c757d' }}>
                      {option.estimated_wait_time} min wait
                    </span>
                  </div>
                )}

                {option.notes && (
                  <p style={{ color: '#6c757d', fontSize: '14px', marginBottom: '12px' }}>
                    {option.notes}
                  </p>
                )}

                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                  Updated {new Date(option.updated_at).toLocaleString()}
                </div>

                <button
                  className={`btn ${option.availability === 'available' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%', marginTop: '12px' }}
                  disabled={option.availability === 'unavailable'}
                >
                  {option.availability === 'available' ? 'Book Now' : 
                   option.availability === 'limited' ? 'Check Availability' : 'Unavailable'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
            <Bus size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>No transport options available</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Transport services may be limited due to weather conditions
            </p>
          </div>
        )}
      </div>

      {/* Transport Status Legend */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Transport Status Legend</h3>
        </div>
        <div className="grid grid-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div 
              className="status-badge"
              style={{ backgroundColor: '#28a745', color: 'white' }}
            >
              Available
            </div>
            <span>Service is running normally</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div 
              className="status-badge"
              style={{ backgroundColor: '#ffc107', color: 'white' }}
            >
              Limited
            </div>
            <span>Reduced service or delays</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div 
              className="status-badge"
              style={{ backgroundColor: '#dc3545', color: 'white' }}
            >
              Unavailable
            </div>
            <span>Service suspended</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransportOptions
