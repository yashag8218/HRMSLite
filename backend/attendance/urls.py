from django.urls import path
from .views import AttendanceListCreateView, EmployeeAttendanceView, DashboardView

urlpatterns = [
    path('', AttendanceListCreateView.as_view(), name='attendance-list-create'),
    path('employee/<str:employee_id>/', EmployeeAttendanceView.as_view(), name='employee-attendance'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
]
