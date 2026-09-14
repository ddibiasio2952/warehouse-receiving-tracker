import type {
    Request,
    Response
} from "express";

// Middleware for requests which don't match any route
export function notFoundHandler(
    request: Request,
    response: Response
): void {
    response.status(404).json({
        message:
            `Route ${request.method} ${request.path} was not found.`
    });
}