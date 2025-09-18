import { useCallback, useState } from 'react';
import { useGetPosts } from './useGetPosts';
import type { Post } from '@/features/posts/types';
import type { SnackbarState } from './types';

interface useGetPostsControllerProps {
  // Data
  posts: Post[] | undefined;
  postsLoading: boolean;
  postsError: Error | null;

  // State
  snackbar: SnackbarState;

  // Actions
  closeSnackbar: () => void;
  showSuccessMessage: (message: string) => void;
  showErrorMessage: (message: string) => void;

  // Callback handlers for individual post operations
  onPostDeleted: (deletedPost: Post) => void;
  onPostUpdated: (updatedPost: Post) => void;
  onPostCreated: (createdPost: Post) => void;
}

export const useGetPostsController = (): useGetPostsControllerProps => {
  // Data hooks
  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
  } = useGetPosts();

  // Local state
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Actions
  const closeSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const showSuccessMessage = useCallback((message: string) => {
    setSnackbar({
      open: true,
      message,
      severity: 'success',
    });
  }, []);

  const showErrorMessage = useCallback((message: string) => {
    setSnackbar({
      open: true,
      message,
      severity: 'error',
    });
  }, []);

  // Callback handlers for individual post operations
  const onPostDeleted = useCallback((post: Post) => {
    setSnackbar({
      open: true,
      message: `Post ${post.id} deleted successfully!`,
      severity: 'success',
    });
  }, []);

  const onPostUpdated = useCallback((post: Post) => {
    setSnackbar({
      open: true,
      message: `Post ${post.id} updated successfully!`,
      severity: 'success',
    });
  }, []);

  const onPostCreated = useCallback((post: Post) => {
    setSnackbar({
      open: true,
      message: `Post ${post.id} created successfully!`,
      severity: 'success',
    });
  }, []);

  return {
    // Data
    posts,
    postsLoading,
    postsError,

    // State
    snackbar,

    // Actions
    closeSnackbar,
    showSuccessMessage,
    showErrorMessage,

    // Callback handlers
    onPostDeleted,
    onPostUpdated,
    onPostCreated,
  };
};
