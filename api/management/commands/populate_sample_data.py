from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from api.models import RoadCondition, Route, TransportOption, WeatherAlert

class Command(BaseCommand):
    help = 'Populate the database with sample data'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')

        # Create sample road conditions
        road_conditions = [
            {
                'location_name': 'MG Road, Bangalore',
                'latitude': 12.9716,
                'longitude': 77.5946,
                'condition': 'waterlogged',
                'severity': 2,
                'description': 'Heavy waterlogging near Brigade Road junction',
                'verified': True,
                'verification_count': 5
            },
            {
                'location_name': 'Koramangala 5th Block',
                'latitude': 12.9352,
                'longitude': 77.6245,
                'condition': 'clear',
                'severity': 1,
                'description': 'Road is clear and safe for travel',
                'verified': True,
                'verification_count': 3
            },
            {
                'location_name': 'Indiranagar Metro Station',
                'latitude': 12.9719,
                'longitude': 77.6412,
                'condition': 'flooded',
                'severity': 4,
                'description': 'Severe flooding around metro station entrance',
                'verified': True,
                'verification_count': 8
            },
            {
                'location_name': 'Whitefield Main Road',
                'latitude': 12.9698,
                'longitude': 77.7500,
                'condition': 'blocked',
                'severity': 3,
                'description': 'Road blocked due to fallen tree',
                'verified': False,
                'verification_count': 1
            },
            {
                'location_name': 'Electronic City',
                'latitude': 12.8456,
                'longitude': 77.6603,
                'condition': 'waterlogged',
                'severity': 2,
                'description': 'Minor waterlogging on service road',
                'verified': True,
                'verification_count': 2
            }
        ]

        for condition_data in road_conditions:
            condition, created = RoadCondition.objects.get_or_create(
                location_name=condition_data['location_name'],
                defaults=condition_data
            )
            if created:
                self.stdout.write(f'Created road condition: {condition.location_name}')

        # Create sample routes
        routes = [
            {
                'name': 'MG Road to Koramangala',
                'start_latitude': 12.9716,
                'start_longitude': 77.5946,
                'end_latitude': 12.9352,
                'end_longitude': 77.6245,
                'distance_km': 8.5,
                'estimated_time_minutes': 25,
                'is_safe': True
            },
            {
                'name': 'Indiranagar to Whitefield',
                'start_latitude': 12.9719,
                'start_longitude': 77.6412,
                'end_latitude': 12.9698,
                'end_longitude': 77.7500,
                'distance_km': 12.3,
                'estimated_time_minutes': 35,
                'is_safe': False
            }
        ]

        created_routes = []
        for route_data in routes:
            route, created = Route.objects.get_or_create(
                name=route_data['name'],
                defaults=route_data
            )
            if created:
                self.stdout.write(f'Created route: {route.name}')
                created_routes.append(route)

        # Create sample transport options
        transport_options = [
            {
                'transport_type': 'bus',
                'route': created_routes[0] if created_routes else None,
                'availability': 'available',
                'estimated_fare': 25.00,
                'estimated_wait_time': 5,
                'notes': 'BMTC buses running normally'
            },
            {
                'transport_type': 'metro',
                'route': created_routes[0] if created_routes else None,
                'availability': 'limited',
                'estimated_fare': 30.00,
                'estimated_wait_time': 15,
                'notes': 'Reduced frequency due to weather'
            },
            {
                'transport_type': 'auto',
                'route': created_routes[0] if created_routes else None,
                'availability': 'available',
                'estimated_fare': 80.00,
                'estimated_wait_time': 3,
                'notes': 'Auto-rickshaws available'
            },
            {
                'transport_type': 'taxi',
                'route': created_routes[0] if created_routes else None,
                'availability': 'limited',
                'estimated_fare': 150.00,
                'estimated_wait_time': 20,
                'notes': 'High demand due to weather'
            },
            {
                'transport_type': 'bike',
                'route': created_routes[0] if created_routes else None,
                'availability': 'unavailable',
                'estimated_fare': 60.00,
                'estimated_wait_time': None,
                'notes': 'Service suspended due to safety concerns'
            }
        ]

        for transport_data in transport_options:
            if transport_data['route']:
                transport, created = TransportOption.objects.get_or_create(
                    transport_type=transport_data['transport_type'],
                    route=transport_data['route'],
                    defaults=transport_data
                )
                if created:
                    self.stdout.write(f'Created transport option: {transport.transport_type}')

        # Create sample weather alerts
        now = timezone.now()
        weather_alerts = [
            {
                'alert_type': 'heavy_rain',
                'title': 'Heavy Rainfall Warning',
                'description': 'Heavy rainfall expected in central and eastern parts of the city. Avoid low-lying areas and waterlogged roads.',
                'severity': 3,
                'affected_areas': 'MG Road, Indiranagar, Koramangala, Whitefield',
                'valid_from': now - timedelta(hours=1),
                'valid_until': now + timedelta(hours=6),
                'is_active': True
            },
            {
                'alert_type': 'flood_warning',
                'title': 'Flood Warning - Low Lying Areas',
                'description': 'Flood warning issued for low-lying areas. Avoid traveling through flooded roads.',
                'severity': 4,
                'affected_areas': 'Indiranagar Metro Station, Koramangala 5th Block',
                'valid_from': now - timedelta(minutes=30),
                'valid_until': now + timedelta(hours=4),
                'is_active': True
            },
            {
                'alert_type': 'visibility_low',
                'title': 'Low Visibility Alert',
                'description': 'Low visibility due to heavy fog and rain. Drive with caution.',
                'severity': 2,
                'affected_areas': 'Outer Ring Road, Electronic City',
                'valid_from': now - timedelta(hours=2),
                'valid_until': now + timedelta(hours=2),
                'is_active': True
            }
        ]

        for alert_data in weather_alerts:
            alert, created = WeatherAlert.objects.get_or_create(
                title=alert_data['title'],
                defaults=alert_data
            )
            if created:
                self.stdout.write(f'Created weather alert: {alert.title}')

        self.stdout.write(
            self.style.SUCCESS('Successfully created sample data!')
        )
