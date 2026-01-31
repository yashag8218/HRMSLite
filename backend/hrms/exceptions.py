from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    """Custom exception handler that returns consistent error format"""
    response = exception_handler(exc, context)

    if response is not None:
        custom_response = {
            'success': False,
            'message': 'An error occurred',
            'errors': {}
        }

        if hasattr(exc, 'detail'):
            if isinstance(exc.detail, dict):
                custom_response['errors'] = exc.detail
                custom_response['message'] = 'Validation failed'
            elif isinstance(exc.detail, list):
                custom_response['message'] = exc.detail[0] if exc.detail else 'An error occurred'
            else:
                custom_response['message'] = str(exc.detail)

        response.data = custom_response

    return response


class APIException(Exception):
    """Base API exception"""
    def __init__(self, message, status_code=status.HTTP_400_BAD_REQUEST, errors=None):
        self.message = message
        self.status_code = status_code
        self.errors = errors or {}
        super().__init__(message)

    def to_response(self):
        return Response(
            {
                'success': False,
                'message': self.message,
                'errors': self.errors
            },
            status=self.status_code
        )


class NotFoundError(APIException):
    """Resource not found exception"""
    def __init__(self, message='Resource not found'):
        super().__init__(message, status.HTTP_404_NOT_FOUND)


class ValidationError(APIException):
    """Validation error exception"""
    def __init__(self, message='Validation failed', errors=None):
        super().__init__(message, status.HTTP_400_BAD_REQUEST, errors)


class DuplicateError(APIException):
    """Duplicate resource exception"""
    def __init__(self, message='Resource already exists', errors=None):
        super().__init__(message, status.HTTP_400_BAD_REQUEST, errors)
