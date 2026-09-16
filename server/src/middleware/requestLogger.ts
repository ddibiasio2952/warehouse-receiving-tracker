import type {
    Request,
    Response,
    NextFunction
} from "express";

// Log requests
export function requestLogger(
    request: Request,
    _response: Response,
    next: NextFunction
): void {
    console.log(`${request.method} ${request.path}`);
    next();
}