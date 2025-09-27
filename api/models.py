from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class RoadCondition(models.Model):
    CONDITION_CHOICES = [
        ('clear', 'Clear'),
        ('waterlogged', 'Waterlogged'),
        ('flooded', 'Flooded'),
        ('blocked', 'Blocked'),
        ('under_construction', 'Under Construction'),
    ]
    
    SEVERITY_CHOICES = [
        (1, 'Low'),
        (2, 'Medium'),
        (3, 'High'),
        (4, 'Critical'),
    ]
    
    location_name = models.CharField(max_length=200)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    severity = models.IntegerField(choices=SEVERITY_CHOICES, validators=[MinValueValidator(1), MaxValueValidator(4)])
    description = models.TextField(blank=True)
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    reported_at = models.DateTimeField(auto_now_add=True)
    verified = models.BooleanField(default=False)
    verification_count = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['-reported_at']
    
    def __str__(self):
        return f"{self.location_name} - {self.get_condition_display()}"

class Route(models.Model):
    name = models.CharField(max_length=200)
    start_latitude = models.DecimalField(max_digits=9, decimal_places=6)
    start_longitude = models.DecimalField(max_digits=9, decimal_places=6)
    end_latitude = models.DecimalField(max_digits=9, decimal_places=6)
    end_longitude = models.DecimalField(max_digits=9, decimal_places=6)
    distance_km = models.DecimalField(max_digits=8, decimal_places=2)
    estimated_time_minutes = models.IntegerField()
    is_safe = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.distance_km}km"

class TransportOption(models.Model):
    TRANSPORT_TYPES = [
        ('bus', 'Bus'),
        ('metro', 'Metro'),
        ('auto', 'Auto Rickshaw'),
        ('taxi', 'Taxi'),
        ('bike', 'Bike Taxi'),
        ('walking', 'Walking'),
    ]
    
    AVAILABILITY_CHOICES = [
        ('available', 'Available'),
        ('limited', 'Limited'),
        ('unavailable', 'Unavailable'),
    ]
    
    transport_type = models.CharField(max_length=20, choices=TRANSPORT_TYPES)
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name='transport_options')
    availability = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES)
    estimated_fare = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    estimated_wait_time = models.IntegerField(null=True, blank=True)  # in minutes
    notes = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.get_transport_type_display()} - {self.get_availability_display()}"

class WeatherAlert(models.Model):
    ALERT_TYPES = [
        ('heavy_rain', 'Heavy Rain'),
        ('flood_warning', 'Flood Warning'),
        ('storm', 'Storm'),
        ('visibility_low', 'Low Visibility'),
    ]
    
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField()
    severity = models.IntegerField(choices=RoadCondition.SEVERITY_CHOICES)
    affected_areas = models.TextField(help_text="Comma-separated list of affected areas")
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.get_alert_type_display()}"
