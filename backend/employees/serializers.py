import re
from rest_framework import serializers


class EmployeeSerializer(serializers.Serializer):
    """Serializer for Employee model"""
    id = serializers.CharField(read_only=True)
    employee_id = serializers.CharField(max_length=50)
    full_name = serializers.CharField(max_length=100, min_length=2)
    email = serializers.EmailField()
    department = serializers.CharField(max_length=100)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    def validate_employee_id(self, value):
        """Validate employee_id is alphanumeric"""
        if not re.match(r'^[a-zA-Z0-9]+$', value):
            raise serializers.ValidationError('Employee ID must be alphanumeric')
        return value.strip()

    def validate_full_name(self, value):
        """Validate full_name"""
        if len(value.strip()) < 2:
            raise serializers.ValidationError('Full name must be at least 2 characters')
        return value.strip()

    def validate_email(self, value):
        """Validate email format"""
        return value.strip().lower()

    def validate_department(self, value):
        """Validate department"""
        if not value.strip():
            raise serializers.ValidationError('Department is required')
        return value.strip()


class EmployeeCreateSerializer(EmployeeSerializer):
    """Serializer for creating an employee"""
    pass


class EmployeeListSerializer(serializers.Serializer):
    """Serializer for listing employees"""
    id = serializers.CharField()
    employee_id = serializers.CharField()
    full_name = serializers.CharField()
    email = serializers.EmailField()
    department = serializers.CharField()
    created_at = serializers.DateTimeField()
