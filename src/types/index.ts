// User Model
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
}

// Post Model
export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

// Comment Model
export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Query parameter types
export interface GetPostsParams {
  userId?: number;
  limit?: number;
  page?: number;
}

export interface GetCommentsParams {
  postId?: number;
  limit?: number;
  page?: number;
}

// API Query Response types for better type safety
export type UsersQueryResponse = User[];
export type UserQueryResponse = User;
export type PostsQueryResponse = Post[];
export type PostQueryResponse = Post;
export type CommentsQueryResponse = Comment[];

// Mutation Response types
export type CreatePostMutationResponse = Post;
export type UpdatePostMutationResponse = Post;
export type DeletePostMutationResponse = void;

// Form data types
export interface PostFormData {
  title: string;
  body: string;
  userId: number;
}

// Snackbar state type
export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

// Form validation result type
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Form data types
export interface CreatePostForm {
  title: string;
  body: string;
  userId: number;
}

export interface UpdatePostForm extends Partial<CreatePostForm> {
  id: number;
}
