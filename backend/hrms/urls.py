from django.urls import path, include
from rest_framework.views import APIView
from rest_framework.response import Response


class HealthCheckView(APIView):
    """Health check endpoint"""
    def get(self, request):
        return Response({'status': 'healthy', 'message': 'HRMS Lite API is running'})


urlpatterns = [
    path('', HealthCheckView.as_view(), name='health-check'),
    path('api/employees/', include('employees.urls')),
    path('api/attendance/', include('attendance.urls')),
]
