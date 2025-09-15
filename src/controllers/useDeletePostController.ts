import { useState, useCallback } from 'react';
import { useDeletePost } from '@/hooks';
import type { Post } from '@/types';

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
}

export const useDeletePostController = ({
  postData,
  onPostDeleted,
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
    await deletePostMutate(postData.id);
    setIsDeletePostDialogOpen(false);
    onPostDeleted?.(postData);
  }, [postData, deletePostMutate, onPostDeleted]);

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
