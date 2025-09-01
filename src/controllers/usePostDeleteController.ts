import { useCallback } from 'react';
import { useDeletePost } from '@/hooks';
import type { Post } from '@/types';

interface PostDeleteController {
  // Data
  post: Post;

  // Computed
  isDeleteSubmitDisabled: boolean;

  // Actions
  deletePost: () => Promise<void>;
}

export interface UsePostDeleteControllerProps {
  post: Post;
  onPostDeleted?: () => void;
}

export const usePostDeleteController = ({
  post,
  onPostDeleted,
}: UsePostDeleteControllerProps): PostDeleteController => {
  // Mutation hook
  const { mutateAsync: deletePostMutate, isPending: isDeletePending } =
    useDeletePost();

  // Computed values
  const isDeleteSubmitDisabled = isDeletePending;

  // Actions
  const deletePost = useCallback(async () => {
    if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      await deletePostMutate(post.id);
      onPostDeleted?.();
    }
  }, [post.title, post.id, deletePostMutate, onPostDeleted]);

  return {
    // Data
    post,

    // Computed
    isDeleteSubmitDisabled,

    // Actions
    deletePost,
  };
};
