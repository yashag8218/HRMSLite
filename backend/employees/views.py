from datetime import datetime
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from pymongo.errors import DuplicateKeyError

from hrms.db import get_employees_collection, get_attendance_collection
from .serializers import EmployeeSerializer


class EmployeeListCreateView(APIView):
    """View for listing and creating employees"""

    def get(self, request):
        """List all employees"""
        collection = get_employees_collection()
        employees = list(collection.find().sort('created_at', -1))

        for emp in employees:
            emp['id'] = str(emp.pop('_id'))

        return Response({
            'success': True,
            'message': 'Employees retrieved successfully',
            'data': employees
        })

    def post(self, request):
        """Create a new employee"""
        serializer = EmployeeSerializer(data=request.data)

        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Validation failed',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        collection = get_employees_collection()

        # Prepare document
        now = datetime.utcnow()
        document = {
            'employee_id': data['employee_id'],
            'full_name': data['full_name'],
            'email': data['email'],
            'department': data['department'],
            'created_at': now,
            'updated_at': now
        }

        try:
            result = collection.insert_one(document)
            document['id'] = str(result.inserted_id)
            document.pop('_id', None)

            return Response({
                'success': True,
                'message': 'Employee created successfully',
                'data': document
            }, status=status.HTTP_201_CREATED)

        except DuplicateKeyError as e:
            error_msg = str(e)
            if 'employee_id' in error_msg:
                return Response({
                    'success': False,
                    'message': 'Validation failed',
                    'errors': {'employee_id': ['This employee ID already exists']}
                }, status=status.HTTP_400_BAD_REQUEST)
            elif 'email' in error_msg:
                return Response({
                    'success': False,
                    'message': 'Validation failed',
                    'errors': {'email': ['This email is already registered']}
                }, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({
                    'success': False,
                    'message': 'A duplicate entry exists',
                    'errors': {}
                }, status=status.HTTP_400_BAD_REQUEST)


class EmployeeDetailView(APIView):
    """View for retrieving and deleting a single employee"""

    def get(self, request, pk):
        """Get employee details"""
        collection = get_employees_collection()

        try:
            employee = collection.find_one({'_id': ObjectId(pk)})
        except Exception:
            return Response({
                'success': False,
                'message': 'Invalid employee ID format',
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)

        if not employee:
            return Response({
                'success': False,
                'message': 'Employee not found',
                'errors': {}
            }, status=status.HTTP_404_NOT_FOUND)

        employee['id'] = str(employee.pop('_id'))

        return Response({
            'success': True,
            'message': 'Employee retrieved successfully',
            'data': employee
        })

    def delete(self, request, pk):
        """Delete an employee"""
        employees_collection = get_employees_collection()
        attendance_collection = get_attendance_collection()

        try:
            employee = employees_collection.find_one({'_id': ObjectId(pk)})
        except Exception:
            return Response({
                'success': False,
                'message': 'Invalid employee ID format',
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)

        if not employee:
            return Response({
                'success': False,
                'message': 'Employee not found',
                'errors': {}
            }, status=status.HTTP_404_NOT_FOUND)

        # Delete employee's attendance records first
        attendance_collection.delete_many({'employee_id': str(pk)})

        # Delete the employee
        employees_collection.delete_one({'_id': ObjectId(pk)})

        return Response({
            'success': True,
            'message': 'Employee deleted successfully',
            'data': None
        })
