import type { Post } from '@/posts/types';

// Query parameter types
export interface GetPostsParams {
  userId?: number;
  limit?: number;
  page?: number;
}

export type PostsQueryResponse = Post[];

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}
