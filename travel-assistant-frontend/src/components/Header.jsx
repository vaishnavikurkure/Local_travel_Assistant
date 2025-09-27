import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MapPin, CloudRain, AlertTriangle, Bus, Navigation } from 'lucide-react'

const Header = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: MapPin },
    { path: '/route-planner', label: 'Route Planner', icon: Navigation },
    { path: '/road-conditions', label: 'Road Conditions', icon: AlertTriangle },
    { path: '/weather-alerts', label: 'Weather Alerts', icon: CloudRain },
    { path: '/transport', label: 'Transport', icon: Bus },
  ]

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      padding: '16px 0'
    }}>
      <div className="container">
        <div className="flex-between">
          <Link to="/" style={{ 
            textDecoration: 'none', 
            color: '#667eea',
            fontSize: '24px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CloudRain size={28} />
            Monsoon Travel Assistant
          </Link>
          
          <nav style={{ display: 'flex', gap: '8px' }}>
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: location.pathname === path ? '#667eea' : '#6c757d',
                  background: location.pathname === path ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                  fontWeight: location.pathname === path ? '600' : '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                <Icon size={18} />
                <span style={{ display: window.innerWidth > 768 ? 'inline' : 'none' }}>
                  {label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
