import { useState, useCallback } from 'react';
import { useUpdatePost, useDeletePost } from '@/hooks';
import type {
  Post,
  UpdatePostForm,
  PostFormData,
  SnackbarState,
} from '@/types';

export interface PostController {
  // Data
  post: Post;

  // State
  isEditing: boolean;
  formData: PostFormData;
  snackbar: SnackbarState;

  // Computed
  isSubmitDisabled: boolean;
  isLoading: boolean;

  // Actions
  startEditing: () => void;
  cancelEditing: () => void;
  updateFormField: (field: keyof PostFormData, value: string | number) => void;
  savePost: () => Promise<void>;
  deletePost: () => Promise<void>;
  closeSnackbar: () => void;
}

export interface UsePostControllerProps {
  post: Post;
  onPostDeleted?: (postId: number) => void;
  onPostUpdated?: (post: Post) => void;
}

export const usePostController = ({
  post,
  onPostDeleted,
  onPostUpdated,
}: UsePostControllerProps): PostController => {
  // Mutation hooks
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();

  // Local state
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [formData, setFormData] = useState<PostFormData>({
    title: post.title,
    body: post.body,
    userId: post.userId,
  });

  // Computed values
  const isSubmitDisabled = !formData.title.trim() || !formData.body.trim();
  const isLoading =
    updatePostMutation.isLoading || deletePostMutation.isLoading;

  // Actions
  const startEditing = useCallback(() => {
    setFormData({
      title: post.title,
      body: post.body,
      userId: post.userId,
    });
    setIsEditing(true);
  }, [post]);

  const cancelEditing = useCallback(() => {
    setFormData({
      title: post.title,
      body: post.body,
      userId: post.userId,
    });
    setIsEditing(false);
  }, [post]);

  const updateFormField = useCallback(
    (field: keyof PostFormData, value: string | number) => {
      setFormData(prev => ({
        ...prev,
        [field]: field === 'userId' ? Number(value) || 1 : value,
      }));
    },
    [],
  );

  const savePost = useCallback(async () => {
    try {
      const updateData: UpdatePostForm = {
        id: post.id,
        title: formData.title,
        body: formData.body,
        userId: formData.userId,
      };

      const updatedPost = await updatePostMutation.mutateAsync(updateData);

      setSnackbar({
        open: true,
        message: 'Post updated successfully!',
        severity: 'success',
      });

      setIsEditing(false);
      onPostUpdated?.(updatedPost);
    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to update post',
        severity: 'error',
      });
    }
  }, [post.id, formData, updatePostMutation, onPostUpdated]);

  const deletePost = useCallback(async () => {
    if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      try {
        await deletePostMutation.mutateAsync(post.id);

        setSnackbar({
          open: true,
          message: 'Post deleted successfully!',
          severity: 'success',
        });

        onPostDeleted?.(post.id);
      } catch {
        setSnackbar({
          open: true,
          message: 'Failed to delete post',
          severity: 'error',
        });
      }
    }
  }, [post.id, post.title, deletePostMutation, onPostDeleted]);

  const closeSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  return {
    // Data
    post,

    // State
    isEditing,
    formData,
    snackbar,

    // Computed
    isSubmitDisabled,
    isLoading,

    // Actions
    startEditing,
    cancelEditing,
    updateFormField,
    savePost,
    deletePost,
    closeSnackbar,
  };
};
