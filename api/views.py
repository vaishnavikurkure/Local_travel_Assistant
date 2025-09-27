# api/views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from .models import RoadCondition, Route, TransportOption, WeatherAlert
from .serializers import (
    RoadConditionSerializer, RouteSerializer, TransportOptionSerializer,
    WeatherAlertSerializer, RoutePlanningRequestSerializer
)
import math
import requests 

def geocode_location(location_name):
    
    if not location_name:
        return None, None
        
    url = f"https://nominatim.openstreetmap.org/search"
    params = {'q': location_name, 'format': 'json', 'limit': 1}
    # IMPORTANT: Nominatim requires a custom User-Agent header. 
    # Replace with your app name and contact email.
    headers = {'User-Agent': 'SafeRoutePlannerApp/1.0 (kurkurevaishnavi@gmail.com)'}
    
    try:
        response = requests.get(url, params=params, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()
        if data:
            return float(data[0]['lat']), float(data[0]['lon'])
    except requests.exceptions.RequestException as e:
        print(f"Geocoding error for {location_name}: {e}")
        return None, None
        
    return None, None

class RoadConditionViewSet(viewsets.ModelViewSet):
    
    queryset = RoadCondition.objects.all()
    serializer_class = RoadConditionSerializer
    
    @action(detail=False, methods=['get'])
    def nearby(self, request):
        """Get road conditions near a specific location"""
        lat = float(request.query_params.get('latitude', 0))
        lng = float(request.query_params.get('longitude', 0))
        radius = float(request.query_params.get('radius', 5))  # km
        
        conditions = []
        for condition in self.queryset:
            distance = self._calculate_distance(lat, lng, float(condition.latitude), float(condition.longitude))
            if distance <= radius:
                conditions.append(condition)
        
        serializer = self.get_serializer(conditions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """Verify a road condition report"""
        condition = self.get_object()
        condition.verification_count += 1
        if condition.verification_count >= 3:
            condition.verified = True
        condition.save()
        return Response({'status': 'verified'})
    
    def _calculate_distance(self, lat1, lng1, lat2, lng2):
        R = 6371
        dlat = math.radians(lat2 - lat1)
        dlng = math.radians(lng2 - lng1)
        a = (math.sin(dlat/2) * math.sin(dlat/2) + 
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng/2) * math.sin(dlng/2))
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        return R * c

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
   
    @action(detail=False, methods=['post'])
    def plan_route(self, request):
        
        # Step 1: Get location names from the request
        start_location_name = request.data.get('start_location')
        end_location_name = request.data.get('end_location')
        avoid_flooded = request.data.get('avoid_flooded_areas', True)

        if not start_location_name or not end_location_name:
            return Response(
                {"error": "start_location and end_location fields are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Step 2: Geocode the location names to get coordinates
        start_lat, start_lng = geocode_location(start_location_name)
        end_lat, end_lng = geocode_location(end_location_name)

        if start_lat is None or end_lat is None:
            return Response(
                {"error": "Could not find coordinates for one or both locations. Please try a more specific name."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Step 3: Use the coordinates with your existing logic
        # Find problematic areas
        problematic_conditions = RoadCondition.objects.filter(
            Q(condition__in=['waterlogged', 'flooded', 'blocked']) |
            Q(severity__gte=3)
        )
        
        # Create route suggestions
        routes = []
        
        # Primary route (direct)
        direct_route = self._create_route_suggestion(
            start_lat, start_lng, end_lat, end_lng, 
            f"Direct Route to {end_location_name}", problematic_conditions
        )
        routes.append(direct_route)
        
        # Alternative safe route
        if avoid_flooded:
            alt_route = self._create_route_suggestion(
                start_lat, start_lng, end_lat, end_lng,
                f"Safe Route to {end_location_name}", problematic_conditions,
                avoid_problematic=True
            )
           
            if alt_route['is_safe'] != direct_route['is_safe']:
                 routes.append(alt_route)
        
        return Response({
            'routes': routes,
            'weather_alerts': WeatherAlertSerializer(
                WeatherAlert.objects.filter(is_active=True), many=True
            ).data
        })

    # ... The rest of your RouteViewSet methods (_create_route_suggestion, etc.) remain unchanged ...
    def _create_route_suggestion(self, start_lat, start_lng, end_lat, end_lng, name, problematic_conditions, avoid_problematic=False):
        """Create a route suggestion with safety assessment"""
        distance = self._calculate_distance(start_lat, start_lng, end_lat, end_lng)
        estimated_time = int(distance * 2.5) # Adjusted for city traffic
        
        is_safe = True
        for condition in problematic_conditions:
            if self._is_on_route(start_lat, start_lng, end_lat, end_lng, 
                                  float(condition.latitude), float(condition.longitude)):
                is_safe = False
                break
      
        if avoid_problematic and not is_safe:
             # In a real app, you would recalculate a new path. Here we'll just adjust the properties.
             distance *= 1.2 
             estimated_time *= 1.3
             is_safe = True 
        
        return {
            'name': name,
            'start_latitude': start_lat,
            'start_longitude': start_lng,
            'end_latitude': end_lat,
            'end_longitude': end_lng,
            'distance_km': round(distance, 2),
            'estimated_time_minutes': estimated_time,
            'is_safe': is_safe,
            'safety_score': 95 if is_safe else 40
        }
    
    def _is_on_route(self, start_lat, start_lng, end_lat, end_lng, point_lat, point_lng):
        """Simple check if a point is roughly on the route"""
        distance_to_start = self._calculate_distance(start_lat, start_lng, point_lat, point_lng)
        distance_to_end = self._calculate_distance(end_lat, end_lng, point_lat, point_lng)
        total_distance = self._calculate_distance(start_lat, start_lng, end_lat, end_lng)
        return abs(distance_to_start + distance_to_end - total_distance) < 0.5
    
    def _calculate_distance(self, lat1, lng1, lat2, lng2):
        R = 6371
        dlat = math.radians(lat2 - lat1)
        dlng = math.radians(lng2 - lng1)
        a = (math.sin(dlat/2) * math.sin(dlat/2) + 
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng/2) * math.sin(dlng/2))
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        return R * c

class TransportOptionViewSet(viewsets.ModelViewSet):
    # ... This entire ViewSet remains unchanged ...
    queryset = TransportOption.objects.all()
    serializer_class = TransportOptionSerializer
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        route_id = request.query_params.get('route_id')
        if route_id:
            queryset = self.queryset.filter(route_id=route_id, availability='available')
        else:
            queryset = self.queryset.filter(availability='available')
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class WeatherAlertViewSet(viewsets.ModelViewSet):
    # ... This entire ViewSet remains unchanged ...
    queryset = WeatherAlert.objects.all()
    serializer_class = WeatherAlertSerializer
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        now = timezone.now()
        queryset = self.queryset.filter(
            is_active=True,
            valid_from__lte=now,
            valid_until__gte=now
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)