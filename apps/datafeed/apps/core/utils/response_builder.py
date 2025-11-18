import math
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import BasePagination


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

    @staticmethod
    def create_paginated_success_response(
        data: any,
        pagination: BasePagination,
        message: str = "Success",
        status: int = 200,
    ):
        """
        Build a standardized paginated success response supporting page & size.
        """
        
        if hasattr(pagination, "page") and hasattr(pagination.page, "paginator"):
            count = pagination.page.paginator.count
            current_page = pagination.page.number
            page_size = pagination.get_page_size(pagination.request)
        else:
            count = None
            current_page = None
            page_size = None

        response_body = {
            "success": True,
            "message": message,
            "data": data,
            "pagination": {
                "count": count,
                "max_page": math.ceil(count / page_size),
                "page": current_page,
                "size": page_size,
                "next": pagination.get_next_link(),
                "previous": pagination.get_previous_link(),
            },
        }

        return Response(response_body, status=status)
