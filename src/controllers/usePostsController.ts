import { useState, useCallback } from 'react';
import { usePosts, useCreatePost } from '@/hooks';
import type {
  Post,
  CreatePostForm,
  PostFormData,
  SnackbarState,
} from '@/types';

export interface PostsController {
  // Data
  posts: Post[] | undefined;
  isLoading: boolean;
  error: Error | null;

  // Form State
  formData: PostFormData;
  dialogOpen: boolean;
  snackbar: SnackbarState;

  // Form Validation
  isSubmitDisabled: boolean;

  // Actions
  openCreateDialog: () => void;
  closeDialog: () => void;
  updateFormField: (field: keyof PostFormData, value: string | number) => void;
  submitForm: () => Promise<void>;
  closeSnackbar: () => void;

  // Callback handlers for individual post operations
  onPostDeleted: (postId: number) => void;
  onPostUpdated: (post: Post) => void;
}

export const usePostsController = (): PostsController => {
  // Data hooks
  const { data: posts, isLoading, error } = usePosts();
  const createPostMutation = useCreatePost();

  // Local state
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    body: '',
    userId: 1,
  });

  // Computed values
  const isSubmitDisabled = !formData.title.trim() || !formData.body.trim();

  // Actions
  const openCreateDialog = useCallback(() => {
    setFormData({
      title: '',
      body: '',
      userId: 1,
    });
    setDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setFormData({
      title: '',
      body: '',
      userId: 1,
    });
  }, []);

  const updateFormField = useCallback(
    (field: keyof PostFormData, value: string | number) => {
      setFormData(prev => ({
        ...prev,
        [field]: field === 'userId' ? Number(value) || 1 : value,
      }));
    },
    [],
  );

  const submitForm = useCallback(async () => {
    try {
      const createData: CreatePostForm = {
        title: formData.title,
        body: formData.body,
        userId: formData.userId,
      };
      await createPostMutation.mutateAsync(createData);
      setSnackbar({
        open: true,
        message: 'Post created successfully!',
        severity: 'success',
      });
      closeDialog();
    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to create post',
        severity: 'error',
      });
    }
  }, [formData, createPostMutation, closeDialog]);

  const closeSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  // Callback handlers for individual post operations
  const onPostDeleted = useCallback((_postId: number) => {
    setSnackbar({
      open: true,
      message: 'Post deleted successfully!',
      severity: 'success',
    });
  }, []);

  const onPostUpdated = useCallback((_post: Post) => {
    setSnackbar({
      open: true,
      message: 'Post updated successfully!',
      severity: 'success',
    });
  }, []);

  return {
    // Data
    posts,
    isLoading,
    error,

    // State
    formData,
    dialogOpen,
    snackbar,

    // Computed
    isSubmitDisabled,

    // Actions
    openCreateDialog,
    closeDialog,
    updateFormField,
    submitForm,
    closeSnackbar,

    // Callback handlers
    onPostDeleted,
    onPostUpdated,
  };
};
