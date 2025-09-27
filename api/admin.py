from django.contrib import admin
from .models import RoadCondition, Route, TransportOption, WeatherAlert

@admin.register(RoadCondition)
class RoadConditionAdmin(admin.ModelAdmin):
    list_display = ['location_name', 'condition', 'severity', 'reported_at', 'verified']
    list_filter = ['condition', 'severity', 'verified', 'reported_at']
    search_fields = ['location_name', 'description']
    readonly_fields = ['reported_at', 'verification_count']

@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ['name', 'distance_km', 'estimated_time_minutes', 'is_safe', 'created_at']
    list_filter = ['is_safe', 'created_at']
    search_fields = ['name']

@admin.register(TransportOption)
class TransportOptionAdmin(admin.ModelAdmin):
    list_display = ['transport_type', 'route', 'availability', 'estimated_fare', 'updated_at']
    list_filter = ['transport_type', 'availability', 'updated_at']
    search_fields = ['route__name', 'notes']

@admin.register(WeatherAlert)
class WeatherAlertAdmin(admin.ModelAdmin):
    list_display = ['title', 'alert_type', 'severity', 'is_active', 'valid_from', 'valid_until']
    list_filter = ['alert_type', 'severity', 'is_active', 'created_at']
    search_fields = ['title', 'description', 'affected_areas']