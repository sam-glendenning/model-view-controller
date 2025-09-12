import { useCallback } from 'react';
import { useDeletePost } from '@/hooks';
import type { Post } from '@/types';

interface PostDeleteController {
  // Computed
  isDeleting: boolean;

  // Actions
  deletePost: () => Promise<void>;
}

export interface UsePostDeleteControllerProps {
  postData: Post;
  onPostDeleted?: (deletedPost: Post) => void;
}

export const usePostDeleteController = ({
  postData,
  onPostDeleted,
}: UsePostDeleteControllerProps): PostDeleteController => {
  // Mutation hook
  const { mutateAsync: deletePostMutate, isPending: isDeleting } =
    useDeletePost();

  // Actions
  const deletePost = useCallback(async () => {
    if (
      window.confirm(`Are you sure you want to delete "${postData.title}"?`)
    ) {
      await deletePostMutate(postData.id);
      onPostDeleted?.(postData);
    }
  }, [postData, deletePostMutate, onPostDeleted]);

  return {
    // Computed
    isDeleting,

    // Actions
    deletePost,
  };
};
