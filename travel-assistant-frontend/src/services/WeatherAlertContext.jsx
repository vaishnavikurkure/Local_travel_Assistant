import React, { createContext, useContext, useState, useEffect } from 'react'
import { weatherAPI } from './api'

const WeatherAlertContext = createContext()

export const useWeatherAlerts = () => {
  const context = useContext(WeatherAlertContext)
  if (!context) {
    throw new Error('useWeatherAlerts must be used within a WeatherAlertProvider')
  }
  return context
}

export const WeatherAlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  useEffect(() => {
    fetchAlerts()
    
    // Refresh alerts every 5 minutes
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  const value = {
    alerts,
    loading,
    error,
    refreshAlerts: fetchAlerts,
  }

  return (
    <WeatherAlertContext.Provider value={value}>
      {children}
    </WeatherAlertContext.Provider>
  )
}
