from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RoadConditionViewSet, RouteViewSet, TransportOptionViewSet, WeatherAlertViewSet

router = DefaultRouter()
router.register(r'road-conditions', RoadConditionViewSet)
router.register(r'routes', RouteViewSet)
router.register(r'transport-options', TransportOptionViewSet)
router.register(r'weather-alerts', WeatherAlertViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
