import {
    Request,
    Response,
    NextFunction
} from "express";

// Handle "Unexpected" errors
export function errorHandler(
    error: unknown,
    _request: Request,
    response: Response,
    _next: NextFunction
): void {
    console.error(error);

    response.status(500).json({
        message: "An unexpected server error occurred."
    });
}

// Handle "Not Found" errors
export function notFoundHandler(
    request: Request,
    response: Response,
): void {
    response.status(404).json({
        message:
            `Route ${request.method} ${request.path} was not found.`
    });
}