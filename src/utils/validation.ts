import { ValidationResult, PostFormData } from '@/types';

/**
 * Validates post form data
 * @param formData - The form data to validate
 * @returns ValidationResult with isValid status and any errors
 */
export const validatePostForm = (formData: PostFormData): ValidationResult => {
  const errors: string[] = [];
  
  // Title validation
  if (!formData.title || formData.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (formData.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  } else if (formData.title.trim().length > 100) {
    errors.push('Title must be less than 100 characters');
  }
  
  // Body validation
  if (!formData.body || formData.body.trim().length === 0) {
    errors.push('Content is required');
  } else if (formData.body.trim().length < 10) {
    errors.push('Content must be at least 10 characters long');
  } else if (formData.body.trim().length > 1000) {
    errors.push('Content must be less than 1000 characters');
  }
  
  // User ID validation
  if (!formData.userId || formData.userId <= 0) {
    errors.push('Valid user ID is required');
  } else if (!Number.isInteger(formData.userId)) {
    errors.push('User ID must be a whole number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Type guard to check if form data is valid for creating a post
 * @param formData - The form data to check
 * @returns True if the form data is valid for creating a post
 */
export const isValidCreatePostForm = (formData: PostFormData): formData is PostFormData => {
  return validatePostForm(formData).isValid;
};

/**
 * Type guard to check if a value is a valid post ID
 * @param id - The ID to check
 * @returns True if the ID is a valid post ID
 */
export const isValidPostId = (id: unknown): id is number => {
  return typeof id === 'number' && id > 0 && Number.isInteger(id);
};

/**
 * Type guard to check if a value is a valid user ID
 * @param id - The ID to check
 * @returns True if the ID is a valid user ID
 */
export const isValidUserId = (id: unknown): id is number => {
  return typeof id === 'number' && id > 0 && Number.isInteger(id);
};
