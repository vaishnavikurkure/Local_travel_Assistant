from rest_framework import serializers
from .models import RoadCondition, Route, TransportOption, WeatherAlert

class RoadConditionSerializer(serializers.ModelSerializer):
    condition_display = serializers.CharField(source='get_condition_display', read_only=True)
    severity_display = serializers.CharField(source='get_severity_display', read_only=True)
    reported_by_username = serializers.CharField(source='reported_by.username', read_only=True)
    
    class Meta:
        model = RoadCondition
        fields = [
            'id', 'location_name', 'latitude', 'longitude', 'condition', 
            'condition_display', 'severity', 'severity_display', 'description',
            'reported_by_username', 'reported_at', 'verified', 'verification_count'
        ]
        read_only_fields = ['id', 'reported_at', 'verification_count']

class RouteSerializer(serializers.ModelSerializer):
    transport_options = serializers.SerializerMethodField()
    
    class Meta:
        model = Route
        fields = [
            'id', 'name', 'start_latitude', 'start_longitude', 
            'end_latitude', 'end_longitude', 'distance_km', 
            'estimated_time_minutes', 'is_safe', 'created_at', 'transport_options'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_transport_options(self, obj):
        return TransportOptionSerializer(obj.transport_options.all(), many=True).data

class TransportOptionSerializer(serializers.ModelSerializer):
    transport_type_display = serializers.CharField(source='get_transport_type_display', read_only=True)
    availability_display = serializers.CharField(source='get_availability_display', read_only=True)
    
    class Meta:
        model = TransportOption
        fields = [
            'id', 'transport_type', 'transport_type_display', 'availability', 
            'availability_display', 'estimated_fare', 'estimated_wait_time', 
            'notes', 'updated_at'
        ]
        read_only_fields = ['id', 'updated_at']

class WeatherAlertSerializer(serializers.ModelSerializer):
    alert_type_display = serializers.CharField(source='get_alert_type_display', read_only=True)
    severity_display = serializers.CharField(source='get_severity_display', read_only=True)
    
    class Meta:
        model = WeatherAlert
        fields = [
            'id', 'alert_type', 'alert_type_display', 'title', 'description',
            'severity', 'severity_display', 'affected_areas', 'valid_from',
            'valid_until', 'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

class RoutePlanningRequestSerializer(serializers.Serializer):
    start_latitude = serializers.DecimalField(max_digits=9, decimal_places=6)
    start_longitude = serializers.DecimalField(max_digits=9, decimal_places=6)
    end_latitude = serializers.DecimalField(max_digits=9, decimal_places=6)
    end_longitude = serializers.DecimalField(max_digits=9, decimal_places=6)
    transport_preference = serializers.CharField(required=False, allow_blank=True)
    avoid_flooded_areas = serializers.BooleanField(default=True)
