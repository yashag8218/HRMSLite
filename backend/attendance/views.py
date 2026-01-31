from datetime import datetime, date
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from pymongo.errors import DuplicateKeyError

from hrms.db import get_employees_collection, get_attendance_collection
from .serializers import AttendanceSerializer, AttendanceCreateSerializer


class AttendanceListCreateView(APIView):
    """View for listing and creating attendance records"""

    def get(self, request):
        """List all attendance records with optional date filter"""
        collection = get_attendance_collection()
        employees_collection = get_employees_collection()

        # Build query
        query = {}
        date_filter = request.query_params.get('date')
        if date_filter:
            try:
                query['date'] = date_filter
            except ValueError:
                return Response({
                    'success': False,
                    'message': 'Invalid date format. Use YYYY-MM-DD',
                    'errors': {}
                }, status=status.HTTP_400_BAD_REQUEST)

        attendance_records = list(collection.find(query).sort('date', -1))

        # Get all employees for reference
        employees = {str(emp['_id']): emp for emp in employees_collection.find()}

        # Enrich attendance records with employee details
        for record in attendance_records:
            record['id'] = str(record.pop('_id'))
            emp_id = record.get('employee_id')
            if emp_id and emp_id in employees:
                record['employee_name'] = employees[emp_id].get('full_name', 'Unknown')
                record['employee_code'] = employees[emp_id].get('employee_id', 'Unknown')
            else:
                record['employee_name'] = 'Unknown'
                record['employee_code'] = 'Unknown'

        return Response({
            'success': True,
            'message': 'Attendance records retrieved successfully',
            'data': attendance_records
        })

    def post(self, request):
        """Mark attendance for an employee"""
        serializer = AttendanceCreateSerializer(data=request.data)

        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Validation failed',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        collection = get_attendance_collection()
        employees_collection = get_employees_collection()

        # Verify employee exists
        try:
            employee = employees_collection.find_one({'_id': ObjectId(data['employee_id'])})
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
                'errors': {'employee_id': ['Employee does not exist']}
            }, status=status.HTTP_404_NOT_FOUND)

        # Prepare document
        now = datetime.utcnow()
        document = {
            'employee_id': data['employee_id'],
            'date': data['date'].isoformat(),
            'status': data['status'],
            'created_at': now
        }

        try:
            result = collection.insert_one(document)
            document['id'] = str(result.inserted_id)
            document.pop('_id', None)
            document['employee_name'] = employee.get('full_name', 'Unknown')
            document['employee_code'] = employee.get('employee_id', 'Unknown')

            return Response({
                'success': True,
                'message': 'Attendance marked successfully',
                'data': document
            }, status=status.HTTP_201_CREATED)

        except DuplicateKeyError:
            return Response({
                'success': False,
                'message': 'Attendance already marked for this employee on this date',
                'errors': {'date': ['Attendance already exists for this date']}
            }, status=status.HTTP_400_BAD_REQUEST)


class EmployeeAttendanceView(APIView):
    """View for getting attendance records for a specific employee"""

    def get(self, request, employee_id):
        """Get attendance history for an employee"""
        collection = get_attendance_collection()
        employees_collection = get_employees_collection()

        # Verify employee exists
        try:
            employee = employees_collection.find_one({'_id': ObjectId(employee_id)})
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

        # Get attendance records
        records = list(collection.find({'employee_id': employee_id}).sort('date', -1))

        for record in records:
            record['id'] = str(record.pop('_id'))
            record['employee_name'] = employee.get('full_name', 'Unknown')
            record['employee_code'] = employee.get('employee_id', 'Unknown')

        # Calculate stats
        total_records = len(records)
        present_count = sum(1 for r in records if r.get('status') == 'Present')
        absent_count = total_records - present_count

        return Response({
            'success': True,
            'message': 'Employee attendance retrieved successfully',
            'data': {
                'employee': {
                    'id': str(employee['_id']),
                    'employee_id': employee.get('employee_id'),
                    'full_name': employee.get('full_name'),
                    'department': employee.get('department')
                },
                'stats': {
                    'total_days': total_records,
                    'present_days': present_count,
                    'absent_days': absent_count
                },
                'records': records
            }
        })


class DashboardView(APIView):
    """Dashboard API for summary statistics"""

    def get(self, request):
        """Get dashboard statistics"""
        employees_collection = get_employees_collection()
        attendance_collection = get_attendance_collection()

        # Total employees
        total_employees = employees_collection.count_documents({})

        # Today's date
        today = date.today().isoformat()

        # Today's attendance
        today_present = attendance_collection.count_documents({
            'date': today,
            'status': 'Present'
        })
        today_absent = attendance_collection.count_documents({
            'date': today,
            'status': 'Absent'
        })

        # Get per-employee present counts
        pipeline = [
            {'$match': {'status': 'Present'}},
            {'$group': {'_id': '$employee_id', 'present_days': {'$sum': 1}}},
            {'$sort': {'present_days': -1}}
        ]
        employee_stats = list(attendance_collection.aggregate(pipeline))

        # Enrich with employee details
        employees = {str(emp['_id']): emp for emp in employees_collection.find()}
        for stat in employee_stats:
            emp_id = stat['_id']
            if emp_id in employees:
                stat['employee_name'] = employees[emp_id].get('full_name', 'Unknown')
                stat['employee_code'] = employees[emp_id].get('employee_id', 'Unknown')
            else:
                stat['employee_name'] = 'Unknown'
                stat['employee_code'] = 'Unknown'
            stat['employee_id'] = stat.pop('_id')

        return Response({
            'success': True,
            'message': 'Dashboard data retrieved successfully',
            'data': {
                'total_employees': total_employees,
                'today': {
                    'date': today,
                    'present': today_present,
                    'absent': today_absent,
                    'not_marked': total_employees - today_present - today_absent
                },
                'employee_stats': employee_stats
            }
        })
