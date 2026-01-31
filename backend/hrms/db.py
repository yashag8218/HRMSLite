from pymongo import MongoClient
from django.conf import settings

_client = None
_db = None


def get_db():
    """Get MongoDB database connection"""
    global _client, _db
    if _db is None:
        _client = MongoClient(settings.MONGODB_URI)
        _db = _client[settings.MONGODB_NAME]
        _setup_indexes()
    return _db


def _setup_indexes():
    """Setup database indexes"""
    db = _db

    # Employee indexes
    db.employees.create_index('employee_id', unique=True)
    db.employees.create_index('email', unique=True)

    # Attendance indexes - compound unique index
    db.attendance.create_index(
        [('employee_id', 1), ('date', 1)],
        unique=True
    )


def get_employees_collection():
    """Get employees collection"""
    return get_db().employees


def get_attendance_collection():
    """Get attendance collection"""
    return get_db().attendance
