from fastapi import HTTPException, status


class AetherHTTPException(HTTPException):
    def __init__(self, status_code: int, detail: str):
        super().__init__(status_code=status_code, detail=detail)

class NotFoundException(AetherHTTPException):
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

class UnauthorizedException(AetherHTTPException):
    def __init__(self, detail: str = "Could not validate credentials"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
        )

class ForbiddenException(AetherHTTPException):
    def __init__(self, detail: str = "Not enough permissions"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)

class BadRequestException(AetherHTTPException):
    def __init__(self, detail: str = "Bad request"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=detail)
