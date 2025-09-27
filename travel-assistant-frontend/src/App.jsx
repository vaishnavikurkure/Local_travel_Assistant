import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import RoutePlanner from './pages/RoutePlanner'
import RoadConditions from './pages/RoadConditions'
import WeatherAlerts from './pages/WeatherAlerts'
import TransportOptions from './pages/TransportOptions'
import { WeatherAlertProvider } from './services/WeatherAlertContext'

function App() {
  return (
    <WeatherAlertProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="container" style={{ paddingTop: '80px' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/route-planner" element={<RoutePlanner />} />
              <Route path="/road-conditions" element={<RoadConditions />} />
              <Route path="/weather-alerts" element={<WeatherAlerts />} />
              <Route path="/transport" element={<TransportOptions />} />
            </Routes>
          </main>
        </div>
      </Router>
    </WeatherAlertProvider>
  )
}

export default App
