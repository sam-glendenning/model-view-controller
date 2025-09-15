import { useState, useCallback } from 'react';
import { useDeletePost } from './useDeletePost';
import type { Post } from '@/shared/types';

interface PostDeleteController {
  // State
  isDeletePostDialogOpen: boolean;

  // Computed
  isDeleting: boolean;

  // Actions
  showDeletePostDialog: () => void;
  hideDeletePostDialog: () => void;
  confirmDelete: () => Promise<void>;
}

interface useDeletePostControllerProps {
  postData: Post;
  onPostDeleted?: (deletedPost: Post) => void;
  onPostDeletionError?: (error: Error) => void;
}

export const useDeletePostController = ({
  postData,
  onPostDeleted,
  onPostDeletionError,
}: useDeletePostControllerProps): PostDeleteController => {
  // Local state
  const [isDeletePostDialogOpen, setIsDeletePostDialogOpen] = useState(false);

  // Mutation hook
  const { mutateAsync: deletePostMutate, isPending: isDeleting } =
    useDeletePost();

  // Actions
  const showDeletePostDialog = useCallback(() => {
    setIsDeletePostDialogOpen(true);
  }, []);

  const hideDeletePostDialog = useCallback(() => {
    setIsDeletePostDialogOpen(false);
  }, []);

  const confirmDelete = useCallback(async () => {
    try {
      await deletePostMutate(postData.id);
      setIsDeletePostDialogOpen(false);
      onPostDeleted?.(postData);
    } catch (error) {
      onPostDeletionError?.(error as Error);
    }
  }, [postData, deletePostMutate, onPostDeleted, onPostDeletionError]);

  return {
    // State
    isDeletePostDialogOpen,

    // Computed
    isDeleting,

    // Actions
    showDeletePostDialog,
    hideDeletePostDialog,
    confirmDelete,
  };
};
