# Monsoon Travel Assistant

A comprehensive web application designed to help users plan safe and dry travel within the city during monsoon season. The app provides real-time road condition reporting, route planning with flood avoidance, and transport availability checking.

## Features

### 🛣️ Route Planning
- **Smart Route Planning**: Find optimal routes avoiding flooded and waterlogged areas
- **Alternative Routes**: Get multiple route suggestions with safety scores
- **Real-time Updates**: Routes are updated based on current road conditions

### 📍 Crowd-sourced Reporting
- **Road Condition Reports**: Users can report road conditions in real-time
- **Verification System**: Community-driven verification of reports
- **Location-based**: Reports are tied to specific coordinates for accuracy

### 🚌 Transport Options
- **Multi-modal Transport**: Check availability of buses, metro, auto-rickshaws, taxis, and bike taxis
- **Real-time Status**: Live updates on transport availability and wait times
- **Fare Information**: Estimated fares for different transport options

### 🌧️ Weather Alerts
- **Active Alerts**: Real-time weather alerts affecting travel
- **Severity Levels**: Color-coded alerts based on severity
- **Area-specific**: Alerts for specific areas of the city

## Technology Stack

### Backend
- **Django 4.2.7**: Python web framework
- **Django REST Framework**: API development
- **SQLite**: Database (easily configurable for PostgreSQL/MySQL)
- **CORS Headers**: Cross-origin resource sharing

### Frontend
- **React 18**: Modern JavaScript library
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Lucide React**: Beautiful icons

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run database migrations**:
   ```bash
   python manage.py migrate
   ```

3. **Create a superuser** (optional):
   ```bash
   python manage.py createsuperuser
   ```

4. **Start the Django server**:
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd travel-assistant-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Road Conditions
- `GET /api/road-conditions/` - Get all road conditions
- `GET /api/road-conditions/nearby/` - Get conditions near a location
- `POST /api/road-conditions/` - Create new condition report
- `POST /api/road-conditions/{id}/verify/` - Verify a condition report

### Routes
- `GET /api/routes/` - Get all routes
- `POST /api/routes/plan_route/` - Plan a new route

### Transport Options
- `GET /api/transport-options/` - Get all transport options
- `GET /api/transport-options/available/` - Get available transport

### Weather Alerts
- `GET /api/weather-alerts/` - Get all weather alerts
- `GET /api/weather-alerts/active/` - Get active weather alerts

## Usage

### For Travelers
1. **Plan Your Route**: Use the Route Planner to find safe paths avoiding flooded areas
2. **Check Transport**: View available transport options and their current status
3. **Stay Informed**: Monitor weather alerts that may affect your journey
4. **Report Conditions**: Help other travelers by reporting road conditions

### For Administrators
1. **Manage Data**: Use Django admin at `/admin/` to manage road conditions, routes, and alerts
2. **Monitor Reports**: Review and verify user-submitted road condition reports
3. **Update Transport**: Modify transport availability and status

## Sample Data

The application includes sample data for testing:
- Sample road conditions with different severity levels
- Weather alerts for various scenarios
- Transport options with different availability statuses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.

---

**Stay Safe During Monsoon Season! 🌧️**
