from rest_framework.response import Response
from rest_framework import status


class ResponseBuilder:
    @staticmethod
    def create_success_response(data=None, message="Success", status=200):
        """
        Build a standardized success response.

        Args:
            data (any, optional): The payload to include in the response.
            message (str, optional): A short description of the outcome.
            status (int, optional): HTTP status code.

        Returns:
            Response: A DRF Response object with a standardized structure.
        """
        response_body = {
            "success": True,
            "message": message,
        }

        if data is not None:
            response_body["data"] = data

        return Response(response_body, status=status)

    @staticmethod
    def create_error_response(
        message="Error", errors=None, status=status.HTTP_500_INTERNAL_SERVER_ERROR
    ):
        """
        Build a standardized error response.

        Args:
            message (str, optional): A short description of the error.
            errors (any, optional): Detailed error information (e.g., serializer errors).
            status (int, optional): HTTP status code.

        Returns:
            Response: A DRF Response object with a standardized structure.
        """
        response_body = {
            "success": False,
            "message": message,
        }

        if errors is not None:
            response_body["errors"] = errors

        return Response(response_body, status=status)
