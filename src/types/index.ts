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

// Query parameter types
export interface GetPostsParams {
  userId?: number;
  limit?: number;
  page?: number;
}

// API Query Response types for better type safety
export type UsersQueryResponse = User[];
export type PostsQueryResponse = Post[];

// Mutation Response types
export type CreatePostMutationResponse = Post;
export type UpdatePostMutationResponse = Post;
export type DeletePostMutationResponse = void;

// Snackbar state type
export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}
