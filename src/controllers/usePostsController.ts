import { useState, useCallback } from 'react';
import { usePosts } from '@/hooks';
import type { Post, SnackbarState } from '@/types';

export interface PostsController {
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
  onPostDeleted: () => void;
  onPostUpdated: () => void;
}

export const usePostsController = (): PostsController => {
  // Data hooks
  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
  } = usePosts();

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
  const onPostDeleted = useCallback(() => {
    setSnackbar({
      open: true,
      message: 'Post deleted successfully!',
      severity: 'success',
    });
  }, []);

  const onPostUpdated = useCallback(() => {
    setSnackbar({
      open: true,
      message: 'Post updated successfully!',
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
  };
};
