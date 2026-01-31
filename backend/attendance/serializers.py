from datetime import datetime, date
from rest_framework import serializers


class AttendanceSerializer(serializers.Serializer):
    """Serializer for Attendance model"""
    id = serializers.CharField(read_only=True)
    employee_id = serializers.CharField()
    date = serializers.DateField()
    status = serializers.ChoiceField(choices=['Present', 'Absent'])
    created_at = serializers.DateTimeField(read_only=True)

    # Additional fields for response
    employee_name = serializers.CharField(read_only=True)
    employee_code = serializers.CharField(read_only=True)

    def validate_date(self, value):
        """Validate date is not in future"""
        if value > date.today():
            raise serializers.ValidationError('Cannot mark attendance for future dates')
        return value

    def validate_status(self, value):
        """Validate status"""
        if value not in ['Present', 'Absent']:
            raise serializers.ValidationError('Status must be either Present or Absent')
        return value


class AttendanceCreateSerializer(serializers.Serializer):
    """Serializer for creating attendance"""
    employee_id = serializers.CharField()
    date = serializers.DateField()
    status = serializers.ChoiceField(choices=['Present', 'Absent'])

    def validate_date(self, value):
        """Validate date is not in future"""
        if value > date.today():
            raise serializers.ValidationError('Cannot mark attendance for future dates')
        return value
