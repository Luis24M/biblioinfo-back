import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';
  const details = err instanceof ApiError ? err.details : undefined;

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(details && { details }),
  });
}
