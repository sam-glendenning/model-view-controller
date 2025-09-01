import { ApiError } from '@/types';
import { AxiosError } from 'axios';

/**
 * Type guard to check if an error is an AxiosError
 * @param error - The error to check
 * @returns True if the error is an AxiosError
 */
export const isAxiosError = (error: unknown): error is AxiosError => {
  return error instanceof Error && 'isAxiosError' in error && error.isAxiosError === true;
};

/**
 * Transforms any error into a standardized ApiError
 * @param error - The error to transform
 * @returns Standardized ApiError object
 */
export const transformToApiError = (error: unknown): ApiError => {
  // Handle AxiosError
  if (isAxiosError(error)) {
    const responseData = error.response?.data as any;
    return {
      message: responseData?.message || error.message || 'Network request failed',
      status: error.response?.status,
      code: error.code,
    };
  }
  
  // Handle regular Error
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error,
    };
  }
  
  // Handle unknown errors
  return {
    message: 'An unknown error occurred',
  };
};

/**
 * Gets a user-friendly error message from an error
 * @param error - The error to get the message from
 * @returns User-friendly error message
 */
export const getErrorMessage = (error: unknown): string => {
  const apiError = transformToApiError(error);
  
  // Map common HTTP status codes to user-friendly messages
  if (apiError.status) {
    switch (apiError.status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'You are not authorized to perform this action.';
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 422:
        return 'Invalid data provided. Please check your input.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
      case 503:
      case 504:
        return 'Service unavailable. Please try again later.';
      default:
        return apiError.message;
    }
  }
  
  return apiError.message;
};
