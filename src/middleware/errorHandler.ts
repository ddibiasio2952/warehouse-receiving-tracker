import type {
    Request,
    Response,
    NextFunction
} from "express";

// Middleware for centralized error-handling
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